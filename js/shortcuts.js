// shortcuts.js — cross-platform keyboard shortcuts
const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform) || /Mac OS/i.test(navigator.userAgent);
const isLinux = !isMac && /Linux/.test(navigator.platform);

// Helpers
function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return el.isContentEditable || ['input', 'textarea', 'select'].includes(tag);
}

function normalizeKey(e) {
  const k = e.key || '';
  return k === '?' ? '/' : k.toLowerCase();
}

const actions = {
  m: () => !isMac ? window.toggleSideMenu?.() : null,
  '.': () => isMac ? window.toggleSideMenu?.() : null,
  ',': () => isMac ? document.getElementById('darkModeToggle')?.click() : null,
  l: () => !isMac ? document.getElementById('darkModeToggle')?.click() : null,
  k: () => window.openCalculator?.(),
  u: () => window.resetInputs?.(),
  "'": () => isMac ? window.toggleHighReturn?.() : null,
  g: () => !isMac ? window.toggleHighReturn?.() : null,
  '/': () => window.toggleHelpOverlay?.()
};

document.addEventListener('keydown', (e) => {
  const key = normalizeKey(e);
  const targetIsTyping = isTypingTarget(document.activeElement);
  const isHelp = key === '/';
  const action = actions[key];
  if (!action) return;

  // Help fallback: Ctrl + Alt + /
  if (e.ctrlKey && e.altKey && key === '/') {
    e.preventDefault();
    action();
    return;
  }

  // Mac: Cmd + Shift
  if (isMac && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey) {
    if (targetIsTyping && !isHelp) return;
    e.preventDefault();
    action();
    return;
  }

  // Win/Linux: Alt + Shift
  if (!isMac && e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) {
    if (targetIsTyping && !isHelp) return;
    e.preventDefault();
    action();
    return;
  }

  // Linux: Ctrl + Alt + M for menu fallback
  if (isLinux && key === 'm' && e.ctrlKey && e.altKey && !e.metaKey && !e.shiftKey) {
    e.preventDefault();
    actions['m']();
    return;
  }
});

