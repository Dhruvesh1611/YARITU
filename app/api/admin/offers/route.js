import { NextResponse } from 'next/server';
import { auth } from '../../auth/[...nextauth]/route';
import dbConnect from '../../../../lib/dbConnect';
import Offer from '../../../../models/Offer';

export async function GET(req) {
  const session = await auth();
  if (!session || (!session.user?.isAdmin && session.user?.role !== 'admin')) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
  }

  try {
    await dbConnect();
    const items = await Offer.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    console.error('Read offer signups error', err);
    return NextResponse.json({ success: false, message: 'Could not read data' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, phone } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    const newOffer = await Offer.create({ name, email, phone });
    return NextResponse.json({ success: true, data: newOffer }, { status: 201 });
  } catch (err) {
    console.error('Save offer signup error', err);
    return NextResponse.json({ success: false, message: 'Could not save data' }, { status: 500 });
  }
}

