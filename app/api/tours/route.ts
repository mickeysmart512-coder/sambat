import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(tours);
  } catch (error: any) {
    console.error('Fetch tours error:', error);
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newTour = await prisma.tour.create({
      data: {
        date: body.date,
        dateTime: body.dateTime ? new Date(body.dateTime) : null,
        city: body.city,
        venue: body.venue,
        status: body.status || 'TICKETS'
      }
    });

    return NextResponse.json(newTour, { status: 201 });
  } catch (error: any) {
    console.error('Create tour error:', error);
    return NextResponse.json({ error: 'Failed to save tour' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    await prisma.tour.delete({
      where: { id: String(id) }
    });

    return NextResponse.json({ message: 'Tour deleted' });
  } catch (error: any) {
    console.error('Delete tour error:', error);
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
  }
}

