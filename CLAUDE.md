# Claude at Cogapp

Talk + slide deck on using Claude Code at Cogapp.

Live: <https://cogapplabs.github.io/claude-at-cogapp/>

## Repo layout

- `slides/`: Astro deck (source of truth for talk content)
- `docs/claude-code-at-cogapp-developers-guide.md`: long-form companion guide
- `docs/audit.md`: previous content audit findings (internal artefact, contains em-dashes)
- `.github/workflows/deploy.yml`: GH Pages build via `withastro/action@v3`

## Slide system

- Stack: Astro 6, MDX, Tailwind v4, React (for one component), Node 22+
- Slide content: `slides/src/content/slides/<slug>.mdx`
- Order + presence controlled by `slides/src/content/order.ts` (`slideOrder` array of slugs)
- A file in `content/slides/` not listed in `order.ts` is **not** rendered
- Routing: `slides/src/pages/slide/[slug].astro` builds one route per slug
- URL: `/slide/<slug>` (slug = mdx filename minus `.mdx`)
- Position counter (`N / total`) derived from index in `slideOrder`
- Prev/Next nav, arrow keys, PageUp/PageDown, Home/End all work in slug terms
- Spacebar does NOT advance slides (preserves page scroll for a11y)

### Frontmatter schema (`slides/src/content.config.ts`)

```yaml
title: string                 # required
bg: cream|slate|pink|green|purple|blue|white   # default cream
align: start|center|end       # default start
section: string               # optional, shown as kicker
notes: string                 # optional speaker notes
docs:                         # optional References block at slide foot
  - label: Skills
    href: https://code.claude.com/docs/en/skills
  # or bare URL string; or single URL string instead of array
```

References block renders as a collapsible `<details>` at slide foot.

### Adding a slide

1. Create `slides/src/content/slides/<slug>.mdx` with frontmatter
2. Insert `"<slug>"` into `slideOrder` at desired position in `order.ts`

### Reordering

Move slug lines in `order.ts`. URLs stay stable (slug-based).

## Components available in MDX

- `TwoCol.astro`: side-by-side grid (`ratio="1-1"|"2-1"|"1-2"`). Cells use `minmax(0,1fr)` + `overflow-hidden` to stay rigid regardless of content.
- `Terminal.astro`: macOS-style terminal frame. Static text only. Props: `title`, `text`, optional `class`.
- `Terminal.tsx`: animated React variant (TypeAnimation). Avoid for layout-sensitive slides; mount swing causes width spikes.
- `Bullets.astro`, `Footnote.astro`, `Title.astro`, `Slide.astro`: see `slides/src/components/`.

## Accessibility

- Each slide gets `<h1 class="sr-only">{title}</h1>` for proper page hierarchy
- Progress bar has `role="progressbar"` + aria-valuenow/min/max
- Counter has `aria-label="Slide N of M"`, glyph spans aria-hidden
- Global `:focus-visible` outline (`var(--color-focus)`)
- `prefers-reduced-motion` disables all transitions
- External links: `rel="noopener noreferrer"` + sr-only "(opens in new tab)"
- Bullets `<ul>` has explicit `role="list"`

## Deployment

Push to `main`: builds + publishes to GH Pages automatically.

`base: "/claude-at-cogapp"` set in `slides/astro.config.mjs`. Internal links use `import.meta.env.BASE_URL`. Font URLs in `src/styles/global.css` are prefixed literally (`/claude-at-cogapp/fonts/...`).

If repo name changes or custom domain added: update `site` + `base` in `astro.config.mjs` and font URL prefix in `global.css`.

## Dev

```sh
cd slides
npm install
npm run dev      # localhost:4321/claude-at-cogapp/ (user runs, not Claude)
npm run build
npm run preview
```

Don't start the dev server from Claude. User runs it.

## Conventions

- Don't hand-edit `package.json` for deps. Use `npm install <pkg>`.
- Biome v2 for any JS/TS lint/format if added. No ESLint/Prettier.
- Keep slides terse: title + ~5 bullets max. Talk fills the rest.
- No em-dashes in slide copy, README, or CLAUDE.md. Use full stop, comma, colon, or hyphen instead.
- Don't introduce React for new slides unless needed. Static Astro components preferred (no hydration cost, no width swing).
- **No client refs.** Repo is public. Use generic placeholders (`client_name`, `example.com`) instead of real client/project names (NTS, TMS, TRS, etc). Sweep new content for client names before commit.
- `<meta name="robots" content="noindex, nofollow">` is set on every page; `slides/public/robots.txt` denies all crawlers. Public repo, but search engines skip it.
