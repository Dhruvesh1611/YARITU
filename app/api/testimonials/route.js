import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Testimonial from '../../../models/Testimonial';
import { auth } from '../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    await dbConnect();
    // Allow filtering by location query param (e.g., ?location=home or ?location=reviews)
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    console.debug('GET /api/testimonials requested location=', location);
    const filter = location ? { location } : {};
    const items = await Testimonial.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  // optional: restrict to admins only
  if (!session.user?.isAdmin && session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
  }

  try {
    await dbConnect();
  const body = await request.json();
  console.debug('POST /api/testimonials body=', body);
  if (!body.name || !body.quote) return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
  const created = await Testimonial.create({ name: body.name, quote: body.quote, rating: body.rating || 5, avatarUrl: body.avatarUrl || '', location: body.location || 'home' });
  console.debug('POST /api/testimonials created=', created);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
