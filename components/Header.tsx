'use client';

import React from 'react';
import { Flame, Server, ShieldCheck, RefreshCw } from 'lucide-react';

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
    <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-950/40 ring-1 ring-orange-400/30">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Free Fire <span className="text-orange-500 font-black">Inspector</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Protocole Direct
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              API Joueur en direct &bull; Liens officiels non dépréciés
            </p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <div className="w-2 h-2 rounded-full bg-emerald-500 -ml-4" />
            <span className="text-zinc-300 font-medium">Passerelles Garena :</span>
            <span className="font-semibold text-emerald-400">
              {onlineGatewaysCount}/{totalGatewaysCount} Actives
            </span>
          </div>

          {onRefreshEndpoints && (
            <button
              onClick={onRefreshEndpoints}
              disabled={isTestingEndpoints}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-200 border border-zinc-700/60 text-xs font-medium transition-colors disabled:opacity-50"
              title="Tester les serveurs et endpoints en temps réel"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingEndpoints ? 'animate-spin text-orange-400' : ''}`} />
              <span className="hidden xs:inline">Tester Serveurs</span>
            </button>
          )}

          <div className="flex items-center gap-1 text-xs text-zinc-400 px-2 py-1 rounded-md bg-zinc-900/50 border border-zinc-800/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Zéro Clé Requise</span>
          </div>
        </div>
      </div>
    </header>
  );
}
