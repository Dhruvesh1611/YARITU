import { NextResponse } from 'next/server';
import { auth } from '../../auth/[...nextauth]/route';
import dbConnect from '../../../../lib/dbConnect';
import OfferContent from '../../../../models/OfferContent';
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
  if (!region || region === 'us-east-1') {
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

async function uploadBase64ToS3(base64) {
  if (!bucketName) throw new Error('Server not configured (missing AWS_S3_BUCKET_NAME)');
  try {
    // base64 expected to be data:<type>;base64,<data>
    const m = base64.match(/^data:(.+);base64,(.+)$/);
    if (!m) throw new Error('Invalid base64 data');
    const contentType = m[1];
    const b64 = m[2];
    const buffer = Buffer.from(b64, 'base64');
  const filename = `offers-${Date.now()}.png`;
  // Store offers content images under REVIEW_PAGE per new requirement
  const key = `YARITU/OFFER_PAGE/${Date.now()}-${filename}`;
  await s3Client.send(new PutObjectCommand({ Bucket: bucketName, Key: key, Body: buffer, ContentType: contentType }));
    return buildS3Url(bucketName, region, key);
  } catch (err) {
    console.error('S3 upload error', err);
    throw err;
  }
}

export async function GET(req) {
  const session = await auth();
  if (!session || (!session.user?.isAdmin && session.user?.role !== 'admin')) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
  }

  try {
    await dbConnect();
    const items = await OfferContent.find({}).sort({ position: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    console.error('Read offers content error', err);
    return NextResponse.json({ success: false, message: 'Could not read data' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await auth();
  if (!session || (!session.user?.isAdmin && session.user?.role !== 'admin')) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
  }

  try {
  const body = await req.json();
  const { id, heading, subheading, discount, validity, image, imageBase64, imageName, position, store } = body;
    await dbConnect();

    let target = null;
    if (id) target = await OfferContent.findById(id);
    if (!target && typeof position === 'number') target = await OfferContent.findOne({ position: Number(position) });

    // upload imageBase64 to S3 if provided
    let imageUrl = image;
    if (imageBase64) {
      imageUrl = await uploadBase64ToS3(imageBase64);
    }

    if (target) {
      if (heading) target.heading = heading;
      if (subheading) target.subheading = subheading;
      if (discount) target.discount = discount;
      if (validity) target.validity = validity;
      if (typeof position !== 'undefined') target.position = Number(position);
      if (typeof store !== 'undefined') target.store = store;
      if (imageUrl) target.image = imageUrl;
      await target.save();
      return NextResponse.json({ success: true, data: target });
    }

    const newItem = await OfferContent.create({ heading: heading || '', subheading: subheading || '', discount: discount || '', validity: validity || '', image: imageUrl || '', position: typeof position === 'number' ? Number(position) : undefined, store: store || '' });
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (err) {
    console.error('Save offers content error', err);
    return NextResponse.json({ success: false, message: 'Could not save data' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await auth();
  if (!session || (!session.user?.isAdmin && session.user?.role !== 'admin')) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id } = body || {};
    if (typeof id === 'undefined' || id === null) {
      return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
    }

    await dbConnect();
    const removed = await OfferContent.findByIdAndDelete(id);
    if (!removed) return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: { id: removed._id } });
  } catch (err) {
    console.error('Delete offers content error', err);
    return NextResponse.json({ success: false, message: 'Could not delete data' }, { status: 500 });
  }
}
