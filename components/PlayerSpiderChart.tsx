'use client';

import React, { useState, useEffect } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Crosshair, Award, Shield, Swords, Zap, Activity } from 'lucide-react';
import type { FFAllStats, FFPlayerData } from '@/lib/freefire';

interface PlayerSpiderChartProps {
  player: FFPlayerData;
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg shadow-xl text-xs space-y-1.5 font-sans">
        <div className="font-bold text-amber-400 border-b border-zinc-800 pb-1">
          {payload[0]?.payload?.subject}
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-white">
              {entry.value} / 100
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

const emptySubscribe = () => () => {};

export function PlayerSpiderChart({ player }: PlayerSpiderChartProps) {
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [selectedModes, setSelectedModes] = useState<{
    solo: boolean;
    duo: boolean;
    squad: boolean;
    clashSquad: boolean;
  }>({
    solo: true,
    duo: true,
    squad: true,
    clashSquad: true,
  });

  const stats = player.stats;
  const cs = stats?.clashSquad;

  // Helper to normalize values to 0-100 scale for Radar Chart
  const calcStats = (modeStats?: any, isCs = false) => {
    if (!modeStats || modeStats.gamesPlayed === 0) {
      return {
        winRate: 0,
        headshotRate: 0,
        kdNormalized: 0,
        damageNormalized: 0,
        aggression: 0,
        survival: 0,
      };
    }

    const winRate = Math.min(100, Math.round((modeStats.winRate || 0) * 2)); // 50% win rate = 100 on radar scale
    const headshotRate = Math.min(100, Math.round(modeStats.headshotRate || 0));
    
    // KD ratio normalized (KD 4.0 = 100)
    const kdNormalized = Math.min(100, Math.round(((modeStats.kdRatio || 0) / 4) * 100));

    // Avg Damage normalized (Avg 1200 damage = 100)
    const avgDamage = modeStats.gamesPlayed > 0 ? (modeStats.damage || 0) / modeStats.gamesPlayed : 0;
    const damageNormalized = Math.min(100, Math.round((avgDamage / 1200) * 100));

    // Aggression index (Kills per match & Headshots)
    const avgKills = modeStats.gamesPlayed > 0 ? (modeStats.kills || 0) / modeStats.gamesPlayed : 0;
    const aggression = Math.min(100, Math.round((avgKills / 5) * 100));

    // Survival / Team Impact index
    let survival = 0;
    if (isCs) {
      const mvpRate = modeStats.gamesPlayed > 0 ? ((modeStats.mvpCount || 0) / modeStats.gamesPlayed) * 100 : 0;
      survival = Math.min(100, Math.round(mvpRate * 2.5));
    } else {
      const topRate = modeStats.gamesPlayed > 0 ? ((modeStats.top10Times || modeStats.topNTimes || 0) / modeStats.gamesPlayed) * 100 : 0;
      survival = Math.min(100, Math.round(topRate * 1.5));
    }

    return {
      winRate,
      headshotRate,
      kdNormalized,
      damageNormalized,
      aggression,
      survival,
    };
  };

  const soloData = calcStats(stats?.solo);
  const duoData = calcStats(stats?.duo);
  const squadData = calcStats(stats?.squad);
  const csData = calcStats(cs, true);

  // Radar axes data structure
  const spiderData = [
    {
      subject: 'Taux Victoire',
      fullMark: 100,
      Solo: soloData.winRate,
      Duo: duoData.winRate,
      Squad: squadData.winRate,
      ClashSquad: csData.winRate,
      unit: '%',
    },
    {
      subject: 'Précision Tête',
      fullMark: 100,
      Solo: soloData.headshotRate,
      Duo: duoData.headshotRate,
      Squad: squadData.headshotRate,
      ClashSquad: csData.headshotRate,
      unit: '%',
    },
    {
      subject: 'Ratio K/D',
      fullMark: 100,
      Solo: soloData.kdNormalized,
      Duo: duoData.kdNormalized,
      Squad: squadData.kdNormalized,
      ClashSquad: csData.kdNormalized,
      unit: 'pts',
    },
    {
      subject: 'Dégâts Moyens',
      fullMark: 100,
      Solo: soloData.damageNormalized,
      Duo: duoData.damageNormalized,
      Squad: squadData.damageNormalized,
      ClashSquad: csData.damageNormalized,
      unit: 'pts',
    },
    {
      subject: 'Agressivité (Kills)',
      fullMark: 100,
      Solo: soloData.aggression,
      Duo: duoData.aggression,
      Squad: squadData.aggression,
      ClashSquad: csData.aggression,
      unit: 'pts',
    },
    {
      subject: 'Impact / Survie',
      fullMark: 100,
      Solo: soloData.survival,
      Duo: duoData.survival,
      Squad: squadData.survival,
      ClashSquad: csData.survival,
      unit: 'pts',
    },
  ];

  const toggleMode = (mode: keyof typeof selectedModes) => {
    setSelectedModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
  };

  return (
    <section className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Spider Chart Profil &amp; Compétences de Combat
            </h3>
            <p className="text-xs text-zinc-400">
              Analyse radar multidimensionnelle des performances du joueur sur l&apos;ensemble des modes de jeu
            </p>
          </div>
        </div>

        {/* Mode Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => toggleMode('solo')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 ${
              selectedModes.solo
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            Solo
          </button>

          <button
            onClick={() => toggleMode('duo')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 ${
              selectedModes.duo
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Duo
          </button>

          <button
            onClick={() => toggleMode('squad')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 ${
              selectedModes.squad
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Squad BR
          </button>

          <button
            onClick={() => toggleMode('clashSquad')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 ${
              selectedModes.clashSquad
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Clash Squad
          </button>
        </div>
      </div>

      {/* Spider Radar Chart Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
        {/* Radar Graphic */}
        <div className="lg:col-span-7 h-[340px] sm:h-[380px] w-full bg-zinc-950/60 rounded-xl border border-zinc-800/80 p-2 relative flex items-center justify-center">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={spiderData}>
                <PolarGrid stroke="#3f3f46" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#52525b" tick={{ fontSize: 9 }} />

                {selectedModes.solo && (
                  <Radar
                    name="Solo"
                    dataKey="Solo"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                )}

                {selectedModes.duo && (
                  <Radar
                    name="Duo"
                    dataKey="Duo"
                    stroke="#22d3ee"
                    fill="#22d3ee"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                )}

                {selectedModes.squad && (
                  <Radar
                    name="Squad BR"
                    dataKey="Squad"
                    stroke="#fbbf24"
                    fill="#fbbf24"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                )}

                {selectedModes.clashSquad && (
                  <Radar
                    name="Clash Squad"
                    dataKey="ClashSquad"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                    strokeWidth={2.5}
                  />
                )}

                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#d4d4d8' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center text-zinc-500 text-xs">
              Chargement du Spider Chart...
            </div>
          )}
        </div>

