#!/usr/bin/env node
// Serve built decks and rebuild whenever a deck or the theme changes.
//
//   pnpm dev        ->  http://localhost:4444

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, extname } from 'node:path';

const PORT = Number(process.env.PORT) || 4444;
const DIST_DIR = 'dist';
const DECKS_DIR = 'decks';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

const rebuild = () => {
  try {
    execFileSync('node', ['scripts/build.mjs', '--all'], { stdio: 'pipe' });
    console.log(`  rebuilt  ${new Date().toTimeString().slice(0, 8)}`);
  } catch (error) {
    console.error(`  build failed: ${error.message.split('\n')[0]}`);
  }
};

rebuild();

const decks = readdirSync(DECKS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

// Debounced: editors often fire several events for a single save.
let pending;
const onChange = () => {
  clearTimeout(pending);
  pending = setTimeout(rebuild, 120);
};

watch('themes', { recursive: true }, onChange);
watch(DECKS_DIR, { recursive: true }, onChange);

const listing = () => `<!doctype html>
<meta charset="utf-8">
<title>Decks</title>
<style>
  body { background:#0d1117; color:#e6edf3; font-family:-apple-system,sans-serif;
         padding:3rem; line-height:1.6; }
  h1 { letter-spacing:-0.03em; }
  a { color:#58a6ff; text-decoration:none; display:block; padding:0.5rem 0; }
</style>
<h1>Decks</h1>
${decks.map((d) => `<a href="/${d}/">${d}</a>`).join('\n')}
`;

createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);

  if (url === '/') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(listing());
  }

  let path = join(DIST_DIR, url);

  try {
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
  } catch {
    res.writeHead(404).end('Not found');
    return;
  }

  try {
    const body = await readFile(path);
    res.writeHead(200, {
      'content-type': TYPES[extname(path)] || 'application/octet-stream',
      // Decks are rebuilt in place; never let the browser hold a stale copy.
      'cache-control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(PORT, () => {
  console.log(`\n  http://localhost:${PORT}\n`);
  decks.forEach((d) => console.log(`  http://localhost:${PORT}/${d}/`));
  console.log('\n  watching decks/ and themes/ — Ctrl+C to stop\n');
});
