/**
 * PriceService — fetches real stock quotes from Finnhub via our proxy.
 * Falls back to simulated data if API is unavailable.
 */

export interface QuoteData {
  currentPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  previousClose: number;
  changePercent: number;
  isSimulated: boolean;
}

// In-memory quote cache (symbol → { data, timestamp })
const quoteCache = new Map<string, { data: QuoteData; ts: number }>();
const CACHE_TTL = 30_000; // 30 seconds

// Taiwan stocks are not supported by Finnhub — auto-fallback
function isTaiwanStock(symbol: string): boolean {
  return symbol.endsWith('.TW');
}

// Map Finnhub-compatible symbol (strip .TW for lookup, but these will fallback anyway)
function finnhubSymbol(symbol: string): string {
  // Finnhub uses standard US ticker symbols
  return symbol.replace('.TW', '');
}

export async function fetchQuote(symbol: string): Promise<QuoteData> {
  // Check cache first
  const cached = quoteCache.get(symbol);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  // Taiwan stocks → always simulated (Finnhub doesn't support TWSE)
  if (isTaiwanStock(symbol)) {
    return makeSimulated(symbol);
  }

  try {
    const fSymbol = finnhubSymbol(symbol);
    const res = await fetch(`/api/quote?symbol=${encodeURIComponent(fSymbol)}`);

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const json = await res.json();

    // Finnhub returns: c=current, o=open, h=high, l=low, pc=previous close, dp=change%
    // If current price is 0, the symbol is invalid or market is closed with no data
    if (!json.c || json.c === 0) {
      throw new Error('No price data');
    }

    const data: QuoteData = {
      currentPrice: json.c,
      openPrice: json.o,
      highPrice: json.h,
      lowPrice: json.l,
      previousClose: json.pc,
      changePercent: json.dp || ((json.c - json.pc) / json.pc) * 100,
      isSimulated: false,
    };

    quoteCache.set(symbol, { data, ts: Date.now() });
    return data;
  } catch (err) {
    console.warn(`[PriceService] Failed to fetch real quote for ${symbol}, using simulation`, err);
    return makeSimulated(symbol);
  }
}

function makeSimulated(symbol: string): QuoteData {
  // Use cached price if available, else import from stock database
  const cached = quoteCache.get(symbol);
  const basePrice = cached ? cached.data.currentPrice : getDefaultPrice(symbol);

  // Small random fluctuation for realism
  const jitter = basePrice * 0.002 * (Math.random() - 0.5);
  const price = basePrice + jitter;

  const data: QuoteData = {
    currentPrice: price,
    openPrice: basePrice * (1 + (Math.random() - 0.5) * 0.01),
    highPrice: basePrice * (1 + Math.random() * 0.015),
    lowPrice: basePrice * (1 - Math.random() * 0.015),
    previousClose: basePrice,
    changePercent: (jitter / basePrice) * 100,
    isSimulated: true,
  };

  quoteCache.set(symbol, { data, ts: Date.now() });
  return data;
}

// Lazy-load default price from stock database
function getDefaultPrice(symbol: string): number {
  // Import inline to avoid circular deps
  try {
    // We store a small fallback map here for common tickers
    const FALLBACK_PRICES: Record<string, number> = {
      NVDA: 900, AAPL: 170, MSFT: 420, TSLA: 175, GOOGL: 155,
      META: 500, AMZN: 180, TSM: 140, AMD: 180, AVGO: 1300,
      '2330.TW': 780, '2454.TW': 1150, '2317.TW': 145.5,
    };
    return FALLBACK_PRICES[symbol] || 100;
  } catch {
    return 100;
  }
}

/**
 * Batch-fetch quotes for multiple symbols.
 * Fetches in parallel with individual error handling.
 */
export async function fetchQuotes(symbols: string[]): Promise<Map<string, QuoteData>> {
  const results = new Map<string, QuoteData>();
  const promises = symbols.map(async (s) => {
    const q = await fetchQuote(s);
    results.set(s, q);
  });
  await Promise.all(promises);
  return results;
}
