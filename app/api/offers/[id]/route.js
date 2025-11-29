import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import OfferContent from '../../../../models/OfferContent';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const { id } = params;
  await dbConnect();

  try {
    const body = await request.json();
    const { image, discount, category, heading } = body;

    // Map category -> heading for consistency with OfferContent schema
    const update = {
      image,
      discount,
      heading: heading || category, // support either field name from client
    };

    const updatedOffer = await OfferContent.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!updatedOffer) {
      return NextResponse.json({ success: false, error: 'Offer not found' }, { status: 404 });
    }

    return new NextResponse(JSON.stringify({ success: true, data: updatedOffer }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new NextResponse(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
}
