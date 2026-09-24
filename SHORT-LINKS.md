# Compact invitation links

This version no longer calls TinyURL or any external URL shortener, so there is no 7-second redirect/wait.

The personalizer creates a compact URL directly on the Vercel domain:

`/i/<token>`

The token contains the invitation data in a gzip-compressed, URL-safe payload. Vercel rewrites `/i/*` to `guest.html`, which decodes the token immediately in the browser.

This keeps the link much shorter than the previous full `?card=...` URL and avoids an external redirect service.

The guest viewer also no longer rerenders on ordinary `resize` events because mobile browsers can emit resize while the address bar collapses during scrolling. It only re-renders after a real orientation change.
