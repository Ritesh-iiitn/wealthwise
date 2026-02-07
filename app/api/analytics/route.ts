import { NextResponse } from 'next/server';

export async function GET() {
    const data = {
        spendingByMonth: [],
        spendingByCategory: []
    };
    return NextResponse.json(data);
}
