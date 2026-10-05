# Wedding Invitation Studio

Static/local-first wedding invitation personalizer built around the supplied 3-page wedding card.

## Run locally

Use a local HTTP server. Python is not required.

### Node.js

```cmd
npx serve .
```

### VS Code

Use the Live Server extension and open `index.html` with Live Server.

## Important

Do not open `index.html` directly with `file:///`. IndexedDB, module loading, PDF assets and PWA behavior are intended to run under HTTP(S).

## Features

- Nepali / English / mixed Unicode input
- Browser-native Devanagari shaping for generated text
- Client-side PDF generation
- Original 3-page card preserved
- IndexedDB invitation register
- Search, open, download, share, edit and delete
- Duplicate detection
- Backup/restore ZIP
- CSV guest-list export
- PWA structure
- No backend or database

## PDF personalization

The overlay coordinates are in `js/app.js` under `LAYOUT`. They are calibrated for the supplied card.

The final PDF uses the original supplied card as its master artwork. Personalized text is rendered by the browser at high resolution before being overlaid on page 1. This avoids broken Devanagari glyph boxes such as `□ □ □`.
