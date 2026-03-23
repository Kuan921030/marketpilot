import React, { useEffect, useState, useRef } from 'react';
import { priceSimulator } from '../services/priceSimulator';
import { MARKET_AI } from '../services/mockAI';
import type { Sentiment } from '../types';

interface Props {
  ticker: string;
}

const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 200;
  const h = 40;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  const lastVal = data[data.length - 1];
  const firstVal = data[0];
  const color = lastVal >= firstVal ? 'var(--color-up)' : 'var(--color-down)';

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

export const LiveMonitorView: React.FC<Props> = ({ ticker }) => {
  const [price, setPrice] = useState<number | null>(null);
  const [changePct, setChangePct] = useState<number>(0);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [isSimulated, setIsSimulated] = useState(true);
  const sentimentRef = useRef<Sentiment>('neutral');

  const [dropAlert, setDropAlert] = useState<number>(2);
  const [increaseAlert, setIncreaseAlert] = useState<number>(2);
  const [triggeredAlerts, setTriggeredAlerts] = useState<{message: string; type: 'up' | 'down'; time: string}[]>([]);

  useEffect(() => {
    setPriceHistory([]);
    setTriggeredAlerts([]);

    const unsubscribe = priceSimulator.subscribe(ticker, (newPrice, pct, sim) => {
      setPrice(newPrice);
      setChangePct(pct);
      setIsSimulated(sim);
      setPriceHistory(prev => [...prev.slice(-60), newPrice]);

      if (pct <= -dropAlert) {
        const msg = MARKET_AI.generateAlertSuggestion(ticker, 'DROP', Math.abs(pct), sentimentRef.current);
        setTriggeredAlerts(prev => [{ message: msg, type: 'down', time: new Date().toLocaleTimeString() }, ...prev.slice(0, 19)]);
        setDropAlert(prev => prev + 1);
      } else if (pct >= increaseAlert) {
        const msg = MARKET_AI.generateAlertSuggestion(ticker, 'INCREASE', pct, sentimentRef.current);
        setTriggeredAlerts(prev => [{ message: msg, type: 'up', time: new Date().toLocaleTimeString() }, ...prev.slice(0, 19)]);
        setIncreaseAlert(prev => prev + 1);
      }
    });

    return () => unsubscribe();
  }, [ticker, dropAlert, increaseAlert]);

  const isPositive = changePct >= 0;
  const currencyPrefix = ticker.endsWith('.TW') ? 'NT$' : '$';

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Price Display */}
      <div className="card live-price-card">
        <div className="live-price-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="live-price-value">
              {currencyPrefix}{price?.toFixed(2) || '---'}
            </h1>
            {isSimulated
              ? <span className="sim-badge-lg">SIMULATED</span>
              : <span className="live-badge-lg">LIVE DATA</span>
            }
          </div>
          <div className={`live-price-change ${isPositive ? 'text-up' : 'text-down'}`}>
            {isPositive ? '↑' : '↓'} {isPositive ? '+' : ''}{changePct.toFixed(2)}%
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <Sparkline data={priceHistory} />
          </div>
        </div>

        <div className="live-alert-settings">
          <h4>Alert Thresholds</h4>
          <div className="alert-inputs">
            <label className="alert-label">
              <span className="text-down">↓ Drop %</span>
              <input
                type="number"
                value={dropAlert}
                onChange={e => setDropAlert(Number(e.target.value))}
                className="alert-input"
              />
            </label>
            <label className="alert-label">
              <span className="text-up">↑ Rise %</span>
              <input
                type="number"
                value={increaseAlert}
                onChange={e => setIncreaseAlert(Number(e.target.value))}
                className="alert-input"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Alert Log */}
      <div>
        <h3 className="section-title">AI Alert Log</h3>
        {triggeredAlerts.length === 0 ? (
          <p className="text-secondary">No alerts triggered yet. Prices tick every 2s — adjust thresholds or wait.</p>
        ) : (
          <div className="alert-log">
            {triggeredAlerts.map((alert, i) => (
              <div key={i} className={`card alert-item alert-${alert.type}`}>
                <div className="alert-icon">🤖</div>
                <div className="alert-body">
                  <div className="alert-time">{alert.time}</div>
                  <div className="alert-message">{alert.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
