# Wedding Invitation Studio — Vercel Fix

This is the static Vercel-ready version of Wedding Invitation Studio.

## Vercel deployment
- Framework Preset: **Other**
- Build Command: **leave empty**
- Output Directory: **.**
- Root Directory: the folder containing `index.html` and `vercel.json`

The included `vercel.json` explicitly serves the project root and keeps the wedding-card PDF/font assets available.

The app uses browser-only IndexedDB for generated invitations; there is no backend database.
