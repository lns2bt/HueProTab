(function initPairing(global) {
  const app = global.HueProTab = global.HueProTab || {};
  app.services = app.services || {};

  function buildAppKey(bridgeId, appName) {
    return `${String(appName || 'hueprotab').toLowerCase()}-${String(bridgeId || 'bridge').replace(/[^a-z0-9]+/gi, '').toLowerCase()}`;
  }

  app.services.pairing = {
    buildAppKey,
    begin(options = {}) {
      const bridge = options.bridge || null;
      if (!bridge) {
        return {
          status: 'bridge-required',
          instruction: 'Find or enter a bridge IP before pairing can begin.'
        };
      }

      if (options.simulateButtonPress === false) {
        return {
          status: 'awaiting-button-press',
          bridge,
          instruction: 'Press the bridge button, then retry pairing within 30 seconds.'
        };
      }

      const appName = options.appName || app.config?.appName || 'HueProTab';
      return {
        status: 'linked',
        bridge,
        appName,
        appKey: buildAppKey(bridge.id, appName),
        linkedAt: 'demo-linked-now'
      };
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
