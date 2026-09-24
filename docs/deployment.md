# Deployment

Vercel hosts the Next.js app, including its API routes. The repository's
`vercel.json` selects Next.js and runs `npm ci` followed by `npm run build`.
The build script uses Webpack for the Serwist service worker.

GitHub Actions runs lint and a production build on Linux for pushes to main
and pull requests. GitHub Pages must use the **GitHub Actions** source instead
of the legacy branch/Jekyll source; no Pages publishing workflow is provided.
This app requires server API routes and cannot be deployed as a Jekyll site.

Python virtual environments are machine-specific and must not be committed.
Run `npm run tts:setup` locally to create the speech service's `.venv` and download
its models. `.vercelignore` excludes the local speech service from Vercel uploads.

Cloud lesson generation requires a server-side `GEMINI_API_KEY` in Vercel's
project environment settings. This key is not needed to compile the app.
After changing environment variables, redeploy the affected environment.
