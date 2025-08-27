// loader.js — version-aware loader
(function () {
  if (window.__fintoolsLoaderLoaded) return;
  window.__fintoolsLoaderLoaded = true;

  const VERSION_URL = './data/version.txt';
  const STORAGE_KEY = 'siteVersion';
  const scriptsToLoad = [
    'js/menu-toggle.js',
    'js/help-overlay.js',
    'js/shortcuts.js',
    'js/annotate.js',
    'js/lock-screen.js'
  ];

  function fetchVersionAndLoad() {
    fetch(VERSION_URL, { cache: 'no-store' })
      .then(res => res.text())
      .then(text => {
        const [versionLine, updatedLine] = text.trim().split('\n');
        updateVersionInfo(versionLine, updatedLine);

        const currentVersion = localStorage.getItem(STORAGE_KEY);
        if (currentVersion && currentVersion !== versionLine) {
          localStorage.setItem(STORAGE_KEY, versionLine);
          
          location.reload(true);
        } else {
          if (!currentVersion) localStorage.setItem(STORAGE_KEY, versionLine);
          loadScriptsSequentially(0, versionLine);
        }
      })
      .catch(err => {
        
        loadScriptsSequentially();
      });
  }

  function loadScriptsSequentially(index = 0, version = 'dev') {
    if (index >= scriptsToLoad.length) return;
    const script = document.createElement('script');
    script.src = `${scriptsToLoad[index]}?v=${version}`;
    script.onload = () => loadScriptsSequentially(index + 1, version);
    document.body.appendChild(script);
  }

  function updateVersionInfo(version, date) {
    const versionTag = document.getElementById('versionTag');
    const updatedTag = document.getElementById('updatedTag');
    if (versionTag) versionTag.textContent = `v${version}`;
    if (updatedTag) updatedTag.textContent = date;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchVersionAndLoad);
  } else {
    fetchVersionAndLoad();
  }
})();

// --- PDF Display Logic (one method for desktop, another for mobile) ---

var pdfDoc = null;
var pdfLib = null;
var currentPage = 2; // Andex chart is on the second page
var scale = 1.2;
var isRendering = false;

function isMobileDevice() {
  return (
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768 && 'ontouchstart' in window)
  );
}


async function showPDFjsFallback() {
  document.getElementById('andexPdfViewer').style.display = 'none';
  document.getElementById('andexPdfFallback').style.display = 'block';

  if (pdfDoc) {
      renderPDFPage();
      return;
  }

  const isLocal = !location.hostname.includes('github.io');
  const pdfUrl = isLocal
    ? './data/andex.pdf'
    : 'https://teamcanadapro.github.io/fintool/data/andex.pdf';

  try {
    pdfLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/es5/build/pdf.mjs');
    pdfLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/es5/build/pdf.worker.mjs';
    
    pdfDoc = await pdfLib.getDocument(pdfUrl).promise;
    renderPDFPage();
  } catch (error) {
    console.error("Error loading PDF:", error);
  }
}

function renderPDFPage() {
    if (!pdfDoc || isRendering) return;
    isRendering = true;

    pdfDoc.getPage(currentPage).then(page => {
        const canvas = document.getElementById('pdf-canvas');
        if (!canvas) {
            isRendering = false;
            return;
        }
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: scale });

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';

        page.render({
            canvasContext: context,
            viewport: viewport
        }).promise.then(() => {
            isRendering = false;
        });
    });
}


function zoomIn() {
  scale = Math.min(3.0, scale + 0.25);
  renderPDFPage();
}

function zoomOut() {
  scale = Math.max(0.5, scale - 0.25);
  renderPDFPage();
}

function tryLoadAndexPDF() {
  if (isMobileDevice()) {
    showPDFjsFallback();
  } else {
    document.getElementById('andexPdfViewer').style.display = 'block';
    document.getElementById('andexPdfFallback').style.display = 'none';
  }
}

window.addEventListener("DOMContentLoaded", () => {
    // This now correctly determines whether to use the iframe or the canvas.
    const andexTabButton = document.querySelector('.tab-btn[data-tab="andex"]');
    if (andexTabButton) {
        andexTabButton.addEventListener('click', tryLoadAndexPDF);
    }
    
    // Wire up zoom buttons for mobile view
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
});