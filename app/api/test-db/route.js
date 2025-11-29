import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();
    const conn = mongoose.connection;
    const hosts = conn && conn.hosts ? conn.hosts : null;
    return NextResponse.json({ success: true, hosts: hosts || conn.hosts || null });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack }, { status: 500 });
  }
}
