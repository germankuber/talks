#!/usr/bin/env node
// Build decks into self-contained reveal.js pages under dist/<deck>/.
//
//   pnpm build <deck-name>     one deck
//   pnpm build:all             every deck
//
// Decks are authored as reveal.js HTML sections, which is what the library
// documents: fragments and slide classes are written directly on the markup.
// This build only inlines them and ships the runtime alongside.

import {
  writeFileSync,
  readFileSync,
  mkdirSync,
  readdirSync,
  existsSync,
  cpSync,
} from 'node:fs';
import { join } from 'node:path';

const DECKS_DIR = 'decks';
const DIST_DIR = 'dist';
const THEME = 'themes/kuber.css';
const REVEAL_DIST = 'node_modules/reveal.js/dist';

const listDecks = () =>
  readdirSync(DECKS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => existsSync(join(DECKS_DIR, name, 'slides.html')));

// Inlined as a data URI so a deck stays self-contained: no extra request, and
// the mark scales to whatever size the browser asks for.
const FAVICON =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
      `<rect width="64" height="64" rx="12" fill="#0d1117"/>` +
      `<text x="32" y="44" text-anchor="middle" fill="#58a6ff"` +
      ` font-family="ui-monospace,Menlo,monospace" font-size="34"` +
      ` font-weight="700">GK</text>` +
      `</svg>`,
  );

const page = (deck, slides) => `<!doctype html>
<html lang="es" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${deck}</title>
<link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="reveal/reveal.css">
<link rel="stylesheet" href="theme.css">
</head>
<body>
<button id="theme-toggle" type="button" title="Toggle light/dark (T)">&#9689;</button>
<div class="reveal">
  <div class="slides">
${slides}
  </div>
</div>
<script>
  (() => {
    // Dark unless the presenter explicitly chose light. Deliberately ignores
    // the OS setting: how a deck looks on the projector must not depend on
    // the laptop's appearance preference.
    document.documentElement.dataset.theme =
      localStorage.getItem('deck-theme') || 'dark';

    const toggle = () => {
      const next =
        document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('deck-theme', next);
    };

    addEventListener('DOMContentLoaded', () => {
      document.getElementById('theme-toggle').addEventListener('click', toggle);
    });

    addEventListener('keydown', (e) => {
      // reveal owns most keys; T is free and does not clash with navigation.
      if (e.key === 't' || e.key === 'T') toggle();
    });
  })();
</script>
<script type="module">
  import Reveal from './reveal/reveal.mjs';
  import Notes from './reveal/plugin/notes.mjs';
  import Highlight from './reveal/plugin/highlight.mjs';

  Reveal.initialize({
    plugins: [Notes, Highlight],
    hash: true,
    slideNumber: 'c/t',
    transition: 'slide',
    width: 1280,
    height: 720,
    margin: 0.04,
  });

  // reveal 6 is an ES module, so nothing lands on window by default.
  window.Reveal = Reveal;
</script>
</body>
</html>
`;

const build = (deck) => {
  const outDir = join(DIST_DIR, deck);
  mkdirSync(outDir, { recursive: true });

  cpSync(REVEAL_DIST, join(outDir, 'reveal'), { recursive: true });
  cpSync(THEME, join(outDir, 'theme.css'));

  const assets = join(DECKS_DIR, deck, 'assets');
  if (existsSync(assets)) {
    cpSync(assets, join(outDir, 'assets'), { recursive: true });
  }

  // Slides are authored as reveal's own HTML — fragments and slide classes
  // written directly, exactly as the library documents. Nothing is parsed or
  // rewritten here; the sections are inlined into the page as-is.
  const slides = readFileSync(join(DECKS_DIR, deck, 'slides.html'), 'utf8');
  writeFileSync(join(outDir, 'index.html'), page(deck, slides));

  console.log(`  ${deck} -> ${outDir}/`);
};

const args = process.argv.slice(2);
const available = listDecks();

if (available.length === 0) {
  console.error(`No decks found. Expected ${DECKS_DIR}/<name>/slides.html`);
  process.exit(1);
}

const requested = args.filter((arg) => !arg.startsWith('--'));
let targets;

if (args.includes('--all')) {
  targets = available;
} else if (requested.length > 0) {
  const unknown = requested.filter((name) => !available.includes(name));
  if (unknown.length > 0) {
    console.error(`Unknown deck(s): ${unknown.join(', ')}`);
    console.error(`Available: ${available.join(', ')}`);
    process.exit(1);
  }
  targets = requested;
} else if (available.length === 1) {
  targets = available;
} else {
  console.error('Multiple decks found — name one, or pass --all:');
  available.forEach((name) => console.error(`  pnpm build ${name}`));
  process.exit(1);
}

console.log('Building:');
targets.forEach(build);
