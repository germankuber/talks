#!/usr/bin/env node
// Write dist/index.html: a landing page linking every built deck.

import { readdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST_DIR = 'dist';
const DECKS_DIR = 'decks';

// Pull the first heading out of a deck so the index shows its real title.
const readTitle = (deck) => {
  const source = join(DECKS_DIR, deck, 'slides.html');
  if (!existsSync(source)) return deck;
  const heading = readFileSync(source, 'utf8').match(/<h1[^>]*>(.*?)<\/h1>/s);
  return heading ? heading[1].replace(/<[^>]+>/g, '').trim() : deck;
};

const readSubtitle = (deck) => {
  const source = join(DECKS_DIR, deck, 'slides.html');
  if (!existsSync(source)) return '';
  const heading = readFileSync(source, 'utf8').match(/<h2[^>]*>(.*?)<\/h2>/s);
  return heading ? heading[1].replace(/<[^>]+>/g, '').trim() : '';
};

const escape = (text) =>
  text.replace(/[&<>"]/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char],
  );

const decks = existsSync(DIST_DIR)
  ? readdirSync(DIST_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((name) => existsSync(join(DIST_DIR, name, 'index.html')))
      .sort()
  : [];

const cards = decks
  .map((deck) => {
    const subtitle = readSubtitle(deck);
    return `      <li class="card">
        <a href="./${deck}/">
          <h2>${escape(readTitle(deck))}</h2>
          ${subtitle ? `<p>${escape(subtitle)}</p>` : ''}
        </a>
      </li>`;
  })
  .join('\n');

// Same mark the decks carry, kept in sync by hand — it is three lines of SVG.
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

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Talks — Germán Küber</title>
<link rel="icon" href="${FAVICON}">
<style>
  :root {
    --bg: #0d1117;
    --bg-alt: #161b22;
    --fg: #e6edf3;
    --fg-muted: #8b949e;
    --accent: #58a6ff;
    --border: #30363d;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: clamp(2rem, 6vw, 5rem);
    background: var(--bg);
    color: var(--fg);
    font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
  }
  header { margin-bottom: 3rem; }
  h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    letter-spacing: -0.03em;
    margin: 0 0 0.3rem;
  }
  header p { color: var(--fg-muted); margin: 0; }
  header a { color: var(--accent); text-decoration: none; }
  ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 1rem; }
  .card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    background: var(--bg-alt);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
    transition: border-color 0.15s;
  }
  .card:hover { border-color: var(--accent); }
  .card > a:first-child { text-decoration: none; color: inherit; flex: 1; }
  .card h2 { margin: 0; font-size: 1.25rem; letter-spacing: -0.02em; }
  .card p { margin: 0.2rem 0 0; color: var(--fg-muted); font-size: 0.95rem; }
  .pdf {
    color: var(--accent);
    text-decoration: none;
    font-size: 0.8rem;
    font-family: ui-monospace, Menlo, monospace;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.35rem 0.7rem;
    white-space: nowrap;
  }
  .pdf:hover { border-color: var(--accent); }
  .empty { color: var(--fg-muted); }
</style>
</head>
<body>
  <header>
    <h1>Talks</h1>
    <p>Germán Küber — <a href="https://github.com/germankuber">@germankuber</a></p>
  </header>
  <main>
${decks.length ? `    <ul>\n${cards}\n    </ul>` : '    <p class="empty">No decks published yet.</p>'}
  </main>
</body>
</html>
`;

writeFileSync(join(DIST_DIR, 'index.html'), html);
console.log(`Wrote ${DIST_DIR}/index.html (${decks.length} deck${decks.length === 1 ? '' : 's'})`);
