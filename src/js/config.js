(function initConfig(global) {
  const app = global.HueProTab = global.HueProTab || {};
  app.config = {
    appName: 'HueProTab',
    views: ['views/setup', 'views/dashboard', 'views/settings'],
    bridgeDiscoveryTimeoutMs: 5000,
    demoBridge: {
      id: 'bridge-demo-001',
      name: 'Living Room Bridge',
      ip: '192.168.1.25',
      model: 'Philips Hue Bridge v2'
    },
    demoSnapshot: {
      lights: [
        {
          id: 'light-lamp-left',
          name: 'Sofa Lamp',
          roomId: 'room-living',
          on: true,
          brightness: 82,
          colorMode: 'color',
          colorLabel: 'Sunset amber'
        },
        {
          id: 'light-lamp-right',
          name: 'Desk Strip',
          roomId: 'room-living',
          on: true,
          brightness: 64,
          colorMode: 'scene',
          colorLabel: 'Aurora blend'
        },
        {
          id: 'light-bedside',
          name: 'Bedside Orb',
          roomId: 'room-bedroom',
          on: false,
          brightness: 20,
          colorMode: 'temperature',
          colorLabel: 'Warm relax'
        }
      ],
      rooms: [
        {
          id: 'room-living',
          name: 'Living Room',
          lightIds: ['light-lamp-left', 'light-lamp-right'],
          sceneIds: ['scene-focus', 'scene-party']
        },
        {
          id: 'room-bedroom',
          name: 'Bedroom',
          lightIds: ['light-bedside'],
          sceneIds: ['scene-sleep']
        }
      ],
      scenes: [
        {
          id: 'scene-focus',
          name: 'Focus',
          roomId: 'room-living'
        },
        {
          id: 'scene-party',
          name: 'Party Pulse',
          roomId: 'room-living'
        },
        {
          id: 'scene-sleep',
          name: 'Sleep',
          roomId: 'room-bedroom'
        }
      ]
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
