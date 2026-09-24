# Wedding Invitation Studio — Final V18

## Deployment
Deploy the contents of this folder as the Vercel project root.

## Main Preset
The permanent Main Preset is in `js/app.js` under `MAIN_PRESET`; it is not stored in browser localStorage.

## Sharing
The main Share button opens the Wedding Invitation Studio share panel first. It does NOT immediately open the browser/Windows native share sheet. The panel includes:
- Copy guest-only invitation link
- WhatsApp
- Telegram
- Facebook
- X
- Email
- Open guest view
- Download PDF
- Share PDF to phone apps (native share sheet, explicitly selected)

The guest link opens `/invite?invite=1&card=...` and shows a responsive, full-width three-page invitation viewer without the personalizer.

## PDF size
The template PDF has been optimized and the generated name/address raster scale was reduced from 6x to 4x. This keeps Devanagari text crisp while avoiding unnecessarily large PDFs.


## v19 fixes
- Main Preset is hard-coded in js/app.js and appears as the default template selection.
- Main Preset settings use Name X 196, Y 56, size 24, width 420; Address X 246, Y 32, size 22, width 365; Noto Sans Devanagari Bold, left aligned, #7c1f31.
- Main Share PDF opens the custom Wedding Invitation Studio share panel first; native device sharing is only an option inside that panel.
- Text rendering uses a 3x high-resolution canvas to keep Devanagari crisp while reducing generated PDF size.
- Guest view remains a full-width invitation webpage rather than a small embedded PDF viewer.
