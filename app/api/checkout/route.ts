import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateOrder, makeOrderReference, normalisePhone, type CheckoutItem } from '@/lib/ticketing';
import { paymentProvider } from '@/lib/payments';
import { notificationChannel } from '@/lib/notifications';

const requests = new Map<string, { count: number; reset: number }>();
function rateLimited(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'local'; const now = Date.now(); const entry = requests.get(ip);
  if (!entry || entry.reset < now) { requests.set(ip, { count: 1, reset: now + 60_000 }); return false; }
  entry.count++; return entry.count > 10;
}

export async function POST(request: Request) {
  if (rateLimited(request)) return NextResponse.json({ error: 'Please wait a moment before trying again.' }, { status: 429 });
  try {
    const body = await request.json();
    const idempotencyKey = String(body.idempotencyKey || '');
    if (!/^[a-zA-Z0-9_-]{16,128}$/.test(idempotencyKey)) return NextResponse.json({ error: 'Invalid checkout session.' }, { status: 400 });
    const existing = await prisma.order.findUnique({ where: { idempotencyKey }, include: { tour: true, items: true } });
    if (existing) return NextResponse.json(existing);
    const name = String(body.name || '').trim(); const email = String(body.email || '').trim().toLowerCase();
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Enter a valid name and email.' }, { status: 400 });
    const phone = normalisePhone(String(body.phone || ''));
    const tour = await prisma.tour.findUnique({ where: { id: String(body.tourId || '') }, include: { ticketTiers: true } });
    if (!tour || !tour.ticketingEnabled || tour.status === 'SOLD OUT') return NextResponse.json({ error: tour?.soldOutMessage || 'Tickets are unavailable.' }, { status: 400 });
    const now = new Date(); if ((tour.saleStartsAt && tour.saleStartsAt > now) || (tour.saleEndsAt && tour.saleEndsAt < now)) return NextResponse.json({ error: 'Ticket sales are not open right now.' }, { status: 400 });
    const calculation = calculateOrder(body.items as CheckoutItem[], tour.ticketTiers, tour.perOrderLimit);
    const order = await prisma.$transaction(async tx => {
      const created = await tx.order.create({ data: { reference: makeOrderReference(), idempotencyKey, tourId: tour.id, buyerName: name, email, phone, notes: String(body.notes || '').slice(0, 500) || null, currency: tour.currency, amount: calculation.amount, items: { create: calculation.priced.map(({ tier, quantity }) => ({ ticketTierId: tier.id, tierName: tier.name, unitPrice: tier.price, quantity })) } }, include: { tour: true, items: true } });
      for (const { tier, quantity } of calculation.priced) await tx.ticketTier.update({ where: { id: tier.id }, data: { sold: { increment: quantity } } });
      return created;
    });
    const payment = await paymentProvider.createPayment({ orderReference: order.reference, amount: order.amount, currency: order.currency });
    const paid = payment.status === 'success';
    const updated = await prisma.order.update({ where: { id: order.id }, data: { status: paid ? 'PAID' : payment.status === 'failed' ? 'FAILED' : 'PENDING', paymentStatus: payment.status.toUpperCase(), paymentRef: payment.providerReference }, include: { tour: true, items: true } });
    if (paid) {
      const log = await prisma.notificationLog.create({ data: { orderId: order.id, channel: process.env.NOTIFY_CHANNEL || 'discord' } });
      try {
        await notificationChannel().send({ reference: updated.reference, buyerName: updated.buyerName, phone: updated.phone, email: updated.email, show: `${updated.tour.city} — ${updated.tour.venue}`, items: updated.items.map(item => `${item.quantity}× ${item.tierName}`).join(', '), amount: updated.amount, currency: updated.currency, timestamp: updated.createdAt });
        await prisma.notificationLog.update({ where: { id: log.id }, data: { status: 'SENT', attempts: 1, deliveredAt: new Date() } });
      } catch (error) { await prisma.notificationLog.update({ where: { id: log.id }, data: { status: 'FAILED', attempts: 1, lastError: error instanceof Error ? error.message : 'Notification failed' } }); }
    }
    return NextResponse.json(updated, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not create order.' }, { status: 400 }); }
}
