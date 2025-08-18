// help-overlay.js — builds a cross-platform keyboard shortcuts overlay
(function () {
  const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform) || /Mac OS/i.test(navigator.userAgent);
  const isLinux = !isMac && /Linux/.test(navigator.platform);

  const ALT = isMac ? 'Option' : 'Alt';
  const ALT_SYM = isMac ? '⌥' : 'Alt';
  const SHIFT = isMac ? 'Shift' : 'Shift';
  const SHIFT_SYM = isMac ? '⇧' : 'Shift';
  const CTRL_SYM = isMac ? '⌃' : 'Ctrl';
  const CMD_SYM = '⌘';

  // Final key mappings
  const combos = [
    {
      key: 'Side Menu',
      primary: isMac ? `${CMD_SYM} + ${SHIFT_SYM} + .` : isLinux ? `Ctrl + Alt + M` : `${ALT_SYM} + ${SHIFT_SYM} + M`
    },
    {
      key: 'Dark Mode',
      primary: isMac ? `${CMD_SYM} + ${SHIFT_SYM} + ,` : `${ALT_SYM} + ${SHIFT_SYM} + L`
    },
    {
      key: 'Open Calculator',
      primary: `${isMac ? CMD_SYM : ALT_SYM} + ${SHIFT_SYM} + K`
    },
    {
      key: 'Reset Inputs',
      primary: `${isMac ? CMD_SYM : ALT_SYM} + ${SHIFT_SYM} + U`
    },
    {
      key: 'High Return Mode',
      primary: isMac ? `${CMD_SYM} + ${SHIFT_SYM} + '` : `${ALT_SYM} + ${SHIFT_SYM} + G`
    },
    {
      key: 'Help / Shortcuts',
      primary: `${ALT_SYM} + ${SHIFT_SYM} + /`,
      secondary: `${CTRL_SYM} + ${ALT_SYM} + /`
    }
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
      border:

