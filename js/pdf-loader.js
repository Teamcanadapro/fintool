// pdf-loader.js
import * as pdfjsLib from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/es5/build/pdf.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/es5/build/pdf.worker.mjs';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const url = isLocalhost
  ? '/data/andex.pdf'
  : 'https://teamcanadapro.github.io/fintool/data/andex.pdf';

const canvas = document.getElementById('pdf-canvas');
if (canvas) {
  const context = canvas.getContext('2d');
  pdfjsLib.getDocument(url).promise.then(pdf => {
    pdf.getPage(1).then(page => {
      const viewport = page.getViewport({ scale: 1.25 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      page.style = "max-width:100%;height:auto;";
      page.render({ canvasContext: context, viewport });
    });
  });
}

