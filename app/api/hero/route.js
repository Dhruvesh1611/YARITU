import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import HeroImage from '../../../models/HeroImage';
import { auth } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    await dbConnect();
    const items = await HeroImage.find({}).sort({ order: 1 });
    // ensure legacy documents without visibility default to 'both'
    const normalized = items.map(it => ({ ...it.toObject ? it.toObject() : it, visibility: (it.visibility || 'both') }));
    return NextResponse.json({ success: true, data: normalized });
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
    const created = await HeroImage.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
