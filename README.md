# WeMust — website

Creative direction: **L'Horizon**. The gap between the M and the W of the monogram becomes the
site's main graphic device. It shows up as the horizon line under headlines, the ivory/cobalt page
transition, the split wordmark in the footer, and the hero footage's water line.

## Stack

React 19 · TypeScript · Vite · React Router 7 (all routes prerendered to static HTML) ·
Tailwind CSS 4 · Motion · Lenis · Lucide.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in build/client (+ sitemap.xml)
npm run preview    # serve the build
npm run typecheck
```

French is served at `/`, English at `/en`. Slugs are the same in both languages.

## Where things live

| What | File |
| --- | --- |
| Business details (WhatsApp, email, budget ranges) | `app/lib/site.ts` |
| Production domain | `app/lib/constants.ts` (also update `public/robots.txt`) |
| Services copy, FR/EN | `app/content/services.ts` |
| Process steps | `app/content/process.ts` |
| Portfolio projects | `app/content/work.ts` |
| Higgsfield videos | `app/content/media.ts` + files in `public/media/` |
| Brand colours, type, utilities | `app/app.css` |

## Content still needed (placeholders are visible on the site until filled)

- **Portfolio**: add real projects to `app/content/work.ts`. Each project gets a prerendered page at `/work/<slug>`.
- **Team**: portraits, names and roles in `app/routes/about.tsx`.
- **WhatsApp number and email**: `app/lib/site.ts`. The mobile WhatsApp button appears once a number is set.
- **Contact form**: set `VITE_FORM_ENDPOINT` (see `.env.example`), e.g. a Formspree endpoint.
- **Legal pages**: fill in the bracketed fields in `app/routes/legal.tsx` and `privacy.tsx`, then have a lawyer review them.
- **Hero video**: the hero currently shows a still poster (studio keyframe v1, `public/media/hero-poster.*`).
  The share image `public/media/og.jpg` is cropped from the same still. Replace both when the final loop exists.
- **Wordmark**: the footer wordmark is set in Archivo. Swap in the official SVG when available.

## Adding a Higgsfield video

1. Encode the master (commands are in the creative direction document):
   `hero-1080.webm`, `hero-1080.mp4`, `hero-720x1280.mp4`, `hero-poster.avif`.
2. Put them in `public/media/`.
3. Fill in the entry in `app/content/media.ts`:

```ts
"H-01": {
  tone: "horizon",
  poster: "/media/hero-poster.avif",
  video: { webm: "/media/hero-1080.webm", mp4: "/media/hero-1080.mp4" },
  mobile: "/media/hero-720x1280.mp4",
},
```

The poster loads first. The video loads only when it scrolls into view, and never for visitors
with reduced motion or Save-Data turned on.

## Deploying

The build is a static folder (`build/client`). On Netlify, `public/_redirects` already sends
unknown URLs to the in-app 404 page with a real 404 status. On other hosts, point 404s at
`__spa-fallback.html`.
