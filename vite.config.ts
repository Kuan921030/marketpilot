import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(() => {
  // Read env vars at build time
  const finnhubKey = process.env.VITE_FINNHUB_KEY || '';

  return {
    plugins: [react(), {
      name: 'mock-cloudflare-functions',
      configureServer(server) {
        // News proxy
        server.middlewares.use('/api/news', async (req, res) => {
          const url = new URL(req.url || '', `http://${req.headers.host}`);
          const ticker = url.searchParams.get('ticker');
          if (!ticker) {
            res.statusCode = 400;
            res.end('Missing ticker');
            return;
          }
          try {
            const fetchUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(ticker)}+stock&hl=en-US&gl=US&ceid=US:en`;
            const r = await fetch(fetchUrl);
            const text = await r.text();
            res.setHeader('Content-Type', 'application/xml');
            res.end(text);
          } catch (e) {
            res.statusCode = 500;
            res.end('Error fetching RSS');
          }
        });

        // Quote proxy (Finnhub)
        server.middlewares.use('/api/quote', async (req, res) => {
          const url = new URL(req.url || '', `http://${req.headers.host}`);
          const symbol = url.searchParams.get('symbol');
          if (!symbol) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing symbol' }));
            return;
          }

          const key = finnhubKey;
          if (!key || key === 'your_finnhub_api_key_here') {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'No API key' }));
            return;
          }

          try {
            const fetchUrl = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`;
            const r = await fetch(fetchUrl);
            const data = await r.text();
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'public, max-age=30');
            res.end(data);
          } catch (e) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Fetch failed' }));
          }
        });
      }
    }, cloudflare()],
  };
});