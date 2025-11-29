import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_REGION;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export function isS3Url(url) {
  if (!url || typeof url !== 'string') return false;
  if (!bucketName || !region) return false;
  return url.includes(`${bucketName}.s3.${region}.amazonaws.com/`);
}

export function urlToKey(url) {
  try {
    // Expect URL like https://bucket.s3.region.amazonaws.com/<key>
    const parts = url.split('.amazonaws.com/');
    if (parts.length < 2) return null;
    // decodeURIComponent to revert any encoded path segments
    // strip query string or fragment if present
    const raw = decodeURIComponent(parts[1]);
    const clean = raw.split('?')[0].split('#')[0];
    return clean;
  } catch (err) {
    return null;
  }
}

export async function deleteObjectByKey(key) {
  if (!bucketName || !region || !key) return false;
  try {
    await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
    return true;
  } catch (err) {
    console.error('Failed to delete S3 object by key:', key, err);
    return false;
  }
}

export async function deleteObjectByUrl(url) {
  if (!isS3Url(url)) return false;
  const key = urlToKey(url);
  if (!key) return false;
  return deleteObjectByKey(key);
}

export default {
  deleteObjectByKey,
  deleteObjectByUrl,
  isS3Url,
  urlToKey,
};
