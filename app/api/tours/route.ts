import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/admin';

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      include: { ticketTiers: { orderBy: { sortOrder: 'asc' } } },
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
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const ticketMode = body.ticketMode === 'EVENT_TICKET' ? 'EVENT_TICKET' : 'PLATFORM_DEFAULT';
    const tiers = Array.isArray(body.ticketTiers) ? body.ticketTiers : [];
    if (ticketMode === 'EVENT_TICKET' && (!tiers.length || tiers.some((tier: any) => !tier.imageUrl || !Number(tier.price)))) {
      return NextResponse.json({ error: 'Event ticket mode needs at least one tier with an image and price.' }, { status: 400 });
    }
    
    const newTour = await prisma.tour.create({
      data: {
        date: body.date,
        dateTime: body.dateTime ? new Date(body.dateTime) : null,
        city: body.city,
        venue: body.venue,
        status: body.status || 'TICKETS',
        ticketingEnabled: body.ticketingEnabled !== false,
        ticketMode,
        currency: String(body.currency || 'NGN').toUpperCase(),
        saleStartsAt: body.saleStartsAt ? new Date(body.saleStartsAt) : null,
        saleEndsAt: body.saleEndsAt ? new Date(body.saleEndsAt) : null,
        perOrderLimit: Math.max(1, Number(body.perOrderLimit) || 6),
        soldOutMessage: body.soldOutMessage || undefined,
        ticketTiers: tiers.length ? { create: tiers.map((tier: any, index: number) => ({
          name: String(tier.name || 'General admission'), description: tier.description || null, perks: tier.perks || null,
          imageUrl: tier.imageUrl || null, price: Number(tier.price), quantity: Math.max(0, Number(tier.quantity) || 0),
          perOrderLimit: tier.perOrderLimit ? Number(tier.perOrderLimit) : null, sortOrder: index
        })) } : undefined
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
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

