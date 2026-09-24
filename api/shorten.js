export default async function handler(req, res) {
  try {
    const raw = req.query?.url;
    if (!raw) return res.status(400).json({ error: 'Missing url' });
    const target = String(raw);
    if (!/^https?:\/\//i.test(target)) return res.status(400).json({ error: 'Invalid url' });
    if (target.length > 8000) return res.status(400).json({ error: 'URL too long' });
    const endpoint = 'https://tinyurl.com/api-create.php?url=' + encodeURIComponent(target);
    const r = await fetch(endpoint, { headers: { 'accept': 'text/plain' } });
    const text = (await r.text()).trim();
    if (!r.ok || !/^https:\/\/(?:www\.)?tinyurl\.com\//i.test(text)) {
      return res.status(502).json({ error: 'Shortener unavailable' });
    }
    return res.status(200).json({ shortUrl: text });
  } catch (e) {
    return res.status(502).json({ error: 'Shortener unavailable' });
  }
}
