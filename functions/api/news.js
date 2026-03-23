export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const ticker = url.searchParams.get('ticker');

  if (!ticker) {
    return new Response('Missing ticker parameter', { status: 400 });
  }

  const fetchUrl = `https://news.google.com/rss/search?q=${ticker}+stock&hl=en-US&gl=US&ceid=US:en`;

  try {
    const r = await fetch(fetchUrl);
    const text = await r.text();

    return new Response(text, {
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
      },
      status: 200,
    });
  } catch (error) {
    return new Response('Error fetching RSS', { status: 500 });
  }
}
