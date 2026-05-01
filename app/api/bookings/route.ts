import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      fullName, email, phone, eventDate, eventTime, eventType, 
      state, location, venue, message, totalPrice, isNegotiated, 
      agreedPrice, negotiationCode 
    } = body;

    const newBooking = await prisma.booking.create({
      data: {
        fullName,
        email,
        phone,
        eventDate,
        eventTime,
        eventType,
        state,
        location,
        venue,
        message,
        totalPrice: parseFloat(totalPrice),
        isNegotiated: !!isNegotiated,
        agreedPrice: agreedPrice ? parseFloat(agreedPrice) : null,
        status: 'PENDING'
      }
    });

    // Mark negotiation code as used if provided
    if (negotiationCode) {
      await prisma.negotiationCode.update({
        where: { code: negotiationCode },
        data: { isUsed: true }
      });
    }

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Failed to save booking:', error);
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
  }
}


export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json(updatedBooking);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
