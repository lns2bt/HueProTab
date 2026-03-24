import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('dashboard shell exposes quick access, rooms, lights, and scenes sections', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /data-section="quick-access"/);
  assert.match(html, /data-section="rooms"/);
  assert.match(html, /data-section="lights"/);
  assert.match(html, /data-section="scenes"/);
});

test('setup and dashboard templates include Hue platform summary placeholders', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /data-bridge-name/);
  assert.match(html, /data-pairing-status/);
  assert.match(html, /data-dashboard-summary/);
  assert.match(html, /Living Room Bridge/);
});

test('shell includes topbar status and primary actions', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /data-build-status/);
  assert.match(html, /data-action="refresh"/);
  assert.match(html, /data-action="settings"/);
});
