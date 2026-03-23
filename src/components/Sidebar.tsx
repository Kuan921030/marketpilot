import React, { useState, useEffect } from 'react';
import type { WatchlistGroup } from '../types';
import { getStockBySymbol } from '../data/stockDatabase';
import { StockSearch } from './StockSearch';
import { priceSimulator } from '../services/priceSimulator';

interface SidebarProps {
  groups: WatchlistGroup[];
  selectedTicker: string | null;
  onSelectTicker: (ticker: string) => void;
  onAddTicker: (groupId: string, ticker: string) => void;
  onRemoveTicker: (groupId: string, ticker: string) => void;
  onCreateGroup: (name: string) => void;
  onDeleteGroup: (groupId: string) => void;
}

/** Individual ticker row with live price subscription */
const TickerRow: React.FC<{
  ticker: string;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}> = ({ ticker, isSelected, onSelect, onRemove }) => {
  const stock = getStockBySymbol(ticker);
  const [price, setPrice] = useState<number>(stock?.defaultPrice || 0);
  const [changePct, setChangePct] = useState<number>(0);
  const [isSimulated, setIsSimulated] = useState(true);

  useEffect(() => {
    const unsub = priceSimulator.subscribe(ticker, (p, pct, sim) => {
      setPrice(p);
      setChangePct(pct);
      setIsSimulated(sim);
    });
    return () => unsub();
  }, [ticker]);

  const isUp = changePct >= 0;

  return (
    <li className={`ticker-item ${isSelected ? 'selected' : ''}`}>
      <button className="ticker-btn" onClick={onSelect}>
        <div className="ticker-info">
          <div className="ticker-symbol-row">
            <span className="ticker-symbol">{ticker}</span>
            {isSimulated && <span className="sim-badge">SIM</span>}
            {!isSimulated && <span className="live-badge">LIVE</span>}
          </div>
          <span className="ticker-name">{stock?.name || ''}</span>
        </div>
        <div className="ticker-price-col">
          <span className="ticker-price">{price.toFixed(2)}</span>
          <span className={`ticker-change ${isUp ? 'text-up' : 'text-down'}`}>
            {isUp ? '+' : ''}{changePct.toFixed(2)}%
          </span>
        </div>
      </button>
      <button
        className="ticker-remove-btn"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        title="Remove"
      >×</button>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  groups, selectedTicker, onSelectTicker,
  onAddTicker, onRemoveTicker, onCreateGroup, onDeleteGroup
}) => {
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      onCreateGroup(newGroupName.trim());
      setNewGroupName('');
      setShowNewGroup(false);
    }
  };

  return (
    <div className="sidebar-inner">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">
          <span className="logo-icon">📈</span> MarketPilot
        </h2>
      </div>

      <div className="sidebar-search-area">
        <StockSearch groups={groups} onAddTicker={onAddTicker} />
      </div>

      <div className="sidebar-groups">
        {groups.map((group) => (
          <div key={group.id} className="watchlist-group">
            <div className="group-header">
              <h3 className="group-title">{group.name}</h3>
              <button
                className="group-delete-btn"
                onClick={() => onDeleteGroup(group.id)}
                title="Delete group"
              >×</button>
            </div>

            <ul className="ticker-list">
              {group.tickers.map((ticker) => (
                <TickerRow
                  key={ticker}
                  ticker={ticker}
                  isSelected={selectedTicker === ticker}
                  onSelect={() => onSelectTicker(ticker)}
                  onRemove={() => onRemoveTicker(group.id, ticker)}
                />
              ))}
              {group.tickers.length === 0 && (
                <li className="ticker-empty">Search above to add stocks</li>
              )}
            </ul>
          </div>
        ))}

        {showNewGroup ? (
          <div className="new-group-form">
            <input
              type="text"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateGroup()}
              placeholder="Group name..."
              className="new-group-input"
              autoFocus
            />
            <div className="new-group-actions">
              <button className="btn-primary btn-sm" onClick={handleCreateGroup}>Add</button>
              <button className="btn-ghost btn-sm" onClick={() => setShowNewGroup(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="new-group-btn" onClick={() => setShowNewGroup(true)}>
            + New Watchlist Group
          </button>
        )}
      </div>
    </div>
  );
};
