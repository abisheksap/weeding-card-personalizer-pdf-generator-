# Short guest links

This build creates the personalized guest URL as before, then asks the Vercel `/api/shorten` function to create a compact TinyURL. Sharing and Copy Link use the compact URL when the shortener is available; if the shortener is unavailable, the full guest URL is used automatically.

No API key is required for the bundled TinyURL endpoint. The guest page remains isolated at `/invite` and the short URL redirects to that guest-only page.

The Main Preset is hard-coded in `js/app.js` and uses:
- Name: X 193, Y 59, Size 20, Width 420
- Address: X 244, Y 34, Size 18, Width 365
- Noto Sans Devanagari, Bold, Left, #7c1f31
