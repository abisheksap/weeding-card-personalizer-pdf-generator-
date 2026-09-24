# Vercel deployment

Upload the contents of this folder as the Vercel project root.

- Framework preset: Other
- Root Directory: ./
- Build Command: empty
- Output Directory: empty
- Install Command: empty

This version generates compact `/i/<token>` guest links directly in the browser using gzip compression. There is no external shortener and no redirect wait. Vercel rewrites `/i/*` directly to the guest viewer.

Main Preset is hard-coded in `js/app.js` and is not browser-saved:
- Name X 193, Y 59, Size 20, Width 420
- Address X 244, Y 34, Size 18, Width 365
- Noto Sans Devanagari, Bold, Left, #7c1f31
