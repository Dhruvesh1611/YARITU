import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Testimonial from '../../../../models/Testimonial';
import { auth } from '../../auth/[...nextauth]/route';

export async function PUT(request, { params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  if (!session.user?.isAdmin && session.user?.role !== 'admin') return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });

  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();
    const updated = await Testimonial.findByIdAndUpdate(id, { name: body.name, quote: body.quote, rating: body.rating, avatarUrl: body.avatarUrl }, { new: true });
    if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  if (!session.user?.isAdmin && session.user?.role !== 'admin') return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });

  try {
    await dbConnect();
    const { id } = params;
    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: deleted });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
