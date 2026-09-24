# Wedding Invitation Studio v21

Vercel-ready wedding invitation personalizer with a code-defined Main Preset, three-page golden-star invitation template, lightweight PDF generation, and a separate guest-only route.

## Guest route
Share links use `/invite?invite=1&card=...`. Vercel rewrites `/invite` to `guest.html`, which contains **no personalizer/editor code**. The guest route only accepts a card payload and renders the invitation viewer. The personalizer remains at `/`.

This is route isolation, not authentication: because the app is a public static website, a determined visitor can still type the public personalizer URL manually. If you need the editor itself to require login/password, add authentication at the hosting layer.

## Deploy
Deploy the contents of this folder as the Vercel project root. No nested folder is required.
