import type { DailyInsight, Sentiment, NewsItem } from '../types';

// ===== Keyword dictionaries with intensity weights =====
const POSITIVE_KEYWORDS: [RegExp, number][] = [
  [/surge[ds]?/i, 3], [/soar[sed]*/i, 3], [/record.?high/i, 3], [/all.?time.?high/i, 3],
  [/rally/i, 2.5], [/breakout/i, 2.5], [/upgrade[ds]?/i, 2.5],
  [/beat[s]? (?:estimate|expectation|forecast)/i, 2],
  [/jump[sed]*/i, 2], [/gain[sed]*/i, 2], [/strong/i, 1.5],
  [/bullish/i, 2], [/outperform/i, 2], [/buy/i, 1.5],
  [/growth/i, 1.5], [/expand/i, 1], [/profit/i, 1.5],
  [/up\b/i, 1], [/rise[sn]*/i, 1.5], [/boost/i, 1.5],
  [/optimis/i, 1.5], [/positive/i, 1], [/recover/i, 1],
  [/innovat/i, 1], [/partner/i, 1], [/deal/i, 1],
  [/launch/i, 1], [/revenue/i, 0.5], [/demand/i, 0.5],
];

const NEGATIVE_KEYWORDS: [RegExp, number][] = [
  [/crash/i, 3], [/plunge[ds]*/i, 3], [/plummet/i, 3],
  [/downgrade/i, 2.5], [/lawsuit/i, 2.5], [/investig/i, 2.5],
  [/probe/i, 2], [/fraud/i, 3], [/scandal/i, 3],
  [/bearish/i, 2], [/sell.?off/i, 2.5], [/underperform/i, 2],
  [/drop[pes]*/i, 2], [/fall[sn]*/i, 1.5], [/decline[ds]*/i, 1.5],
  [/loss/i, 1.5], [/miss(?:es|ed)?/i, 2], [/weak/i, 1.5],
  [/risk/i, 1], [/warn/i, 1.5], [/threat/i, 1.5],
  [/recession/i, 2], [/layoff/i, 2], [/cut[s]?/i, 1],
  [/concern/i, 1], [/fear/i, 1.5], [/volatile/i, 1],
  [/debt/i, 1], [/down\b/i, 1], [/low\b/i, 0.5],
];

function computeScore(title: string): { rawScore: number; posWeight: number; negWeight: number } {
  let posWeight = 0;
  let negWeight = 0;
  POSITIVE_KEYWORDS.forEach(([re, w]) => { if (re.test(title)) posWeight += w; });
  NEGATIVE_KEYWORDS.forEach(([re, w]) => { if (re.test(title)) negWeight += w; });
  // rawScore: -1 to +1 normalized
  const total = posWeight + negWeight || 1;
  const rawScore = (posWeight - negWeight) / total;
  return { rawScore, posWeight, negWeight };
}

