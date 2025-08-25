(async function () {
  const VERSION_URL = './data/version.txt'; // adjust path as needed
  const STORAGE_KEY = 'siteVersion';

  try {
    const res = await fetch(VERSION_URL, { cache: 'no-store' });
    const text = await res.text();
    const latestVersion = text.trim().split('\n')[0]; // First line is version number

    const currentVersion = localStorage.getItem(STORAGE_KEY);

    if (currentVersion && currentVersion !== latestVersion) {
      localStorage.setItem(STORAGE_KEY, latestVersion);
      console.log(`[Andex] New version detected (${latestVersion} ≠ ${currentVersion}). Reloading...`);
      location.reload(true); // Hard reload
    } else if (!currentVersion) {
      localStorage.setItem(STORAGE_KEY, latestVersion);
    }
  } catch (err) {
    console.error('[Andex] Version check failed:', err);
  }
})();

