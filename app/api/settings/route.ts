import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap = settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    
    // Add default values if not exists
    const defaults = {
      price_wedding: "150000",
      price_club: "100000",
      price_birthday: "50000",
      price_corporate: "200000",
      travel_fee: "30000",
      base_location: "Lagos"
    };

    return NextResponse.json({ ...defaults, ...settingsMap });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json(); // { key: string, value: string }
    const setting = await prisma.setting.upsert({
      where: { key: body.key },
      update: { value: body.value },
      create: { key: body.key, value: body.value }
    });
    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
