window.HueProTab = window.HueProTab || {};
window.HueProTab.ui = window.HueProTab.ui || {};
window.HueProTab.ui.renderSetup = function renderSetup() {
  return document.querySelector('template[data-template="views/setup"]')?.innerHTML ?? '';
};
