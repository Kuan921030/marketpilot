import React, { useEffect, useState } from 'react';
import { priceSimulator } from '../services/priceSimulator';
import { fetchNewsForTicker } from '../services/rssParser';
import { MARKET_AI } from '../services/mockAI';

interface Props {
  ticker: string;
}

export const PostMarketView: React.FC<Props> = ({ ticker }) => {
  const [changePct, setChangePct] = useState<number>(0);
  const [preMarketBias, setPreMarketBias] = useState<string>('neutral');
  const [preMarketScore, setPreMarketScore] = useState<number>(50);
  const [newsCount, setNewsCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Get current price change
    const unsub = priceSimulator.subscribe(ticker, (_, pct, _sim) => {
      setChangePct(pct);
    });

    // Re-fetch news to compute what the pre-market bias was
    fetchNewsForTicker(ticker).then(news => {
      setNewsCount(news.length);
      const insight = MARKET_AI.generateDailyInsight(ticker, news);
      setPreMarketBias(insight.bias);
      setPreMarketScore(insight.sentimentScore);
      setLoaded(true);
    });

    return () => unsub();
  }, [ticker]);

  const actualTrend = changePct > 0.5 ? 'positive' : changePct < -0.5 ? 'negative' : 'neutral';
  const predictionMatched = preMarketBias === actualTrend;

  const accuracyScore = predictionMatched ? Math.min(95, preMarketScore + 15) : Math.max(20, 100 - preMarketScore);

  const biasEmoji = preMarketBias === 'positive' ? '🟢' : preMarketBias === 'negative' ? '🔴' : '⚪';
  const actualEmoji = actualTrend === 'positive' ? '🟢' : actualTrend === 'negative' ? '🔴' : '⚪';

  let explanation: string;
  if (predictionMatched) {
    explanation = `Pre-market AI predicted a ${preMarketBias} bias (score ${preMarketScore}/100), which aligned with the actual session result of ${changePct > 0 ? '+' : ''}${changePct.toFixed(2)}%. The news-driven heuristic model successfully captured the dominant market narrative for ${ticker}.`;
  } else {
    explanation = `Pre-market AI predicted a ${preMarketBias} bias (score ${preMarketScore}/100), but the actual session moved ${actualTrend} with ${changePct > 0 ? '+' : ''}${changePct.toFixed(2)}%. External factors or late-breaking developments may have overridden the initial news sentiment for ${ticker}.`;
  }

  if (!loaded) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        Generating post-market analysis...
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Session Summary */}
      <div className="card">
        <h3 className="section-title" style={{ marginBottom: '1rem' }}>Day Session Wrap-up</h3>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          {ticker} closed the simulated session{' '}
          {changePct > 0
            ? <span className="text-up">up +{changePct.toFixed(2)}%</span>
            : <span className="text-down">down {changePct.toFixed(2)}%</span>
          }.
        </p>

        <div className="post-comparison">
          <div className="comparison-item">
            <span className="comparison-label">Pre-Market Prediction</span>
            <span className="comparison-value">{biasEmoji} {preMarketBias.toUpperCase()} (Score: {preMarketScore})</span>
          </div>
          <div className="comparison-arrow">→</div>
          <div className="comparison-item">
            <span className="comparison-label">Actual Outcome</span>
            <span className="comparison-value">{actualEmoji} {actualTrend.toUpperCase()} ({changePct > 0 ? '+' : ''}{changePct.toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* AI Retrospective */}
      <div className="card" style={{ borderLeft: `4px solid var(--color-accent)` }}>
        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          AI Retrospective Analysis
        </h4>
        <p style={{ lineHeight: 1.6, fontStyle: 'italic' }}>"{explanation}"</p>
      </div>

      {/* Stats Grid */}
      <div className="post-stats-grid">
        <div className="card stat-card">
          <div className="stat-emoji">{predictionMatched ? '🎯' : '❌'}</div>
          <div className="stat-label">Prediction</div>
          <div className={`stat-value ${predictionMatched ? 'text-up' : 'text-down'}`}>
            {predictionMatched ? 'MATCHED' : 'MISSED'}
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-emoji">📊</div>
          <div className="stat-label">Accuracy Score</div>
          <div className="stat-value" style={{ color: 'var(--color-accent)' }}>{accuracyScore}%</div>
        </div>

        <div className="card stat-card">
          <div className="stat-emoji">📰</div>
          <div className="stat-label">News Processed</div>
          <div className="stat-value">{newsCount} articles</div>
        </div>

        <div className="card stat-card">
          <div className="stat-emoji">🧠</div>
          <div className="stat-label">AI Confidence</div>
          <div className="stat-value" style={{ color: 'var(--color-up)' }}>{preMarketScore}%</div>
        </div>
      </div>
    </div>
  );
};
