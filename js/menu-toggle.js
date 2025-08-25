// 🌐 Global utility functions

// Simulates clicking the calculator button
window.openCalculator = function () {
  const calcBtn = document.getElementById('calculatorBtn');
  if (calcBtn) calcBtn.click();
};

// Resets all relevant input fields
window.resetInputs = function () {
  const inputs = document.querySelectorAll('input[type="number"], input[type="text"], input[type="range"]');
  inputs.forEach(input => {
    if (input.defaultValue !== undefined) {
      input.value = input.defaultValue;
    } else {
      input.value = '';
    }
  });

  // Optional: re-run calculation
  if (typeof calculateFIN === 'function') calculateFIN();
};

(function () {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenuFunctions);
  } else {
    initMenuFunctions();
  }

  function initMenuFunctions() {
    // 🌍 Global functions for use in shortcuts.js
    
    // --- Hidden Pro Range Toggle (9% <-> 18%) ---
const PRO_KEY = 'proReturnRange';
const proEnabled = JSON.parse(localStorage.getItem(PRO_KEY) || 'false');

function applyReturnMax(enabled) {
  const max = enabled ? 18 : 9;

  const pre = document.getElementById('preReturn');       // range
  const post = document.getElementById('postReturn');     // range
  const preTxt = document.getElementById('preReturnText');   // text
  const postTxt = document.getElementById('postReturnText'); // text

  [pre, post].forEach(el => {
    if (!el) return;
    el.max = String(max);
    if (Number(el.value) > max) el.value = String(max);
  });

  // Clamp the companion text boxes if user typed numbers beyond the cap
  [preTxt, postTxt].forEach(el => {
    if (!el) return;
    const v = parseFloat(el.value);
    if (!isNaN(v) && v > max) el.value = String(max);
  });

  // Optional: soften the labels to hint quietly (no visible control added)
  // const preLabel = document.querySelector('label[for="preReturn"]');
  // const postLabel = document.querySelector('label[for="postReturn"]');
  // [preLabel, postLabel].forEach(l => l && (l.title = enabled ? 'Pro range enabled (up to 18%)' : 'Standard range (up to 9%)'));

  if (typeof calculateFIN === 'function') calculateFIN();
}

// Expose a global function for the shortcut
window.toggleHighReturn = function () {
  const next = !JSON.parse(localStorage.getItem(PRO_KEY) || 'false');
  localStorage.setItem(PRO_KEY, JSON.stringify(next));
  applyReturnMax(next);
};

// Apply on load so it persists across refreshes
applyReturnMax(proEnabled);

    
    window.toggleSideMenu = function () {
  const sideMenu = document.getElementById('sideMenuOverlay');
  if (!sideMenu) return;
  const isVisible = sideMenu.classList.contains('show');
  sideMenu.classList.toggle('show', !isVisible);
  sideMenu.classList.toggle('hidden', isVisible);
};

    window.closeSideMenu = function () {
      const sideMenu = document.getElementById('sideMenuOverlay');
      if (!sideMenu) return;
      sideMenu.classList.remove('show');
      sideMenu.classList.add('hidden');
    };

    const STORAGE_KEY = 'tabVisibilitySettings';
    const SETTINGS_KEY = 'globalToggleSettings';

    // Menu buttons
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');

    menuToggleBtn?.addEventListener('click', () => window.toggleSideMenu());
    closeMenuBtn?.addEventListener('click', () => window.closeSideMenu());

    // Tab visibility restore
    const savedTabs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      rdsp: true, resp: true, tfsa: true, btid: true, tax: true, budget: true, fna: true, calc: true
    };

    Object.entries(savedTabs).forEach(([key, visible]) => {
      const input = document.querySelector(`input[data-toggle-tab="${key}"]`);
      const tabBtn = document.querySelector(`.tab-btn[data-tab="${key}"]`);
      const tabContent = document.getElementById('tab-' + key);

      if (input) input.checked = visible;
      if (tabBtn) tabBtn.style.display = visible ? '' : 'none';
      if (tabContent) tabContent.classList.toggle('hidden', !visible);
    });

    document.querySelectorAll('input[data-toggle-tab]').forEach(input => {
      input.addEventListener('change', () => {
        const key = input.dataset.toggleTab;
        const visible = input.checked;

        savedTabs[key] = visible;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTabs));

        const tabBtn = document.querySelector(`.tab-btn[data-tab="${key}"]`);
        const tabContent = document.getElementById('tab-' + key);

        if (tabBtn) tabBtn.style.display = visible ? '' : 'none';
        if (tabContent) tabContent.classList.toggle('hidden', !visible);
      });
    });

    // Global setting toggles
    const state = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
      darkMode: false,
      futureDisplay: true,
      drawdownForever: false
    };

    const darkToggle = document.getElementById('darkModeToggle');
    const finToggle = document.getElementById('finDisplayToggle');
    const drawToggle = document.getElementById('drawdownToggle');
    const finLabel = document.getElementById('finDisplayLabel');
    const drawLabel = document.getElementById('modeLabel');
    const endAgeLabel = document.querySelector('label[for="endAge"]');

    if (darkToggle) {
      darkToggle.checked = state.darkMode;
      document.body.classList.toggle('dark', state.darkMode);
      darkToggle.addEventListener('change', () => {
  state.darkMode = darkToggle.checked;
  document.body.classList.toggle('dark', state.darkMode);
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));

  // 🆕 Trigger canvas re-render for dark mode to apply
  if (typeof window.renderAndexPDF === 'function') {
    setTimeout(() => window.renderAndexPDF(), 100);
  }
});

    }

    if (finToggle && finLabel) {
      finToggle.checked = state.futureDisplay;
      finLabel.textContent = state.futureDisplay ? 'Future $' : "Today's $";
      finToggle.addEventListener('change', () => {
        state.futureDisplay = finToggle.checked;
        finLabel.textContent = state.futureDisplay ? 'Future $' : "Today's $";
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
        if (typeof calculateFIN === 'function') calculateFIN();
      });
    }

    if (drawToggle && drawLabel && endAgeLabel) {
      drawToggle.checked = state.drawdownForever;
      const label = state.drawdownForever ? 'Forever' : 'Life Expectancy';
      drawLabel.textContent = label;
      endAgeLabel.textContent = state.drawdownForever ? 'Mode: Perpetual' : 'Life Expectancy';

      drawToggle.addEventListener('change', () => {
        state.drawdownForever = drawToggle.checked;
        const label = state.drawdownForever ? 'Forever' : 'Life Expectancy';
        drawLabel.textContent = label;
        endAgeLabel.textContent = state.drawdownForever ? 'Mode: Perpetual' : 'Life Expectancy';
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
        if (typeof calculateFIN === 'function') calculateFIN();
      });
    }

    // Master tab toggle
    const toggleAllTabs = document.getElementById('toggleAllTabs');
    const tabToggles = document.querySelectorAll('[data-toggle-tab]:not([data-toggle-tab="calc"])');

    toggleAllTabs?.addEventListener('change', () => {
      const shouldCheck = toggleAllTabs.checked;
      tabToggles.forEach(input => {
        input.checked = shouldCheck;
        input.dispatchEvent(new Event('change'));
      });
    });

    tabToggles.forEach(input => {
      input.addEventListener('change', () => {
        const allChecked = [...tabToggles].every(i => i.checked);
        toggleAllTabs.checked = allChecked;
      });
    });
    document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const sideMenu = document.getElementById('sideMenuOverlay');
    if (sideMenu && sideMenu.classList.contains('show')) {
      sideMenu.classList.remove('show');
    }
  }
});
function initSlidingHighlightBar() {
  const tabBar = document.querySelector('.tab-bar'); 
  if (!tabBar) return;

  const highlight = tabBar.querySelector('.tab-highlight');
  const buttons = [...tabBar.querySelectorAll('.tab-btn')];
  if (!highlight || buttons.length === 0) return;

  function moveHighlight(targetBtn) {
    if (!targetBtn) return;
    const barRect = tabBar.getBoundingClientRect();
    const btnRect = targetBtn.getBoundingClientRect();
    const left = btnRect.left - barRect.left + tabBar.scrollLeft; // safe if horizontally scrollable

    highlight.style.width = `${btnRect.width}px`;
    highlight.style.left  = `${left}px`;
  }

  function setActive(btn) {
    buttons.forEach(b => b.classList.toggle('active', b === btn));
    moveHighlight(btn);
  }

  // initial position (fallback to first active or first button)
  setTimeout(() => {
    const current = buttons.find(b => b.classList.contains('active')) || buttons[0];
    setActive(current);
  }, 0);

  // click to switch
  buttons.forEach(btn => {
    btn.addEventListener('click', () => setActive(btn));
  });

  // reposition on resize
  const ro = new ResizeObserver(() => {
    const current = buttons.find(b => b.classList.contains('active'));
    moveHighlight(current || buttons[0]);
  });
  ro.observe(tabBar);

  window.addEventListener('resize', () => {
    const current = buttons.find(b => b.classList.contains('active'));
    moveHighlight(current || buttons[0]);
  });

  // if your code switches tabs programmatically, expose a helper:
  window.setActiveTabByData = function(key) {
    const target = buttons.find(b => b.dataset.tab === key);
    if (target) setActive(target);
  };
}

// Call it after your existing UI is wired (inside initMenuFunctions or after DOMContentLoaded)
initSlidingHighlightBar();

  }
})();

