window.HueProTab = window.HueProTab || {};
window.HueProTab.ui = window.HueProTab.ui || {};
window.HueProTab.ui.router = {
  viewOrder: ['views/setup', 'views/dashboard', 'views/settings'],
  activeView: 'views/dashboard',
  setActiveView(viewName) {
    if (!this.viewOrder.includes(viewName)) {
      return this.activeView;
    }

    this.activeView = viewName;
    return this.activeView;
  }
};
