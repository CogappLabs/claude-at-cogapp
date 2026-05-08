# Claude at Cogapp

Talk + slide deck on using Claude Code at Cogapp.

## Repo layout

- `slides/`: Astro deck (source of truth for talk content)
- `docs/claude-code-at-cogapp-developers-guide.md`: long-form companion guide

## Slide system

- Stack: Astro 6, MDX, Tailwind v4
- Slide content: `slides/src/content/slides/<slug>.mdx`
- Order + presence controlled by `slides/src/content/order.ts` (`slideOrder` array of slugs)
- A file in `content/slides/` not listed in `order.ts` is **not** rendered
- Routing: `slides/src/pages/slide/[slug].astro` builds one route per slug; URL is `/slide/<slug>` (slug = mdx filename minus `.mdx`)
- Position counter (`N / total`) derived from index in `slideOrder`
- Prev/Next nav, arrow keys, Home/End all work in slug terms

### Frontmatter schema (`slides/src/content.config.ts`)

```yaml
title: string                 # required
bg: cream|slate|pink|green|purple|blue|white   # default cream
align: start|center|end       # default start
section: string               # optional, shown as kicker
notes: string                 # optional speaker notes
docs:                         # optional References block at slide foot
  - label: Slash commands
    href: https://docs.claude.com/en/docs/claude-code/slash-commands
  # or bare URL string; or single URL string instead of array
```

### Adding a slide

1. Create `slides/src/content/slides/<slug>.mdx` with frontmatter
2. Insert `"<slug>"` into `slideOrder` at desired position in `order.ts`

### Reordering

Move slug lines in `order.ts`. URLs stay stable (slug-based).

## Components available in MDX

`Slide`, `Bullets`, `TwoCol`, `Footnote`, `Title`. See `slides/src/components/`.

## Dev

```sh
cd slides
npm install
npm run dev      # localhost:4321 (user runs, not Claude)
npm run build
npm run preview
```

Don't start the dev server from Claude. User runs it.

## Conventions

- Don't hand-edit `package.json` for deps. Use `npm install <pkg>`.
- Biome v2 for any JS/TS lint/format if added (no ESLint/Prettier).
- Keep slides terse: title + ~5 bullets max. Talk fills the rest.
- No em-dashes in slide copy or docs.
