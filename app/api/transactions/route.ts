import { NextResponse } from 'next/server';

export async function GET() {
    const transactions = [
        { id: '1', date: '2023-10-12', category: 'Food', payee: 'Uber Eats', amount: -25.00 },
        { id: '2', date: '2023-10-11', category: 'Transport', payee: 'Uber', amount: -15.00 },
    ];
    return NextResponse.json(transactions);
}

export async function POST(request: Request) {
    const body = await request.json();
    return NextResponse.json({ message: 'Transaction created', data: body }, { status: 201 });
}
