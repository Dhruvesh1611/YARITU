import { NextResponse } from 'next/server';
import { auth } from '../../auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'stores.json');

export async function GET() {
  const session = await auth();
  if (!session || (!session.user?.isAdmin && session.user?.role !== 'admin')) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
  }

  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const items = JSON.parse(raw || '[]');
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    console.error('Read stores error', err);
    return NextResponse.json({ success: false, message: 'Could not read data' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await auth();
  if (!session || (!session.user?.isAdmin && session.user?.role !== 'admin')) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { idx, image, imageBase64, imageName, address } = body;

    if (typeof idx !== 'number') {
      return NextResponse.json({ success: false, message: 'Invalid payload: missing idx' }, { status: 400 });
    }

    const raw = fs.readFileSync(dataPath, 'utf-8');
    const items = JSON.parse(raw || '[]');
    if (idx < 0 || idx >= items.length) return NextResponse.json({ success: false, message: 'Index out of range' }, { status: 400 });

    // If imageBase64 is provided, save it to public/uploads/stores
    if (imageBase64) {
      // ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'stores');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      // data URI may look like: data:image/png;base64,AAAA
      const matches = imageBase64.match(/^data:(image\/[^;]+);base64,(.+)$/);
      let ext = '.png';
      let base64Data = imageBase64;
      if (matches) {
        const mime = matches[1];
        base64Data = matches[2];
        // choose extension from mime
        const m = mime.split('/')[1];
        ext = m ? `.${m}` : ext;
      } else if (imageName && imageName.includes('.')) {
        ext = '.' + imageName.split('.').pop();
      }

      const filename = `store-${idx}-${Date.now()}${ext}`;
      const outPath = path.join(uploadsDir, filename);
      fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));

      // set public path
      items[idx].image = `/uploads/stores/${filename}`;
    }

    // update address if provided
    if (typeof address === 'string') {
      items[idx].address = address;
    }

    // update phone if provided
    if (typeof body.phone === 'string') {
      items[idx].phone = body.phone;
    }

    // also if direct image URL provided, use it
    if (!imageBase64 && image) {
      items[idx].image = image;
    }

    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2), 'utf-8');

    return NextResponse.json({ success: true, data: items[idx] });
  } catch (err) {
    console.error('Update store error', err);
    return NextResponse.json({ success: false, message: 'Could not save data' }, { status: 500 });
  }
}
