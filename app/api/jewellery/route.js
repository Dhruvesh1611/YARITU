import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Jewellery from '../../../models/Jewellery';

export async function GET(request) {
  try {
    await dbConnect();
    const q = new URL(request.url).searchParams;
    const store = q.get('store');
    const filter = {};
    if (store) filter.store = store;
    const items = await Jewellery.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (err) {
    console.error('GET /api/jewellery error', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
