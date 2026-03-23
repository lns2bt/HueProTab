window.HueProTab = window.HueProTab || {};
window.HueProTab.services = window.HueProTab.services || {};
window.HueProTab.services.hueClient = {
  fetchSnapshot() {
    return { lights: [], rooms: [], scenes: [] };
  }
};
