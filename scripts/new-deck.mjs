#!/usr/bin/env node
// Scaffold a new deck from the shared theme.
//
//   pnpm new my-talk-name

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const name = process.argv[2];

if (!name) {
  console.error('Usage: pnpm new <deck-name>');
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(name)) {
  console.error('Deck name must be kebab-case: lowercase letters, digits, dashes.');
  process.exit(1);
}

const dir = join('decks', name);

if (existsSync(dir)) {
  console.error(`Deck already exists: ${dir}`);
  process.exit(1);
}

const title = name
  .split('-')
  .map((word) => word[0].toUpperCase() + word.slice(1))
  .join(' ');

const template = `<section class="lead">
  <h1>${title}</h1>
  <h2>Subtitle</h2>
  <div class="byline">
  <p><strong>Germán Küber</strong></p>
  <p>@germankuber</p>
  </div>
</section>

<section class="divider">
  <h2>01</h2>
  <h1>First Section</h1>
</section>

<section>
  <h1>A regular slide</h1>
  <ul>
    <li class="fragment">One idea</li>
    <li class="fragment">Per bullet</li>
  </ul>
</section>

<section class="section">
  <h1>A single beat.</h1>
</section>

<section>
  <h1>A pipeline</h1>
  <div class="flow">
    <div class="fragment node">First</div>
    <div class="fragment arrow">&#8595;</div>
    <div class="fragment node accent">Last</div>
  </div>
</section>

<section class="impact">
  <h1>Word</h1>
</section>

<section class="lead">
  <h1>Gracias</h1>
  <h2>&#191;Preguntas?</h2>
</section>
`;

mkdirSync(join(dir, 'assets'), { recursive: true });
writeFileSync(join(dir, 'slides.html'), template);

console.log(`Created ${dir}/slides.html`);
console.log(`\n  pnpm dev              # then open http://localhost:4444/${name}/`);
console.log(`  pnpm build ${name}`);