export const MARKET_AI = {
  analyzeNewsTitle(title: string): {
    sentiment: Sentiment;
    sentimentScore: number;
    trendArrow: '↑' | '↓' | '→';
    summary: string;
  } {
    const { rawScore } = computeScore(title);

    // Convert rawScore (-1..+1) to sentimentScore (0..100)
    const sentimentScore = Math.round(50 + rawScore * 50);
    const clampedScore = Math.max(0, Math.min(100, sentimentScore));

    let sentiment: Sentiment = 'neutral';
    let trendArrow: '↑' | '↓' | '→' = '→';

    if (clampedScore >= 62) { sentiment = 'positive'; trendArrow = '↑'; }
    else if (clampedScore <= 38) { sentiment = 'negative'; trendArrow = '↓'; }

    // Generate contextual summary referencing the actual headline
    const shortTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;
    let summary: string;
    if (sentiment === 'positive') {
      summary = `Bullish signal detected (score ${clampedScore}): "${shortTitle}" suggests upward catalyst.`;
    } else if (sentiment === 'negative') {
      summary = `Bearish signal detected (score ${clampedScore}): "${shortTitle}" indicates downside pressure.`;
    } else {
      summary = `Neutral impact (score ${clampedScore}): "${shortTitle}" shows balanced market implications.`;
    }

    return { sentiment, sentimentScore: clampedScore, trendArrow, summary };
  },

  generateDailyInsight(ticker: string, news: NewsItem[]): DailyInsight {
    if (news.length === 0) {
      return {
        drivers: ['No major breaking news detected in pre-market.'],
        risks: ['General macroeconomic conditions remain the primary driver.'],
        bias: 'neutral',
        sentimentScore: 50,
        confidenceScore: 20,
        trendArrow: '→',
        oneLiner: `${ticker}: No fresh catalysts detected — expect range-bound activity.`,
        newsSpike: false,
      };
    }

    // Aggregate sentiment scores
    const scores = news.map(n => n.sentimentScore);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    let positiveCount = 0;
    let negativeCount = 0;
    news.forEach(n => {
      if (n.sentiment === 'positive') positiveCount++;
      if (n.sentiment === 'negative') negativeCount++;
    });

    // Determine bias
    let bias: Sentiment = 'neutral';
    let trendArrow: '↑' | '↓' | '→' = '→';
    if (avgScore >= 58) { bias = 'positive'; trendArrow = '↑'; }
    else if (avgScore <= 42) { bias = 'negative'; trendArrow = '↓'; }

    // Confidence based on consensus + volume
    const consensus = Math.abs(positiveCount - negativeCount) / news.length;
    const volumeBonus = Math.min(news.length * 5, 25);
    const confidenceScore = Math.min(100, Math.round(consensus * 60 + volumeBonus + 15));

    // News spike detection
    const newsSpike = (positiveCount >= 3 && negativeCount === 0) ||
                       (negativeCount >= 3 && positiveCount === 0);

    const drivers: string[] = [];
    const risks: string[] = [];

    if (bias === 'positive') {
      drivers.push(`Strong bullish flow detected across ${positiveCount} of ${news.length} headlines for ${ticker}.`);
      drivers.push(`Aggregate sentiment score: ${avgScore}/100 — momentum is constructive.`);
      if (newsSpike) drivers.push('⚡ Unusual positive news spike — high conviction signal.');
      risks.push('Potential for profit-taking if broader market turns negative.');
    } else if (bias === 'negative') {
      drivers.push('Risk management recommended — avoid aggressive entries.');
      risks.push(`Bearish pressure detected across ${negativeCount} of ${news.length} headlines for ${ticker}.`);
      risks.push(`Aggregate sentiment score: ${avgScore}/100 — caution warranted.`);
      if (newsSpike) risks.push('⚡ Unusual negative news spike — high risk of further downside.');
    } else {
      drivers.push(`Mixed signals across ${news.length} headlines — no clear directional edge.`);
      risks.push('Choppy session likely; wait for volume confirmation before acting.');
    }

    const biasEmoji = bias === 'positive' ? '🟢' : bias === 'negative' ? '🔴' : '⚪';
    const oneLiner = `${biasEmoji} ${ticker}: Sentiment ${avgScore}/100 | ${trendArrow} ${bias.toUpperCase()} bias | Confidence ${confidenceScore}%`;

    return { drivers, risks, bias, sentimentScore: avgScore, confidenceScore, trendArrow, oneLiner, newsSpike };
  },

  generateAlertSuggestion(
    ticker: string,
    type: 'DROP' | 'INCREASE',
    threshold: number,
    sentimentBias?: Sentiment
  ): string {
    const pct = Math.abs(threshold).toFixed(1);
    if (type === 'DROP') {
      const sentimentContext = sentimentBias === 'negative'
        ? ' — aligns with negative news sentiment, downside may continue'
        : sentimentBias === 'positive'
        ? ' — contradicts bullish sentiment, possible buying opportunity'
        : '';
      if (threshold >= 3)
        return `[${ticker}] ⚠️ Significant drop of ${pct}%${sentimentContext}. Consider hedging or waiting for support.`;
      return `[${ticker}] Minor pullback of ${pct}%${sentimentContext}. Monitor for continuation or recovery.`;
    } else {
      const sentimentContext = sentimentBias === 'positive'
        ? ' — confirms bullish sentiment, momentum intact'
        : sentimentBias === 'negative'
        ? ' — defies bearish news, possible short squeeze'
        : '';
      if (threshold >= 3)
        return `[${ticker}] 🚀 Strong breakout of +${pct}%${sentimentContext}. Consider trailing stops.`;
      return `[${ticker}] Positive move of +${pct}%${sentimentContext}. Consistent with bullish flow.`;
    }
  },

  computeSentimentBias(news: NewsItem[]): Sentiment {
    if (news.length === 0) return 'neutral';
    const avg = news.reduce((sum, n) => sum + n.sentimentScore, 0) / news.length;
    if (avg >= 58) return 'positive';
    if (avg <= 42) return 'negative';
    return 'neutral';
  }
};
