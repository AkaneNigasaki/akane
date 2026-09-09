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
import { AlertCircle, ArrowDownRight, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export default function Home() {
  const [currentUid, setCurrentUid] = useState('13943539936');
  const [playerData, setPlayerData] = useState<FFPlayerData | null>(null);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(true);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([]);
  const [isLoadingEndpoints, setIsLoadingEndpoints] = useState(true);
  const [endpointsTestedAt, setEndpointsTestedAt] = useState('');
  const [quotaInfo, setQuotaInfo] = useState<any>(null);

  const fetchEndpoints = useCallback(async () => { setIsLoadingEndpoints(true); try { const json = await fetch('/api/endpoints').then((r) => r.json()); if (json.success && Array.isArray(json.endpoints)) { setEndpoints(json.endpoints); setEndpointsTestedAt(json.testedAt || new Date().toLocaleTimeString('fr-FR')); if (json.quotaInfo) setQuotaInfo(json.quotaInfo); } } catch (error) { console.error('Failed to load endpoints status:', error); } finally { setIsLoadingEndpoints(false); } }, []);
  const fetchPlayer = useCallback(async (uid: string, region = 'auto') => { setIsLoadingPlayer(true); setPlayerError(null); setCurrentUid(uid); try { const regionParam = region && region !== 'auto' ? `&region=${encodeURIComponent(region)}` : ''; const json = await fetch(`/api/player?uid=${encodeURIComponent(uid)}${regionParam}`).then((r) => r.json()); if (!json.success) throw new Error(json.error || 'Impossible de récupérer les informations du joueur.'); setPlayerData(json.data); } catch (error: any) { setPlayerError(error.message || 'Une erreur est survenue lors de la recherche.'); setPlayerData(null); } finally { setIsLoadingPlayer(false); } }, []);
  useEffect(() => { let cancelled = false; Promise.all([fetch('/api/endpoints').then((r) => r.json()).catch(() => null), fetch('/api/player?uid=13943539936').then((r) => r.json()).catch(() => null)]).then(([endpointJson, playerJson]) => { if (cancelled) return; if (endpointJson?.success && Array.isArray(endpointJson.endpoints)) { setEndpoints(endpointJson.endpoints); setEndpointsTestedAt(endpointJson.testedAt || new Date().toLocaleTimeString('fr-FR')); setQuotaInfo(endpointJson.quotaInfo); } if (playerJson?.success) setPlayerData(playerJson.data); else setPlayerError(playerJson?.error || 'Erreur lors du chargement initial'); }).finally(() => { if (!cancelled) { setIsLoadingEndpoints(false); setIsLoadingPlayer(false); } }); return () => { cancelled = true; }; }, []);

  const activeGateways = endpoints.filter((endpoint) => endpoint.category === 'official_active' && endpoint.status === 'online').length;
  const totalGateways = endpoints.filter((endpoint) => endpoint.category === 'official_active').length || 4;

  return <div id="top" className="min-h-screen bg-background text-foreground font-sans">
    <Header onRefreshEndpoints={fetchEndpoints} isTestingEndpoints={isLoadingEndpoints} onlineGatewaysCount={activeGateways} totalGatewaysCount={totalGateways} />
    <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12">
      <section id="overview" className="hero-grid relative overflow-hidden border-x border-border px-5 pb-20 pt-16 sm:px-12 sm:pt-24 lg:px-20 lg:pb-28">
        <div className="relative z-10 max-w-5xl">
          <p className="mb-8 font-mono text-xs uppercase tracking-[0.18em] text-accent">Free Fire · intelligence joueur en direct</p>
          <h1 className="max-w-4xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.07em] sm:text-7xl lg:text-[clamp(4.5rem,8vw,8rem)]">Comprendre un profil.<br /><span className="text-gradient">Pas seulement le regarder.</span></h1>
          <div className="mt-10 flex flex-col gap-8 border-t border-border pt-7 sm:flex-row sm:items-start sm:justify-between"><p className="max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">FF Inspector transforme les données brutes de Free Fire en une lecture claire, vérifiable et utile — pour les joueurs, les analystes et les développeurs.</p><div className="flex shrink-0 flex-wrap gap-3"><a href="#player" className="inline-flex items-center gap-2 bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80">Explorer un profil <ArrowRight className="size-4" /></a><a href="#diagnostics" className="inline-flex items-center gap-2 border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Voir le système</a></div></div>
        </div>
        <div className="mt-20 flex items-end justify-between border-t border-border pt-5 text-xs text-muted-foreground"><span>Un outil ouvert, construit autour des données officielles.</span><ArrowDownRight className="size-5 text-accent" aria-hidden="true" /></div>
      </section>

      <section id="diagnostics" className="scroll-mt-24 border-x border-b border-border px-5 py-12 sm:px-12 lg:px-20"><div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">01 / infrastructure</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] sm:text-5xl">La donnée commence<br />par une connexion fiable.</h2></div><p className="max-w-sm text-sm leading-6 text-muted-foreground">Les passerelles officielles sont vérifiées en direct avant chaque lecture. Aucun écran ne masque l&apos;état réel du système.</p></div><EndpointTester endpoints={endpoints} isLoading={isLoadingEndpoints} onRefresh={fetchEndpoints} testedAt={endpointsTestedAt} quotaInfo={quotaInfo} /></section>
      <ApiSuccessAndCurlTester endpoints={endpoints} currentUid={currentUid} />

      <section id="player" className="scroll-mt-24 border-x border-b border-border px-5 py-12 sm:px-12 lg:px-20"><div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">02 / player intelligence</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] sm:text-5xl">Un profil, raconté<br />avec précision.</h2></div><p className="max-w-sm text-sm leading-6 text-muted-foreground">Entrez un UID et obtenez une vue structurée : identité, progression, statistiques, classement et contexte.</p></div><PlayerSearch onSearch={fetchPlayer} isLoading={isLoadingPlayer} initialUid={currentUid} /></section>

      {isLoadingPlayer && <div className="flex flex-col items-center gap-3 border-x border-b border-border bg-card py-20 text-center"><Loader2 className="size-7 animate-spin text-accent" /><p className="text-sm font-medium">Lecture du profil en cours</p><p className="max-w-md text-xs leading-5 text-muted-foreground">Interrogation des passerelles régionales pour l&apos;UID {currentUid}.</p></div>}
      {playerError && !isLoadingPlayer && <div className="flex items-start gap-3 border-x border-b border-destructive/40 bg-destructive/10 p-5 text-sm"><AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" /><div><p className="font-medium">Échec de la requête</p><p className="mt-1 text-muted-foreground">{playerError}</p></div></div>}
      {playerData && !isLoadingPlayer && <div className="flex flex-col gap-6 border-x border-b border-border px-5 py-8 sm:px-12 lg:px-20"><PlayerCard player={playerData} /><PlayerSpiderChart player={playerData} /><PlayerRankPrime player={playerData} /><PlayerStats stats={playerData.stats} clan={playerData.clan} pet={playerData.pet} social={playerData.social} /><PlayerDeepExplanations player={playerData} /><RawDataViewer player={playerData} /><div id="developer"><DeveloperTools playerData={playerData} currentUid={currentUid} /></div></div>}
    </main>
    <footer className="border-t border-border"><div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-10 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-12 lg:px-20"><p>FF Inspector — données lisibles, systèmes vérifiables.</p><div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-emerald-500" /> Système opérationnel <span className="text-border">·</span> Garena protocol vOB54</div></div></footer>
  </div>;
}
