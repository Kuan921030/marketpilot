export interface StockEntry {
  symbol: string;
  name: string;
  exchange: string;
  keywords: string[];
  defaultPrice: number;
}

// Keyword map for Google News RSS (especially for Taiwan stocks)
export const NEWS_KEYWORD_MAP: Record<string, string> = {
  '2330.TW': 'TSMC OR 台積電',
  '2317.TW': 'Foxconn OR 鴻海',
  '2454.TW': 'MediaTek OR 聯發科',
  '2412.TW': 'Chunghwa Telecom OR 中華電信',
  '2308.TW': 'Delta Electronics OR 台達電',
  '2881.TW': 'Fubon Financial OR 富邦金',
  '2882.TW': 'Cathay Financial OR 國泰金',
  '2303.TW': 'United Microelectronics OR 聯電',
  '3711.TW': 'ASE Technology OR 日月光',
  '2382.TW': 'Quanta Computer OR 廣達',
  '2891.TW': 'CTBC Financial OR 中信金',
  '6505.TW': 'Formosa Petrochemical OR 台塑石化',
  '2886.TW': 'Mega Financial OR 兆豐金',
};

export const STOCK_DATABASE: StockEntry[] = [
  // ===== US Tech / AI =====
  { symbol: 'NVDA', name: 'NVIDIA Corp', exchange: 'NASDAQ', keywords: ['nvidia', 'gpu', 'ai chip', 'jensen huang'], defaultPrice: 900.50 },
  { symbol: 'AAPL', name: 'Apple Inc', exchange: 'NASDAQ', keywords: ['apple', 'iphone', 'mac', 'tim cook'], defaultPrice: 170.85 },
  { symbol: 'MSFT', name: 'Microsoft Corp', exchange: 'NASDAQ', keywords: ['microsoft', 'windows', 'azure', 'copilot'], defaultPrice: 420.10 },
  { symbol: 'GOOGL', name: 'Alphabet Inc', exchange: 'NASDAQ', keywords: ['google', 'alphabet', 'youtube', 'gemini ai'], defaultPrice: 155.00 },
  { symbol: 'META', name: 'Meta Platforms', exchange: 'NASDAQ', keywords: ['meta', 'facebook', 'instagram', 'zuckerberg'], defaultPrice: 500.00 },
  { symbol: 'AMZN', name: 'Amazon.com Inc', exchange: 'NASDAQ', keywords: ['amazon', 'aws', 'bezos', 'ecommerce'], defaultPrice: 180.00 },
  { symbol: 'TSLA', name: 'Tesla Inc', exchange: 'NASDAQ', keywords: ['tesla', 'elon musk', 'ev', 'electric vehicle'], defaultPrice: 175.20 },
  { symbol: 'NFLX', name: 'Netflix Inc', exchange: 'NASDAQ', keywords: ['netflix', 'streaming'], defaultPrice: 620.00 },
  { symbol: 'CRM', name: 'Salesforce Inc', exchange: 'NYSE', keywords: ['salesforce', 'crm', 'cloud'], defaultPrice: 270.00 },
  { symbol: 'ORCL', name: 'Oracle Corp', exchange: 'NYSE', keywords: ['oracle', 'database', 'cloud'], defaultPrice: 125.00 },
  { symbol: 'ADBE', name: 'Adobe Inc', exchange: 'NASDAQ', keywords: ['adobe', 'photoshop', 'creative cloud'], defaultPrice: 520.00 },
  { symbol: 'INTC', name: 'Intel Corp', exchange: 'NASDAQ', keywords: ['intel', 'cpu', 'semiconductor'], defaultPrice: 42.00 },
  { symbol: 'IBM', name: 'IBM Corp', exchange: 'NYSE', keywords: ['ibm', 'watson', 'enterprise'], defaultPrice: 185.00 },
  { symbol: 'CSCO', name: 'Cisco Systems', exchange: 'NASDAQ', keywords: ['cisco', 'networking'], defaultPrice: 50.00 },
  { symbol: 'UBER', name: 'Uber Technologies', exchange: 'NYSE', keywords: ['uber', 'rideshare', 'delivery'], defaultPrice: 72.00 },
  { symbol: 'SQ', name: 'Block Inc', exchange: 'NYSE', keywords: ['block', 'square', 'cash app', 'fintech'], defaultPrice: 75.00 },
  { symbol: 'SHOP', name: 'Shopify Inc', exchange: 'NYSE', keywords: ['shopify', 'ecommerce'], defaultPrice: 78.00 },
  { symbol: 'SNOW', name: 'Snowflake Inc', exchange: 'NYSE', keywords: ['snowflake', 'data cloud'], defaultPrice: 165.00 },
  { symbol: 'PLTR', name: 'Palantir Technologies', exchange: 'NYSE', keywords: ['palantir', 'data analytics', 'ai'], defaultPrice: 24.00 },
  { symbol: 'COIN', name: 'Coinbase Global', exchange: 'NASDAQ', keywords: ['coinbase', 'crypto', 'bitcoin exchange'], defaultPrice: 210.00 },

  // ===== US Semiconductors =====
  { symbol: 'TSM', name: 'Taiwan Semiconductor (ADR)', exchange: 'NYSE', keywords: ['tsm', 'tsmc', 'taiwan semi', '台積電'], defaultPrice: 140.30 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', exchange: 'NASDAQ', keywords: ['amd', 'ryzen', 'radeon', 'lisa su'], defaultPrice: 180.50 },
  { symbol: 'AVGO', name: 'Broadcom Inc', exchange: 'NASDAQ', keywords: ['broadcom', 'semiconductor', 'networking chip'], defaultPrice: 1300.00 },
  { symbol: 'QCOM', name: 'Qualcomm Inc', exchange: 'NASDAQ', keywords: ['qualcomm', 'snapdragon', 'mobile chip'], defaultPrice: 165.00 },
  { symbol: 'ARM', name: 'Arm Holdings', exchange: 'NASDAQ', keywords: ['arm', 'chip design', 'softbank'], defaultPrice: 130.00 },
  { symbol: 'MU', name: 'Micron Technology', exchange: 'NASDAQ', keywords: ['micron', 'memory', 'dram', 'nand'], defaultPrice: 95.00 },
  { symbol: 'MRVL', name: 'Marvell Technology', exchange: 'NASDAQ', keywords: ['marvell', 'data infrastructure'], defaultPrice: 70.00 },
  { symbol: 'LRCX', name: 'Lam Research', exchange: 'NASDAQ', keywords: ['lam research', 'semiconductor equipment'], defaultPrice: 920.00 },
  { symbol: 'AMAT', name: 'Applied Materials', exchange: 'NASDAQ', keywords: ['applied materials', 'semiconductor equipment'], defaultPrice: 200.00 },
  { symbol: 'KLAC', name: 'KLA Corp', exchange: 'NASDAQ', keywords: ['kla', 'semiconductor inspection'], defaultPrice: 680.00 },

  // ===== US Finance =====
  { symbol: 'JPM', name: 'JPMorgan Chase', exchange: 'NYSE', keywords: ['jpmorgan', 'chase', 'bank'], defaultPrice: 195.00 },
  { symbol: 'V', name: 'Visa Inc', exchange: 'NYSE', keywords: ['visa', 'payment', 'credit card'], defaultPrice: 280.00 },
  { symbol: 'MA', name: 'Mastercard Inc', exchange: 'NYSE', keywords: ['mastercard', 'payment'], defaultPrice: 460.00 },
  { symbol: 'BAC', name: 'Bank of America', exchange: 'NYSE', keywords: ['bank of america', 'bofa'], defaultPrice: 37.00 },
  { symbol: 'GS', name: 'Goldman Sachs', exchange: 'NYSE', keywords: ['goldman sachs', 'investment bank'], defaultPrice: 400.00 },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway B', exchange: 'NYSE', keywords: ['berkshire', 'buffett', 'warren buffett'], defaultPrice: 410.00 },

  // ===== US Healthcare =====
  { symbol: 'UNH', name: 'UnitedHealth Group', exchange: 'NYSE', keywords: ['unitedhealth', 'insurance', 'healthcare'], defaultPrice: 520.00 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE', keywords: ['johnson', 'pharma', 'healthcare'], defaultPrice: 155.00 },
  { symbol: 'LLY', name: 'Eli Lilly', exchange: 'NYSE', keywords: ['eli lilly', 'pharma', 'obesity drug', 'mounjaro'], defaultPrice: 780.00 },
  { symbol: 'PFE', name: 'Pfizer Inc', exchange: 'NYSE', keywords: ['pfizer', 'vaccine', 'pharma'], defaultPrice: 27.00 },
  { symbol: 'ABBV', name: 'AbbVie Inc', exchange: 'NYSE', keywords: ['abbvie', 'humira', 'pharma'], defaultPrice: 170.00 },

  // ===== US Consumer / Industrial =====
  { symbol: 'WMT', name: 'Walmart Inc', exchange: 'NYSE', keywords: ['walmart', 'retail'], defaultPrice: 175.00 },
  { symbol: 'KO', name: 'Coca-Cola Co', exchange: 'NYSE', keywords: ['coca-cola', 'coke', 'beverage'], defaultPrice: 60.00 },
  { symbol: 'PG', name: 'Procter & Gamble', exchange: 'NYSE', keywords: ['procter', 'gamble', 'consumer goods'], defaultPrice: 160.00 },
  { symbol: 'DIS', name: 'Walt Disney Co', exchange: 'NYSE', keywords: ['disney', 'disney+', 'theme park'], defaultPrice: 112.00 },
  { symbol: 'NKE', name: 'Nike Inc', exchange: 'NYSE', keywords: ['nike', 'sneakers', 'sportswear'], defaultPrice: 95.00 },
  { symbol: 'BA', name: 'Boeing Co', exchange: 'NYSE', keywords: ['boeing', 'aerospace', 'aircraft'], defaultPrice: 178.00 },
  { symbol: 'CAT', name: 'Caterpillar Inc', exchange: 'NYSE', keywords: ['caterpillar', 'construction', 'machinery'], defaultPrice: 340.00 },
  { symbol: 'XOM', name: 'Exxon Mobil', exchange: 'NYSE', keywords: ['exxon', 'oil', 'energy'], defaultPrice: 105.00 },

  // ===== US EV / Energy =====
  { symbol: 'RIVN', name: 'Rivian Automotive', exchange: 'NASDAQ', keywords: ['rivian', 'ev', 'electric truck'], defaultPrice: 15.00 },
  { symbol: 'LCID', name: 'Lucid Group', exchange: 'NASDAQ', keywords: ['lucid', 'ev', 'luxury electric'], defaultPrice: 4.50 },
  { symbol: 'NIO', name: 'NIO Inc', exchange: 'NYSE', keywords: ['nio', 'china ev', 'electric vehicle'], defaultPrice: 6.50 },
  { symbol: 'ENPH', name: 'Enphase Energy', exchange: 'NASDAQ', keywords: ['enphase', 'solar', 'renewable'], defaultPrice: 120.00 },

  // ===== Taiwan Stocks =====
  { symbol: '2330.TW', name: 'TSMC', exchange: 'TWSE', keywords: ['tsmc', '台積電', 'taiwan semiconductor'], defaultPrice: 780.00 },
  { symbol: '2454.TW', name: 'MediaTek', exchange: 'TWSE', keywords: ['mediatek', '聯發科', 'mobile chip'], defaultPrice: 1150.00 },
  { symbol: '2317.TW', name: 'Hon Hai (Foxconn)', exchange: 'TWSE', keywords: ['foxconn', '鴻海', 'hon hai', 'iphone assembly'], defaultPrice: 145.50 },
  { symbol: '2412.TW', name: 'Chunghwa Telecom', exchange: 'TWSE', keywords: ['chunghwa telecom', '中華電信', 'telecom'], defaultPrice: 125.00 },
  { symbol: '2308.TW', name: 'Delta Electronics', exchange: 'TWSE', keywords: ['delta electronics', '台達電', 'power supply'], defaultPrice: 380.00 },
  { symbol: '2881.TW', name: 'Fubon Financial', exchange: 'TWSE', keywords: ['fubon', '富邦金', 'financial'], defaultPrice: 72.00 },
  { symbol: '2882.TW', name: 'Cathay Financial', exchange: 'TWSE', keywords: ['cathay', '國泰金', 'financial'], defaultPrice: 48.00 },
  { symbol: '2303.TW', name: 'United Microelectronics', exchange: 'TWSE', keywords: ['umc', '聯電', 'semiconductor'], defaultPrice: 52.00 },
  { symbol: '3711.TW', name: 'ASE Technology', exchange: 'TWSE', keywords: ['ase', '日月光', 'packaging'], defaultPrice: 160.00 },
  { symbol: '2382.TW', name: 'Quanta Computer', exchange: 'TWSE', keywords: ['quanta', '廣達', 'server', 'ai server'], defaultPrice: 280.00 },
  { symbol: '2891.TW', name: 'CTBC Financial', exchange: 'TWSE', keywords: ['ctbc', '中信金', 'financial'], defaultPrice: 32.00 },
  { symbol: '6505.TW', name: 'Formosa Petrochemical', exchange: 'TWSE', keywords: ['formosa', '台塑石化', 'petrochemical'], defaultPrice: 95.00 },
  { symbol: '2886.TW', name: 'Mega Financial', exchange: 'TWSE', keywords: ['mega', '兆豐金', 'financial'], defaultPrice: 40.00 },

  // ===== Crypto-adjacent =====
  { symbol: 'MSTR', name: 'MicroStrategy Inc', exchange: 'NASDAQ', keywords: ['microstrategy', 'bitcoin', 'saylor'], defaultPrice: 1500.00 },
  { symbol: 'MARA', name: 'Marathon Digital', exchange: 'NASDAQ', keywords: ['marathon', 'bitcoin mining'], defaultPrice: 20.00 },

  // ===== Index ETFs =====
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', exchange: 'NYSE', keywords: ['spy', 's&p 500', 'index'], defaultPrice: 510.00 },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', exchange: 'NASDAQ', keywords: ['qqq', 'nasdaq 100', 'tech etf'], defaultPrice: 440.00 },
  { symbol: 'IWM', name: 'iShares Russell 2000', exchange: 'NYSE', keywords: ['iwm', 'russell', 'small cap'], defaultPrice: 205.00 },
  { symbol: 'DIA', name: 'SPDR Dow Jones ETF', exchange: 'NYSE', keywords: ['dia', 'dow jones', 'index'], defaultPrice: 390.00 },
  { symbol: 'VTI', name: 'Vanguard Total Stock', exchange: 'NYSE', keywords: ['vti', 'total market', 'vanguard'], defaultPrice: 255.00 },
  { symbol: 'ARKK', name: 'ARK Innovation ETF', exchange: 'NYSE', keywords: ['ark', 'cathie wood', 'innovation'], defaultPrice: 48.00 },
  { symbol: 'SOXX', name: 'iShares Semicond ETF', exchange: 'NASDAQ', keywords: ['soxx', 'semiconductor etf'], defaultPrice: 240.00 },
];

// Quick lookup helpers
export function getStockBySymbol(symbol: string): StockEntry | undefined {
  return STOCK_DATABASE.find(s => s.symbol === symbol);
}

export function getNewsKeyword(symbol: string): string {
  return NEWS_KEYWORD_MAP[symbol] || symbol.replace('.TW', '');
}

export function searchStocks(query: string): StockEntry[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return STOCK_DATABASE.filter(s =>
    s.symbol.toLowerCase().includes(q) ||
    s.name.toLowerCase().includes(q) ||
    s.keywords.some(k => k.toLowerCase().includes(q))
  ).slice(0, 10);
}
