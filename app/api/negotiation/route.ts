import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Admin: Generate a new negotiation code
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { price, expiresAt } = body;

    // Generate a 6-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newCode = await prisma.negotiationCode.create({
      data: {
        code,
        price: parseFloat(price),
        expiresAt: new Date(expiresAt),
      }
    });

    return NextResponse.json(newCode, { status: 201 });
  } catch (error) {
    console.error('Failed to generate code:', error);
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
  }
}

// User: Validate a negotiation code
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const negotiationCode = await prisma.negotiationCode.findUnique({
      where: { code }
    });

    if (!negotiationCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }

    if (negotiationCode.isUsed) {
      return NextResponse.json({ error: 'Code has already been used' }, { status: 400 });
    }

    if (new Date() > negotiationCode.expiresAt) {
      return NextResponse.json({ error: 'Code has expired' }, { status: 400 });
    }

    return NextResponse.json(negotiationCode);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to validate code' }, { status: 500 });
  }
}
