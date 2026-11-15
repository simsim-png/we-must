# WE MUST — the universe (v3)

The site is one real-time 3D scene. The WE MUST monogram sits at the centre; four glass
spheres orbit it, one per service. Scrolling moves a single camera through the scenes like a
film; clicking a sphere flies the camera inside it and the sphere becomes the environment.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in build/client (+ sitemap.xml, 404.html)
npm run preview    # serve the build
npm run typecheck
```

French is served at `/`, English at `/en`. Add `?lite` to any URL to see the 2D fallback.

## The scenes

| # | Scene | Where |
| --- | --- | --- |
| 01 | Enter the universe: the monogram assembles, the horizon ignites | `/` before entering |
| 02 | The creative universe: core + four orbiting worlds (hover, click, drag) | `/#universe` |
| 03 | Service worlds: Branding, Shooting, Social media, Web & Apps | `/services/<id>` |
| 04 | Selected work: six campaigns on an arc, one per camera stop | `/#work` |
| 05 | About WE MUST: close on the monogram | `/#about` |
| 06 | Contact: the four worlds line up | `/#contact` |

Every world has its own URL, prerendered to HTML with its text, so it can be linked and
indexed. Old URLs (`/work`, `/about`, `/contact`, `/work/<slug>`) redirect to their scene.

## Stack

React 19 · TypeScript · Vite · React Router 7 (every page prerendered) · Tailwind CSS 4 ·
three.js · React Three Fiber · Drei · postprocessing · GSAP + ScrollTrigger · Motion · Zustand.

## Structure

```
app/
  experience/            the WebGL scene (its own lazy chunk, client only)
    Experience.tsx         canvas, quality tiers, frame-rate watch
    UniverseScene.tsx      composes everything below
    CentralCore.tsx        the monogram in 3D, the horizon light, the rings
    OrbitalSystem.tsx      orbits, drag-to-rotate, the lamps that follow a world
    ServiceSphere.tsx      one world in glass; lazy-loads its interior
    CameraController.tsx   the one camera: scroll path, opening, flight into a world
    ProjectShowcase.tsx    the gallery arc
    Atmosphere.tsx         lights, reflections, backdrop, dust
    Effects.tsx            bloom, colour fringe, vignette, grain
    worlds/                emblems + the four interiors (one chunk each)
    lib/                   shaders, canvas-drawn textures, logo geometry, per-world looks
  state/
    layout.ts              every camera position, orbit and timing curve, as plain numbers
    director.ts            timed transitions (opening, enter world, leave world)
    scroll.ts              ScrollTrigger: scroll → progress → scene
    store.ts / runtime.ts  UI state (React) and per-frame values (not React)
  components/
    hud/                   NavigationSystem, Loader, SphereLabels, PortalFlash, canvas host
    scenes/                text for scenes 01, 02, 04, 05, 06
    world/                 text for scene 03
    fallback/              the 2D universe for devices without WebGL
  content/                 services, campaigns, visuals, interface copy (FR + EN)
  routes/                  layout (the stage), home, world, legal pages, 404
```

To move a camera, change a number in `app/state/layout.ts`. To change wording, edit
`app/content/copy.ts` or `services.ts`. Brand colours live in `app/lib/palette.ts` (3D) and
the `@theme` block of `app/app.css` (interface); keep the two in step.

## Brand

Colours are the logo's: ink `#101116`, ivory `#F2EEE5`, cobalt `#304BFF` (plus the soft cobalt
`#7A8BFF` for small text on dark, and a warm amber used only inside the Shooting world, after
the lighting of WE MUST's own photographs). The 3D monogram is extruded from the traced logo;
rings and button cuts use the logo's 38.6° chevron angle.

Signature lines ("Enter the universe", scene titles, the contact headline) are in English on
both language versions; explanatory copy is translated. All of it is in `app/content/copy.ts`.

## Performance and accessibility

- The first paint is HTML and CSS only (about 110 kB of JS gzipped before the 3D chunk).
- Three tiers: full effects on capable desktops; no post-processing, fewer particles and a
  lower pixel ratio on phones and modest machines; a CSS-only universe when WebGL is missing.
- If the frame rate stays under 30 fps the scene drops its post-processing by itself.
- World interiors are separate chunks, fetched on hover or a few seconds after load.
- `prefers-reduced-motion`: no orbit drift, no parallax, flights become cross-fades.
- Every world and scene is reachable by keyboard: the sphere labels and the rail are real
  links and buttons, `Esc` leaves a world.
- If scripts fail, the scenes fall back to an ordinary readable page.

## Content rules

Nothing on the site is invented. The work shown is WE MUST's own campaigns as published on
Instagram; there are no made-up clients, results, testimonials or awards.

## Still needed from WE MUST

- **Original image files.** `public/visuals/*.jpg|avif` are the 512×640 thumbnails Instagram
  serves publicly; they are soft at the size the gallery shows them. Replace each file with
  the original export (1080×1350 or larger, same name) and update `w`/`h` in
  `app/content/visuals.ts`.
- **Client projects.** The gallery holds six stops (`WORK_COUNT` in `app/state/layout.ts`).
  Add real projects to `app/content/work.ts`.
- **Official wordmark SVG.** "WEMUST" is set in the display font until the file is supplied.
- **Email and WhatsApp.** Fill them in `app/lib/site.ts`; the buttons appear on their own.
- **Contact form.** Set `VITE_FORM_ENDPOINT` (see `.env.example`), e.g. a Formspree URL.
  Until then Instagram is the contact channel and no form is shown.
- **Production domain.** Confirm it in `app/lib/constants.ts` and `public/robots.txt`.
- **Legal pages.** Fill the bracketed fields in `app/routes/legal.tsx` and `privacy.tsx`.
- **Share image.** `public/media/og.jpg` is from the previous design.

## Deploy

The build is a static folder (`build/client`).

- **Vercel**: push to GitHub; `vercel.json` sets the build command, output folder, cache
  headers and redirects. Add `VITE_FORM_ENDPOINT` under Settings → Environment Variables.
- **Netlify**: `public/_redirects` does the same.
- Anywhere else: serve `build/client` and point unknown URLs at `404.html`.
