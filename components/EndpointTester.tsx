'use client';

import React, { useState } from 'react';
import {
  Server,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Gauge,
  Activity,
  Sparkles,
} from 'lucide-react';
import type { EndpointStatus } from '@/lib/freefire';

interface EndpointTesterProps {
  endpoints: EndpointStatus[];
  isLoading: boolean;
  onRefresh: () => void;
  testedAt?: string;
  quotaInfo?: {
    recommendedQuota?: string;
    limit?: number;
    used?: number;
    remaining?: number;
    resetInSeconds?: number;
    recommendedInterval?: string;
    description?: string;
  };
}

export function EndpointTester({
  endpoints,
  isLoading,
  onRefresh,
  testedAt,
  quotaInfo,
}: EndpointTesterProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'deprecated'>('all');

  const activeCount = endpoints.filter((e) => e.category === 'official_active').length;
  const deprecatedCount = endpoints.filter((e) => e.category === 'deprecated_community').length;

  const filteredEndpoints = endpoints.filter((e) => {
    if (filter === 'active') return e.category === 'official_active';
    if (filter === 'deprecated') return e.category === 'deprecated_community';
    return true;
  });

  return (
    <section className="bg-zinc-900/70 border border-zinc-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm">
      {/* Top Accordion Bar */}
      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 bg-zinc-900/90">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-semibold text-white">
                Rapport de Test des Liens &amp; Endpoints Free Fire
              </h2>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {activeCount} APIs Ayant Réussi le Test
              </span>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-orange-400" />
                Quota : {quotaInfo?.recommendedQuota || '20 requêtes / min'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Testés en direct depuis le serveur {testedAt ? `à ${testedAt}` : ''} &bull; Comparaison officiel actif vs communautaire déprécié
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-xs font-semibold shadow transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Tester en direct</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            aria-label={isExpanded ? 'Réduire' : 'Développer'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Synthèse API Ayant Réussi le Test & Quota Officiel */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 via-zinc-900 to-zinc-950 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  API ayant réussi le test : Direct Game Protocol (Protobuf Garena)
                </span>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  OB54 / Production
                </span>
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed max-w-3xl">
                Seules les passerelles officielles directes de jeu Garena (PolarBear SG, US/Americas, IND) et Garena OAuth ont validé les tests de connexion. Les anciennes API communautaires Vercel et Discord sont dépréciées (404/Inaccessibles).
              </p>
            </div>

            {/* Quota box & API Key status */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              {/* Quota Box */}
              <div className="flex items-center gap-3 bg-zinc-950/90 border border-orange-500/30 p-3 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Quota &amp; Cadence
                  </div>
                  <div className="text-xs sm:text-sm font-mono font-black text-orange-300">
                    {quotaInfo?.recommendedQuota || '20 requêtes / min'}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Recommandé : <strong className="text-zinc-300">{quotaInfo?.recommendedInterval || '1 req / 3s'}</strong>
                  </div>
                </div>
              </div>

              {/* API Key requirement box */}
              <div className="flex items-center gap-3 bg-zinc-950/90 border border-emerald-500/30 p-3 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Besoin Clé API ?
                  </div>
                  <div className="text-xs sm:text-sm font-mono font-black text-emerald-300">
                    NON &bull; 100% Sans Clé
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Protocole officiel <strong className="text-zinc-300">MSDK Handshake</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter pills & explanatory badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-zinc-950/80 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  filter === 'all'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Tous ({endpoints.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  filter === 'active'
                    ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Test Réussi ({activeCount})
              </button>
              <button
                onClick={() => setFilter('deprecated')}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  filter === 'deprecated'
                    ? 'bg-red-950/60 text-red-300 border border-red-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Dépréciés / Échoués ({deprecatedCount})
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Les passerelles <strong>Direct Game Protocol (Protobuf)</strong> ne dépendent d&apos;aucun tiers et restent stables.
              </span>
            </div>
          </div>

          {/* List of endpoints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredEndpoints.map((ep) => {
              const isOfficial = ep.category === 'official_active';
              const isSuccess = ep.testResult === 'success' || (isOfficial && ep.status === 'online');
              const isBlocked = ep.status === 'blocked' || ep.testResult === 'blocked';

              return (
                <div
                  key={ep.id}
                  className={`p-3.5 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                    isSuccess
                      ? 'bg-zinc-950/80 border-emerald-900/50 hover:border-emerald-700/70 shadow-sm'
                      : isBlocked
                      ? 'bg-zinc-950/50 border-amber-950/60 hover:border-amber-800/50'
                      : 'bg-zinc-950/40 border-red-950/50 hover:border-red-800/40 opacity-80'
                  }`}
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
                        {isSuccess ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : isBlocked ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span className="truncate">{ep.name}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {ep.isWinningApi && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Gagnante
                          </span>
                        )}
                        <span
                          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                            isSuccess
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : isBlocked
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {isSuccess ? 'Test Réussi' : isBlocked ? 'Captcha Requis' : 'Test Échoué (Déprécié)'}
                        </span>
                      </div>
                    </div>

                    {/* URL */}
                    <div className="font-mono text-[11px] text-zinc-400 break-all bg-zinc-900/80 px-2 py-1 rounded border border-zinc-800 mb-2 flex items-center justify-between gap-1">
                      <span className="truncate">{ep.url}</span>
                      <span className="text-[10px] text-zinc-500 uppercase">{ep.method}</span>
                    </div>

                    <p className="text-zinc-400 text-[11px] leading-relaxed mb-2.5">
                      {ep.description}
                    </p>

                    {/* Quota indicator box */}
                    <div className="mb-2.5 p-2 rounded bg-zinc-900/90 border border-zinc-800 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <Gauge className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span className="text-zinc-400">Quota :</span>
                        <strong className={isSuccess ? 'text-orange-300 font-mono' : 'text-zinc-500 font-mono'}>
                          {ep.quota || (isOfficial ? '20 requêtes / min' : '0 req / min')}
                        </strong>
                      </div>
                      {ep.rateLimitNote && (
                        <span className="text-[10px] text-zinc-500 truncate max-w-[200px]" title={ep.rateLimitNote}>
                          {ep.rateLimitNote}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer status bar */}
                  <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      {ep.httpCode && (
                        <span className="font-mono text-zinc-300">
                          HTTP <strong className={isSuccess ? 'text-emerald-400' : 'text-red-400'}>{ep.httpCode}</strong>
                        </span>
                      )}
                      {ep.latencyMs !== undefined && (
                        <span className="flex items-center gap-0.5 text-zinc-400 font-mono">
                          <Zap className="w-3 h-3 text-amber-400" />
                          {ep.latencyMs} ms
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-medium ${
                        isSuccess ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {ep.verdict}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
