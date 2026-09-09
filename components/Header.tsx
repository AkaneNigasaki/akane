'use client';

import React from 'react';
import { Activity, Flame, RefreshCw, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onRefreshEndpoints?: () => void;
  isTestingEndpoints?: boolean;
  onlineGatewaysCount?: number;
  totalGatewaysCount?: number;
}

export function Header({
  onRefreshEndpoints,
  isTestingEndpoints = false,
  onlineGatewaysCount = 4,
  totalGatewaysCount = 4,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="Free Fire Inspector accueil">
          <span className="flex size-9 items-center justify-center rounded-lg bg-foreground text-background">
            <Flame className="size-4" aria-hidden="true" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold tracking-tight">Free Fire Inspector</span>
            <span className="block text-xs text-muted-foreground">Direct protocol</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          <a href="#overview" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Vue d&apos;ensemble</a>
          <a href="#diagnostics" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Diagnostics</a>
          <a href="#player" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Joueur</a>
          <a href="#developer" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Développeur</a>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs sm:flex">
            <Activity className="size-3.5 text-emerald-500" aria-hidden="true" />
            <span className="text-muted-foreground">Passerelles</span>
            <span className="font-mono font-medium text-foreground">{onlineGatewaysCount}/{totalGatewaysCount}</span>
          </div>
          {onRefreshEndpoints && (
            <button onClick={onRefreshEndpoints} disabled={isTestingEndpoints} className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50" title="Tester les serveurs en temps réel">
              <RefreshCw className={isTestingEndpoints ? 'size-3.5 animate-spin' : 'size-3.5'} aria-hidden="true" />
              <span className="hidden lg:inline">Tester</span>
            </button>
          )}
          <div className="hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
            <ShieldCheck className="size-3.5 text-emerald-500" aria-hidden="true" />
            Sans clé
          </div>
        </div>
      </div>
    </header>
  );
}
