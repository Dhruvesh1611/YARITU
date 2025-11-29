import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Use the standardized env names requested
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
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}


export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file) return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    if (!bucketName) return NextResponse.json({ success: false, error: 'Server missing AWS_S3_BUCKET_NAME' }, { status: 500 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = file.name ? file.name.replace(/\s+/g, '_') : `${Date.now()}`;
    const key = `${Date.now()}-${filename}`; // store at root per requirement

    await s3Client.send(new PutObjectCommand({ Bucket: bucketName, Key: key, Body: buffer, ContentType: file.type || 'application/octet-stream' }));
    const url = buildS3Url(bucketName, region, key);
    return NextResponse.json({ success: true, data: { url } });
  } catch (err) {
    console.error('cloudinary proxy -> S3 upload error', err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
