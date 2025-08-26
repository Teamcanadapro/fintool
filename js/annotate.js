let canvas, ctx, drawing = false;
let currentColor = "#ff0000";
let activePointers = new Set();

function toggleCanvas() {
  const controls = document.getElementById("annotateControls");

  if (!canvas) {
    canvas = document.createElement("canvas");

    // 👇 Handle full-screen responsive canvas
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    Object.assign(canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      zIndex: "10000",
      pointerEvents: "auto",
      display: "block",
      cursor: "crosshair",
      touchAction: "none"
    });

    document.body.appendChild(canvas);

    ctx = canvas.getContext("2d");
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    canvas.addEventListener("pointerdown", e => {
      activePointers.add(e.pointerId);
      if (activePointers.size === 1) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
        e.preventDefault();
      }
    });

    canvas.addEventListener("pointermove", e => {
      if (drawing && activePointers.size === 1) {
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        e.preventDefault();
      }
    }, { passive: false });

    canvas.addEventListener("pointerup", e => {
      activePointers.delete(e.pointerId);
      if (activePointers.size === 0) drawing = false;
    });

    canvas.addEventListener("pointercancel", e => {
      activePointers.delete(e.pointerId);
      if (activePointers.size === 0) drawing = false;
    });

  } else {
   const visible = canvas.style.display !== "none";
canvas.style.display = visible ? "none" : "block";

// Disable page scrolling/zooming while annotation is active
if (!visible) {
  document.body.style.touchAction = 'none';
  document.body.style.overflow = 'hidden';
  document.documentElement.style.touchAction = 'none';
  document.documentElement.style.overflow = 'hidden';
} else {
  document.body.style.touchAction = '';
  document.body.style.overflow = '';
  document.documentElement.style.touchAction = '';
  document.documentElement.style.overflow = '';
}


  }

  const visible = controls.style.display === "flex";
  controls.style.display = visible ? "none" : "flex";
}

function setPenColor(color) {
  currentColor = color;
  if (ctx) ctx.strokeStyle = currentColor;
}

function clearCanvas() {
  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

document.getElementById("toggleAnnotateBtn").addEventListener("click", toggleCanvas);
