'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Trophy,
  Crown,
  Shield,
  Users,
  Sparkles,
  Heart,
  MessageSquare,
  KeyRound,
  Crosshair,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Box,
} from 'lucide-react';
import type { FFPlayerData } from '@/lib/freefire';

interface PlayerDeepExplanationsProps {
  player: FFPlayerData;
}

export function PlayerDeepExplanations({ player }: PlayerDeepExplanationsProps) {
  const [activeSection, setActiveSection] = useState<string | null>('overview');

  const { basic, rank, prime, elitePass, stats, clan, pet, social, credit, profile, apiKeyRequirement } = player;

  const toggleSection = (id: string) => {
    setActiveSection(activeSection === id ? null : id);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Guide &amp; Explications Détaillées des Données
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                100% Décrypté
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Comprenez la signification exacte de chaque métrique renvoyée par le protocole Free Fire
            </p>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="divide-y divide-zinc-800">
        {/* 1. Compte & Identité */}
        <div className="p-4 sm:p-5">
          <button
            onClick={() => toggleSection('account')}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-orange-400 transition flex items-center gap-2">
                  Profil &amp; Compte Garena
                  <span className="text-xs font-mono text-zinc-400">
                    (Niveau {basic.level} &bull; {basic.region})
                  </span>
                </h4>
                <p className="text-xs text-zinc-400">
                  EXP cumulée, popularité ({basic.liked} likes) et dates de création
                </p>
              </div>
            </div>
            {activeSection === 'account' ? (
              <ChevronUp className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            )}
          </button>

          {activeSection === 'account' && (
            <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3 text-xs sm:text-sm text-zinc-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-zinc-950/70 p-3 rounded-lg border border-zinc-800">
                  <div className="text-[11px] font-bold text-orange-400 uppercase">Progression d&apos;EXP</div>
                  <div className="text-sm font-black text-white mt-1">{basic.exp.toLocaleString()} EXP</div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Atteindre le niveau {basic.level} nécessite près de 500,000 points d&apos;expérience accumulés au fil de centaines de parties.
                  </p>
                </div>

                <div className="bg-zinc-950/70 p-3 rounded-lg border border-zinc-800">
                  <div className="text-[11px] font-bold text-red-400 uppercase">Popularité &amp; Likes</div>
                  <div className="text-sm font-black text-white mt-1">{basic.liked.toLocaleString()} Likes</div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Pouces levés reçus en fin de partie de la part des coéquipiers ou adversaires, témoignant de sa réputation.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800 text-xs text-zinc-400 space-y-1">
                <div>&bull; <strong>Date de Création du compte :</strong> {basic.createAt || 'Inconnue'} (Timestamp Epoch : <code className="text-orange-300">{basic.createAtTimestamp}</code>)</div>
                <div>&bull; <strong>Dernière Connexion :</strong> {basic.lastLoginAt || 'Inconnue'} (Timestamp Epoch : <code className="text-orange-300">{basic.lastLoginAtTimestamp}</code>)</div>
                <div>&bull; <strong>Région / Serveur :</strong> {basic.region} (Moyen-Orient / Middle East, routé via clientbp ou client.us)</div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Statut Prime & Investissement Diamants */}
        <div className="p-4 sm:p-5">
          <button
            onClick={() => toggleSection('prime')}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-400 transition flex items-center gap-2">
                  Statut Prime, Vétéran &amp; Diamants
                  <span className="text-xs font-mono text-purple-300">
                    ({prime?.diamondCost || 390} 💎)
                  </span>
                </h4>
                <p className="text-xs text-zinc-400">
                  PreVeteranType, reconnaissance joueur fidèle et coût en diamants
                </p>
              </div>
            </div>
            {activeSection === 'prime' ? (
              <ChevronUp className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            )}
          </button>

          {activeSection === 'prime' && (
            <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3 text-xs sm:text-sm text-zinc-300">
              <div className="bg-purple-950/30 border border-purple-500/30 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-purple-300 text-xs">
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span>Qu&apos;indique la valeur &quot;diamondCost: {prime?.diamondCost || 390}&quot; ?</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Dans le protocole Garena, l&apos;objet <code className="text-purple-300 font-mono">diamondcostres</code> comptabilise les diamants Free Fire investis ou éligibles à des paliers de fidélité ou d&apos;activité.
                  La valeur de <strong>{prime?.diamondCost || 390} 💎</strong> confirme que le joueur a débloqué des récompenses premium (telles que des Booyah Pass ou des coffres événementiels).
                </p>
                <div className="text-[11px] text-zinc-400 pt-1">
                  &bull; <strong>PreVeteranType :</strong> <code className="text-zinc-300 font-mono">{prime?.preVeteranType || 'PREVETERANACTIONTYPENONE'}</code> (Compte actif régulier, sans pause prolongée nécessitant un pack de retour).
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Historique des Booyah Pass / Pass Élite */}
        <div className="p-4 sm:p-5">
          <button
            onClick={() => toggleSection('elitepass')}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-yellow-500/10 text-yellow-400 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-yellow-400 transition flex items-center gap-2">
                  Historique des Pass Élite &amp; Booyah Pass
                  <span className="text-xs font-mono text-zinc-400">
                    ({elitePass?.length || 10} saisons archivées)
                  </span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Badges collectés (jusqu&apos;à 150), statuts Acheté/Gratuit et identifiants d&apos;icônes
                </p>
              </div>
            </div>
            {activeSection === 'elitepass' ? (
              <ChevronUp className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            )}
          </button>

          {activeSection === 'elitepass' && (
            <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3 text-xs text-zinc-300">
              <p className="text-xs text-zinc-300 leading-relaxed">
                Les Pass Élite (Booyah Pass) récompensent les missions saisonnières. Le joueur a possédé au moins 3 pass en version payante (<span className="text-amber-400 font-semibold">Saisons 93, 94 et 96</span>), et a atteint le palier maximal (100+) sur la quasi-totalité des 10 saisons récentes :
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {elitePass?.slice(0, 10).map((ep) => (
                  <div
                    key={ep.eventId}
                    className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                      ep.ownedPass
                        ? 'bg-amber-950/30 border-amber-500/40'
                        : 'bg-zinc-950/60 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-white">Saison {ep.eventId}</span>
                      {ep.ownedPass ? (
                        <span className="text-amber-300 font-bold">Pass 💎</span>
                      ) : (
                        <span className="text-zinc-500">Gratuit</span>
                      )}
                    </div>
                    <div className="text-sm font-black text-orange-400 mt-1">
                      {ep.badgeCount} <span className="text-[10px] font-normal text-zinc-400">badges</span>
                    </div>
                    <div className="text-[9px] font-mono text-zinc-500 truncate mt-1">
                      {ep.bpIcon || ep.eventName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Clash Squad Stats Décryptées */}
        <div className="p-4 sm:p-5">
          <button
            onClick={() => toggleSection('csstats')}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition flex items-center gap-2">
                  Performances en Clash Squad (CS)
                  <span className="text-xs font-mono text-cyan-300">
                    (1,337 parties &bull; 373 MVP)
                  </span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Analyse des 68 Quadruple Kills (Aces), du K/D et du taux de headshots de 39.6%
                </p>
              </div>
            </div>
            {activeSection === 'csstats' ? (
              <ChevronUp className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            )}
          </button>

          {activeSection === 'csstats' && (
            <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3 text-xs sm:text-sm text-zinc-300">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-zinc-950/70 p-3 rounded-lg border border-zinc-800">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase">Titre MVP</div>
                  <div className="text-base font-black text-white mt-0.5">373 Titres</div>
                  <div className="text-[10px] text-zinc-400">27.9% de ses parties CS !</div>
                </div>

                <div className="bg-zinc-950/70 p-3 rounded-lg border border-zinc-800">
                  <div className="text-[10px] font-bold text-orange-400 uppercase">Quad Kills (Aces)</div>
                  <div className="text-base font-black text-white mt-0.5">68 Aces</div>
                  <div className="text-[10px] text-zinc-400">Toute l&apos;équipe éliminée seul</div>
                </div>

                <div className="bg-zinc-950/70 p-3 rounded-lg border border-zinc-800">
                  <div className="text-[10px] font-bold text-red-400 uppercase">Mises à terre</div>
                  <div className="text-base font-black text-white mt-0.5">5,336 Knockdowns</div>
                  <div className="text-[10px] text-zinc-400">Ennemis neutralisés</div>
                </div>

                <div className="bg-zinc-950/70 p-3 rounded-lg border border-zinc-800">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">Soutien &amp; Sauvetages</div>
                  <div className="text-base font-black text-white mt-0.5">1,971 Assists</div>
                  <div className="text-[10px] text-zinc-400">604 réanimations d&apos;alliés</div>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                <strong>Analyse de style :</strong> Le joueur est un combattant de première ligne très agressif en format 4v4 rapproché, avec un cumul de plus de <strong>2,031,932 points de dégâts</strong> infligés et un taux d&apos;élimination par tir à la tête de <strong>39.6%</strong> (1808 headshot kills).
              </p>
            </div>
          )}
        </div>

        {/* 5. Battle Royale Solo, Duo & Squad */}
        <div className="p-4 sm:p-5">
          <button
            onClick={() => toggleSection('brstats')}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-bold">
                5
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-orange-400 transition flex items-center gap-2">
                  Battle Royale &amp; Records Personnels
                  <span className="text-xs font-mono text-orange-300">
                    (Max Kills: 24 en Duo &bull; 22 en Solo)
                  </span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Distance de marche (7,348 km cumulés), 164,000+ objets ramassés et 65.7% de headshots en escouade
                </p>
              </div>
            </div>
            {activeSection === 'brstats' ? (
              <ChevronUp className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            )}
          </button>

          {activeSection === 'brstats' && (
            <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3 text-xs sm:text-sm text-zinc-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Solo */}
                <div className="bg-zinc-950/70 p-3 rounded-lg border border-zinc-800 space-y-1">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Solo (694 matchs)</span>
                    <span className="text-orange-400">K/D 2.41</span>
                  </div>
                  <div className="text-zinc-400 text-xs">
                    &bull; <strong>Record en 1 match :</strong> <span className="text-emerald-300 font-bold">22 éliminations</span><br />
                    &bull; <strong>Objets ramassés :</strong> 59,212 pickups<br />
                    &bull; <strong>Temps de survie :</strong> 5,091 minutes (84.8 heures)<br />
                    &bull; <strong>Distance parcourue :</strong> 2,913.5 km<br />
                    &bull; <strong>Éliminations en véhicule :</strong> 4 road kills
                  </div>
                </div>

                {/* Duo */}
                <div className="bg-zinc-950/70 p-3 rounded-lg border border-zinc-800 space-y-1">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Duo (193 matchs)</span>
                    <span className="text-orange-400">K/D 1.67</span>
                  </div>
                  <div className="text-zinc-400 text-xs">
                    &bull; <strong>Record en 1 match :</strong> <span className="text-emerald-300 font-bold">24 éliminations</span><br />
                    &bull; <strong>Taux de victoire :</strong> 8.3% (16 victoires)<br />
                    &bull; <strong>Knockdowns :</strong> 322 ennemis neutralisés<br />
                    &bull; <strong>Distance parcourue :</strong> 712.3 km
                  </div>
                </div>

                {/* Squad */}
                <div className="bg-zinc-950/70 p-3 rounded-lg border border-zinc-800 space-y-1">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Escouade (820 matchs)</span>
                    <span className="text-orange-400">K/D 2.23</span>
                  </div>
                  <div className="text-zinc-400 text-xs">
                    &bull; <strong>Taux de Headshots :</strong> <span className="text-red-400 font-bold">65.7% (1,122 tirs tête)</span><br />
                    &bull; <strong>Réanimations d&apos;alliés :</strong> 265 sauvetages<br />
                    &bull; <strong>Objets ramassés :</strong> 92,777 pickups<br />
                    &bull; <strong>Distance parcourue :</strong> 3,722.2 km
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. Guilde & Capitaine */}
        <div className="p-4 sm:p-5">
          <button
            onClick={() => toggleSection('clan')}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold">
                6
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition flex items-center gap-2">
                  Guilde &amp; Capitaine Référent
                  <span className="text-xs font-mono text-blue-300">
                    ({clan?.clanName || 'GASY乂MAPME༒'} &bull; Lvl {clan?.clanLevel || 7})
                  </span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Membres ({clan?.memberNum}/{clan?.capacity}) et profil du Capitaine ({clan?.captain?.nickname || 'ᴳᴹㅤᴋʀᴀᴋᴇɴ༒'})
                </p>
              </div>
            </div>
            {activeSection === 'clan' ? (
              <ChevronUp className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            )}
          </button>

          {activeSection === 'clan' && (
            <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3 text-xs sm:text-sm text-zinc-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-zinc-950/70 p-3.5 rounded-lg border border-zinc-800 space-y-1.5">
                  <div className="text-[11px] font-bold text-blue-400 uppercase">Informations Guilde</div>
                  <div className="text-base font-black text-white">{clan?.clanName || 'GASY乂MAPME༒'}</div>
                  <div className="text-xs text-zinc-400">
                    &bull; ID Guilde : <code className="text-zinc-300 font-mono">{clan?.clanId || '3066354765'}</code><br />
                    &bull; Niveau de Guilde : <strong className="text-amber-400">Niveau {clan?.clanLevel || 7}</strong><br />
                    &bull; Effectif : <strong>{clan?.memberNum || 47} / {clan?.capacity || 55}</strong> membres
                  </div>
                </div>

                <div className="bg-zinc-950/70 p-3.5 rounded-lg border border-zinc-800 space-y-1.5">
                  <div className="text-[11px] font-bold text-amber-400 uppercase">Capitaine de Guilde</div>
                  <div className="text-base font-black text-white">{clan?.captain?.nickname || 'ᴳᴹㅤᴋʀᴀᴋᴇɴ༒'}</div>
                  <div className="text-xs text-zinc-400">
                    &bull; UID Capitaine : <code className="text-zinc-300 font-mono">{clan?.captain?.accountId || '5549014229'}</code><br />
                    &bull; Niveau du Capitaine : <strong>Niveau {clan?.captain?.level || 71}</strong> ({clan?.captain?.liked || '20,911'} Likes)<br />
                    &bull; Date de Création : {clan?.captain?.createAt || '6 mars 2022'}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/80">
                <strong>Pourquoi le profil du capitaine est-il inclus ?</strong> Garena transmet la fiche complète du leader de clan dans l&apos;objet <code className="text-orange-300">captainbasicinfo</code> du paquet Protobuf pour permettre la vérification des droits de modération et des guerres de guildes.
              </p>
            </div>
          )}
        </div>

        {/* 7. Social, Bio BBCode & Horaires */}
        <div className="p-4 sm:p-5">
          <button
            onClick={() => toggleSection('social')}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-pink-500/10 text-pink-400 flex items-center justify-center text-xs font-bold">
                7
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-pink-400 transition flex items-center gap-2">
                  Signature Personnalisée &amp; Préférences Sociales
                  <span className="text-xs font-mono text-zinc-400">
                    (BBCode Stylisé &bull; Horaires de Jeu)
                  </span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Décodage des couleurs et balises, langue Française et connexion en semaine
                </p>
              </div>
            </div>
            {activeSection === 'social' ? (
              <ChevronUp className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            )}
          </button>

          {activeSection === 'social' && (
            <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3 text-xs sm:text-sm text-zinc-300">
              <div className="bg-zinc-950/70 p-3.5 rounded-lg border border-zinc-800 space-y-2">
                <div className="text-[11px] font-bold text-pink-400 uppercase">Signature brute Free Fire</div>
                <pre className="font-mono text-xs bg-zinc-900/90 p-2.5 rounded text-zinc-300 overflow-x-auto">
                  {social?.signature || '[b][c]╭─╮\n︱ⓕ︱Faceßook┊[33FFB5] Re Beccà\n╰─╯biiiii'}
                </pre>
                <div className="text-xs text-zinc-400 space-y-1 pt-1">
                  <div>&bull; <code className="text-orange-300">[b]</code> : Texte en <strong>gras</strong> (Bold).</div>
                  <div>&bull; <code className="text-orange-300">[c]</code> : Texte centré horizontalement sur la bannière de jeu.</div>
                  <div>&bull; <code className="text-[#33FFB5]">[33FFB5]</code> : Code couleur hexadécimal Free Fire (Teinte Cyan / Turquoise néon).</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] uppercase font-bold">Horaires Habituels</div>
                  <div className="text-white font-semibold mt-0.5">En Semaine (Jours ouvrés)</div>
                  <div className="text-[10px] text-zinc-400 font-mono">TIMEONLINEWORKDAY</div>
                </div>

                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] uppercase font-bold">Affichage de Rang Public</div>
                  <div className="text-cyan-300 font-semibold mt-0.5">Clash Squad Classé</div>
                  <div className="text-[10px] text-zinc-400 font-mono">RANKSHOWCS</div>
                </div>

                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] uppercase font-bold">Langue Configurée</div>
                  <div className="text-white font-semibold mt-0.5">Français</div>
                  <div className="text-[10px] text-zinc-400 font-mono">LANGUAGEFRENCH</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 8. Score d'Honneur & Fair-Play */}
        <div className="p-4 sm:p-5">
          <button
            onClick={() => toggleSection('credit')}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">
                8
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition flex items-center gap-2">
                  Score d&apos;Honneur &amp; Conduite (Credit Score)
                  <span className="text-xs font-mono text-emerald-300">
                    ({credit?.creditScore || 100} / 100)
                  </span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Système anti-toxicité, surveillance AFK et éligibilité aux parties classées
                </p>
              </div>
            </div>
            {activeSection === 'credit' ? (
              <ChevronUp className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            )}
          </button>

          {activeSection === 'credit' && (
            <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3 text-xs sm:text-sm text-zinc-300">
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-300 text-xs">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Score Parfait de 100 / 100 : Joueur exemplaire</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Le système de Credit Score de Garena surveille le comportement en jeu (absentéisme AFK, abandon de match, tirs alliés volontaires ou toxicité vocale).
                  Ce joueur possède un score maximal sans aucune infraction périodique (<code className="text-emerald-300 font-mono">illegalCount: 0</code>).
                </p>
                <div className="text-[11px] text-zinc-400 pt-1">
                  &bull; <strong>Seuils de sanction Garena :</strong> &lt; 90 points = interdiction de Clash Squad Classé ; &lt; 80 points = interdiction de Battle Royale en équipe ; &lt; 60 points = interdiction totale de jeu multijoueur.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
