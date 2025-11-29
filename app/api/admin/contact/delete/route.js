import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { auth } from '../../../auth/[...nextauth]/route';

const dataPath = path.join(process.cwd(), 'data', 'contact-submissions.json');

export async function POST(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  if (!session.user?.isAdmin && session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
    let items = [];
    if (fs.existsSync(dataPath)) {
      items = JSON.parse(fs.readFileSync(dataPath, 'utf-8') || '[]');
    }
    const filtered = items.filter(i => i.id !== id);
    fs.writeFileSync(dataPath, JSON.stringify(filtered, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete contact error', err);
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 500 });
  }
}
