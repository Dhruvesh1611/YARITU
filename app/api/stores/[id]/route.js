import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Store from '../../../../models/Store';
import { auth } from '../../../../app/api/auth/[...nextauth]/route';

export async function PUT(request, context) {
  // In Next.js App Router dynamic API routes, params may be async - await them if needed
  const { params } = context;
  const { id } = await params;

  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }
  const isAdmin = !!(session?.user?.isAdmin || session?.user?.role === 'admin');
  if (!isAdmin) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  await dbConnect();

  try {
    const store = await Store.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!store) {
      return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: store });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, context) {
  const { params } = context;
  const { id } = await params;

  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }
  const isAdmin = !!(session?.user?.isAdmin || session?.user?.role === 'admin');
  if (!isAdmin) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();
    const deleted = await Store.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}