import { getDocument, GlobalWorkerOptions } from '../pdfjs/build/pdf.mjs';

GlobalWorkerOptions.workerSrc = '../pdfjs/build/pdf.worker.mjs';

let pdf = null;
let scale = 1.5;
const pageToRender = 2;
let renderInProgress = false;

function renderPDF() {
  const canvas = document.getElementById('pdf-canvas');
  const ctx = canvas.getContext('2d');

  if (!pdf || renderInProgress || !canvas) return;

  renderInProgress = true;
  pdf.getPage(pageToRender).then((page) => {
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    return page.render({ canvasContext: ctx, viewport }).promise;
  }).then(() => {
    renderInProgress = false;
  }).catch((err) => {
    console.error('[Render Error]', err);
    renderInProgress = false;
  });
}

function zoomIn() {
  if (scale < 3.0) {
    scale += 0.25;
    renderPDF();
  }
}

function zoomOut() {
  if (scale > 0.5) {
    scale -= 0.25;
    renderPDF();
  }
}

function setupViewer() {
  if (!pdf) {
    getDocument('../data/andex.pdf').promise.then((doc) => {
      pdf = doc;
      renderPDF();
    }).catch((err) => {
      console.error('[PDF ERROR]', err.message);
    });
  } else {
    renderPDF();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Attach zoom handlers to all matching buttons
  document.querySelectorAll('.zoomInBtn').forEach(btn =>
    btn.addEventListener('click', zoomIn)
  );

  document.querySelectorAll('.zoomOutBtn').forEach(btn =>
    btn.addEventListener('click', zoomOut)
  );

  // Load chart when the tab is clicked
  const tabBtn = document.querySelector('[data-tab="andex"]');
  tabBtn?.addEventListener('click', () => {
    setTimeout(setupViewer, 100);
  });

  // Observe dark mode changes and re-render the chart
  const observer = new MutationObserver(() => {
    if (pdf) renderPDF(); // Force re-render when dark mode toggles
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
});
window.renderAndexPDF = renderPDF;
