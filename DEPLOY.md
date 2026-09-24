# Vercel deployment

Upload the contents of this folder as the Vercel project root.

- Framework preset: Other
- Root Directory: ./
- Build Command: empty
- Output Directory: empty
- Install Command: empty

This version includes an `/api/shorten` Vercel function. It turns the long guest invitation URL into a compact TinyURL before Share Link / Copy Link use it. If the shortener is temporarily unavailable, the app automatically falls back to the full guest URL so sharing still works.

Main Preset is hard-coded in `js/app.js` and is not browser-saved:
- Name X 193, Y 59, Size 20, Width 420
- Address X 244, Y 34, Size 18, Width 365
- Noto Sans Devanagari, Bold, Left, #7c1f31
