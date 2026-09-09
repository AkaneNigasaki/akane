import { NextResponse } from 'next/server';
import { testAllEndpoints, getRateLimitStatus } from '@/lib/freefire';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const endpoints = await testAllEndpoints();
    const rateLimit = getRateLimitStatus();
    const winningEndpoints = endpoints.filter((e) => e.isWinningApi && e.testResult === 'success');

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      testedAt: new Date().toLocaleTimeString('fr-FR'),
      quotaInfo: {
        recommendedQuota: '20 requêtes / min',
        limit: rateLimit.limit,
        used: rateLimit.used,
        remaining: rateLimit.remaining,
        resetInSeconds: rateLimit.resetInSeconds,
        recommendedInterval: rateLimit.recommendedInterval,
        description: 'Limite conseillée de 20 requêtes / minute pour éviter le blocage IP par les pare-feux Garena WAF.',
      },
      winningApiCount: winningEndpoints.length,
      endpoints,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Erreur lors du test des endpoints.',
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Allow manual refresh trigger via POST
  return GET();
}
