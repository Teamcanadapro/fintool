// Determine platform
const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform) || /Mac OS/i.test(navigator.userAgent);

const actions = {
  '.': () => window.toggleSideMenu?.(),
  ',': () => document.getElementById('darkModeToggle')?.click(),
  k: () => window.openCalculator?.(),
  u: () => window.resetInputs?.(),
  y: () => window.toggleHighReturn?.(),
  '/': () => window.toggleHelpOverlay?.()
};

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return el.isContentEditable || ['input', 'textarea', 'select'].includes(tag);
}

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

  // 1️⃣ Help overlay for all OS: Ctrl + Alt + /
  if (e.ctrlKey && e.altKey && key === '/') {
    e.preventDefault();
    action();
    return;
  }

  // 2️⃣ Mac: Cmd + Shift + [Key]
  if (isMac && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey) {
    if (targetIsTyping && !isHelp) return;
    e.preventDefault();
    action();
    return;
  }

  // 3️⃣ Windows/Linux: Alt + Shift + [Key]
  if (!isMac && e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) {
    if (targetIsTyping && !isHelp) return;
    e.preventDefault();
    action();
    return;
  }
});

