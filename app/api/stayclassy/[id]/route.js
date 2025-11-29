import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import StayClassyImage from '../../../../models/StayClassyImage';
import { auth } from '../../../../app/api/auth/[...nextauth]/route';

export async function PUT(request, context) {
  const { params } = context;
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();
    const updated = await StayClassyImage.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
