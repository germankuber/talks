#!/usr/bin/env node
// Build one deck (or all of them) to HTML and PDF under dist/<deck>/.
//
//   pnpm build engineering-cognition      one deck
//   pnpm build:all                        every deck

import { readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const DECKS_DIR = 'decks';
const DIST_DIR = 'dist';

const listDecks = () =>
  readdirSync(DECKS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => existsSync(join(DECKS_DIR, name, 'slides.md')));

const args = process.argv.slice(2);
const buildAll = args.includes('--all');
const requested = args.filter((arg) => !arg.startsWith('--'));

const available = listDecks();

if (available.length === 0) {
  console.error(`No decks found. Expected ${DECKS_DIR}/<name>/slides.md`);
  process.exit(1);
}

let targets;
if (buildAll) {
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

const marp = (deck, outFile) =>
  execFileSync(
    'pnpm',
    [
      'exec',
      'marp',
      join(DECKS_DIR, deck, 'slides.md'),
      '-o',
      join(DIST_DIR, deck, outFile),
      '--allow-local-files',
    ],
    { stdio: 'inherit' },
  );

for (const deck of targets) {
  console.log(`\nBuilding ${deck}...`);
  marp(deck, 'slides.html');
  marp(deck, 'slides.pdf');
  console.log(`  -> ${join(DIST_DIR, deck)}/`);
}
