import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import ReviewVideo from '../../../models/ReviewVideo';

export async function GET() {
  try {
    await dbConnect();
    const items = await ReviewVideo.find({}).sort({ position: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: items });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
  const body = await request.json();
  console.log('PUT /api/review-videos payload', Array.isArray(body) ? { len: body.length, sample: body[0] } : typeof body);
    if (!Array.isArray(body)) {
      return NextResponse.json({ success: false, error: 'Expected array' }, { status: 400 });
    }
    // Basic validation: ensure each item has a string src
    const invalid = body.find((x) => !x || typeof x.src !== 'string' || x.src.trim() === '');
    if (invalid) {
      return NextResponse.json({ success: false, error: 'Each item must have a valid src string' }, { status: 400 });
    }

    // Replace all for simplicity
    await ReviewVideo.deleteMany({});
    try {
      const docs = await ReviewVideo.insertMany(body.map((x, idx) => ({ src: x.src, thumbnail: x.thumbnail || '', position: idx })));
      return NextResponse.json({ success: true, data: docs });
    } catch (insertErr) {
      console.error('Failed to insert review videos', insertErr);
      return NextResponse.json({ success: false, error: insertErr.message || 'Insert failed' }, { status: 500 });
    }
  } catch (e) {
    console.error('PUT /api/review-videos error', e);
    return NextResponse.json({ success: false, error: e?.message || 'Server error' }, { status: 500 });
  }
}
