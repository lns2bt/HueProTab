import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const runtimeFiles = [
  'src/js/config.js',
  'src/js/services/discovery.js',
  'src/js/services/pairing.js',
  'src/js/services/hue-client.js',
  'src/js/state/store.js'
];

function loadRuntime() {
  const context = vm.createContext({
    console,
    setTimeout,
    clearTimeout
  });

  context.window = context;
  context.globalThis = context;

  for (const relativePath of runtimeFiles) {
    const source = readFileSync(path.join(process.cwd(), relativePath), 'utf8');
    vm.runInContext(source, context, { filename: relativePath });
  }

  return context.HueProTab;
}

test('discovery supports manual bridge fallback and normalizes the IP', () => {
  const HueProTab = loadRuntime();
  const result = HueProTab.services.discovery.discover({ manualIp: ' 10.0.0.24 ' });

  assert.equal(result.status, 'found');
  assert.equal(result.source, 'manual');
  assert.equal(result.manualEntry, true);
  assert.equal(result.bridges[0].ip, '10.0.0.24');
  assert.match(result.bridges[0].id, /manual-10-0-0-24/);
});

test('pairing returns a deterministic demo app key after the bridge is selected', () => {
  const HueProTab = loadRuntime();
  const discovery = HueProTab.services.discovery.discover();
  const bridge = discovery.bridges[0];
  const result = HueProTab.services.pairing.begin({ bridge, appName: HueProTab.config.appName });

  assert.equal(result.status, 'linked');
  assert.equal(result.bridge.name, 'Living Room Bridge');
  assert.equal(result.appKey, 'hueprotab-bridgedemo001');
});

test('hue client returns a summarized dashboard snapshot for the selected bridge', () => {
  const HueProTab = loadRuntime();
  const bridge = HueProTab.services.discovery.discover().bridges[0];
  const snapshot = HueProTab.services.hueClient.fetchSnapshot({ bridge });
  const state = HueProTab.updateHuePlatformState({
    discoveryResult: HueProTab.services.discovery.discover(),
    pairingResult: HueProTab.services.pairing.begin({ bridge }),
    snapshotResult: snapshot
  });

  assert.equal(snapshot.status, 'ready');
  assert.equal(snapshot.summary.lightCount, 3);
  assert.equal(snapshot.summary.lightsOn, 2);
  assert.equal(snapshot.summary.roomCount, 2);
  assert.equal(snapshot.summary.sceneCount, 3);
  assert.equal(state.setup.bridgeName, 'Living Room Bridge');
  assert.equal(state.snapshotSummary.lightCount, 3);
});
