import type { WatchlistGroup } from '../types';

export const WATCHLIST_GROUPS: WatchlistGroup[] = [
  {
    id: 'ai-stocks',
    name: 'AI & Tech Leaders',
    tickers: ['NVDA', 'TSLA', 'AAPL', 'MSFT']
  },
  {
    id: 'semiconductors',
    name: 'Semiconductors',
    tickers: ['TSM', 'AMD', 'AVGO']
  },
  {
    id: 'taiwan-stocks',
    name: 'Taiwan Market',
    tickers: ['2330.TW', '2454.TW', '2317.TW']
  }
];

export const MOCK_PRICES: Record<string, { price: number; name: string }> = {
  'NVDA': { price: 900.50, name: 'NVIDIA Corp' },
  'TSLA': { price: 175.20, name: 'Tesla Inc' },
  'AAPL': { price: 170.85, name: 'Apple Inc' },
  'MSFT': { price: 420.10, name: 'Microsoft Corp' },
  'TSM': { price: 140.30, name: 'Taiwan Semiconductor' },
  'AMD': { price: 180.50, name: 'Advanced Micro Devices' },
  'AVGO': { price: 1300.00, name: 'Broadcom Inc' },
  '2330.TW': { price: 780.00, name: 'TSMC' },
  '2454.TW': { price: 1150.00, name: 'MediaTek' },
  '2317.TW': { price: 145.50, name: 'Hon Hai Precision' },
};
