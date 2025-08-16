const scriptsToLoad = [
  'js/menu-toggle.js',
  'js/help-overlay.js',
  'js/shortcuts.js'
];

// Load each script dynamically and in strict order
(function loadScriptsSequentially(index = 0) {
  if (index >= scriptsToLoad.length) return;

  const script = document.createElement('script');
  script.src = scriptsToLoad[index];
  script.onload = () => loadScriptsSequentially(index + 1);
  document.body.appendChild(script);
})();

