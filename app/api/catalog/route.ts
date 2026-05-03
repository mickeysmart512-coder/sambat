import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Get all visible catalog items
export async function GET() {
  try {
    const catalog = await prisma.catalog.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(catalog);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 500 });
  }
}

// Add new catalog item (Admin only)
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin in DB
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (dbUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { url, platform } = await request.json();
    
    const item = await prisma.catalog.create({
      data: { url, platform: platform || (url.includes('tiktok') ? 'tiktok' : 'instagram') }
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create catalog item' }, { status: 500 });
  }
}
