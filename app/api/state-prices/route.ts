import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const statePrices = await prisma.statePrice.findMany();
    return NextResponse.json(statePrices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch state prices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stateName, price } = body;

    const statePrice = await prisma.statePrice.upsert({
      where: { stateName },
      update: { price: parseFloat(price) },
      create: { stateName, price: parseFloat(price) }
    });

    return NextResponse.json(statePrice);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update state price' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.statePrice.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete state price' }, { status: 500 });
  }
}
