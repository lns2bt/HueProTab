(function bootstrapHueProTab(global) {
  const app = global.HueProTab || {};
  const root = document.querySelector('#app-root');
  const status = document.querySelector('[data-build-status]');

  if (!root || !status) {
    return;
  }

  const orderedViews = (app.config?.views ?? []).map((name) => {
    return document.querySelector(`template[data-template="${name}"]`)?.innerHTML ?? '';
  });

  root.innerHTML = orderedViews.join('\n');

  const discoveryResult = app.services?.discovery?.discover() || { bridges: [] };
  const bridge = discoveryResult.bridges?.[0] || null;
  const pairingResult = app.services?.pairing?.begin({ bridge, appName: app.config?.appName }) || { status: 'idle' };
  const snapshotResult = app.services?.hueClient?.fetchSnapshot({ bridge }) || { summary: app.state?.snapshotSummary };
  const state = app.updateHuePlatformState?.({ discoveryResult, pairingResult, snapshotResult }) || app.state;

  const bridgeNameNode = root.querySelector('[data-bridge-name]');
  const bridgeIpNode = root.querySelector('[data-bridge-ip]');
  const discoverySourceNode = root.querySelector('[data-discovery-source]');
  const pairingStatusNode = root.querySelector('[data-pairing-status]');
  const dashboardSummaryNode = root.querySelector('[data-dashboard-summary]');

  if (bridgeNameNode) {
    bridgeNameNode.textContent = state.setup.bridgeName;
  }

  if (bridgeIpNode) {
    bridgeIpNode.textContent = state.setup.bridgeIp;
  }

  if (discoverySourceNode) {
    discoverySourceNode.textContent = state.setup.discoverySource;
  }

  if (pairingStatusNode) {
    pairingStatusNode.textContent = state.setup.pairingStatus;
  }

  if (dashboardSummaryNode) {
    dashboardSummaryNode.textContent = `${state.snapshotSummary.roomCount} rooms • ${state.snapshotSummary.lightCount} lights (${state.snapshotSummary.lightsOn} on) • ${state.snapshotSummary.sceneCount} scenes`;
  }

  status.textContent = `${state.setup.bridgeName} ready • ${state.snapshotSummary.lightCount} lights loaded`;
})(typeof window !== 'undefined' ? window : globalThis);
