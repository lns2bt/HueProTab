window.HueProTab = window.HueProTab || {};
window.HueProTab.ui = window.HueProTab.ui || {};
window.HueProTab.ui.renderDashboard = function renderDashboard() {
  return document.querySelector('template[data-template="views/dashboard"]')?.innerHTML ?? '';
};
