import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { description } = await request.json();
    // AI logic would go here
    const category = "Uncategorized"; // Placeholder
    return NextResponse.json({ category });
}
