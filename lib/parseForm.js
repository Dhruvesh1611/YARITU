// lib/parseForm.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_REGION;
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function buildS3Url(bucket, region, key) {
  // Encode each path segment but preserve slashes so URLs look like
  // https://bucket.s3.region.amazonaws.com/YARITU/celebrity/filename.mp4
  const encoded = String(key)
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return `https://${bucket}.s3.${region}.amazonaws.com/${encoded}`;
}


/**
 * Parses the incoming form request to separate files and fields.
 */
export const parseForm = async (request) => {
  const formData = await request.formData();
  const files = {};
  const fields = {};

  for (const entry of formData.entries()) {
    const [name, value] = entry;

    if (value instanceof File) {
      if (files[name]) {
        if (!Array.isArray(files[name])) {
          files[name] = [files[name]];
        }
        files[name].push(value);
      } else {
        files[name] = value;
      }
    } else {
      fields[name] = value;
    }
  }

  return { fields, files };
};


/**
 * NAYA AUR SIMPLIFIED processImage function
 * (Optimization steps hata diye gaye hain speed test karne ke liye)
 */
export const processImage = async (file, rawFolder) => {
  if (!file) return null;
  if (!bucketName) throw new Error('Server not configured (missing AWS_S3_BUCKET_NAME)');

  try {
    const ab = await file.arrayBuffer();
    const buffer = Buffer.from(ab);

    // Allow optional folder prefix (e.g. 'YARITU/celebrity') passed by callers.
    let folderPrefix = '';
    if (rawFolder) {
      folderPrefix = String(rawFolder).trim();
      folderPrefix = folderPrefix.replace(/^\/+/g, '').replace(/\/+$/g, '');
      folderPrefix = folderPrefix.replace(/\.\.+/g, '');
      folderPrefix = folderPrefix.replace(/[^A-Za-z0-9\/_-]/g, '');
    }

    // Normalize leading 'yaritu' to uppercase and ensure a YARITU/ prefix when only a short name is provided
    if (folderPrefix) {
      folderPrefix = folderPrefix.replace(/^yaritu/i, 'YARITU');
      if (!folderPrefix.includes('/')) {
        folderPrefix = `YARITU/${folderPrefix}`;
      }
    }

    // store files at bucket root or under the provided prefix with a timestamp-prefix
    const filename = file.name ? file.name.replace(/\s+/g, '_') : `${Date.now()}`;
    const key = folderPrefix ? `${folderPrefix}/${Date.now()}-${filename}` : `${Date.now()}-${filename}`;

    const putParams = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
    };

    await s3Client.send(new PutObjectCommand(putParams));
    const url = buildS3Url(bucketName, region, key);
    return { secure_url: url, url };
  } catch (err) {
    console.error('S3 upload error in processImage:', err);
    throw err;
  }
};