# Claude at Cogapp

Talk + slide deck on using Claude Code at Cogapp.

## Layout

- `slides/`: Astro deck (MDX slides, served at `localhost:4321`)
- `docs/claude-code-at-cogapp-developers-guide.md`: long-form developer guide

## Run the deck

```sh
cd slides
npm install
npm run dev
```

Open <http://localhost:4321>. Individual slides at `/slide/<slug>` where slug is the mdx filename (e.g. `/slide/day-one`).

## Build

```sh
cd slides
npm run build      # outputs to slides/dist/
npm run preview    # serve built deck
```

## Adding / reordering slides

1. Add `src/content/slides/<slug>.mdx` with frontmatter (`title`, optional `bg`, `align`, `section`, `notes`)
2. Insert slug in `src/content/order.ts` at desired position
3. URL is `/slide/<slug>`; position counter derived from index in `slideOrder`

## Stack

Astro 6, MDX, Tailwind v4, Node 22+.

## Deployment

Push to `main`: built + published to GitHub Pages via `.github/workflows/deploy.yml` (`withastro/action@v3`).

Live URL: <https://cogapplabs.github.io/claude-at-cogapp/>

`base: "/claude-at-cogapp"` set in `slides/astro.config.mjs`. Internal links go through `import.meta.env.BASE_URL`. Font URLs in `src/styles/global.css` are prefixed literally (`/claude-at-cogapp/fonts/...`).

If repo name changes or custom domain added: update `site` + `base` in `astro.config.mjs` and the font URL prefix in `global.css`.

GitHub repo settings, Pages, Source: GitHub Actions (one-time).
