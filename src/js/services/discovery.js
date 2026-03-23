(function initDiscovery(global) {
  const app = global.HueProTab = global.HueProTab || {};
  app.services = app.services || {};

  function normalizeBridgeIp(ip) {
    return String(ip || '').trim();
  }

  function createDiscoveryResult({ bridge, source, manualEntry = false }) {
    return {
      status: bridge ? 'found' : 'not-found',
      source,
      manualEntry,
      bridges: bridge ? [bridge] : []
    };
  }

  app.services.discovery = {
    normalizeBridgeIp,
    discover(options = {}) {
      const manualIp = normalizeBridgeIp(options.manualIp);
      const fallbackBridge = app.config?.demoBridge || null;

      if (manualIp) {
        return createDiscoveryResult({
          bridge: {
            ...fallbackBridge,
            id: `manual-${manualIp.replace(/\./g, '-')}`,
            ip: manualIp,
            name: `${fallbackBridge?.name || 'Hue Bridge'} (manual)`
          },
          source: 'manual',
          manualEntry: true
        });
      }

      if (fallbackBridge) {
        return createDiscoveryResult({
          bridge: fallbackBridge,
          source: 'demo-discovery'
        });
      }

      return createDiscoveryResult({ bridge: null, source: 'unavailable' });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
