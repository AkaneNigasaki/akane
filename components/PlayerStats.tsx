'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Crosshair,
  Skull,
  Activity,
  Users,
  User,
  Shield,
  Clock,
  Compass,
  Zap,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import type { FFAllStats, FFClanInfo, FFPetInfo, FFSocialInfo, FFModeStats } from '@/lib/freefire';

interface PlayerStatsProps {
  stats?: FFAllStats;
  clan?: FFClanInfo;
  pet?: FFPetInfo;
  social?: FFSocialInfo;
}

export function PlayerStats({ stats, clan, pet, social }: PlayerStatsProps) {
  const [activeTab, setActiveTab] = useState<'solo' | 'duo' | 'squad'>('solo');

  const currentMode: FFModeStats | undefined =
    activeTab === 'solo' ? stats?.solo : activeTab === 'duo' ? stats?.duo : stats?.squad;

  const modeTitle = activeTab === 'solo' ? 'Solo (1v99)' : activeTab === 'duo' ? 'Duo (2v2)' : 'Squad (4v4 Escouade)';

  return (
    <div className="space-y-4">
      {/* Battle Royale Stats Section */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Statistiques de Combat (Battle Royale)
            </h3>
            <p className="text-xs text-zinc-400">
              Historique de combat officiel synchronisé avec les serveurs Free Fire
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('solo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                activeTab === 'solo'
                  ? 'bg-orange-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Solo</span>
              {stats?.solo && (
                <span className="text-[10px] opacity-80">({stats.solo.gamesPlayed})</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('duo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                activeTab === 'duo'
                  ? 'bg-orange-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Duo</span>
              {stats?.duo && (
                <span className="text-[10px] opacity-80">({stats.duo.gamesPlayed})</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('squad')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                activeTab === 'squad'
                  ? 'bg-orange-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Squad</span>
              {stats?.squad && (
                <span className="text-[10px] opacity-80">({stats.squad.gamesPlayed})</span>
              )}
            </button>
          </div>
        </div>

        {/* Current Mode Metrics */}
        {currentMode && currentMode.gamesPlayed > 0 ? (
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">Mode sélectionné : {modeTitle}</span>
              <span>Total : {currentMode.gamesPlayed} parties jouées</span>
            </div>

            {/* Main 4 Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* K/D Ratio */}
              <div className="bg-zinc-950/80 border border-zinc-800/80 p-3.5 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                  <span>Ratio K/D</span>
                  <Crosshair className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {currentMode.kdRatio.toFixed(2)}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  {currentMode.kills} éliminations / {currentMode.deaths} morts
                </div>
              </div>

              {/* Win Rate */}
              <div className="bg-zinc-950/80 border border-zinc-800/80 p-3.5 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                  <span>Taux de Victoire</span>
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {currentMode.winRate.toFixed(1)}%
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  {currentMode.wins} Booyah! sur {currentMode.gamesPlayed}
                </div>
              </div>

              {/* Headshot Rate */}
              <div className="bg-zinc-950/80 border border-zinc-800/80 p-3.5 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                  <span>Tirs à la Tête</span>
                  <Skull className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-2xl font-black text-red-400 font-mono">
                  {currentMode.headshotRate.toFixed(1)}%
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  {currentMode.headshots} headshots enregistrés
                </div>
              </div>

              {/* Total Damage */}
              <div className="bg-zinc-950/80 border border-zinc-800/80 p-3.5 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                  <span>Dégâts Totaux</span>
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {currentMode.damage.toLocaleString('fr-FR')}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  Moy. ~{Math.round(currentMode.damage / currentMode.gamesPlayed)} / partie
                </div>
              </div>
            </div>

            {/* Secondary stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
              <div className="bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-900">
                <div className="text-zinc-500 text-[11px]">Record Kills (1 partie)</div>
                <div className="font-bold text-zinc-200 font-mono text-sm mt-0.5">
                  {currentMode.highestKills} éliminations
                </div>
              </div>

              <div className="bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-900">
                <div className="text-zinc-500 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Temps de Survie
                </div>
                <div className="font-bold text-zinc-200 font-mono text-sm mt-0.5">
                  {currentMode.survivalTimeMinutes} minutes
                </div>
              </div>

              <div className="bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-900">
                <div className="text-zinc-500 text-[11px] flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  Distance Parcourue
                </div>
                <div className="font-bold text-zinc-200 font-mono text-sm mt-0.5">
                  {currentMode.distanceKm} km
                </div>
              </div>

              <div className="bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-900">
                <div className="text-zinc-500 text-[11px]">Réanimations / K.O.</div>
                <div className="font-bold text-zinc-200 font-mono text-sm mt-0.5">
                  {currentMode.revives || 0} / {currentMode.knockdowns || 0}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-zinc-400 text-xs">
            <Activity className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="font-medium text-zinc-300">Aucune partie enregistrée en mode {modeTitle}</p>
            <p className="text-zinc-500 mt-0.5">
              Le joueur n&apos;a pas encore de parties compétitives enregistrées dans ce mode.
            </p>
          </div>
        )}
      </div>

      {/* Guild, Pet & Social Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Clan / Guild Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-400" />
                <span>Guilde / Clan</span>
              </span>
              {clan && (
                <span className="text-[10px] text-zinc-500 font-mono">ID {clan.clanId}</span>
              )}
            </div>
            {clan ? (
              <div className="space-y-2">
                <div className="text-lg font-black text-white">{clan.clanName}</div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold">
                    Niveau {clan.clanLevel}
                  </span>
                  <span>
                    {clan.memberNum} / {clan.capacity} Membres
                  </span>
                </div>

                {/* Guild Captain info */}
                {clan.captain && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                      <span>Capitaine de Guilde</span>
                    </div>
                    <div className="text-xs font-black text-white flex items-center justify-between">
                      <span>{clan.captain.nickname}</span>
                      <span className="text-zinc-400 font-mono text-[11px]">Lvl {clan.captain.level}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>{clan.captain.liked.toLocaleString()} Likes</span>
                      <span className="font-mono">UID {clan.captain.accountId}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-zinc-500 py-3">
                Ce joueur ne fait actuellement partie d&apos;aucune guilde.
              </div>
            )}
          </div>
        </div>

        {/* Pet Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Familier (Pet)</span>
              </span>
              {pet?.skinId && (
                <span className="text-[10px] text-zinc-500 font-mono">Skin #{pet.skinId}</span>
              )}
            </div>
            {pet ? (
              <div className="space-y-2">
                <div className="text-lg font-black text-white">{pet.name}</div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                    Niveau {pet.level}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-500">
                    EXP: {pet.exp}
                  </span>
                </div>
                {pet.selectedSkillId ? (
                  <div className="p-2 rounded bg-zinc-950/70 border border-zinc-800 text-[11px] text-zinc-300">
                    Compétence tactique active : <span className="font-mono text-amber-300 font-bold">#{pet.selectedSkillId}</span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-xs text-zinc-500 py-3">
                Aucun familier actif équipé sur ce compte.
              </div>
            )}
          </div>
        </div>

        {/* Social & Signature Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Bio &amp; Préférences</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-zinc-950/80 border border-zinc-800/80 text-zinc-300 min-h-[50px] font-mono text-[11px] whitespace-pre-line leading-relaxed">
                {social?.signature ? (
                  <div className="space-y-0.5">
                    {social.signature.split('\n').map((line, idx) => {
                      const cleanLine = line.replace(/\[b\]/gi, '').replace(/\[c\]/gi, '');
                      const colorMatch = cleanLine.match(/\[([0-9A-Fa-f]{6})\](.*)/);
                      if (colorMatch) {
                        const hex = colorMatch[1];
                        const text = colorMatch[2];
                        const before = cleanLine.substring(0, cleanLine.indexOf(`[${hex}]`));
                        return (
                          <div key={idx} className="text-center font-bold">
                            <span>{before}</span>
                            <span style={{ color: `#${hex}` }}>{text}</span>
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="text-center font-bold text-zinc-300">
                          {cleanLine}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="italic text-zinc-500">Aucune signature personnalisée.</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-zinc-400 pt-1">
                <div>
                  Horaires : <strong className="text-zinc-200">{social?.timeOnline === 'TIMEONLINEWORKDAY' ? 'En semaine' : social?.timeOnline || 'Libre'}</strong>
                </div>
                <div>
                  Affichage rang : <strong className="text-cyan-300">{social?.rankShow === 'RANKSHOWCS' ? 'Clash Squad' : social?.rankShow || 'BR'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
