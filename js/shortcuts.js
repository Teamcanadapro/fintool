document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  // Support both Windows (Ctrl+Alt) and Mac (Meta+Alt)
  const ctrlOrCmd = e.ctrlKey || e.metaKey;

  if (ctrlOrCmd && e.altKey) {
    switch (key) {
      case 'm':
        e.preventDefault();
        window.toggleSideMenu?.();
        break;
      case 'c':
        e.preventDefault();
        window.openCalculator?.();
        break;
      case 'l':
        e.preventDefault();
        document.getElementById('darkModeToggle')?.click();
        break;
      case 'r':
        e.preventDefault();
        window.resetInputs?.();
        break;
      case '/':
        e.preventDefault();
        window.toggleHelpOverlay?.();
        break;
      case 'g':
        e.preventDefault();
        window.toggleHighReturn?.();
        break;
    }
  }
});
