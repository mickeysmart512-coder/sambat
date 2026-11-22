import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/admin';
import { notificationChannel } from '@/lib/notifications';

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;
  const order = await prisma.order.findUnique({ where: { id }, include: { tour: true, items: true } });
  if (!order || order.status !== 'PAID') return NextResponse.json({ error: 'Only paid orders can be resent.' }, { status: 400 });
  const log = await prisma.notificationLog.create({ data: { orderId: id, channel: process.env.NOTIFY_CHANNEL || 'discord' } });
  try {
    await notificationChannel().send({ reference: order.reference, buyerName: order.buyerName, phone: order.phone, email: order.email, show: `${order.tour.city} — ${order.tour.venue}`, items: order.items.map(item => `${item.quantity}× ${item.tierName}`).join(', '), amount: order.amount, currency: order.currency, timestamp: order.createdAt });
    await prisma.notificationLog.update({ where: { id: log.id }, data: { status: 'SENT', attempts: 1, deliveredAt: new Date() } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    await prisma.notificationLog.update({ where: { id: log.id }, data: { status: 'FAILED', attempts: 1, lastError: error instanceof Error ? error.message : 'Notification failed' } });
    return NextResponse.json({ error: 'Notification failed and was logged.' }, { status: 502 });
  }
}
