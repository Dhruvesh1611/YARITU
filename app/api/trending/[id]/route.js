import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import TrendingVideo from '../../../../models/TrendingVideo';
import { auth } from '../../auth/[...nextauth]/route';

export async function PUT(request, { params }) {
	const session = await auth();
	if (!session) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

	try {
		await dbConnect();
	const body = await request.json();
	const { id } = await params;
		const updated = await TrendingVideo.findByIdAndUpdate(id, body, { new: true });
		if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
		return NextResponse.json({ success: true, data: updated });
	} catch (err) {
		return NextResponse.json({ success: false, error: err.message }, { status: 500 });
	}
}

export async function DELETE(request, { params }) {
	const session = await auth();
	if (!session) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

	try {
	await dbConnect();
	const { id } = await params;
		const deleted = await TrendingVideo.findByIdAndDelete(id);
		if (!deleted) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
		return NextResponse.json({ success: true, data: { id } });
	} catch (err) {
		return NextResponse.json({ success: false, error: err.message }, { status: 500 });
	}
}
