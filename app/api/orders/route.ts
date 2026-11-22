import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/admin';

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const where = { ...(params.get('status') ? { status: params.get('status')! } : {}), ...(params.get('tourId') ? { tourId: params.get('tourId')! } : {}) };
  const orders = await prisma.order.findMany({ where, include: { tour: true, items: true, notifications: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(orders);
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, status } = await request.json();
  if (!['PAID', 'FULFILLED', 'FAILED', 'CANCELLED'].includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  return NextResponse.json(await prisma.order.update({ where: { id }, data: { status } }));
}
