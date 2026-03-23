import { readFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');

if (!html.includes('data-app="hueprotab"')) {
  throw new Error('Missing app marker');
}

if (!html.includes('data-template="views/setup"')) {
  throw new Error('Missing setup template');
}

if (!html.includes('Foundation build ready')) {
  throw new Error('Missing foundation status text');
}

console.log('dist/index.html looks valid');
