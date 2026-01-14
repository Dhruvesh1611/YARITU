// scripts/migrate-cloudinary-to-s3.js
// Usage (dry-run): node scripts/migrate-cloudinary-to-s3.js
// Real run:        node scripts/migrate-cloudinary-to-s3.js --run

const mongoose = require('mongoose');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const argv = process.argv.slice(2);
const doRun = argv.includes('--run');

const MONGODB_URI = process.env.MONGODB_URI;
const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET = process.env.AWS_S3_BUCKET_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI environment variable. Aborting.');
  process.exit(1);
}
if (!AWS_REGION || !AWS_BUCKET || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error('Missing AWS credentials/region/bucket in environment. Aborting.');
  process.exit(1);
}

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
});

function buildS3Url(bucket, region, key) {
  if (!region || region === 'us-east-1') return `https://${bucket}.s3.amazonaws.com/${key}`;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

async function downloadToBuffer(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Download failed: ${res.status} ${res.statusText}`);
    const ab = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    return { buffer: Buffer.from(ab), contentType };
  } catch (err) {
    throw err;
  }
}

async function uploadBufferToS3(buffer, key, contentType) {
  const cmd = new PutObjectCommand({
    Bucket: AWS_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read',
  });
  await s3.send(cmd);
  return buildS3Url(AWS_BUCKET, AWS_REGION, key);
}

(async () => {
  console.log(`Migration script started. mode=${doRun ? 'APPLY' : 'DRY-RUN'}`);

  await mongoose.connect(MONGODB_URI, { });
  console.log('Connected to MongoDB');

  // Use a permissive schema so we can update flexibly
  const OfferContent = mongoose.model('OfferContent', new mongoose.Schema({}, { strict: false }), 'offercontents');

  const docs = await OfferContent.find({ image: /res\.cloudinary\.com/i }).lean();
  if (!docs || docs.length === 0) {
    console.log('No documents found with Cloudinary URLs.');
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${docs.length} document(s) referencing Cloudinary.`);

  const results = [];
  for (const doc of docs) {
    const id = doc._id || doc.id;
    const imageUrl = (doc.image || '').toString();
    console.log('\n---');
    console.log('Doc id:', id);
    console.log('Cloudinary url:', imageUrl);

    if (!doRun) {
      results.push({ id, cloudinary: imageUrl });
      continue;
    }

    try {
      const { buffer, contentType } = await downloadToBuffer(imageUrl);

      // determine extension
      let ext = 'png';
      try {
        const p = new URL(imageUrl).pathname;
        const m = p.match(/\.([a-zA-Z0-9]+)(?:$|\?)/);
        if (m && m[1]) ext = m[1];
        else if (contentType) {
          if (contentType.includes('jpeg')) ext = 'jpg';
          if (contentType.includes('png')) ext = 'png';
          if (contentType.includes('svg')) ext = 'svg';
          if (contentType.includes('webp')) ext = 'webp';
        }
      } catch (e) {}

      const filename = `${Date.now()}-${id}.${ext}`;
      const key = `YARITU/OFFER_PAGE/${filename}`;

      const s3Url = await uploadBufferToS3(buffer, key, contentType);

      // update DB: set new image URL and keep a backup field
      const update = { image: s3Url, migratedAt: new Date(), previousImageCloudinary: imageUrl };
      await OfferContent.updateOne({ _id: id }, { $set: update });

      console.log('Uploaded to S3:', s3Url);
      results.push({ id, cloudinary: imageUrl, s3: s3Url, ok: true });
    } catch (err) {
      console.error('Failed to migrate doc', id, err.message || err);
      results.push({ id, cloudinary: imageUrl, error: (err && err.message) || String(err) });
    }

    // small delay to be polite
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log('\nSummary:');
  results.forEach((r) => console.log(JSON.stringify(r)));

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB. Migration complete.');
})();
