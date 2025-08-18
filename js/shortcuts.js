// shortcuts.js — cross-platform keyboard shortcuts
// Mac: Cmd+Shift+Key, Win/Linux: Ctrl+Shift+Key

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return el.isContentEditable || ['input', 'textarea', 'select'].includes(tag);
}

const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform) || /Mac OS/i.test(navigator.userAgent);

const actions = {
  m: () => window.toggleSideMenu?.(),
  c: () => window.openCalculator?.(),
  l: () => document.getElementById('darkModeToggle')?.click(),
  r: () => window.resetInputs?.(),
  '/': () => window.toggleHelpOverlay?.(),
  g: () => window.toggleHighReturn?.()
};

function normalizeKey(e) {
  const k = e.key || '';
  return k === '?' ? '/' : k.toLowerCase();
}

document.addEventListener('keydown', (e) => {
  const key = normalizeKey(e);
  const targetIsTyping = isTypingTarget(document.activeElement);
  const isHelp = key === '/';
  const action = actions[key];

  if (!action) return;

  // ✅ Mac: Cmd + Shift + Key
  if (isMac && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey) {
    if (targetIsTyping && !isHelp) return;
    e.preventDefault();
    action();
    return;
  }

  // ✅ Windows/Linux: Ctrl + Shift + Key
  if (!isMac && e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
    if (targetIsTyping && !isHelp) return;
    e.preventDefault();
    action();
    return;
  }
});

