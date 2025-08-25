(function () {
  const PASSWORD = 'winning4u';
  const SESSION_KEY = 'loggedIn';

  let overlayEl = null;
  let inputEl = null;
  let errorEl = null;
  let inited = false;

  function nukeLegacyLockIfAny() {
    const legacy = document.getElementById('passwordOverlay');
    if (legacy) legacy.remove();

    const content = document.getElementById('content');
    if (content && content.style.display === 'none') {
      content.style.display = '';
    }
  }

  function buildOverlay() {
    if (overlayEl) return overlayEl;

    overlayEl = document.createElement('div');
    overlayEl.id = 'lockScreen';
    overlayEl.className = 'lock-screen-overlay';

    overlayEl.innerHTML = `
      <div class="lock-box" role="dialog" aria-modal="true" aria-labelledby="lockTitle">
        <h2 id="lockTitle"><span aria-hidden="true">🔒</span> Fintools</h2>
        <p class="lock-msg">Enter password to continue</p>
        <input type="password" id="lockPasswordInput" class="lock-input" autocomplete="current-password" aria-label="Password" />
        <button id="unlockBtn" class="lock-submit" type="button">Unlock</button>
        <div id="lockError" class="lock-error" aria-live="polite" style="display:none">Incorrect password</div>
      </div>
    `;

    document.body.appendChild(overlayEl);

    inputEl = overlayEl.querySelector('#lockPasswordInput');
    errorEl = overlayEl.querySelector('#lockError');

    const unlockBtn = overlayEl.querySelector('#unlockBtn');
    unlockBtn.addEventListener('click', tryUnlock);

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tryUnlock();
    });

    overlayEl.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

    return overlayEl;
  }

  function tryUnlock() {
    const entered = (inputEl.value || '').trim();
    if (entered === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      hide();
    } else {
      errorEl.style.display = 'block';
      inputEl.select();
    }
  }

  function show() {
    sessionStorage.removeItem(SESSION_KEY);

    const ov = buildOverlay();
    if (ov.style.display !== 'flex') {
      ov.style.display = 'flex';
      errorEl.style.display = 'none';
      inputEl.value = '';
      setTimeout(() => inputEl.focus(), 0);
    }

    document.body.classList.add('locked');
  }

function hide() {
  const ov = buildOverlay();
  ov.style.display = 'none';
  document.body.classList.remove('locked');

  // Initialize chart once visible
  if (window.initAndexChart) {
    window.initAndexChart();
  }
}


  function wireLockButtons() {
    const btn = document.getElementById('lockBtn');
    if (btn) btn.addEventListener('click', show);

    document.querySelectorAll('[data-action="lock"]').forEach((el) => {
      el.addEventListener('click', show);
    });
  }

  function init() {
    if (inited) return;
    inited = true;

    nukeLegacyLockIfAny();

    const ov = buildOverlay();

    if (sessionStorage.getItem(SESSION_KEY) !== 'true') {
      document.body.classList.add('locked');
      ov.style.display = 'flex';
      setTimeout(() => inputEl.focus(), 0);
    }

    wireLockButtons();
  }

  window.toggleLockScreen = show;

  // Immediately run init, since loader.js already waits for DOM ready
  init();
})();

