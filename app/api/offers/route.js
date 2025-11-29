import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import OfferContent from '../../../models/OfferContent';

// We'll keep a fixed set of 5 positions (0..4). Each document may have an optional `position` field.
// GET: return array of length 5, filling missing positions with defaults.
export async function GET() {
  try {
    await dbConnect();
    // Return all offer documents (so public users see offers tied to stores).
    // Previously this endpoint returned a fixed 5-length array; returning the
    // actual documents makes store-based filtering on the client reliable.
    const docs = await OfferContent.find({}).sort({ position: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, data: docs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching offers from DB', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
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
