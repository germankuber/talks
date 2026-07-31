# Presentations

Marp slide decks, sharing one theme.

## Layout

```
themes/kuber.css                    shared theme, used by every deck
decks/<deck-name>/slides.md         one folder per talk
decks/<deck-name>/assets/           images for that talk
dist/<deck-name>/                   build output (gitignored)
```

Decks pick the theme in their frontmatter with `theme: kuber`. The theme lives
in one place, so a change to it applies to every deck.

## Commands

```bash
pnpm dev                     # live preview at http://localhost:4444
pnpm new <deck-name>         # scaffold a new deck
pnpm build <deck-name>       # build one deck to HTML + PDF
pnpm build:all               # build every deck
```

With the dev server running, open `http://localhost:4444/<deck-name>/slides.md`.
Edits reload automatically.

## Writing slides

Slides are separated by `---`. The deck is meant to be projected while you
speak, so the rule is **one beat per slide**: a title plus a few bullets, or a
single statement. If a slide needs a build-up, split it into several slides
rather than stacking lines.

### Layout classes

Set with a comment directly above the slide content:

| Class | Use |
| --- | --- |
| `lead` | title and closing slides, centered |
| `divider` | chapter divider with a section number |
| `section` | a single statement; a following `##` renders as the "new" idea in green |
| `impact` | one word, dead center |
| `split` | two columns — wrap them in `<div class="cols"><div>…</div><div>…</div></div>` |

```markdown
<!-- _class: section -->

# No modeles agentes.

## Modelá decisiones.
```

Per-slide directives use the `_` prefix and apply to that slide only:
`_paginate: false`, `_footer: ''`.

### Theme colors

Defined as CSS variables at the top of `themes/kuber.css`:

- `--accent` (blue) — headings, links, list markers
- `--accent-alt` (green) — the "new idea" in a contrast beat
- `--fg-muted` — the "old idea", de-emphasized text

Green means *this is the point*. Keep that consistent — using it for the old
idea in a contrast inverts the meaning.

## Adding a new talk

```bash
pnpm new my-talk
```

Creates `decks/my-talk/` from a template already wired to the shared theme.
