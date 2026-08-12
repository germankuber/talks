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
| `impact` | one statement, dead center; add `class="plain"` to the `<h1>` to keep the line white and accent a single word with `<em>` |
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

### Architecture diagrams

`.flow` runs top to bottom. When a diagram needs to read left to right, come
back, or branch, write inline SVG with `class="arch"` instead. Colors come from
theme variables, so one drawing works in both themes, and every element is a
real DOM node — so `class="fragment"` on a `<g>` reveals that piece on its own.

```html
<svg class="arch" viewBox="0 0 900 200" role="img" aria-label="...">
  <defs>
    <marker id="head" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10" fill="var(--accent)"/>
    </marker>
  </defs>

  <g class="fragment node">
    <rect x="10" y="60" width="180" height="80" rx="8"/>
    <text x="100" y="105">Usuario</text>
  </g>

  <g class="fragment link">
    <path d="M 190 88 L 350 88" marker-end="url(#head)"/>
    <text x="272" y="76">pregunta</text>
  </g>
</svg>
```

| Class | Use |
| --- | --- |
| `node` | a box with a label |
| `node accent` | the piece this slide is about |
| `node sm` | a smaller box, for layers packed with several |
| `node gate` | a dashed box: a check beside the flow, not a step in it |
| `link` | an arrow, optionally labelled |
| `link back` | a dashed green return edge, for a feedback loop |
| `band` | a dashed frame grouping nodes into a named layer |

Rules that keep a diagram readable on a projector:

- **Each SVG needs its own `<marker>` id.** Sharing one across slides breaks
  the arrowheads if the slides are ever reordered.
- **An arrow's tail touches the box it leaves**; only the head keeps a ~10px
  gap so the marker has room. A few px of air at the tail reads as a floating
  line.
- **Split a long label across two lines** with `<tspan>` rather than shrinking
  it, so every node keeps the same type size.
- **Reveal what is new.** Once a diagram carries over from the previous slide,
  leave the familiar part visible and fragment only the pieces being added —
  and put an arrow in the same fragment as the box it points at.

### Tool stacks

`.stack` lays out a row of tools behind a chapter. Logos are monochrome SVGs
inheriting `currentColor`; anything without a usable mark falls back to its
name in the mono face at the same visual weight.

```html
<div class="stack">
  <div class="fragment tool accent"><img src="assets/logos/openai.svg" alt=""><span>OpenAI</span></div>
  <div class="fragment tool"><img src="assets/logos/anthropic.svg" alt=""><span>Anthropic</span></div>
  <div class="fragment tool text"><span>LiteLLM</span></div>
</div>
```

`tool text` is the no-logo variant; `tool accent` marks the one actually
reached for.

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
