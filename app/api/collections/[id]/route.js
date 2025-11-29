// app/api/collections/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Collection from '../../../../models/Collection';
import MetaOption from '../../../../models/MetaOption';
import { auth } from '../../auth/[...nextauth]/route';
import { parseForm, processImage } from '../../../../lib/parseForm';

export async function GET(request, { params }) {
    const { id } = params;
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    try {
      await dbConnect();
      const item = await Collection.findById(id).lean();
      if (!item) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: item });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
  const { id } = params;
  if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
  
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Support JSON-based submissions where client uploads images to Cloudinary directly
    const contentType = (request.headers.get('content-type') || '').toLowerCase();
    let fields = {};
    let files = {};
    if (contentType.includes('application/json')) {
      fields = await request.json();
    } else {
      const parsed = await parseForm(request);
      fields = parsed.fields || {};
      files = parsed.files || {};
    }

    if (fields.newOptions && typeof fields.newOptions === 'object') {
      const entries = Object.entries(fields.newOptions);
      await Promise.all(entries.map(async ([key, value]) => {
        if (!value) return;
        try { await MetaOption.create({ key, value }); } catch (e) { /* ignore */ }
      }));
    }

    const updateData = { ...fields, updatedAt: new Date() };
    
    if (files.mainImage) {
    const mainImageFile = files.mainImage;
    const result = await processImage(mainImageFile, fields.folder);
    if (result) {
      updateData.mainImage = result.secure_url;
    }
  } else if (fields.imageUrl) {
    updateData.mainImage = fields.imageUrl;
  }

  if (files.mainImage2) {
    const mainImage2File = files.mainImage2;
    const result = await processImage(mainImage2File, fields.folder);
    if (result) {
      updateData.mainImage2 = result.secure_url;
    }
  } else if (fields.mainImage2Url) {
    updateData.mainImage2 = fields.mainImage2Url;
  }

  let otherImageUrls = [];
  if (fields['otherImages'] && Array.isArray(fields['otherImages'])) {
    otherImageUrls = fields['otherImages'];
  } else if (fields['otherImagesUrls[]']) {
    otherImageUrls = Array.isArray(fields['otherImagesUrls[]']) ? fields['otherImagesUrls[]'] : [fields['otherImagesUrls[]']];
  }

  if (files.otherImages) {
    const otherImageFiles = Array.isArray(files.otherImages) ? files.otherImages : [files.otherImages];
    for (const file of otherImageFiles) {
      const result = await processImage(file, fields.folder);
      if (result) {
        otherImageUrls.push(result.secure_url);
      }
    }
  }
  updateData.otherImages = otherImageUrls;

    await dbConnect();
    const updated = await Collection.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error(`Error in PUT /api/collections/${id}:`, err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    try {
      const session = await auth();
      if (!session || session.user?.role !== 'admin') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  
      await dbConnect();
      const removed = await Collection.findByIdAndDelete(id);
      if (!removed) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}