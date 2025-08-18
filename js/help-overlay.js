// help-overlay.js — builds a cross-platform keyboard shortcuts overlay
(function () {
  const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform) || /Mac OS/i.test(navigator.userAgent);

  // Labels per platform
  const ALT = isMac ? 'Option' : 'Alt';
  const ALT_SYM = isMac ? '⌥' : 'Alt';
  const SHIFT = isMac ? 'Shift' : 'Shift';
  const SHIFT_SYM = isMac ? '⇧' : 'Shift';
  const CTRL = isMac ? 'Control' : 'Ctrl';
  const CTRL_SYM = isMac ? '⌃' : 'Ctrl';

  // Unified combos
  const combos = [
    { key: 'M', desc: 'Toggle Side Menu', primary: `${ALT_SYM} + ${SHIFT_SYM} + M` },
    { key: 'C', desc: 'Open Calculator', primary: `${ALT_SYM} + ${SHIFT_SYM} + C` },
    { key: 'L', desc: 'Toggle Dark Mode', primary: `${ALT_SYM} + ${SHIFT_SYM} + L` },
    { key: 'R', desc: 'Reset Inputs', primary: `${ALT_SYM} + ${SHIFT_SYM} + R` },
    { key: '/', desc: 'Help / Shortcuts', primary: `${ALT_SYM} + ${SHIFT_SYM} + /`, secondary: `${CTRL_SYM} + ${ALT_SYM} + /` },
    
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
      background: rgba(0,0,0,0.5);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    const panel = document.createElement('div');
    panel.className = 'help-overlay-panel';
    panel.style.cssText = `
      background: var(--card-bg, #fff);
      color: var(--text-color, #111);
      min-width: min(92vw, 720px);
      max-width: 92vw;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.25);
      padding: 18px 20px;
      position: relative;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close help');
    closeBtn.className = 'help-close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 8px; right: 12px;
      width: 36px; height: 36px;
      border: none;
      background: transparent;
      color: inherit;
      font-size: 28px;
      line-height: 1;
      cursor: pointer;
    `;

    const title = document.createElement('h2');
    title.id = 'helpOverlayTitle';
    title.textContent = 'Keyboard Shortcuts';
    title.style.cssText = `
      margin: 0 0 6px 0;
      font-size: 1.25rem;
      color: var(--brand, #1976d2);
    `;

    const subtitle = document.createElement('div');
    subtitle.style.cssText = `
      margin: 0 0 14px 0;
      font-size: 0.9rem;
      opacity: 0.8;
    `;
    subtitle.textContent = isMac
      ? `Use ${ALT} (${ALT_SYM}) + ${SHIFT} (${SHIFT_SYM}) + key`
      : `Use ${ALT} + ${SHIFT} + key`;

    const table = document.createElement('div');
    table.className = 'help-grid';
    table.style.cssText = `
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px 18px;
      align-items: center;
    `;

    combos.forEach(({ desc, primary, secondary }) => {
      const label = document.createElement('div');
      label.textContent = desc;
      label.style.cssText = `font-weight: 600;`;

      const keys = document.createElement('div');
      keys.style.cssText = `justify-self: end; display: flex; flex-wrap: wrap; gap: 6px;`;

      const chip = (txt) => {
        const k = document.createElement('span');
        k.textContent = txt;
        k.style.cssText = `
          padding: 4px 8px;
          border-radius: 8px;
          background: #f1f3f4;
          border: 1px solid #dadce0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 0.85rem;
        `;
        return k;
      };

      keys.appendChild(chip(primary));
      if (secondary) {
        const sep = document.createElement('span');
        sep.textContent = ' or ';
        sep.style.cssText = `margin: 0 4px; opacity: 0.6;`;
        keys.appendChild(sep);
        keys.appendChild(chip(secondary));
      }

      table.appendChild(label);
      table.appendChild(keys);
    });

    const tip = document.createElement('div');
    tip.style.cssText = `
      margin-top: 14px;
      font-size: 0.85rem;
      opacity: 0.8;
    `;
    tip.innerHTML = isMac
      ? `Tip: On Mac, <strong>${ALT}</strong> is the <strong>${ALT_SYM}</strong> key.`
      : `Tip: Works on Windows & Linux using <strong>Alt + Shift</strong>.`;

    // Dark mode tweaks
    const darkStyles = document.createElement('style');
    darkStyles.textContent = `
      body.dark .help-overlay-panel { background:#1e1e1e; color:#eee; }
      body.dark .help-grid span { background:#2b2b2b; border-color:#444; }
    `;

    panel.appendChild(closeBtn);
    panel.appendChild(title);
    panel.appendChild(subtitle);
    panel.appendChild(table);
    panel.appendChild(tip);
    overlay.appendChild(panel);
    overlay.appendChild(darkStyles);
    document.body.appendChild(overlay);

    // Wire up interactions
    function hide() { overlay.style.display = 'none'; }
    function show() { overlay.style.display = 'flex'; }

    closeBtn.addEventListener('click', hide);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hide();
    });
    document.addEventListener('keydown', (e) => {
      if (overlay.style.display !== 'none' && e.key === 'Escape') hide();
    });

    // Expose global toggle for shortcuts.js
    window.toggleHelpOverlay = function () {
      if (overlay.style.display === 'none' || overlay.style.display === '') {
        show();
      } else {
        hide();
      }
    };

    return overlay;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureOverlay);
  } else {
    ensureOverlay();
  }
})();

