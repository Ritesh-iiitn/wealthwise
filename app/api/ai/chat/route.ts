import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { message } = await request.json();
    // Chat logic would go here
    return NextResponse.json({ reply: "I am a placeholder AI assistant." });
}
