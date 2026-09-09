import { NextRequest, NextResponse } from 'next/server';
import { fetchFFPlayer } from '@/lib/freefire';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  const region = searchParams.get('region') || undefined;

  if (!uid) {
    return NextResponse.json(
      {
        success: false,
        error: 'Paramètre "uid" requis dans la requête (ex: /api/player?uid=2115167098)',
      },
      { status: 400 }
    );
  }

  try {
    const data = await fetchFFPlayer(uid, region);
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error('Free Fire player fetch error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Impossible de récupérer les informations du joueur.',
        uid,
      },
      { status: 404 }
    );
  }
}
