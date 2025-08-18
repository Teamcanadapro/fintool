// shortcuts.js — cross-platform keyboard shortcuts
// Uniform across Windows/Linux/Mac using Alt+Shift combinations.
// Option+Shift on Mac = Alt+Shift on Windows/Linux.

// Helpers
function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  const isEditable = el.isContentEditable;
  return (
    isEditable ||
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select'
  );
}

// Map of actions
const actions = {
  m: () => window.toggleSideMenu?.(),
  c: () => window.openCalculator?.(),
  l: () => document.getElementById('darkModeToggle')?.click(),
  r: () => window.resetInputs?.(),
  '/': () => window.toggleHelpOverlay?.(),
  g: () => window.toggleHighReturn?.()
};

// Normalize a key (treat '?' as '/')
function normalizeKey(e) {
  const k = e.key || '';
  if (k === '?') return '/';
  return k.toLowerCase();
}

document.addEventListener('keydown', (e) => {
  const key = normalizeKey(e);

  // 1) Primary: Alt+Shift+<key> (works on Mac/Win/Linux)
  if (e.altKey && e.shiftKey) {
    // Don’t fire most shortcuts while typing in fields, except Help
    const targetIsTyping = isTypingTarget(document.activeElement);
    const isHelp = key === '/';

    if (targetIsTyping && !isHelp) return;

    const action = actions[key];
    if (action) {
      e.preventDefault();
      action();
      return;
    }
  }

  // 2) Secondary alias: Ctrl+Alt+/ for Help (since this already works on Mac for you)
  if (e.ctrlKey && e.altKey && key === '/') {
    e.preventDefault();
    actions['/']?.();
  }
});

