let canvas, ctx, drawing = false;
let currentColor = "#ff0000";

function toggleCanvas() {
  const controls = document.getElementById("annotateControls");

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Object.assign(canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      zIndex: "10000",
      pointerEvents: "auto",
      display: "block",
      cursor: "crosshair",
    });
    document.body.appendChild(canvas);

    ctx = canvas.getContext("2d");
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    canvas.addEventListener("pointerdown", e => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    });
    canvas.addEventListener("pointermove", e => {
      if (!drawing) return;
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    });
    canvas.addEventListener("pointerup", () => drawing = false);
  } else {
    const visible = canvas.style.display !== "none";
    canvas.style.display = visible ? "none" : "block";
  }

  // Toggle control menu display
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
