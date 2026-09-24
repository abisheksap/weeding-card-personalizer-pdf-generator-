Wedding Invitation Studio v29

This build fixes the share-button flow and is a complete Vercel project.

Important: upload the CONTENTS of this folder as the Vercel project root. index.html, guest.html, vercel.json, js/, css/, and assets/ must be directly at the root.

The live URL previously reported was serving an older v13 deployment; the v29 footer/template marker is included so you can verify the new deployment.

Share behavior:
- Share PDF: native device share sheet when supported, with download fallback.
- Share Link: native device share sheet when supported; desktop fallback opens the app share panel.
- Copy Link remains available.
- Share errors are caught and surfaced instead of silently failing.
