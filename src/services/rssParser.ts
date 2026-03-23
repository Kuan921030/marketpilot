import type { NewsItem } from '../types';
import { MARKET_AI } from './mockAI';
import { getNewsKeyword } from '../data/stockDatabase';

export async function fetchNewsForTicker(ticker: string): Promise<NewsItem[]> {
  try {
    const keyword = getNewsKeyword(ticker);
    const response = await fetch(`/api/news?ticker=${encodeURIComponent(keyword)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS for ${ticker}`);
    }
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    const items = xmlDoc.querySelectorAll('item');
    const news: NewsItem[] = [];

    for (let i = 0; i < Math.min(items.length, 8); i++) {
      const item = items[i];
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const source = item.querySelector('source')?.textContent || 'Google News';

      const cleanTitle = title.replace(` - ${source}`, '');
      const aiAnalysis = MARKET_AI.analyzeNewsTitle(cleanTitle);

      news.push({
        id: `${ticker}-${i}-${Date.now()}`,
        title: cleanTitle,
        source,
        time: pubDate ? new Date(pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        link,
        summary: aiAnalysis.summary,
        sentiment: aiAnalysis.sentiment,
        sentimentScore: aiAnalysis.sentimentScore,
        trendArrow: aiAnalysis.trendArrow,
      });
    }

    return news;
  } catch (error) {
    console.error('Error in fetchNewsForTicker:', error);
    return [];
  }
}
