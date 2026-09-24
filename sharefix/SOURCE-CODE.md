# Source Code — Wedding Invitation Studio v21

The complete application source is included in this project folder.

- `index.html` — personalizer/editor UI
- `js/app.js` — personalizer, PDF generation, presets, sharing
- `guest.html` — isolated guest-only route shell
- `js/guest.js` — guest-only invitation renderer and sharing
- `css/styles.css` — site and guest-view styling
- `vercel.json` — `/invite` → `/guest.html` rewrite
- `service-worker.js` — cache/version handling
- `assets/card/final-template.pdf` — 3-page invitation template
- `assets/fonts/` — Devanagari fonts

Main Preset is source-controlled in `js/app.js`.
