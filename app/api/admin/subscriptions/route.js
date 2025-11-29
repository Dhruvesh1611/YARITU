import { NextResponse } from 'next/server';
import { auth } from '../../auth/[...nextauth]/route';
import dbConnect from '../../../../lib/dbConnect';
import Subscription from '../../../../models/Subscription';

export async function GET(req) {
  const session = await auth();
  if (!session || (!session.user?.isAdmin && session.user?.role !== 'admin')) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
  }

  try {
    await dbConnect();
    const items = await Subscription.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    console.error('Read subscriptions error', err);
    return NextResponse.json({ success: false, message: 'Could not read data' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { phone, name, email } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone is required' }, { status: 400 });
    }

    // Avoid duplicates: if same phone exists, return existing
    const existing = await Subscription.findOne({ phone });
    if (existing) {
      return NextResponse.json({ success: true, data: existing, message: 'Already subscribed' });
    }

    const newSub = await Subscription.create({ phone, name, email });
    return NextResponse.json({ success: true, data: newSub }, { status: 201 });
  } catch (err) {
    console.error('Save subscription error', err);
    return NextResponse.json({ success: false, message: 'Could not save data' }, { status: 500 });
  }
}
