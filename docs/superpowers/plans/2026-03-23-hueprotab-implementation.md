# HueProTab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build HueProTab as a modular repository that compiles into a single dark-mode `dist/index.html` file for controlling Philips Hue lights, groups/zones, and scenes directly from Chrome on Windows 10 and Android.

**Architecture:** Use plain HTML/CSS/JavaScript source modules organized by responsibility, plus a tiny Node-based build step that inlines the modular source into one final deliverable. Keep runtime logic entirely client-side while separating discovery, pairing, Hue API access, UI rendering, and local-preference storage into clear boundaries so multiple agents can work in parallel.

**Tech Stack:** Vanilla HTML, CSS, JavaScript modules, Node.js build/test scripts, `node:test`, generated single-file HTML output.

---

## File Structure

### Files to create in the first implementation wave
- `package.json` — scripts for build/test/validate.
- `.gitignore` — ignore generated and local brainstorming/build artifacts where appropriate.
- `README.md` — developer instructions and user-oriented single-file output notes.
- `src/html/shell.html` — top-level app shell with mount points.
- `src/html/views/setup.html` — setup wizard markup.
- `src/html/views/dashboard.html` — dashboard structure and section placeholders.
- `src/html/views/settings.html` — preferences/settings shell.
- `src/html/components/quick-access.html` — quick access card container.
- `src/html/components/room-card.html` — room/group card template.
- `src/html/components/light-card.html` — light card template.
- `src/html/components/scene-card.html` — scene tile template.
- `src/css/tokens.css` — dark-mode tokens.
- `src/css/base.css` — reset/base typography.
- `src/css/layout.css` — responsive layout.
- `src/css/components/cards.css` — card visuals.
- `src/css/components/controls.css` — slider/buttons/chips.
- `src/css/components/color-picker.css` — color control styling.
- `src/js/app.js` — bootstrap and view composition.
- `src/js/config.js` — runtime constants and feature flags.
- `src/js/state/store.js` — app state container.
- `src/js/state/preferences.js` — browser storage wrapper.
- `src/js/services/discovery.js` — bridge discovery contract.
- `src/js/services/pairing.js` — pairing contract.
- `src/js/services/hue-client.js` — Hue API client contract.
- `src/js/ui/router.js` — simple view switching.
- `src/js/ui/render-setup.js` — setup UI rendering.
- `src/js/ui/render-dashboard.js` — dashboard UI rendering.
- `src/js/ui/components/quick-access.js` — quick access behavior.
- `src/js/ui/components/room-card.js` — room card behavior.
- `src/js/ui/components/light-card.js` — light card behavior.
- `src/js/ui/components/scene-card.js` — scene card behavior.
- `src/js/ui/components/color-picker.js` — color picker behavior.
- `scripts/build-single-html.mjs` — source-to-single-file builder.
- `scripts/validate-dist.mjs` — generated artifact checks.
- `tests/build/build-single-html.test.mjs` — build output tests.
- `tests/state/preferences.test.mjs` — local storage abstraction tests.
- `tests/ui/dashboard-shell.test.mjs` — dashboard rendering tests.
- `dist/index.html` — generated output; only touched by build/integration steps.

### Ownership boundaries for parallel agents
- **Foundation/build agent:** `package.json`, `.gitignore`, `scripts/*`, `tests/build/*`, initial `dist/index.html`
- **Frontend shell agent:** `src/html/shell.html`, `src/html/views/*`, `src/css/*`, `src/js/ui/router.js`
- **Hue platform agent:** `src/js/services/*`
- **State/preferences agent:** `src/js/state/*`, `tests/state/*`
- **Domain UI agent:** `src/html/components/*`, `src/js/ui/components/*`, `tests/ui/*`
- **Integration agent:** `src/js/app.js`, `src/js/ui/render-*.js`, final `dist/index.html`, README assembly notes

## Delivery Strategy

### Smart first-PR strategy
The first PR should be a **foundation PR**. Its purpose is to give every later agent a stable place to work without locking the team into messy ad hoc files.