        {/* Skill Breakdown Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-400" />
            <span>Indices Clés du Spider Chart</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Precision / Headshot */}
            <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                  <Crosshair className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Précision Tête (Tirs à la tête)</div>
                  <div className="text-[11px] text-zinc-400">
                    Max: <strong className="text-red-400">{cs?.headshotRate || stats?.squad?.headshotRate || 0}%</strong> (Clash Squad)
                  </div>
                </div>
              </div>
              <span className="font-mono font-bold text-red-400 text-sm">
                {csData.headshotRate}/100
              </span>
            </div>

            {/* Win Rate */}
            <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Domination &amp; Booyah</div>
                  <div className="text-[11px] text-zinc-400">
                    Taux CS: <strong className="text-amber-400">{cs?.winRate || 0}%</strong> ({cs?.wins || 0} victoires)
                  </div>
                </div>
              </div>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {csData.winRate}/100
              </span>
            </div>

            {/* Aggression & K/D */}
            <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                  <Swords className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Ratio K/D &amp; Lethalité</div>
                  <div className="text-[11px] text-zinc-400">
                    CS K/D: <strong className="text-orange-400">{cs?.kdRatio || 1.0}</strong> ({cs?.kills || 0} kills)
                  </div>
                </div>
              </div>
              <span className="font-mono font-bold text-orange-400 text-sm">
                {csData.kdNormalized}/100
              </span>
            </div>

            {/* Team Impact / MVP */}
            <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Impact de Jeu &amp; Titres MVP</div>
                  <div className="text-[11px] text-zinc-400">
                    MVP: <strong className="text-purple-300">{cs?.mvpCount || 0} fois</strong> &bull; Ace: {cs?.fourKills || 0}
                  </div>
                </div>
              </div>
              <span className="font-mono font-bold text-purple-400 text-sm">
                {csData.survival}/100
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
