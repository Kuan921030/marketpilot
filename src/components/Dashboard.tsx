import React from 'react';
import type { MarketPhase } from '../types';
import { PreMarketView } from './PreMarketView';
import { LiveMonitorView } from './LiveMonitorView';
import { PostMarketView } from './PostMarketView';
import { getStockBySymbol } from '../data/stockDatabase';

interface DashboardProps {
  selectedTicker: string | null;
  phase: MarketPhase;
  onPhaseChange: (phase: MarketPhase) => void;
}

const PHASE_LABELS: Record<MarketPhase, string> = {
  PRE_MARKET: '☀ Pre-Market',
  LIVE: '⚡ Live',
  POST_MARKET: '🌙 Post-Market',
};

export const Dashboard: React.FC<DashboardProps> = ({ selectedTicker, phase, onPhaseChange }) => {
  const stock = selectedTicker ? getStockBySymbol(selectedTicker) : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header Tabs */}
      <header className="dashboard-header">
        <div className="phase-tabs">
          {(['PRE_MARKET', 'LIVE', 'POST_MARKET'] as MarketPhase[]).map(p => (
            <button
              key={p}
              onClick={() => onPhaseChange(p)}
              className={`phase-tab ${phase === p ? 'active' : ''}`}
            >
              {PHASE_LABELS[p]}
            </button>
          ))}
        </div>

        <div className="dashboard-ticker-info">
          {selectedTicker ? (
            <>
              <span className="ticker-badge">{selectedTicker}</span>
              {stock && <span className="ticker-fullname">{stock.name}</span>}
            </>
          ) : (
            <span className="text-secondary">Select a Ticker</span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {!selectedTicker ? (
          <div className="empty-state">
            <div className="empty-icon">📈</div>
            <h3>Welcome to MarketPilot</h3>
            <p>Select a stock from the sidebar or use search to get started.</p>
          </div>
        ) : (
          <div>
            {phase === 'PRE_MARKET' && <PreMarketView ticker={selectedTicker} />}
            {phase === 'LIVE' && <LiveMonitorView ticker={selectedTicker} />}
            {phase === 'POST_MARKET' && <PostMarketView ticker={selectedTicker} />}
          </div>
        )}
      </main>
    </div>
  );
};
