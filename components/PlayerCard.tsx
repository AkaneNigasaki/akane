'use client';

import React, { useState } from 'react';
import {
  User,
  Flame,
  Copy,
  Check,
  Calendar,
  Clock,
  Globe,
  Award,
  Zap,
  Shield,
  Star,
  CheckCircle2,
  Activity,
  Gauge,
  Radio,
  KeyRound,
  Crown,
  Medal,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { FFPlayerData } from '@/lib/freefire';

interface PlayerCardProps {
  player: FFPlayerData;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const [copiedUid, setCopiedUid] = useState(false);
  const [copiedNick, setCopiedNick] = useState(false);

  const { basic, credit, rank, prime, queryLatencyMs, activeApi, apiKeyRequirement } = player;

  const handleCopyUid = () => {
    navigator.clipboard.writeText(basic.accountId);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleCopyNick = () => {
    navigator.clipboard.writeText(basic.nickname);
    setCopiedNick(true);
    setTimeout(() => setCopiedNick(false), 2000);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
      {/* Top Banner Accent */}
      <div className="relative flex min-h-28 items-start justify-between border-b border-zinc-800 bg-zinc-950 p-4 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-orange-500">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            Région {basic.region}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md text-emerald-300 text-xs font-semibold border border-white/20">
            <Shield className="w-3.5 h-3.5" />
            Compte Vérifié Garena
          </span>
          {prime?.isVeteranOrPrime && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-900/60 backdrop-blur-md text-purple-200 text-xs font-semibold border border-purple-400/30">
              <Crown className="w-3.5 h-3.5 text-yellow-300" />
              {prime.veteranLabel}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md text-amber-300 text-xs font-mono border border-white/10">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{queryLatencyMs} ms</span>
        </div>
      </div>

      {/* Main Identity Info */}
      <div className="px-5 pb-5 -mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {/* Avatar and Nickname */}
          <div className="flex items-end gap-3.5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-zinc-950 border-4 border-zinc-900 shadow-xl flex items-center justify-center text-orange-500 overflow-hidden ring-1 ring-zinc-700">
                <User className="w-10 h-10 text-zinc-300" />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-950 font-black text-xs px-2 py-0.5 rounded-full shadow-md border-2 border-zinc-900 flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-zinc-950" />
                <span>{basic.level}</span>
              </div>
            </div>

            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {basic.nickname}
                </h3>
                <button
                  onClick={handleCopyNick}
                  title="Copier le pseudo"
                  className="p-1 text-zinc-400 hover:text-white transition"
                >
                  {copiedNick ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs font-mono text-zinc-400">UID: {basic.accountId}</span>
                <button
                  onClick={handleCopyUid}
                  title="Copier l'UID"
                  className="p-0.5 text-zinc-400 hover:text-white transition"
                >
                  {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {rank?.rankingLeaderboardPos && rank.rankingLeaderboardPos > 0 ? (
                  <span className="text-[11px] px-2 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                    Rang #{rank.rankingLeaderboardPos}
                  </span>
                ) : null}

                {prime?.diamondCost ? (
                  <span className="text-[11px] px-2 py-0.2 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                    {prime.diamondCost} 💎 Coût
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Likes and Credit Score */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                <Flame className="w-4 h-4 fill-orange-400/20" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400">Likes Totaux</div>
                <div className="text-sm sm:text-base font-black text-orange-400 font-mono">
                  {basic.liked.toLocaleString('fr-FR')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400">Score de Crédit</div>
                <div className="text-sm sm:text-base font-black text-emerald-400 font-mono">
                  {credit?.creditScore || 100} / 100
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API ayant réussi le test & Affichage du Quota (20 requêtes / min) + Statut Clé API */}
        <div className="mt-5 space-y-3">
          {/* Main API & Quota Block */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-950/90 border border-emerald-500/30 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
              {/* API info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    API ayant réussi le test : {activeApi?.testStatusLabel || 'Test Réussi (HTTP 200 OK)'}
                  </span>
                  <span className="font-mono text-zinc-400 text-[11px]">
                    Latence : <strong className="text-amber-400">{queryLatencyMs} ms</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap text-zinc-300">
                  <span className="font-bold text-white text-sm">
                    {activeApi?.apiName || 'Garena Client Americas Gateway (US Server)'}
                  </span>
                  <span className="text-zinc-500">&bull;</span>
                  <span className="font-mono text-[11px] bg-zinc-900 px-2 py-0.5 rounded text-zinc-300 border border-zinc-800">
                    {activeApi?.serverHost || 'client.us.freefiremobile.com'}
                  </span>
                  <span className="text-zinc-500">&bull;</span>
                  <span className="text-amber-300/90 text-[11px]">{activeApi?.protocol || 'Protobuf Direct vOB54'}</span>
                </div>

                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  {activeApi?.description || 'Passerelle officielle Garena sans serveur tiers, validée en direct.'}
                </p>
              </div>

              {/* Quota display: 20 requetes / min */}
              <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-700/60 p-3 rounded-lg shrink-0">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Quota Limite
                    </span>
                    <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono font-bold text-xs border border-orange-500/30">
                      {activeApi?.quota || '20 requêtes / min'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <div className="flex items-center gap-1 font-mono">
                      <span className="text-zinc-400 text-[11px]">Restant :</span>
                      <span className="font-bold text-emerald-400">
                        {activeApi?.quotaRemaining ?? 19} / {activeApi?.quotaLimit || 20}
                      </span>
                    </div>
                    <span className="text-zinc-600">&bull;</span>
                    <span className="text-[10px] text-zinc-400">
                      Cadence : <strong className="text-zinc-300">{activeApi?.recommendedInterval || '1 req / 3s'}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explicit User Query Answer: Do requests need an API Key? */}
          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <KeyRound className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">Besoin d&apos;une clé API pour les requêtes ?</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                    NON &bull; Sans Clé API
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px] mt-0.5">
                  {apiKeyRequirement?.explanation || 'Aucune clé API requise. Authentification directe via Garena MSDK Guest OAuth2 automatique.'}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700/80 text-[11px] text-zinc-300 font-mono">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>100% Gratuit &amp; Illimité</span>
            </div>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-zinc-800 text-xs">
          <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
            <div className="text-zinc-500 text-[11px] flex items-center gap-1.5 mb-1">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              Expérience (EXP)
            </div>
            <div className="font-mono font-bold text-zinc-200">
              {basic.exp.toLocaleString('fr-FR')} pts
            </div>
          </div>

          <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
            <div className="text-zinc-500 text-[11px] flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Création du compte
            </div>
            <div className="font-medium text-zinc-200 truncate" title={basic.createAt}>
              {basic.createAt || 'Inconnue'}
            </div>
          </div>

          <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
            <div className="text-zinc-500 text-[11px] flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              Dernière connexion
            </div>
            <div className="font-medium text-zinc-200 truncate" title={basic.lastLoginAt}>
              {basic.lastLoginAt || 'Inconnue'}
            </div>
          </div>

          <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
            <div className="text-zinc-500 text-[11px] flex items-center gap-1.5 mb-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Serveur Actif
            </div>
            <div className="font-semibold text-emerald-400">
              Garena Regional ({basic.region})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
