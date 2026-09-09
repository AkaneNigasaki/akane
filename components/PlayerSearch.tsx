'use client';

import React, { useState } from 'react';
import { Search, Globe, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface PlayerSearchProps {
  onSearch: (uid: string, region: string) => void;
  isLoading: boolean;
  initialUid?: string;
}

const PRESET_ACCOUNTS = [
  { uid: '13943539936', label: '✿ｐａｓｔｅｒａㅤ모', region: 'ME', level: 54, isFeatured: true },
  { uid: '2115167098', label: 'custos11728K', region: 'US', level: 41 },
  { uid: '4718569825', label: 'casura332', region: 'US', level: 47 },
  { uid: '1608705614', label: 'pcc2210G', region: 'BR', level: 2 },
  { uid: '256985474', label: 'Demon.01', region: 'RU', level: 5 },
];

const REGIONS = [
  { id: 'auto', label: 'Détection Automatique (Recherche globale)' },
  { id: 'ME', label: 'Moyen-Orient / ME (clientbp)' },
  { id: 'US', label: 'US / Amériques / Brésil (client.us)' },
  { id: 'IND', label: 'Inde / Bharat (client.ind)' },
  { id: 'SG', label: 'Singapour / Europe / Global (clientbp)' },
];

export function PlayerSearch({ onSearch, isLoading, initialUid = '' }: PlayerSearchProps) {
  const [uid, setUid] = useState<string>(initialUid || '13943539936');
  const [region, setRegion] = useState<string>('auto');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = uid.trim();
    if (!clean) {
      setInputError('Veuillez entrer un UID de joueur');
      return;
    }
    if (!/^\d{6,14}$/.test(clean)) {
      setInputError('L\'UID doit être composé uniquement de 6 à 14 chiffres (ex: 2115167098)');
      return;
    }
    setInputError(null);
    onSearch(clean, region);
  };

  const handleSelectPreset = (presetUid: string) => {
    setUid(presetUid);
    setInputError(null);
    onSearch(presetUid, region);
  };

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main input and search button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={uid}
              onChange={(e) => {
                setUid(e.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder="Entrez l'UID du joueur Free Fire (ex: 2115167098)..."
              disabled={isLoading}
              className="w-full pl-11 pr-4 py-3 bg-zinc-950/80 border border-zinc-700/80 rounded-lg text-white placeholder-zinc-500 font-mono text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={isLoading}
                className="w-full sm:w-auto appearance-none pl-9 pr-8 py-3 bg-zinc-950/80 border border-zinc-700/80 rounded-lg text-xs sm:text-sm text-zinc-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition cursor-pointer disabled:opacity-50"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
              <Globe className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:from-orange-700 active:to-amber-700 text-white font-semibold text-sm rounded-lg shadow-md shadow-orange-950/40 flex items-center justify-center gap-2 transition disabled:opacity-50 shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Recherche...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Inspecter</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Validation error if any */}
        {inputError && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{inputError}</span>
          </div>
        )}

        {/* Quick presets for immediate testing */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-zinc-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Comptes testés fonctionnels :
          </span>
          {PRESET_ACCOUNTS.map((acc) => (
            <button
              key={acc.uid}
              type="button"
              onClick={() => handleSelectPreset(acc.uid)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-md bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition flex items-center gap-1.5 font-mono text-[11px] disabled:opacity-50"
            >
              <span className="font-semibold text-white">{acc.label}</span>
              <span className="text-amber-400 text-[10px]">Nv.{acc.level}</span>
              <span className="text-zinc-500">({acc.region})</span>
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
