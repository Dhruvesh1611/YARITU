import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { auth } from '../../auth/[...nextauth]/route';

const dataPath = path.join(process.cwd(), 'data', 'contact-submissions.json');

export async function GET(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  if (!session.user?.isAdmin && session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
  }

  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const items = JSON.parse(raw || '[]');
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    console.error('Read contact submissions error', err);
    return NextResponse.json({ success: false, message: 'Could not read data' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const submission = { id: now + '-' + Math.random().toString(36).slice(2, 9), createdAt: now, ...body };

    // Ensure directory exists
    const dir = path.dirname(dataPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let items = [];
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8');
      items = JSON.parse(raw || '[]');
    }
    items.unshift(submission);
    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2), 'utf-8');

    return NextResponse.json({ success: true, data: submission }, { status: 201 });
  } catch (err) {
    console.error('Save contact submission error', err);
    return NextResponse.json({ success: false, message: 'Could not save data' }, { status: 500 });
  }
}
