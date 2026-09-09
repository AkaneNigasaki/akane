'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { EndpointTester } from '@/components/EndpointTester';
import { ApiSuccessAndCurlTester } from '@/components/ApiSuccessAndCurlTester';
import { PlayerSearch } from '@/components/PlayerSearch';
import { PlayerCard } from '@/components/PlayerCard';
import { PlayerSpiderChart } from '@/components/PlayerSpiderChart';
import { PlayerRankPrime } from '@/components/PlayerRankPrime';
import { PlayerStats } from '@/components/PlayerStats';
import { PlayerDeepExplanations } from '@/components/PlayerDeepExplanations';
import { RawDataViewer } from '@/components/RawDataViewer';
import { DeveloperTools } from '@/components/DeveloperTools';
import type { FFPlayerData, EndpointStatus } from '@/lib/freefire';
import {
  AlertCircle,
  Loader2,
  CheckCircle2,
  Server,
  Flame,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export default function Home() {
  const [currentUid, setCurrentUid] = useState<string>('13943539936');
  const [playerData, setPlayerData] = useState<FFPlayerData | null>(null);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState<boolean>(true);
  const [playerError, setPlayerError] = useState<string | null>(null);

  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([]);
  const [isLoadingEndpoints, setIsLoadingEndpoints] = useState<boolean>(true);
  const [endpointsTestedAt, setEndpointsTestedAt] = useState<string>('');
  const [quotaInfo, setQuotaInfo] = useState<any>(null);

  // Fetch live endpoints status
  const fetchEndpoints = useCallback(async () => {
    setIsLoadingEndpoints(true);
    try {
      const res = await fetch('/api/endpoints');
      const json = await res.json();
      if (json.success && Array.isArray(json.endpoints)) {
        setEndpoints(json.endpoints);
        setEndpointsTestedAt(json.testedAt || new Date().toLocaleTimeString('fr-FR'));
        if (json.quotaInfo) setQuotaInfo(json.quotaInfo);
      }
    } catch (e) {
      console.error('Failed to load endpoints status:', e);
    } finally {
      setIsLoadingEndpoints(false);
    }
  }, []);

  // Fetch player profile and stats
  const fetchPlayer = useCallback(async (uid: string, region: string = 'auto') => {
    setIsLoadingPlayer(true);
    setPlayerError(null);
    setCurrentUid(uid);

    try {
      const regParam = region && region !== 'auto' ? `&region=${encodeURIComponent(region)}` : '';
      const res = await fetch(`/api/player?uid=${encodeURIComponent(uid)}${regParam}`);
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || 'Impossible de récupérer les informations du joueur.');
      }

      setPlayerData(json.data);
    } catch (err: any) {
      setPlayerError(err.message || 'Une erreur est survenue lors de la recherche.');
      setPlayerData(null);
    } finally {
      setIsLoadingPlayer(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    let isCancelled = false;

    async function initialize() {
      try {
        const [epRes, pRes] = await Promise.all([
          fetch('/api/endpoints')
            .then((r) => r.json())
            .catch(() => null),
          fetch('/api/player?uid=13943539936')
            .then((r) => r.json())
            .catch(() => null),
        ]);

        if (isCancelled) return;

        if (epRes?.success && Array.isArray(epRes.endpoints)) {
          setEndpoints(epRes.endpoints);
          setEndpointsTestedAt(epRes.testedAt || new Date().toLocaleTimeString('fr-FR'));
          if (epRes.quotaInfo) setQuotaInfo(epRes.quotaInfo);
        }
        setIsLoadingEndpoints(false);

        if (pRes?.success && pRes.data) {
          setPlayerData(pRes.data);
        } else if (pRes && !pRes.success) {
          setPlayerError(pRes.error || 'Erreur lors du chargement initial');
        }
        setIsLoadingPlayer(false);
      } catch (e: any) {
        if (!isCancelled) {
          setIsLoadingEndpoints(false);
          setIsLoadingPlayer(false);
          setPlayerError(e.message || 'Erreur de connexion');
        }
      }
    }

    initialize();

    return () => {
      isCancelled = true;
    };
  }, []);

  const activeGateways = endpoints.filter((e) => e.category === 'official_active' && e.status === 'online').length;
  const totalGateways = endpoints.filter((e) => e.category === 'official_active').length || 4;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        onRefreshEndpoints={fetchEndpoints}
        isTestingEndpoints={isLoadingEndpoints}
        onlineGatewaysCount={activeGateways}
        totalGatewaysCount={totalGateways}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Intro Notification Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-orange-950/40 via-amber-950/20 to-zinc-900 border border-orange-500/20 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 mt-0.5 sm:mt-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">
                Passerelles Officielles Vérifiées &amp; Testées en Direct
              </span>
              <p className="text-zinc-400 mt-0.5 leading-relaxed">
                Les anciens endpoints tiers (ex: Vercel glob-info2, bots Discord) sont dépréciés ou désactivés.
                Cette application utilise le <strong>protocole direct officiel Garena</strong> (OAuth guest + PolarBear/US/IND Gateways), testé en temps réel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Direct Garena Protobuf
            </span>
          </div>
        </div>

        {/* 1. Endpoint & Link Health Diagnostics (User's explicit request) */}
        <EndpointTester
          endpoints={endpoints}
          isLoading={isLoadingEndpoints}
          onRefresh={fetchEndpoints}
          testedAt={endpointsTestedAt}
          quotaInfo={quotaInfo}
        />

        {/* Diagnostic: API ayant réussi les tests & Commande curl.exe pour le terminal */}
        <ApiSuccessAndCurlTester
          endpoints={endpoints}
          currentUid={currentUid}
        />

        {/* 2. Player Search Form */}
        <PlayerSearch
          onSearch={fetchPlayer}
          isLoading={isLoadingPlayer}
          initialUid={currentUid}
        />

        {/* Loading Indicator */}
        {isLoadingPlayer && (
          <div className="py-16 text-center bg-zinc-900/40 rounded-xl border border-zinc-800/60 p-8 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
            <div className="text-sm font-semibold text-white">
              Connexion aux serveurs Garena Free Fire en cours...
            </div>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Interrogation des passerelles régionales et décodage du profil et des statistiques de combat du joueur (UID {currentUid}).
            </p>
          </div>
        )}

        {/* Error Alert */}
        {playerError && !isLoadingPlayer && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-red-300">Échec de la requête Free Fire</span>
              <p className="text-red-300/80 leading-relaxed">{playerError}</p>
              <div className="pt-2 text-[11px] text-zinc-400">
                <strong>Conseil :</strong> Vérifiez le numéro de l&apos;UID ou essayez l&apos;un des comptes testés ci-dessus (ex: <code className="text-orange-300">2115167098</code> ou <code className="text-orange-300">4718569825</code>).
              </div>
            </div>
          </div>
        )}

        {/* 3. Player Identity and Card */}
        {playerData && !isLoadingPlayer && (
          <div className="space-y-6">
            <PlayerCard player={playerData} />

            {/* Spider Chart Radar Analytics (Replaces 3D Viewer) */}
            <PlayerSpiderChart player={playerData} />

            {/* 4. Rank, Prime, Elite Pass & Clash Squad Stats */}
            <PlayerRankPrime player={playerData} />

            {/* 5. Battle Royale Stats, Guild, Pet & Social */}
            <PlayerStats
              stats={playerData.stats}
              clan={playerData.clan}
              pet={playerData.pet}
              social={playerData.social}
            />

            {/* Deep Explanations & Decryption of all player metrics */}
            <PlayerDeepExplanations player={playerData} />

            {/* 6. Raw Data Viewer (Unfiltered Protobuf JSON, Rank, Prime, EP, Search & API Key explanation) */}
            <RawDataViewer player={playerData} />

            {/* 7. Developer Tools & Code Export */}
            <DeveloperTools playerData={playerData} currentUid={currentUid} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Free Fire Player Info &bull; Conçu pour fournir des liens fiables, testés et non dépréciés.
          </p>
          <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
            <span>Garena Game Protocol vOB54</span>
            <span>&bull;</span>
            <span>Protobuf Encrypted Stream</span>
            <span>&bull;</span>
            <span>Statut : Opérationnel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
