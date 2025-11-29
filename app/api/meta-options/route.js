// app/api/meta-options/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import MetaOption from '../../../models/MetaOption';
import { auth } from '../auth/[...nextauth]/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();
    const items = await MetaOption.find({}).sort({ key: 1, value: 1 }).lean();
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    console.error('Error fetching meta-options', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// Admin-only: add a meta option { key, value }
export async function POST(request) {
  const session = await auth();
  const isAdmin = !!(session?.user?.isAdmin || session?.user?.role === 'admin');
  if (!isAdmin) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  try {
    const body = await request.json();
    const { key, value } = body || {};
    if (!key || !value) return NextResponse.json({ success: false, message: 'Missing key/value' }, { status: 400 });
    await dbConnect();
    const created = await MetaOption.create({ key, value });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err) {
    const code = err?.code === 11000 ? 409 : 500;
    const msg = err?.code === 11000 ? 'Duplicate option' : 'Server error';
    console.error('POST /meta-options error', err);
    return NextResponse.json({ success: false, error: msg }, { status: code });
  }
}

// Admin-only: delete a meta option by { key, value }
export async function DELETE(request) {
  const session = await auth();
  const isAdmin = !!(session?.user?.isAdmin || session?.user?.role === 'admin');
  if (!isAdmin) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  try {
    const body = await request.json();
    const { key, value } = body || {};
    if (!key || !value) return NextResponse.json({ success: false, message: 'Missing key/value' }, { status: 400 });
    await dbConnect();
    const del = await MetaOption.findOneAndDelete({ key, value });
    if (!del) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: del });
  } catch (err) {
    console.error('DELETE /meta-options error', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
