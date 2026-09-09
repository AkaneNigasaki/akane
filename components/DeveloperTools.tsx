'use client';

import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  FileJson,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { FFPlayerData } from '@/lib/freefire';

interface DeveloperToolsProps {
  playerData?: FFPlayerData;
  currentUid: string;
}

export function DeveloperTools({ playerData, currentUid }: DeveloperToolsProps) {
  const [activeLang, setActiveLang] = useState<'curl' | 'js' | 'python'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const uid = currentUid || '2115167098';

  const snippets = {
    curl: `# 1. Appel vers votre API Next.js locale/déployée (Quota: 20 req/min - SANS CLÉ API REQUISE)
curl -X GET "http://localhost:3000/api/player?uid=${uid}"

# 2. Test du statut des serveurs et vérification des quotas
curl -X GET "http://localhost:3000/api/endpoints"

# 3. Requête officielle Garena OAuth directe (Protocole MSDK Non Déprécié - Gratuit & Sans Clé)
curl -X POST "https://ffmconnect.live.gop.garenanow.com/oauth/guest/token/grant" \\
  -H "User-Agent: GarenaMSDK/4.0.19P9(A063 ;Android 13;en;IN;)" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "response_type=token&client_type=2&client_id=100067"`,

    js: `// Récupération des informations Free Fire en JavaScript / TypeScript
// Clé API requise : AUCUNE (Protocole direct Garena MSDK automatique)
// Quota API conseillé : 20 requêtes / minute (1 requête toutes les 3 secondes)
async function getFreeFirePlayer(uid) {
  const response = await fetch(\`/api/player?uid=\${uid}\`);
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error);
  }
  
  const { basic, rank, prime, stats, activeApi, apiKeyRequirement } = result.data;
  console.log(\`Clé API nécessaire ? : \${apiKeyRequirement?.requiresApiKey ? 'OUI' : 'NON (100% Gratuit)'}\`);
  console.log(\`Méthode d'authentification : \${apiKeyRequirement?.authMethod}\`);
  console.log(\`API ayant réussi le test : \${activeApi?.apiName} (Quota: \${activeApi?.quota})\`);
  console.log(\`Joueur : \${basic.nickname} | Niveau \${basic.level} | Région \${basic.region}\`);
  console.log(\`Rang / Leaderboard : #\${rank?.rankingLeaderboardPos || 'Hors Top 100'} | MMR : \`, rank?.mmrList);
  console.log(\`Statut Prime / Vétéran : \${prime?.veteranLabel} | Coût Diamants : \${prime?.diamondCost} 💎\`);
  return result.data;
}

// Exemple d'exécution
getFreeFirePlayer('${uid}');`,

    python: `# Récupération des informations Free Fire en Python
# Clé API requise : AUCUNE (Protocole MSDK officiel, 100% gratuit)
# Quota conseillé : 20 requêtes / minute
import requests

def get_free_fire_player(uid):
    url = f"http://localhost:3000/api/player?uid={uid}"
    response = requests.get(url)
    data = response.json()
    
    if not data.get("success"):
        print("Erreur:", data.get("error"))
        return None
        
    player = data["data"]
    basic = player["basic"]
    rank = player.get("rank", {})
    prime = player.get("prime", {})
    active_api = player.get("activeApi", {})
    api_req = player.get("apiKeyRequirement", {})

    print(f"Besoin d'une clé API ? : {'OUI' if api_req.get('requiresApiKey') else 'NON (100% Sans Clé)'}")
    print(f"API ayant réussi le test: {active_api.get('apiName')} (Quota: {active_api.get('quota')})")
    print(f"Joueur: {basic['nickname']} (Niveau {basic['level']}, Région {basic['region']})")
    print(f"Rang: #{rank.get('rankingLeaderboardPos', 0)} | Prime: {prime.get('veteranLabel')}")
    return player

# Test avec l'UID actuel
get_free_fire_player("${uid}")`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippets[activeLang]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyJson = () => {
    if (!playerData) return;
    navigator.clipboard.writeText(JSON.stringify(playerData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!playerData) return;
    const blob = new Blob([JSON.stringify(playerData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freefire_player_${uid}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Intégration Développeur &amp; Code d&apos;Exemple
            </h3>
            <p className="text-xs text-zinc-400">
              Utilisez ces requêtes prêtes à l&apos;emploi dans vos bots Discord, applications ou scripts
            </p>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setActiveLang('curl')}
            className={`px-2.5 py-1 rounded transition ${
              activeLang === 'curl'
                ? 'bg-orange-600 text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            cURL
          </button>
          <button
            onClick={() => setActiveLang('js')}
            className={`px-2.5 py-1 rounded transition ${
              activeLang === 'js'
                ? 'bg-orange-600 text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            JavaScript
          </button>
          <button
            onClick={() => setActiveLang('python')}
            className={`px-2.5 py-1 rounded transition ${
              activeLang === 'python'
                ? 'bg-orange-600 text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Python
          </button>
        </div>
      </div>

      {/* Code Block Display */}
      <div className="relative rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden font-mono text-xs">
        <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/60 border-b border-zinc-800/80 text-[11px] text-zinc-400">
          <span>Snippet prêt à l&apos;emploi ({activeLang.toUpperCase()})</span>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 text-zinc-300 hover:text-white transition px-2 py-0.5 rounded bg-zinc-800/60"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>
        <pre className="p-4 text-zinc-300 overflow-x-auto leading-relaxed">
          <code>{snippets[activeLang]}</code>
        </pre>
      </div>

      {/* Raw JSON Accordion if player data exists */}
      {playerData && (
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/60">
          <div className="flex items-center justify-between p-3 bg-zinc-900/40">
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white transition"
            >
              <FileJson className="w-4 h-4 text-amber-400" />
              <span>Réponse JSON Brute ({Math.round(JSON.stringify(playerData).length / 1024)} KB)</span>
              {showJson ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition px-2.5 py-1 rounded bg-zinc-800/50"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copié' : 'Copier JSON'}</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition px-2.5 py-1 rounded bg-orange-950/40 border border-orange-800/50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger .json</span>
              </button>
            </div>
          </div>

          {showJson && (
            <div className="max-h-96 overflow-y-auto p-4 bg-zinc-950 border-t border-zinc-800 text-xs font-mono text-zinc-400">
              <pre>{JSON.stringify(playerData, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
