import React, { useState, useRef, useEffect } from 'react';
import { searchStocks } from '../data/stockDatabase';
import type { StockEntry } from '../data/stockDatabase';
import type { WatchlistGroup } from '../types';

interface Props {
  groups: WatchlistGroup[];
  onAddTicker: (groupId: string, ticker: string) => void;
}

export const StockSearch: React.FC<Props> = ({ groups, onAddTicker }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockEntry[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockEntry | null>(null);
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowGroupPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (val.length >= 1) {
      setResults(searchStocks(val));
      setShowDropdown(true);
      setShowGroupPicker(false);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectStock = (stock: StockEntry) => {
    setSelectedStock(stock);
    setShowDropdown(false);
    setShowGroupPicker(true);
  };

  const handleAddToGroup = (groupId: string) => {
    if (selectedStock) {
      onAddTicker(groupId, selectedStock.symbol);
      setQuery('');
      setResults([]);
      setShowGroupPicker(false);
      setSelectedStock(null);
    }
  };

  return (
    <div ref={containerRef} className="stock-search">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search stocks..."
          className="search-input"
        />
      </div>

      {showDropdown && results.length > 0 && (
        <div className="search-dropdown">
          {results.map(stock => (
            <button
              key={stock.symbol}
              className="search-result-item"
              onClick={() => handleSelectStock(stock)}
            >
              <div className="search-result-left">
                <span className="search-result-symbol">{stock.symbol}</span>
                <span className="search-result-exchange">{stock.exchange}</span>
              </div>
              <span className="search-result-name">{stock.name}</span>
            </button>
          ))}
        </div>
      )}

      {showDropdown && results.length === 0 && query.length >= 2 && (
        <div className="search-dropdown">
          <div className="search-no-result">No stocks found for "{query}"</div>
        </div>
      )}

      {showGroupPicker && selectedStock && (
        <div className="search-dropdown group-picker">
          <div className="group-picker-header">
            Add <strong>{selectedStock.symbol}</strong> to:
          </div>
          {groups.map(g => (
            <button
              key={g.id}
              className="search-result-item"
              onClick={() => handleAddToGroup(g.id)}
            >
              {g.name}
              {g.tickers.includes(selectedStock.symbol) && (
                <span className="already-added">✓ Added</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
