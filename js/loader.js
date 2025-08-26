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
var currentPage = 1;
var scale = 1.2;

function isMobileDevice() {
  return (
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768 && 'ontouchstart' in window)
  );
}


async function showPDFjsFallback() {
  document.getElementById('andexPdfViewer').style.display = 'none';
  document.getElementById('andexPdfFallback').style.display = 'block';

  const pdfjsLib = await import('../pdfjs/build/pdf.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '../pdfjs/build/pdf.worker.mjs';

  const url = '../data/andex.pdf';
  pdfDoc = await pdfjsLib.getDocument(url).promise;
  renderPDFPage(pdfjsLib);
}

function renderPDFPage(pdfjsLib) {
  pdfDoc.getPage(currentPage).then(page => {
    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');

    const devicePixelRatio = window.devicePixelRatio || 1;
    const outputScale = scale * devicePixelRatio;

    const viewport = page.getViewport({ scale: outputScale });

    // Set canvas resolution in physical pixels
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // ✅ Make canvas fit device width
    canvas.style.width = '100%';
    canvas.style.height = 'auto';

    // High-DPI clarity
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    page.render({
      canvasContext: context,
      viewport: viewport
    });
  });
}


function zoomIn() {
  scale += 0.25;
  showPDFjsFallback();
}

function zoomOut() {
  scale = Math.max(0.5, scale - 0.25);
  showPDFjsFallback();
}

function tryLoadAndexPDF() {
  const isMobile = isMobileDevice();

  if (isMobile) {
    
    document.getElementById('andexPdfViewer').style.display = 'none';
    document.getElementById('andexPdfFallback').style.display = 'block';
    showPDFjsFallback();
  } else {
    
    document.getElementById('andexPdfViewer').style.display = 'block';
    document.getElementById('andexPdfFallback').style.display = 'none';
  }
}

window.addEventListener("DOMContentLoaded", tryLoadAndexPDF);
