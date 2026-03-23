import { useState, useEffect, useCallback } from 'react';
import type { WatchlistGroup } from '../types';

const STORAGE_KEY = 'marketpilot-watchlists';

const DEFAULT_GROUPS: WatchlistGroup[] = [
  { id: 'ai-stocks', name: 'AI & Tech Leaders', tickers: ['NVDA', 'TSLA', 'AAPL', 'MSFT'] },
  { id: 'semiconductors', name: 'Semiconductors', tickers: ['TSM', 'AMD', 'AVGO'] },
  { id: 'taiwan-stocks', name: 'Taiwan Market', tickers: ['2330.TW', '2454.TW', '2317.TW'] },
];

function loadGroups(): WatchlistGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DEFAULT_GROUPS;
}

function saveGroups(groups: WatchlistGroup[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

export function useWatchlist() {
  const [groups, setGroups] = useState<WatchlistGroup[]>(loadGroups);

  useEffect(() => {
    saveGroups(groups);
  }, [groups]);

  const createGroup = useCallback((name: string) => {
    const id = 'group-' + Date.now();
    setGroups(prev => [...prev, { id, name, tickers: [] }]);
    return id;
  }, []);

  const deleteGroup = useCallback((groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
  }, []);

  const renameGroup = useCallback((groupId: string, newName: string) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, name: newName } : g));
  }, []);

  const addTicker = useCallback((groupId: string, ticker: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      if (g.tickers.includes(ticker)) return g;
      return { ...g, tickers: [...g.tickers, ticker] };
    }));
  }, []);

  const removeTicker = useCallback((groupId: string, ticker: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return { ...g, tickers: g.tickers.filter(t => t !== ticker) };
    }));
  }, []);

  return { groups, createGroup, deleteGroup, renameGroup, addTicker, removeTicker };
}
