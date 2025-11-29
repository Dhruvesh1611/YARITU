import { NextResponse } from 'next/server';
import { auth } from '../../../auth/[...nextauth]/route';
import dbConnect from '../../../../../lib/dbConnect';
import Offer from '../../../../../models/Offer';

export async function POST(req) {
  const session = await auth();
  if (!session || (!session.user?.isAdmin && session.user?.role !== 'admin')) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
  }

  try {
    await dbConnect();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing ID' }, { status: 400 });
    }

    const result = await Offer.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete offer error', err);
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 500 });
  }
}

