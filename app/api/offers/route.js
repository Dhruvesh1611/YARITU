import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import OfferContent from '../../../models/OfferContent';

// Force dynamic on Vercel to avoid build-time caching of this route
export const dynamic = 'force-dynamic';

// We'll keep a fixed set of 5 positions (0..4). Each document may have an optional `position` field.
// GET: return array of length 5, filling missing positions with defaults.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const debug = searchParams.get('debug');
  try {
    await dbConnect();
    const docs = await OfferContent.find({}).sort({ position: 1, createdAt: 1 }).lean();
    const payload = { success: true, data: docs };
    if (debug === '1') {
      // Minimal debug info without exposing full credentials
      payload._meta = {
        envHasMongoUri: !!process.env.MONGODB_URI,
        docsCount: docs.length,
      };
    }
    return new NextResponse(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching offers from DB', error);
    return new NextResponse(JSON.stringify({ success: false, error: 'Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }
}

// Create a new offer document (not typically used for the fixed 5 slots but supported)
export async function POST(request) {
  try {
    const body = await request.json();
    await dbConnect();
    const created = await OfferContent.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/offers (DB):', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

// Update by id or by position (zero-based index)
// PUT handler removed to allow dynamic route /api/offers/[id] to handle updates.
