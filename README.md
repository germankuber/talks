# Talks

reveal.js slide decks, sharing one theme.

## Layout

```
themes/kuber.css                    shared theme, used by every deck
decks/<deck-name>/slides.html       one folder per talk
decks/<deck-name>/assets/           images for that talk
dist/<deck-name>/                   build output (gitignored)
```

Decks are authored as reveal.js `<section>` elements — the way the library
documents it. The build inlines them into a page and ships reveal's runtime
alongside; nothing is parsed or rewritten.

## Commands

```bash
pnpm dev                     # live preview at http://localhost:4444
pnpm new <deck-name>         # scaffold a new deck
pnpm build <deck-name>       # build one deck
pnpm build:all               # build every deck
```

`pnpm dev` rebuilds automatically when a deck or the theme changes.

## Writing slides

Each `<section>` is a slide. The deck is meant to be projected while you
speak, so the rule is **one beat per slide**: a title plus a few bullets, or
a single statement.

### Fragments

Anything with `class="fragment"` appears one step at a time, so content
builds up while you talk instead of landing all at once:

```html
<section>
  <h1>El Problema Oculto</h1>
  <ul>
    <li class="fragment">Todo agente tiene una <strong>carga cognitiva</strong></li>
    <li class="fragment">Más decisiones que tomar</li>
  </ul>
</section>
```

Enter a slide and only its heading shows; each arrow press reveals the next
fragment. Beat slides (`lead`, `divider`, `section`, `impact`) carry no
fragments — they are a single hit.

### Layout classes

| Class | Use |
| --- | --- |
| `lead` | title and closing slides, centered |
| `divider` | chapter divider with a section number |
| `section` | a single statement; a following `<h2>` renders as the "new" idea in green |
| `impact` | one word, dead center |
| `split` | two columns, wrapped in `<div class="cols">` |

### Flow diagrams

A vertical pipeline, revealed stage by stage:

```html
<div class="flow">
  <div class="fragment node">Conocimiento</div>
  <div class="fragment arrow">&#8595;</div>
  <div class="fragment node accent">Representación</div>
</div>
```

`accent` marks the final stage — the one that matters.

### Theme colors

CSS variables at the top of `themes/kuber.css`:

- `--accent` (blue) — headings, links, list markers
- `--accent-alt` (green) — the "new idea" in a contrast beat
- `--fg-muted` — the "old idea", de-emphasized text

Green means *this is the point*. Keep that consistent — using it for the old
idea in a contrast inverts the meaning.

Dark is the default. Press `T` or click the toggle for light. The OS
appearance setting is deliberately ignored: how a deck looks on the projector
should not depend on the laptop's preferences.

## Adding a new talk

```bash
pnpm new my-talk
```

Creates `decks/my-talk/` from a template already wired to the shared theme.
