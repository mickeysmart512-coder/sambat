import prisma from '@/lib/prisma';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function isAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return false;
  if ((process.env.ADMIN_EMAILS || '').split(',').map(value => value.trim().toLowerCase()).includes(user.email.toLowerCase())) return true;
  return (await prisma.user.findUnique({ where: { email: user.email } }))?.role === 'ADMIN';
}
