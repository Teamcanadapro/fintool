// help-overlay.js — cross-platform keyboard shortcuts overlay with theme detection

// help-overlay.js — cross-platform keyboard shortcuts overlay
(function () {
  const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform) || /Mac OS/i.test(navigator.userAgent);
  const isLinux = !isMac && /Linux/.test(navigator.platform);

  const ALT = isMac ? 'Option' : 'Alt';
  const ALT_SYM = isMac ? '⌥' : 'Alt';
  const SHIFT_SYM = isMac ? '⇧' : 'Shift';
  const CTRL_SYM = isMac ? '⌃' : 'Ctrl';
  const CMD_SYM = '⌘';

  const combos = [
    { key: 'Side Menu', primary: isMac ? `${CMD_SYM} + ${SHIFT_SYM} + .` : isLinux ? `Ctrl + Alt + M` : `${ALT_SYM} + ${SHIFT_SYM} + M` },
    { key: 'Dark Mode', primary: isMac ? `${CMD_SYM} + ${SHIFT_SYM} + ,` : `${ALT_SYM} + ${SHIFT_SYM} + L` },
    { key: 'Open Calculator', primary: `${isMac ? CMD_SYM : ALT_SYM} + ${SHIFT_SYM} + K` },
    { key: 'Reset Inputs', primary: `${isMac ? CMD_SYM : ALT_SYM} + ${SHIFT_SYM} + U` },
    { key: 'Help / Shortcuts', primary: `${ALT_SYM} + ${SHIFT_SYM} + /`, secondary: `${CTRL_SYM} + ${ALT_SYM} + /` }
  ];

  function ensureOverlay() {
    let overlay = document.getElementById('helpOverlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'helpOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'helpOverlayTitle');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(6px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;

    const panel = document.createElement('div');
    panel.className = 'help-overlay-panel';
    panel.style.cssText = `
      background: var(--help-bg, #fff);
      color: var(--help-text, #000);
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      padding: 20px 24px;
      min-width: 440px;
      max-width: 90vw;
      font-family: system-ui, sans-serif;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close help');
    closeBtn.className = 'help-close-btn';
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px; right: 16px;
      font-size: 20px;
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
    `;
    closeBtn.onclick = () => overlay.style.display = 'none';

    const style = document.createElement('style');
    style.textContent = `
      @media (prefers-color-scheme: dark) {
        .help-overlay-panel {
          background: #1e1e23 !important;
          color: #fff !important;
        }
        .help-overlay-panel h2 {
          color: #fff !important;
        }
      }

      .help-overlay-panel h2 {
        margin-top: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--help-title, #000);
      }

      .help-overlay-panel ul {
        list-style: none;
        margin: 16px 0 0 0;
        padding: 0;
      }

      .help-overlay-panel li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 6px 0;
        font-size: 15px;
      }

      .shortcut-key {
        background: #eee;
        color: #111;
        font-size: 13px;
        padding: 4px 8px;
        border-radius: 6px;
        margin-left: 8px;
        font-family: monospace;
        display: inline-block;
      }

      @media (prefers-color-scheme: dark) {
        .shortcut-key {
          background: #444;
          color: #fff;
        }
      }
    `;

    const list = combos.map(c => {
      let keys = `<span class="shortcut-key">${c.primary}</span>`;
      if (c.secondary) keys += ` <span class="shortcut-key">${c.secondary}</span>`;
      return `<li><span>${c.key}</span>${keys}</li>`;
    }).join('');

    panel.innerHTML = `
      <h2 id="helpOverlayTitle">Keyboard Shortcuts</h2>
      <ul>${list}</ul>
    `;

    panel.appendChild(closeBtn);
    overlay.appendChild(style);
    overlay.appendChild(panel);
    return overlay;
  }

  function toggleHelpOverlay() {
    const overlay = ensureOverlay();
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
  }

  window.toggleHelpOverlay = toggleHelpOverlay;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(ensureOverlay());
    });
  } else {
    document.body.appendChild(ensureOverlay());
  }

  document.addEventListener('keydown', (e) => {
    if ((e.altKey && e.shiftKey && e.key === '/') ||
        (e.ctrlKey && e.altKey && e.key === '/')) {
      e.preventDefault();
      toggleHelpOverlay();
    }
    if (e.key === 'Escape') {
      const overlay = document.getElementById('helpOverlay');
      if (overlay?.style.display === 'flex') {
        overlay.style.display = 'none';
      }
    }
  });
})();

