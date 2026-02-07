import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    return NextResponse.json({ message: `Transaction ${id} updated`, data: body });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return NextResponse.json({ message: `Transaction ${id} deleted` });
}
