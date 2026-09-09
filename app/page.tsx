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
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Search, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [currentUid, setCurrentUid] = useState('13943539936');
  const [playerData, setPlayerData] = useState<FFPlayerData | null>(null);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(true);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([]);
  const [isLoadingEndpoints, setIsLoadingEndpoints] = useState(true);
  const [endpointsTestedAt, setEndpointsTestedAt] = useState('');
  const [quotaInfo, setQuotaInfo] = useState<any>(null);

  const fetchEndpoints = useCallback(async () => {
    setIsLoadingEndpoints(true);
    try {
      const json = await fetch('/api/endpoints').then((response) => response.json());
      if (json.success && Array.isArray(json.endpoints)) {
        setEndpoints(json.endpoints);
        setEndpointsTestedAt(json.testedAt || new Date().toLocaleTimeString('fr-FR'));
        if (json.quotaInfo) setQuotaInfo(json.quotaInfo);
      }
    } catch (error) { console.error('Failed to load endpoints status:', error); }
    finally { setIsLoadingEndpoints(false); }
  }, []);

  const fetchPlayer = useCallback(async (uid: string, region = 'auto') => {
    setIsLoadingPlayer(true); setPlayerError(null); setCurrentUid(uid);
    try {
      const regionParam = region && region !== 'auto' ? `&region=${encodeURIComponent(region)}` : '';
      const json = await fetch(`/api/player?uid=${encodeURIComponent(uid)}${regionParam}`).then((response) => response.json());
      if (!json.success) throw new Error(json.error || 'Impossible de récupérer les informations du joueur.');
      setPlayerData(json.data);
    } catch (error: any) { setPlayerError(error.message || 'Une erreur est survenue lors de la recherche.'); setPlayerData(null); }
    finally { setIsLoadingPlayer(false); }
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetch('/api/endpoints').then((response) => response.json()).catch(() => null), fetch('/api/player?uid=13943539936').then((response) => response.json()).catch(() => null)])
      .then(([endpointJson, playerJson]) => {
        if (cancelled) return;
        if (endpointJson?.success && Array.isArray(endpointJson.endpoints)) { setEndpoints(endpointJson.endpoints); setEndpointsTestedAt(endpointJson.testedAt || new Date().toLocaleTimeString('fr-FR')); setQuotaInfo(endpointJson.quotaInfo); }
        if (playerJson?.success) setPlayerData(playerJson.data); else setPlayerError(playerJson?.error || 'Erreur lors du chargement initial');
      })
      .catch(() => { if (!cancelled) setPlayerError('Erreur de connexion'); })
      .finally(() => { if (!cancelled) { setIsLoadingEndpoints(false); setIsLoadingPlayer(false); } });
    return () => { cancelled = true; };
  }, []);

  const activeGateways = endpoints.filter((endpoint) => endpoint.category === 'official_active' && endpoint.status === 'online').length;
  const totalGateways = endpoints.filter((endpoint) => endpoint.category === 'official_active').length || 4;

  return (
    <div id="top" className="min-h-screen bg-background text-foreground font-sans">
      <Header onRefreshEndpoints={fetchEndpoints} isTestingEndpoints={isLoadingEndpoints} onlineGatewaysCount={activeGateways} totalGatewaysCount={totalGateways} />
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section id="overview" className="relative overflow-hidden border-x border-border px-5 pb-16 pt-14 sm:px-10 sm:pt-20 lg:px-16">
          <div className="absolute inset-0 -z-10 grid-lines opacity-70" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/50 to-background" />
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground"><span className="size-1.5 rounded-full bg-emerald-500" />Données live · Protocole officiel Garena</div>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl">L&apos;intelligence joueur<br /><span className="text-gradient">sans le bruit.</span></h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">Inspectez un profil Free Fire, vérifiez la disponibilité des passerelles et comprenez chaque statistique à partir d&apos;une seule interface claire et fiable.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3"><a href="#player" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85">Rechercher un joueur <ArrowRight className="size-4" /></a><a href="#diagnostics" className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Voir les diagnostics</a></div>
          </div>
          <div className="mt-12 grid max-w-3xl grid-cols-1 gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:grid-cols-3"><div><span className="mb-1 block font-mono text-foreground">01</span>Profil et statistiques</div><div><span className="mb-1 block font-mono text-foreground">02</span>Passerelles testées</div><div><span className="mb-1 block font-mono text-foreground">03</span>Données exportables</div></div>
        </section>

        <section id="diagnostics" className="scroll-mt-24 border-t border-border py-8"><div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="font-mono text-xs text-accent">/ diagnostics</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">État de l&apos;infrastructure</h2></div><p className="max-w-md text-sm leading-6 text-muted-foreground">Chaque passerelle officielle est vérifiée en direct avant d&apos;être utilisée.</p></div><EndpointTester endpoints={endpoints} isLoading={isLoadingEndpoints} onRefresh={fetchEndpoints} testedAt={endpointsTestedAt} quotaInfo={quotaInfo} /></section>
        <ApiSuccessAndCurlTester endpoints={endpoints} currentUid={currentUid} />

        <section id="player" className="scroll-mt-24 border-t border-border py-10"><div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="font-mono text-xs text-accent">/ player lookup</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Explorer un profil</h2></div><p className="max-w-md text-sm leading-6 text-muted-foreground">Saisissez un UID pour obtenir une lecture complète du profil et de ses performances.</p></div><PlayerSearch onSearch={fetchPlayer} isLoading={isLoadingPlayer} initialUid={currentUid} /></section>

        {isLoadingPlayer && <div className="flex flex-col items-center gap-3 border border-border bg-card py-16 text-center"><Loader2 className="size-7 animate-spin text-accent" /><p className="text-sm font-medium">Connexion aux serveurs Garena...</p><p className="max-w-md text-xs leading-5 text-muted-foreground">Interrogation des passerelles régionales pour l&apos;UID {currentUid}.</p></div>}
        {playerError && !isLoadingPlayer && <div className="flex items-start gap-3 border border-destructive/40 bg-destructive/10 p-4 text-sm"><AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" /><div><p className="font-medium">Échec de la requête</p><p className="mt-1 text-muted-foreground">{playerError}</p></div></div>}

        {playerData && !isLoadingPlayer && <div className="flex flex-col gap-6"><PlayerCard player={playerData} /><PlayerSpiderChart player={playerData} /><PlayerRankPrime player={playerData} /><PlayerStats stats={playerData.stats} clan={playerData.clan} pet={playerData.pet} social={playerData.social} /><PlayerDeepExplanations player={playerData} /><RawDataViewer player={playerData} /><div id="developer"><DeveloperTools playerData={playerData} currentUid={currentUid} /></div></div>}
      </main>
      <footer className="mt-16 border-t border-border"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><p>Free Fire Inspector · Données fiables, testées et lisibles.</p><div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-emerald-500" /> Système opérationnel <span className="text-border">·</span> Garena protocol vOB54</div></div></footer>
    </div>
  );
}
