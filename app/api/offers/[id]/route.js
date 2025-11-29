import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import OfferContent from '../../../../models/OfferContent';

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

    return NextResponse.json({ success: true, data: updatedOffer });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
