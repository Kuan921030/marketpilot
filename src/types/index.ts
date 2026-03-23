export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  link: string;
  summary: string;
  sentiment: Sentiment;
  sentimentScore: number;    // 0-100
  trendArrow: '↑' | '↓' | '→';
}

export interface DailyInsight {
  drivers: string[];
  risks: string[];
  bias: Sentiment;
  sentimentScore: number;    // 0-100 aggregate
  confidenceScore: number;   // 0-100
  trendArrow: '↑' | '↓' | '→';
  oneLiner: string;
  newsSpike: boolean;
}

export interface MarketAlert {
  id: string;
  type: 'DROP' | 'INCREASE';
  threshold: number;
  message: string;
  triggeredAt: number;
}

export interface TickerData {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  news: NewsItem[];
  insight: DailyInsight | null;
  alerts: MarketAlert[];
}

export interface WatchlistGroup {
  id: string;
  name: string;
  tickers: string[];
}

export type MarketPhase = 'PRE_MARKET' | 'LIVE' | 'POST_MARKET';
