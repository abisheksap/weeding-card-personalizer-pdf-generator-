# Wedding Invitation Studio v19

## Deploy to Vercel
Upload the contents of this folder as the Vercel project root. `index.html` and `vercel.json` must be at the root.

## Main Preset
The Main Preset is hard-coded in `js/app.js` under `MAIN_PRESET`. It is not stored in localStorage or IndexedDB and appears as the default template in the editor.

Current settings:
- Name: X 196, Y 56, Size 24, Width 420
- Address: X 246, Y 32, Size 22, Width 365
- Font: Noto Sans Devanagari
- Weight: Bold
- Align: Left
- Color: #7c1f31

## Sharing
Clicking **Share PDF** opens the site's custom share panel first. It does not immediately open the browser/Windows native share dialog. The panel includes Copy Link, WhatsApp, Telegram, Facebook, X, Email, Open Guest View, Download PDF, and an optional native device share action.

The guest link uses `/invite?invite=1&card=...` and opens the full Wedding Invitation Studio guest viewer, not the personalizer and not a small embedded PDF viewer.

## PDF size
The bundled 3-page template is approximately 3.2 MB. Personalized name/address text is rendered at 3x resolution to keep Devanagari crisp while avoiding the much larger files produced by the earlier 4x/oversized build.
