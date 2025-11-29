import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import FeaturedImage from '../../../models/FeaturedImage';
import { auth } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    await dbConnect();
    const items = await FeaturedImage.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();
    const created = await FeaturedImage.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
