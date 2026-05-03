import { NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const supabase = await getServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ isAdmin: false });
    }

    // 1. Check environment variable whitelist
    const whitelist = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
    if (whitelist.includes(user.email.toLowerCase())) {
      // Ensure they have ADMIN role in DB too
      await prisma.user.upsert({
        where: { email: user.email },
        update: { role: 'ADMIN' },
        create: { 
          email: user.email, 
          role: 'ADMIN',
          fullName: user.user_metadata?.full_name || 'Admin'
        }
      });
      return NextResponse.json({ isAdmin: true });
    }

    // 2. Check Database role
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (dbUser?.role === 'ADMIN') {
      return NextResponse.json({ isAdmin: true });
    }

    return NextResponse.json({ isAdmin: false });
  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
