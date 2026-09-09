'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Crown,
  Medal,
  Sparkles,
  Layers,
  Award,
  Swords,
  Crosshair,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Tag,
  Flame,
  Diamond,
} from 'lucide-react';
import type { FFPlayerData } from '@/lib/freefire';

interface PlayerRankPrimeProps {
  player: FFPlayerData;
}

export function PlayerRankPrime({ player }: PlayerRankPrimeProps) {
  const { rank, prime, elitePass, stats, credit } = player;
  const [activeTab, setActiveTab] = useState<'rank' | 'prime' | 'elitePass' | 'csStats'>('rank');

  const mmrList = rank?.mmrList || [];
  const titles = rank?.titles;
  const cs = stats?.clashSquad;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
      {/* Navigation tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-zinc-800 bg-zinc-950/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Rang, Prime, Pass Élite &amp; Statistiques Avancées
            </h3>
            <p className="text-[11px] text-zinc-400">
              Extraction brute décodée depuis les paquets protobuf officiels Garena
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('rank')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              activeTab === 'rank'
                ? 'bg-amber-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Classement &amp; Rank</span>
          </button>

          <button
            onClick={() => setActiveTab('prime')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              activeTab === 'prime'
                ? 'bg-purple-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Prime &amp; Vétéran</span>
          </button>

          <button
            onClick={() => setActiveTab('elitePass')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              activeTab === 'elitePass'
                ? 'bg-orange-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Medal className="w-3.5 h-3.5" />
            <span>Pass Élite ({elitePass?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('csStats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              activeTab === 'csStats'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Clash Squad (CS)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Rank & MMR */}
      {activeTab === 'rank' && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-xl">
              <div className="text-zinc-400 text-xs mb-1 flex items-center justify-between">
                <span>Leaderboard Régional</span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-black text-white font-mono">
                {rank?.rankingLeaderboardPos && rank.rankingLeaderboardPos > 0
                  ? `#${rank.rankingLeaderboardPos}`
                  : 'Hors Top 100'}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                Position officielle sur les serveurs régionaux
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-xl">
              <div className="text-zinc-400 text-xs mb-1 flex items-center justify-between">
                <span>Affichage Rang Actif</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-xl font-black text-yellow-400 font-mono truncate">
                {rank?.rankShow === 'RANKSHOWBR'
                  ? 'Battle Royale (BR)'
                  : rank?.rankShow === 'RANKSHOWCS'
                  ? 'Clash Squad (CS)'
                  : 'Par Défaut'}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                Code: <code className="text-zinc-400">{rank?.rankShow || 'RANKSHOWNONE'}</code>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-xl">
              <div className="text-zinc-400 text-xs mb-1 flex items-center justify-between">
                <span>Héroïque / Grand Maître</span>
                <Award className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-xl font-black text-orange-400 font-mono">
                {rank?.modeStatsSummary?.reachedHeroicCount || 0} fois
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                Score max : {rank?.modeStatsSummary?.maxScore || 'N/A'}
              </div>
            </div>
          </div>

          {/* MMR Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
              Modes Classés &amp; Points MMR (Protobuf mmrlist)
            </h4>

            {mmrList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mmrList.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-950/60 border border-zinc-800/80 p-3 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-zinc-200">{m.modeName}</div>
                      <div className="text-[11px] text-zinc-500">
                        Mode ID : <span className="font-mono">{m.gameMode}</span> &bull; Victoires consécutives :{' '}
                        <strong className="text-emerald-400">{m.streakWins}</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-amber-400 font-mono">
                        {m.mmr} MMR
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Bot points : {m.botPoint}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-800/60 text-xs text-zinc-400">
                Aucun point MMR actif dans le tableau mmrlist de ce profil.
              </div>
            )}
          </div>

          {/* Titles */}
          {(titles?.ranking?.length || titles?.weapon?.length || titles?.guildWar?.length || titles?.csPeak?.length) ? (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                Titres &amp; Honneurs de Classement Équipés
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {titles?.weapon?.map((w, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-300">Maîtrise Arme #{w.weaponId} ({w.regionName})</span>
                    <span className="font-bold text-amber-400">Rang #{w.rank}</span>
                  </div>
                ))}
                {titles?.ranking?.map((r, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-300">Titre Classement ({r.regionName})</span>
                    <span className="font-bold text-amber-400">Rang #{r.rank}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Tab 2: Prime & Veteran */}
      {activeTab === 'prime' && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Prime / Veteran Status */}
            <div className="bg-zinc-950/80 border border-purple-900/40 p-3.5 rounded-xl">
              <div className="text-zinc-400 text-xs mb-1 flex items-center justify-between">
                <span>Statut Vétéran / Prime</span>
                <Crown className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-lg font-black text-purple-300 font-mono">
                {prime?.veteranLabel || 'Standard'}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                Type : <code className="text-zinc-400">{prime?.preVeteranType || 'NONE'}</code>
              </div>
            </div>

            {/* Diamond Cost / Prime Investment */}
            <div className="bg-zinc-950/80 border border-blue-900/40 p-3.5 rounded-xl">
              <div className="text-zinc-400 text-xs mb-1 flex items-center justify-between">
                <span>Coût en Diamants (Prime)</span>
                <Diamond className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xl font-black text-blue-400 font-mono">
                {prime?.diamondCost ? `${prime.diamondCost.toLocaleString('fr-FR')} 💎` : '0 💎'}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                Valeur renvoyée par <code className="text-zinc-400">diamondcostres</code>
              </div>
            </div>

            {/* Credit Score & Conduct */}
            <div className="bg-zinc-950/80 border border-emerald-900/40 p-3.5 rounded-xl">
              <div className="text-zinc-400 text-xs mb-1 flex items-center justify-between">
                <span>Score d&apos;Honneur &amp; Conduite</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black text-emerald-400 font-mono">
                {credit?.creditScore || 100} / 100
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                Infractions : <strong className="text-zinc-300">{credit?.illegalCount || 0}</strong> &bull; Likes hebdo : <strong className="text-zinc-300">{credit?.likeCount || 0}</strong>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs space-y-2">
            <h4 className="font-bold text-zinc-200">Explication du Statut Prime &amp; Vétéran Garena</h4>
            <p className="text-zinc-400 leading-relaxed">
              Dans Free Fire, les joueurs disposant d&apos;un statut <strong>Vétéran</strong> ou <strong>Prime</strong> bénéficient d&apos;actions de buff et de bonus d&apos;EXP ou de réapparition après des périodes d&apos;inactivité ou d&apos;abonnements. Le champ <code className="text-purple-300">preveterantype</code> reflète l&apos;état actif du joueur dans le système de rétention de Garena.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Elite Pass History */}
      {activeTab === 'elitePass' && (
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300">
              Historique des Passes d&apos;Élite &amp; Booyah Passes enregistrés ({elitePass?.length || 0})
            </span>
            <span className="text-zinc-500 text-[11px]">Données officielles historyepinfo</span>
          </div>

          {elitePass && elitePass.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {elitePass.map((ep, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                    ep.ownedPass
                      ? 'bg-orange-950/30 border-orange-700/50 text-zinc-200'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-white text-xs truncate">
                        {ep.eventName || `Saison ${ep.eventId}`}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                          ep.ownedPass
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {ep.ownedPass ? 'Possédé' : 'Gratuit'}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-400">
                      Événement ID : <span className="font-mono">{ep.eventId}</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Badges collectés :</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {ep.badgeCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-zinc-400 bg-zinc-950/40 rounded-xl border border-zinc-800/60">
              Aucun historique de Pass Élite répertorié sur ce compte.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Clash Squad Stats */}
      {activeTab === 'csStats' && (
        <div className="p-4 sm:p-5 space-y-4">
          {cs && cs.gamesPlayed > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl">
                  <div className="text-zinc-400 text-xs mb-1">Ratio K/D (CS)</div>
                  <div className="text-2xl font-black text-white font-mono">
                    {cs.kdRatio.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    {cs.kills} kills / {cs.deaths} morts
                  </div>
                </div>

                <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl">
                  <div className="text-zinc-400 text-xs mb-1">Taux Victoire (CS)</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {cs.winRate.toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    {cs.wins} victoires / {cs.gamesPlayed} matchs
                  </div>
                </div>

                <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl">
                  <div className="text-zinc-400 text-xs mb-1">Nombre de MVP</div>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {cs.mvpCount ?? 0} fois
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    Meilleur joueur du match
                  </div>
                </div>

                <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl">
                  <div className="text-zinc-400 text-xs mb-1">Tirs à la Tête (CS)</div>
                  <div className="text-2xl font-black text-red-400 font-mono">
                    {(cs.headshotRate ?? 0).toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    {cs.headshotKills ?? 0} éliminations tête
                  </div>
                </div>
              </div>

              {/* Advanced CS breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800">
                  <span className="text-zinc-500 block text-[11px]">Doubles / Triples Kills</span>
                  <span className="font-bold text-zinc-200 font-mono">
                    {cs.doubleKills ?? 0} / {cs.tripleKills ?? 0}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800">
                  <span className="text-zinc-500 block text-[11px]">Quadruple Kills (Ace)</span>
                  <span className="font-bold text-amber-400 font-mono">
                    {cs.fourKills ?? 0}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800">
                  <span className="text-zinc-500 block text-[11px]">Passes Décisives (Assists)</span>
                  <span className="font-bold text-zinc-200 font-mono">
                    {cs.assists ?? 0}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800">
                  <span className="text-zinc-500 block text-[11px]">Dégâts Max en 1 match</span>
                  <span className="font-bold text-zinc-200 font-mono">
                    {(cs.oneGameMostDamage ?? cs.damage ?? 0).toLocaleString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-zinc-400 bg-zinc-950/40 rounded-xl border border-zinc-800/60">
              Aucune statistique enregistrée en mode Clash Squad sur ce compte.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