The first PR should produce:
- a working build command
- a generated `dist/index.html`
- a dark-mode shell with placeholder sections
- a setup wizard skeleton
- stub service boundaries and fake data hooks
- tests proving the build and storage layers work

Do not wait for full Hue integration before opening the first PR. The first PR is successful if the repository has a disciplined shape and the single-file output contract is real.

### Parallel follow-up waves
After the foundation PR merges, multiple agents can work in parallel:
1. Hue setup/connectivity
2. dashboard/domain cards
3. personalization and quick options
4. integration and polish

## Tasks

### Task 1: Clean the repository and define the project contract

**Files:**
- Create: `.gitignore`
- Create: `README.md`
- Modify/Delete: `SUPERPOWERS_INSTALL.md` (remove if it is unrelated to the product direction)

- [ ] **Step 1: Write the failing contract test for repository expectations**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

test('repository contract files exist', () => {
  assert.equal(existsSync('README.md'), true);
  assert.equal(existsSync('.gitignore'), true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/build/build-single-html.test.mjs`
Expected: FAIL because the repo contract files and build tests do not exist yet.

- [ ] **Step 3: Create the repository contract files**

```gitignore
node_modules/
dist/
.superpowers/
```

```md
# HueProTab

Development sources compile into a single `dist/index.html` artifact.
```

- [ ] **Step 4: Run tests/build checks again**

Run: `node --test`
Expected: either PASS for the new repository-level tests or a smaller remaining failure surface.

- [ ] **Step 5: Commit**

```bash
git add .gitignore README.md tests package.json
git commit -m "chore: initialize HueProTab repository contract"
```

### Task 2: Establish the build pipeline that emits one HTML file

**Files:**
- Create: `package.json`
- Create: `scripts/build-single-html.mjs`
- Create: `scripts/validate-dist.mjs`
- Create: `tests/build/build-single-html.test.mjs`
- Create: `src/html/shell.html`
- Create: `src/css/tokens.css`
- Create: `src/js/app.js`
- Create: `dist/index.html`

- [ ] **Step 1: Write the failing build test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('build emits a single html file with inlined css and js', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /<style[\s>]/);
  assert.match(html, /<script[\s>]/);
  assert.match(html, /HueProTab/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/build/build-single-html.test.mjs -v`
Expected: FAIL because no build output exists yet.

- [ ] **Step 3: Implement the minimal build pipeline**

```js
// scripts/build-single-html.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const shell = readFileSync('src/html/shell.html', 'utf8');
const css = readFileSync('src/css/tokens.css', 'utf8');
const js = readFileSync('src/js/app.js', 'utf8');

const html = shell
  .replace('<!-- INLINE_CSS -->', `<style>${css}</style>`)
  .replace('<!-- INLINE_JS -->', `<script>${js}</script>`);

mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', html);
```

- [ ] **Step 4: Run build and tests**

Run: `node scripts/build-single-html.mjs && node --test tests/build/build-single-html.test.mjs -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json scripts src dist tests
git commit -m "build: generate single-file HueProTab artifact"
```

### Task 3: Create the dark-mode shell and responsive layout skeleton

**Files:**
- Modify: `src/html/shell.html`
- Create: `src/html/views/setup.html`
- Create: `src/html/views/dashboard.html`
- Create: `src/css/base.css`
- Create: `src/css/layout.css`
- Create: `src/css/components/cards.css`
- Create: `src/css/components/controls.css`
- Create: `src/js/ui/router.js`
- Create: `tests/ui/dashboard-shell.test.mjs`

- [ ] **Step 1: Write the failing dashboard shell test**

```js
test('dashboard shell exposes quick access, rooms, lights, and scenes sections', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /Quick Access/);
  assert.match(html, /Rooms/);
  assert.match(html, /Lights/);
  assert.match(html, /Scenes/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/ui/dashboard-shell.test.mjs -v`
Expected: FAIL because the shell does not yet include the dashboard sections.

- [ ] **Step 3: Implement the shell and responsive layout**

```html
<section data-section="quick-access"><h2>Quick Access</h2></section>
<section data-section="rooms"><h2>Rooms</h2></section>
<section data-section="lights"><h2>Lights</h2></section>
<section data-section="scenes"><h2>Scenes</h2></section>
```

```css
:root {
  color-scheme: dark;
  --bg: #0d1117;
  --panel: #161b22;
  --text: #e6edf3;
  --accent: #7c3aed;
}
```

- [ ] **Step 4: Rebuild and run tests**

Run: `node scripts/build-single-html.mjs && node --test tests/ui/dashboard-shell.test.mjs -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/css src/html src/js/ui tests/ui dist/index.html
git commit -m "feat: add responsive dark-mode dashboard shell"
```

### Task 4: Implement the setup wizard shell and connection-state contract

**Files:**
- Modify: `src/html/views/setup.html`
- Create: `src/js/services/discovery.js`
- Create: `src/js/services/pairing.js`
- Create: `src/js/services/hue-client.js`
- Create: `src/js/state/store.js`
- Create: `src/js/state/preferences.js`
- Create: `tests/state/preferences.test.mjs`

- [ ] **Step 1: Write the failing preferences test**

```js
test('preferences store persists bridge config and dashboard options', () => {
  const storage = createPreferencesStore(memoryStorage());
  storage.saveBridge({ id: 'bridge-1', ip: '192.168.1.2', appKey: 'abc' });
  assert.deepEqual(storage.loadBridge(), {
    id: 'bridge-1',
    ip: '192.168.1.2',
    appKey: 'abc'
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/state/preferences.test.mjs -v`
Expected: FAIL because the preferences module does not exist yet.

- [ ] **Step 3: Implement storage and service contracts**

```js
export function createPreferencesStore(storage = window.localStorage) {
  return {
    loadBridge() {
      return JSON.parse(storage.getItem('hueprotab.bridge') ?? 'null');
    },
    saveBridge(value) {
      storage.setItem('hueprotab.bridge', JSON.stringify(value));
    }
  };
}
```

```js
export async function discoverBridges() {
  return [];
}
```

- [ ] **Step 4: Run tests**

Run: `node --test tests/state/preferences.test.mjs -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/js/state src/js/services tests/state src/html/views/setup.html
git commit -m "feat: add setup wizard state and service contracts"
```

### Task 5: Build reusable domain card components with fake data

**Files:**
- Create: `src/html/components/quick-access.html`
- Create: `src/html/components/room-card.html`
- Create: `src/html/components/light-card.html`
- Create: `src/html/components/scene-card.html`
- Create: `src/js/ui/components/quick-access.js`
- Create: `src/js/ui/components/room-card.js`
- Create: `src/js/ui/components/light-card.js`
- Create: `src/js/ui/components/scene-card.js`
- Create: `src/js/ui/render-dashboard.js`

- [ ] **Step 1: Write the failing render test**

```js
test('dashboard renders fake pinned items and entity cards', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /Living Room/);
  assert.match(html, /Concentrate/);
  assert.match(html, /Ceiling Lamp/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/ui/dashboard-shell.test.mjs -v`
Expected: FAIL because placeholder entities are not rendered yet.

- [ ] **Step 3: Implement fake-data component rendering**

```js
export function renderLightCard(light) {
  return `<article class="light-card"><h3>${light.name}</h3></article>`;
}
```

- [ ] **Step 4: Rebuild and run tests**

Run: `node scripts/build-single-html.mjs && node --test tests/ui/dashboard-shell.test.mjs -v`
Expected: PASS with fake sample content visible in the generated artifact.

- [ ] **Step 5: Commit**

```bash
git add src/html/components src/js/ui/components src/js/ui/render-dashboard.js dist/index.html tests/ui
git commit -m "feat: add dashboard entity cards with fake data"
```

### Task 6: Add quick options, balanced default density, and color-control scaffolding

**Files:**
- Create: `src/css/components/color-picker.css`
- Create: `src/js/ui/components/color-picker.js`
- Modify: `src/html/components/light-card.html`
- Modify: `src/html/components/room-card.html`
- Modify: `src/html/components/scene-card.html`
- Modify: `src/js/ui/components/light-card.js`
- Modify: `src/js/ui/components/room-card.js`

- [ ] **Step 1: Write the failing interaction/render test**

```js
test('cards expose quick actions, recent colors, and expandable advanced controls', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /Recent colors/);
  assert.match(html, /Advanced controls/);
  assert.match(html, /All Off/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/ui/dashboard-shell.test.mjs -v`
Expected: FAIL because quick options and color scaffolding are missing.

- [ ] **Step 3: Implement minimal quick-option and color-control scaffolding**

```html
<div class="quick-actions">
  <button>All Off</button>
  <button>Warm White</button>
</div>
<div class="recent-colors" aria-label="Recent colors"></div>
<details>
  <summary>Advanced controls</summary>
</details>
```

- [ ] **Step 4: Rebuild and run tests**

Run: `node scripts/build-single-html.mjs && node --test tests/ui/dashboard-shell.test.mjs -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/css/components/color-picker.css src/js/ui/components/color-picker.js src/html/components src/js/ui/components dist/index.html tests/ui
git commit -m "feat: scaffold quick actions and color controls"
```

### Task 7: Integrate real Hue bridge connectivity behind the established contracts

**Files:**
- Modify: `src/js/services/discovery.js`
- Modify: `src/js/services/pairing.js`
- Modify: `src/js/services/hue-client.js`
- Modify: `src/js/app.js`
- Modify: `src/js/ui/render-setup.js`
- Modify: `src/js/ui/render-dashboard.js`
- Test: `tests/state/preferences.test.mjs`
- Test: `tests/ui/dashboard-shell.test.mjs`

- [ ] **Step 1: Write the failing service test or smoke fixture**

```js
test('discovery service returns normalized bridge records', async () => {
  const result = await discoverBridges(fetchStub);
  assert.deepEqual(result[0], {
    id: 'bridge-id',
    ip: '192.168.1.2',
    name: 'Hue Bridge'
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/state/preferences.test.mjs tests/ui/dashboard-shell.test.mjs -v`
Expected: FAIL because real normalization and wiring are not implemented yet.

- [ ] **Step 3: Implement minimal real integration**

```js
export async function discoverBridges(fetchImpl = fetch) {
  const response = await fetchImpl('DISCOVERY_ENDPOINT');
  const payload = await response.json();
  return payload.map((item) => ({
    id: item.id,
    ip: item.internalipaddress,
    name: item.name ?? 'Hue Bridge'
  }));
}
```

- [ ] **Step 4: Rebuild and run the targeted tests**

Run: `node scripts/build-single-html.mjs && node --test tests/state/preferences.test.mjs tests/ui/dashboard-shell.test.mjs -v`
Expected: PASS or clear narrowed failures for the remaining UI wiring.

- [ ] **Step 5: Commit**

```bash
git add src/js/services src/js/app.js src/js/ui dist/index.html tests
git commit -m "feat: connect Hue bridge services to setup and dashboard"
```

### Task 8: Integration handoff and release validation

**Files:**
- Modify: `README.md`
- Modify: `scripts/validate-dist.mjs`
- Modify: `dist/index.html`

- [ ] **Step 1: Write the failing release validation check**

```js
if (!html.includes('data-app="hueprotab"')) {
  throw new Error('Missing app marker');
}
```

- [ ] **Step 2: Run validation to verify it fails**

Run: `node scripts/validate-dist.mjs`
Expected: FAIL until the dist file and validation script align.

- [ ] **Step 3: Finalize README + validation + dist marker**

```js
console.log('dist/index.html looks valid');
```

- [ ] **Step 4: Run full checks**

Run: `npm test && npm run build && node scripts/validate-dist.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add README.md scripts/validate-dist.mjs dist/index.html
git commit -m "docs: finalize HueProTab release workflow"
```

## Execution Notes
- Keep generated `dist/index.html` out of hand-edited feature work whenever possible; regenerate it from source.
- Prefer fake data and contract tests early so UI and service agents can move independently.
- When two agents depend on the same generated file, have only the integration/build agent own the regeneration step to minimize merge noise.
- Delay visual micro-polish until the shell, setup flow, and data model are stable.
- Keep the user-facing artifact single-file at every major milestone so smoke testing always reflects the deployment shape.
