import { STOCK_DATABASE } from '../data/stockDatabase';
import { fetchQuote } from './priceService';
import type { Sentiment } from '../types';

type Subscriber = (price: number, changePercent: number, isSimulated: boolean) => void;

class PriceSimulator {
  private subscribers: Map<string, Set<Subscriber>> = new Map();
  private currentPrices: Map<string, number> = new Map();
  private basePrices: Map<string, number> = new Map();
  private intervalIds: Map<string, ReturnType<typeof setInterval>> = new Map();
  private sentimentBias: Map<string, Sentiment> = new Map();
  private simulatedFlags: Map<string, boolean> = new Map();

  constructor() {
    STOCK_DATABASE.forEach(stock => {
      this.basePrices.set(stock.symbol, stock.defaultPrice);
      this.currentPrices.set(stock.symbol, stock.defaultPrice);
      this.simulatedFlags.set(stock.symbol, true); // assume simulated until proven otherwise
    });
  }

  /** Set the sentiment-driven drift for a ticker */
  setSentimentBias(ticker: string, bias: Sentiment) {
    this.sentimentBias.set(ticker, bias);
  }

  /** Initialize real price from API before starting simulation */
  async initializeRealPrice(ticker: string): Promise<void> {
    try {
      const quote = await fetchQuote(ticker);
      this.basePrices.set(ticker, quote.previousClose || quote.currentPrice);
      this.currentPrices.set(ticker, quote.currentPrice);
      this.simulatedFlags.set(ticker, quote.isSimulated);

      // Notify existing subscribers with the real price
      const pct = quote.changePercent;
      this.subscribers.get(ticker)?.forEach(cb => cb(quote.currentPrice, pct, quote.isSimulated));
    } catch {
      // Keep simulated defaults
      this.simulatedFlags.set(ticker, true);
    }
  }

  subscribe(ticker: string, callback: Subscriber) {
    if (!this.subscribers.has(ticker)) {
      this.subscribers.set(ticker, new Set());
    }
    this.subscribers.get(ticker)!.add(callback);

    // If ticker not yet initialized, use a reasonable default
    if (!this.basePrices.has(ticker)) {
      const stock = STOCK_DATABASE.find(s => s.symbol === ticker);
      const price = stock?.defaultPrice || 100;
      this.basePrices.set(ticker, price);
      this.currentPrices.set(ticker, price);
      this.simulatedFlags.set(ticker, true);
    }

    const currentPrice = this.currentPrices.get(ticker)!;
    const basePrice = this.basePrices.get(ticker)!;
    const pctChange = ((currentPrice - basePrice) / basePrice) * 100;
    const isSim = this.simulatedFlags.get(ticker) ?? true;
    callback(currentPrice, pctChange, isSim);

    this.startSimulation(ticker);

    // Also try to fetch real price in background
    this.initializeRealPrice(ticker);

    return () => this.unsubscribe(ticker, callback);
  }

  unsubscribe(ticker: string, callback: Subscriber) {
    const subs = this.subscribers.get(ticker);
    if (subs) {
      subs.delete(callback);
      if (subs.size === 0) {
        this.stopSimulation(ticker);
      }
    }
  }

  getChangePercent(ticker: string): number {
    const current = this.currentPrices.get(ticker);
    const base = this.basePrices.get(ticker);
    if (current && base) return ((current - base) / base) * 100;
    return 0;
  }

  isSimulated(ticker: string): boolean {
    return this.simulatedFlags.get(ticker) ?? true;
  }

  private startSimulation(ticker: string) {
    if (this.intervalIds.has(ticker)) return;

    const id = setInterval(() => {
      const currentPrice = this.currentPrices.get(ticker)!;
      const basePrice = this.basePrices.get(ticker)!;

      const volatility = 0.004;
      const bias = this.sentimentBias.get(ticker);

      let drift = 0;
      if (bias === 'positive') drift = 0.15;
      else if (bias === 'negative') drift = -0.15;

      const change = currentPrice * volatility * (Math.random() - 0.5 + drift);
      const newPrice = Math.max(0.01, currentPrice + change);

      this.currentPrices.set(ticker, newPrice);
      const pctChange = ((newPrice - basePrice) / basePrice) * 100;
      const isSim = this.simulatedFlags.get(ticker) ?? true;

      this.subscribers.get(ticker)?.forEach(cb => cb(newPrice, pctChange, isSim));
    }, 2000);

    this.intervalIds.set(ticker, id);
  }

  private stopSimulation(ticker: string) {
    const id = this.intervalIds.get(ticker);
    if (id) {
      clearInterval(id);
      this.intervalIds.delete(ticker);
    }
  }
}

export const priceSimulator = new PriceSimulator();
