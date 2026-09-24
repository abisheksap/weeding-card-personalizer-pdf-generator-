# Wedding Invitation Studio

A local-first wedding invitation personalizer.

## Updated card template
- Replaced the previous card template with the newly supplied 3-page scan.
- Restored the same repeating pale-gold heart/leaf background language visible on Page 1 across all three card pages, including Pages 2 and 3. The restored pattern is part of the template PDF and remains visible in previews, downloads and shared PDFs.
- Kept the high-resolution scan artwork and improved page-1 contrast/sharpness.
- The raw uploaded scan is retained as `assets/card/wedding-invitation-source-scan.pdf`.

## New layout/template editor
- Drag the guest name and address directly on the page-1 preview.
- Adjust X/Y position, font size, text width, font family, weight, alignment and color.
- Save named layouts locally and load them later.
- Each generated invitation stores the layout used for that PDF.
- The restored pattern is included in the generated PDF on every page, including pages 2 and 3 where the scan is comparatively plain.
- Saved templates are included in ZIP backups.

## Run
Serve this folder from a local web server (for example `python -m http.server`) and open `index.html`.

### Shared cards
Cards shared through the Share PDF action are persisted in the Generated Cards store before the native share sheet opens. Shared records retain their PDF, name/address, layout/template information, and a shared timestamp, so they remain available from Generated Cards even when sharing is cancelled or the browser does not support native file sharing.

## Faster create/share/download workflow
- There is no separate Generate PDF button anymore.
- Enter the guest name and address; the live preview updates automatically.
- Tap Download PDF or Share PDF and the PDF is generated automatically, saved to Generated Cards, and then downloaded/shared.
- If you edit an existing card, Download/Share updates that same saved card instead of creating an extra copy.


## Vercel-friendly sharing
- The main name/address preset is remembered in `localStorage` on the current browser.
- Share PDF first tries the native PDF file share; if unavailable, it shares/copies a self-contained URL.
- The share URL carries the guest name, address, and current name/address layout so another device can open the personalized card without a server database.
- The site remains static and works on Vercel without API routes or a backend.
- The UI background now uses a layered, animated star-field effect while the original invitation artwork remains unchanged.


## Latest design
The invitation template uses a warm ivory background with a compact golden four-point star pattern that is masked away from the original pink artwork. The source PDF is `assets/card/final-template.pdf`.

## Sharing
The Share PDF button uses the device Web Share API when it can attach the generated PDF. On desktop or browsers without file sharing, it opens WhatsApp, Telegram, Facebook, X, Email and Copy Link options for the personalized invitation URL.


## Latest card/share behavior
- The original pink/red artwork is preserved; the old heart pattern is replaced only in the pale paper background with a restrained golden four-point star pattern.
- Shared links use `?invite=1` and open a guest-only invitation view rather than the personalizer.
- On supported mobile browsers, Share PDF uses the native file share sheet to send the actual PDF.
- Fallback social buttons share the guest-only invitation link.


## v14 visual/share update
- All three invitation pages use the same Page 1 golden-star spacing, scale, and warm ivory background treatment.
- Pages 2 and 3 use the cleaner source artwork with denoising/sharpening; decorative stars are masked away from dark/red text and artwork.
- Guest share links render a dedicated guest-only three-page viewer inside the same website instead of the browser PDF iframe.
- The personalizer share modal includes an Open guest view action, guest-only Copy link, native phone PDF sharing, and social/link fallbacks.


## Vercel guest route
Share links use `/invite?invite=1&card=...`; Vercel rewrites `/invite` to the same app shell, which then switches into the guest-only viewer. App shell and JavaScript are versioned and served with no-store headers to prevent stale service-worker deployments from hiding the guest view.
