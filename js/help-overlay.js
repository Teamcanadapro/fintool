// Global function so it can be called from shortcuts.js
window.toggleHelpOverlay = function () {
  const overlay = document.getElementById('helpOverlay');
  if (!overlay) return;
  overlay.classList.toggle('visible');
};

