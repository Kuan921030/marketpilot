import React, { useEffect, useState } from 'react';
import type { NewsItem, DailyInsight } from '../types';
import { fetchNewsForTicker } from '../services/rssParser';
import { MARKET_AI } from '../services/mockAI';
import { priceSimulator } from '../services/priceSimulator';

interface Props {
  ticker: string;
}

const SentimentGauge: React.FC<{ score: number; label?: string }> = ({ score, label }) => {
  const color = score >= 60 ? 'var(--color-up)' : score <= 40 ? 'var(--color-down)' : 'var(--color-neutral)';
  return (
    <div className="sentiment-gauge">
      {label && <span className="gauge-label">{label}</span>}
      <div className="gauge-bar-track">
        <div className="gauge-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="gauge-value" style={{ color }}>{score}</span>
    </div>
  );
};

export const PreMarketView: React.FC<Props> = ({ ticker }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [insight, setInsight] = useState<DailyInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedNews = await fetchNewsForTicker(ticker);
        if (!mounted) return;
        setNews(fetchedNews);
        const genInsight = MARKET_AI.generateDailyInsight(ticker, fetchedNews);
        setInsight(genInsight);

        // Feed sentiment into price simulator
        priceSimulator.setSentimentBias(ticker, genInsight.bias);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load news');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, [ticker]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        Gathering AI Briefing for <strong>{ticker}</strong>...
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'var(--color-down)' }}>⚠ {error}</div>;
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* One-liner */}
      {insight && (
        <div className="one-liner-bar">
          {insight.oneLiner}
        </div>
      )}

      {/* AI Insight Card */}
      {insight && (
        <div className={`card insight-card bias-${insight.bias}`}>
          <div className="insight-header">
            <h3>
              <span>🤖</span> AI Daily Insight
              {insight.newsSpike && <span className="spike-badge">⚡ News Spike</span>}
            </h3>
            <span className={`bias-tag tag-${insight.bias}`}>
              {insight.trendArrow} {insight.bias.toUpperCase()}
            </span>
          </div>

          <div className="insight-gauges">
            <SentimentGauge score={insight.sentimentScore} label="Sentiment" />
            <SentimentGauge score={insight.confidenceScore} label="Confidence" />
          </div>

          <div className="insight-grid">
            <div>
              <h4 className="text-up" style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Key Drivers</h4>
              <ul className="insight-list">
                {insight.drivers.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-down" style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Potential Risks</h4>
              <ul className="insight-list">
                {insight.risks.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* News Feed */}
      <div>
        <h3 className="section-title">Latest News Flow</h3>
        {news.length === 0 ? (
          <p className="text-secondary">No recent news found for {ticker}.</p>
        ) : (
          <div className="news-list">
            {news.map(item => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="card news-card"
              >
                <div className="news-card-header">
                  <div className="news-card-title-row">
                    <span className="trend-arrow" data-sentiment={item.sentiment}>{item.trendArrow}</span>
                    <h4>{item.title}</h4>
                  </div>
                  <div className="news-card-badges">
                    <span className={`tag-${item.sentiment}`}>{item.sentiment}</span>
                    <span className="score-badge">{item.sentimentScore}</span>
                  </div>
                </div>

                <div className="news-meta">
                  <span>{item.source}</span>
                  <span>{item.time}</span>
                </div>
                <div className="news-summary">
                  <span className="summary-icon">🔍</span>
                  <i>{item.summary}</i>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
