// loader.js — safe, idempotent sequential loader with version & cache check
(function () {
  if (window.__fintoolsLoaderLoaded) return;
  window.__fintoolsLoaderLoaded = true;

  const VERSION_URL = '/data/version.txt';
  const STORAGE_KEY = 'siteVersion';
  const scriptsToLoad = [
    'js/menu-toggle.js',
    'js/help-overlay.js',
    'js/shortcuts.js',
    'js/annotate.js'  ,
    'js/lock-screen.js'
  ];

  function fetchVersionAndLoad() {
    fetch(VERSION_URL, { cache: 'no-store' })
      .then(res => res.text())
      .then(text => {
        const [versionLine, updatedLine] = text.trim().split('\n');
        updateVersionInfo(versionLine, updatedLine);

        const currentVersion = localStorage.getItem(STORAGE_KEY);

        if (currentVersion && currentVersion !== versionLine) {
          localStorage.setItem(STORAGE_KEY, versionLine);
          console.log(`[Andex] New version ${versionLine} → Reloading`);
          location.reload(true);
        } else {
          if (!currentVersion) localStorage.setItem(STORAGE_KEY, versionLine);
          loadScriptsSequentially(0, versionLine);
        }
      })
      .catch(err => {
        console.error('[Andex] Version check failed:', err);
        loadScriptsSequentially();
      });
  }

  function loadScriptsSequentially(index = 0, version = 'dev') {
    if (index >= scriptsToLoad.length) return;
    const script = document.createElement('script');
    script.src = `${scriptsToLoad[index]}?v=${version}`;
    script.onload = () => loadScriptsSequentially(index + 1, version);
    document.body.appendChild(script);
  }

  function updateVersionInfo(version, date) {
    const versionTag = document.getElementById('versionTag');
    const updatedTag = document.getElementById('updatedTag');
    if (versionTag) versionTag.textContent = `v${version}`;
    if (updatedTag) updatedTag.textContent = date;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchVersionAndLoad);
  } else {
    fetchVersionAndLoad();
  }
})();

