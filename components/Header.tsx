'use client';

import React from 'react';
import { Activity, Flame, RefreshCw, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onRefreshEndpoints?: () => void;
  isTestingEndpoints?: boolean;
  onlineGatewaysCount?: number;
  totalGatewaysCount?: number;
}

export function Header({ onRefreshEndpoints, isTestingEndpoints = false, onlineGatewaysCount = 4, totalGatewaysCount = 4 }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#top" className="brand" aria-label="Free Fire Inspector, accueil">
          <span className="brand__mark"><Flame aria-hidden="true" /></span>
          <span><strong>FF Inspector</strong><small>player intelligence</small></span>
        </a>
        <nav className="site-nav" aria-label="Navigation principale">
          <a href="#overview">Présentation</a>
          <a href="#diagnostics">Infrastructure</a>
          <a href="#player">Profils</a>
          <a href="#developer">API</a>
        </nav>
        <div className="header-actions">
          <span className="status-pill"><Activity aria-hidden="true" /><span className="status-dot" />{onlineGatewaysCount}/{totalGatewaysCount} en ligne</span>
          {onRefreshEndpoints && <button className="icon-button" onClick={onRefreshEndpoints} disabled={isTestingEndpoints} aria-label="Tester les passerelles"><RefreshCw className={isTestingEndpoints ? 'spin' : ''} aria-hidden="true" /></button>}
          <span className="secure-label"><ShieldCheck aria-hidden="true" />Sans clé</span>
        </div>
      </div>
    </header>
  );
}
