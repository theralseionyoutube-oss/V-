# V+ — Marketing Website

A single-page marketing site for the V+ Minecraft client, built as plain HTML, CSS and JavaScript. No build step, no dependencies.

## Run locally

```powershell
python -m http.server 3000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:3000/>.

Any static file server works — for example `npx serve .` or the VS Code Live Server extension.

## Structure

```
index.html          All page markup (sections, inline SVG icon sprite)
css/styles.css      Design system, mockups, responsive rules
js/main.js          Mobile menu, scroll reveals, bot selector, stat counters, FAQ
assets/fonts/       Self-hosted Poppins and Pixelify Sans (woff2)
```

## Notes

- All graphics (GUI mockups, launcher, gamemode art, logos) are pure HTML/CSS/SVG — there are no images or videos to load.
- `?static` in the URL disables scroll animations and fixes the stat numbers, which is handy for screenshots.
- Deploy by uploading the folder as-is to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages).
