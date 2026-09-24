# Deploy to Vercel

1. Extract this ZIP.
2. Deploy the extracted folder as the Vercel project root.
3. `index.html` is the personalizer.
4. `/invite?invite=1&card=...` is rewritten by `vercel.json` to `guest.html` and cannot load the personalizer UI/code.
5. After deployment, generate a new Share Link from the personalizer and test it in an incognito window.

If Vercel/CDN shows an older build, redeploy once with a fresh deployment and hard-refresh the browser.
