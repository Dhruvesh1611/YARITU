import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/dbConnect';
import Admin from '../../../../models/Admin';
import { auth } from '../../auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'admin') {
      return new NextResponse(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    const { username, password } = body || {};
    if (!username && !password) {
      return new NextResponse(JSON.stringify({ success: false, error: 'No data provided' }), { status: 400 });
    }

    await dbConnect();

    const update = {};
    if (username) update.username = username;
    if (password) update.password = await bcrypt.hash(String(password), 10);

    const updated = await Admin.findOneAndUpdate({ _id: session.user.id }, { $set: update }, { new: true });
    if (!updated) {
      // fallback: update by username 'admin'
      const fallback = await Admin.findOneAndUpdate({ username: 'admin' }, { $set: update }, { upsert: true, new: true });
      return NextResponse.json({ success: true, data: { id: fallback._id.toString() } });
    }

    return NextResponse.json({ success: true, data: { id: updated._id.toString() } });
  } catch (err) {
    console.error('Error in change-credentials API', err);
    return new NextResponse(JSON.stringify({ success: false, error: 'Server error' }), { status: 500 });
  }
}
