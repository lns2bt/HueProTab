(function initStateStore(global) {
  const app = global.HueProTab = global.HueProTab || {};

  app.state = {
    buildStage: 'foundation',
    bridgeStatus: 'unpaired',
    setup: {
      discoverySource: 'unknown',
      bridgeName: 'No bridge selected',
      bridgeIp: 'Manual entry required',
      pairingStatus: 'idle'
    },
    snapshotSummary: {
      lightCount: 0,
      lightsOn: 0,
      roomCount: 0,
      sceneCount: 0
    }
  };

  app.updateHuePlatformState = function updateHuePlatformState({ discoveryResult, pairingResult, snapshotResult }) {
    const bridge = pairingResult?.bridge || discoveryResult?.bridges?.[0] || null;

    app.state.bridgeStatus = pairingResult?.status || discoveryResult?.status || 'unpaired';
    app.state.setup = {
      discoverySource: discoveryResult?.source || 'unknown',
      bridgeName: bridge?.name || 'No bridge selected',
      bridgeIp: bridge?.ip || 'Manual entry required',
      pairingStatus: pairingResult?.status || 'idle'
    };
    app.state.snapshotSummary = snapshotResult?.summary || app.state.snapshotSummary;

    return app.state;
  };
})(typeof window !== 'undefined' ? window : globalThis);
