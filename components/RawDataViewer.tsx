'use client';

import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Search,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import type { FFPlayerData } from '@/lib/freefire';

interface RawDataViewerProps {
  player: FFPlayerData;
}

export function RawDataViewer({ player }: RawDataViewerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<'all' | 'rank' | 'prime' | 'elitePass' | 'stats' | 'profile'>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Extract sections for raw inspection
  const rawSections: Record<string, any> = {
    all: {
      accountInfo: player.basic,
      rankInfo: player.rank,
      primeInfo: player.prime,
      elitePassHistory: player.elitePass,
      clashSquadStats: player.stats?.clashSquad,
      statsBattleRoyale: {
        solo: player.stats?.solo,
        duo: player.stats?.duo,
        squad: player.stats?.squad,
      },
      clanInfo: player.clan,
      petInfo: player.pet,
      socialInfo: player.social,
      creditScore: player.credit,
      equipmentProfile: player.profile,
      apiKeyRequirement: player.apiKeyRequirement || {
        requiresApiKey: false,
        authMethod: 'Garena MSDK Guest OAuth2 (Automatique & Sans Clé)',
        isFree: true,
        explanation: 'Aucune clé API requise. Le protocole officiel Garena utilise un handshake dynamique d\'invité.',
      },
      rawProtobufGarena: player.rawJson,
    },
    rank: {
      rankingLeaderboardPos: player.rank?.rankingLeaderboardPos,
      rankShow: player.rank?.rankShow,
      mmrList: player.rank?.mmrList,
      modeStatsSummary: player.rank?.modeStatsSummary,
      titles: player.rank?.titles,
      rawMmrListGarena: player.rawJson?.profile?.mmrlist,
      rawRankLeaderboardPos: player.rawJson?.profile?.rankingleaderboardpos,
      rawTitlesGarena: player.rawJson?.profile?.socialinfo?.leaderboardtitles,
    },
    prime: {
      preVeteranType: player.prime?.preVeteranType,
      isVeteranOrPrime: player.prime?.isVeteranOrPrime,
      veteranLabel: player.prime?.veteranLabel,
      diamondCost: player.prime?.diamondCost,
      rawDiamondCostRes: player.rawJson?.profile?.diamondcostres,
      rawPreVeteranType: player.rawJson?.profile?.preveterantype,
      creditScoreInfo: player.credit,
      rawCreditScoreInfoGarena: player.rawJson?.profile?.creditscoreinfo,
    },
    elitePass: {
      totalPassesInHistory: player.elitePass?.length || 0,
      elitePasses: player.elitePass,
      rawHistoryEpInfoGarena: player.rawJson?.profile?.historyepinfo,
    },
    stats: {
      battleRoyaleSolo: player.stats?.solo,
      battleRoyaleDuo: player.stats?.duo,
      battleRoyaleSquad: player.stats?.squad,
      clashSquad: player.stats?.clashSquad,
      rawStatsBRGarena: player.rawJson?.statsBR,
      rawStatsCSGarena: player.rawJson?.statsCS,
    },
    profile: {
      avatarId: player.profile?.avatarId,
      clothesIds: player.profile?.clothes,
      equippedSkillIds: player.profile?.equippedSkills,
      skinColor: player.profile?.skinColor,
      pvePrimaryWeapon: player.profile?.pvePrimaryWeapon,
      tailorEffects: player.profile?.tailorEffects,
      rawProfileInfoGarena: player.rawJson?.profile?.profileinfo,
      rawBasicInfoGarena: player.rawJson?.profile?.basicinfo,
    },
  };

  const currentData = rawSections[activeSection] || rawSections.all;
  const jsonString = JSON.stringify(currentData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter json lines if search term is active
  const displayLines = searchTerm.trim()
    ? jsonString
        .split('\n')
        .filter((line) => line.toLowerCase().includes(searchTerm.toLowerCase()))
        .join('\n')
    : jsonString;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Données Brutes &amp; Informations Étendues (Raw JSON)
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                Protobuf Décrypté Garena
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Visualisation intégrale sans filtre : Rank, MMR, Prime, Vétéran, Pass Élite, Diamants &amp; CS Stats
            </p>
          </div>
        </div>

        {/* Api key notice pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>Clé API : Aucune Requise (100% Gratuit)</span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
            title={isOpen ? 'Replier le visualiseur' : 'Déplier le visualiseur'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Question / Response Banner: Need API Key? */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                  <span>La requête a-t-elle besoin d&apos;une clé API ?</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[11px] font-black uppercase">
                    NON &bull; Aucune Clé Requise
                  </span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed max-w-3xl">
                  Le système communique <strong>directement avec le protocole officiel de jeu de Garena</strong> (Garena MSDK Guest OAuth2 avec hachage HMAC SHA-256). Les jetons de session d&apos;invité sont générés automatiquement à la volée côté serveur. <strong>Vous n&apos;avez besoin d&apos;aucune clé API externe ni inscription payante.</strong>
                </p>
              </div>
            </div>

            <div className="shrink-0 bg-zinc-950/80 px-3 py-2 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-400">
              Auth: <span className="text-emerald-400 font-bold">Auto-Handshake MSDK</span>
            </div>
          </div>

          {/* Section Selector Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950/90 p-1.5 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setActiveSection('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  activeSection === 'all'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Tout le JSON
              </button>

              <button
                onClick={() => setActiveSection('rank')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                  activeSection === 'rank'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Rank &amp; MMR Brut</span>
              </button>

              <button
                onClick={() => setActiveSection('prime')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                  activeSection === 'prime'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3 h-3 text-purple-300" />
                <span>Prime, Vétéran &amp; Diamants</span>
              </button>

              <button
                onClick={() => setActiveSection('elitePass')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  activeSection === 'elitePass'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Pass Élite Historique ({player.elitePass?.length || 0})
              </button>

              <button
                onClick={() => setActiveSection('stats')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  activeSection === 'stats'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Stats BR &amp; CS Brutes
              </button>

              <button
                onClick={() => setActiveSection('profile')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  activeSection === 'profile'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Profil, Skins &amp; Équipement
              </button>
            </div>

            {/* Actions: Search & Copy */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher dans le JSON..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 w-44 sm:w-56"
                />
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 text-xs font-medium transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier JSON'}</span>
              </button>
            </div>
          </div>

          {/* Raw JSON Code Block */}
          <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs overflow-x-auto max-h-96 scrollbar-thin scrollbar-thumb-zinc-700">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-900 text-[11px] text-zinc-500">
              <span>Section : <strong className="text-indigo-400">{activeSection.toUpperCase()}</strong></span>
              <span>Lignes : {displayLines.split('\n').length} &bull; Encodage Protobuf UTF-8</span>
            </div>

            <pre className="text-zinc-300 leading-relaxed select-all">
              {displayLines}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
