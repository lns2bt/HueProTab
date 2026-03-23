(function bootstrapHueProTab() {
  const app = window.HueProTab || {};
  const root = document.querySelector('#app-root');
  const status = document.querySelector('[data-build-status]');
  if (!root || !status) {
    return;
  }

  const orderedViews = (app.config?.views ?? []).map((name) => {
    return document.querySelector(`template[data-template="${name}"]`)?.innerHTML ?? '';
  });

  root.innerHTML = orderedViews.join('\n');
  status.textContent = 'Foundation build ready';
})();
