import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { auth } from '../auth/[...nextauth]/route';
import crypto from 'crypto';

export const runtime = 'nodejs';

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_REGION;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const generateId = (bytes = 12) => crypto.randomBytes(bytes).toString('hex');

const sanitize = (s) => {
  if (!s) return '';
  let v = String(s).trim();
  v = v.replace(/^\/+/g, '').replace(/\/+$/g, '');
  v = v.replace(/\.\.+/g, '');
  v = v.replace(/[^A-Za-z0-9\/_-]/g, '');
  return v;
};

export async function POST(request) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

    if (!bucketName) {
      return NextResponse.json(
        { success: false, error: 'Server misconfigured: missing AWS_S3_BUCKET_NAME' },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Normalize file/fileName
    let { file, fileName, folder, contentType, size } = body || {};
    file = file || fileName;

    if (!file || !folder) {
      return NextResponse.json(
        { success: false, error: 'file and folder required' },
        { status: 400 }
      );
    }

    const maxAllowedBytes = 500 * 1024 * 1024;
    if (size && size > maxAllowedBytes) {
      return NextResponse.json(
        { success: false, error: `File too large. Max ${maxAllowedBytes / (1024 * 1024)}MB` },
        { status: 413 }
      );
    }

    const safeFolder = sanitize(folder) || 'YARITU/others';
    const safeFile = sanitize(file) || `${Date.now()}`;
    const key = `${safeFolder}/${Date.now()}-${generateId()}-${safeFile}`;

    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType || 'application/octet-stream',
    });

    const signedUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 60 });

    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(
      key
    ).replace(/%2F/g, '/')}`;

    return NextResponse.json({ success: true, signedUrl, key, publicUrl });
  } catch (err) {
    console.error('presign error', err);
    return NextResponse.json({ success: false, error: 'Failed to create presigned URL' }, { status: 500 });
  }
}
