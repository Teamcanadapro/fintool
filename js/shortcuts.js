// shortcuts.js — Final Cross-Platform Keyboard Shortcuts

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return el.isContentEditable || ['input', 'textarea', 'select'].includes(tag);
}

const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform) || /Mac OS/i.test(navigator.userAgent);

const actions = {
  '.': () => window.toggleSideMenu?.(),
  ',': () => document.getElementById('darkModeToggle')?.click(),
  k: () => window.openCalculator?.(),
  u: () => window.resetInputs?.(),
  y: () => window.toggleGodMode?.(),
  '/': () => window.toggleHelpOverlay?.()
};

function normalizeKey(e) {
  const k = e.key || '';
  return k === '?' ? '/' : k.toLowerCase();
}

document.addEventListener('keydown', (e) => {
  const key = normalizeKey(e);
  const targetIsTyping = isTypingTarget(document.activeElement);
  const isHelpKey = key === '/';
  const action = actions[key];

  if (!action) return;

  // 1️⃣ Help Overlay — universal Ctrl + Alt + /
  if (e.ctrlKey && e.altKey && isHelpKey) {
    e.preventDefault();
    action();
    return;
  }

  // 2️⃣ Mac: Cmd + Shift + Key
  if (isMac && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey) {
    if (targetIsTyping && !isHelpKey) return;
    e.preventDefault();
    action();
    return;
  }

  // 3️⃣ Windows/Linux: Ctrl + Shift + Key
  if (!isMac && e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
    if (targetIsTyping && !isHelpKey) return;
    e.preventDefault();
    action();
    return;
  }
});

