import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('repository contract files exist', () => {
  assert.equal(existsSync('README.md'), true);
  assert.equal(existsSync('.gitignore'), true);
});

test('build emits a single html file with inlined css, js, and templates', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /<style[\s>]/);
  assert.match(html, /<script[\s>]/);
  assert.match(html, /data-template="views\/setup"/);
  assert.match(html, /HueProTab/);
});
