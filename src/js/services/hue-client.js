(function initHueClient(global) {
  const app = global.HueProTab = global.HueProTab || {};
  app.services = app.services || {};

  function cloneSnapshot(snapshot) {
    return JSON.parse(JSON.stringify(snapshot || { lights: [], rooms: [], scenes: [] }));
  }

  function summarizeSnapshot(snapshot) {
    const lightsOn = snapshot.lights.filter((light) => light.on).length;
    return {
      lightCount: snapshot.lights.length,
      lightsOn,
      roomCount: snapshot.rooms.length,
      sceneCount: snapshot.scenes.length
    };
  }

  app.services.hueClient = {
    cloneSnapshot,
    summarizeSnapshot,
    fetchSnapshot(options = {}) {
      const bridge = options.bridge || null;
      if (!bridge) {
        return {
          status: 'bridge-required',
          bridge: null,
          lights: [],
          rooms: [],
          scenes: [],
          summary: summarizeSnapshot({ lights: [], rooms: [], scenes: [] })
        };
      }

      const snapshot = cloneSnapshot(options.snapshot || app.config?.demoSnapshot);
      return {
        status: 'ready',
        bridge,
        ...snapshot,
        summary: summarizeSnapshot(snapshot)
      };
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
