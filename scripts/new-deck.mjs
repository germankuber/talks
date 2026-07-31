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

const template = `---
marp: true
theme: kuber
paginate: true
size: 16:9
footer: '${title}'
---

<!-- _class: lead -->
<!-- _paginate: false -->
<!-- _footer: '' -->

# ${title}

## Subtitle

<div class="byline">

**Germán Küber**
@germankuber

</div>

---

<!-- _class: divider -->
<!-- _paginate: false -->

## 01

# First Section

---

# A regular slide

- One idea
- Per bullet

---

<!-- _class: section -->

# A single beat.

---

<!-- _class: impact -->
<!-- _footer: '' -->
<!-- _paginate: false -->

# Word

---

<!-- _class: lead -->
<!-- _footer: '' -->

# Gracias

## ¿Preguntas?
`;

mkdirSync(join(dir, 'assets'), { recursive: true });
writeFileSync(join(dir, 'slides.md'), template);

console.log(`Created ${dir}/slides.md`);
console.log(`\n  pnpm dev              # then open http://localhost:4444/${name}/slides.md`);
console.log(`  pnpm build ${name}`);
