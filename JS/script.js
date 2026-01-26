// Funkcijų vizualizatorius


let currentFunction = "exp";

const aRange = document.getElementById("aRange");
const bRange = document.getElementById("bRange");
const formulaDisplay = document.querySelector(".formulaDisplay");
const buttons = document.querySelectorAll(".v-design");
const aValueLabel = document.getElementById("aValue");
const bValueLabel = document.getElementById("bValue");

// Canvas
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

// Graph settings
const graph = {
  width: canvas.width,
  height: canvas.height,
  xMin: -4,
  xMax: 4,
  yMin: -10,
  yMax: 10,
  padding: 28
};

// Funkcijų formulės
function getFormula(a, b) {
  a = Number(a).toFixed(1);
  b = Number(b).toFixed(1);

  switch (currentFunction) {
    case "linear":
      return `y = ${a}x + ${b}`;
    case "quadratic":
      return `y = ${a}x² + ${b}`;
    case "sin":
      return `y = ${a}·sin(x) + ${b}`;
    case "exp":
      return `y = ${a}·e<sup>x</sup> + ${b}`;
  }
}

// Sliderių atnaujinimas
function updateFormula() {
  formulaDisplay.innerHTML = getFormula(aRange.value, bRange.value);
  aValueLabel.textContent = Number(aRange.value).toFixed(1);
  bValueLabel.textContent = Number(bRange.value).toFixed(1);
  draw();
}

// Mygtukų logika
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFunction = btn.dataset.type;
    updateFormula();
  });
});

// Sliderių eventai
aRange.addEventListener("input", updateFormula);
bRange.addEventListener("input", updateFormula);

// Init
updateFormula();

// ensure one active button is present
if (![...buttons].some(b => b.classList.contains('active'))) {
  const first = buttons[0];
  if (first) first.classList.add('active');
}

// Helpers to map coords
function xToCanvas(x) {
  const { xMin, xMax, padding } = graph;
  const usable = graph.width - padding * 2;
  return (x - xMin) / (xMax - xMin) * usable + padding;
}

function yToCanvas(y) {
  const { yMin, yMax, padding } = graph;
  const usable = graph.height - padding * 2;
  // invert y for canvas
  return padding + (yMax - y) / (yMax - yMin) * usable;
}

function clear() {
  ctx.clearRect(0,0,graph.width,graph.height);
}

function drawGrid() {
  const { xMin, xMax, yMin, yMax, padding } = graph;
  const gridColor = document.body.classList.contains('dark') ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
  const axisColor = document.body.classList.contains('dark') ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.5)';

  // background
  ctx.fillStyle = document.body.classList.contains('dark') ? '#0b0f12' : '#f5f7f9';
  ctx.fillRect(0,0,graph.width,graph.height);

  // vertical grid lines
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    const cx = xToCanvas(x);
    ctx.beginPath();
    ctx.moveTo(cx, padding);
    ctx.lineTo(cx, graph.height - padding);
    ctx.strokeStyle = (x === 0) ? axisColor : gridColor;
    ctx.lineWidth = (x === 0) ? 2 : 1;
    ctx.stroke();
  }

  // horizontal grid lines
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
    const cy = yToCanvas(y);
    ctx.beginPath();
    ctx.moveTo(padding, cy);
    ctx.lineTo(graph.width - padding, cy);
    ctx.strokeStyle = (y === 0) ? axisColor : gridColor;
    ctx.lineWidth = (y === 0) ? 2 : 1;
    ctx.stroke();
  }

  // ticks labels
  ctx.fillStyle = document.body.classList.contains('dark') ? '#bfc7cc' : '#333';
  ctx.font = '12px sans-serif';
  // x labels
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    const cx = xToCanvas(x);
    ctx.fillText(String(x), cx - 6, graph.height - padding + 18);
  }
  // y labels
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
    const cy = yToCanvas(y);
    ctx.fillText(String(y), padding - 26, cy + 4);
  }
}

function evalFunction(x, a, b) {
  switch (currentFunction) {
    case 'linear': return a * x + b;
    case 'quadratic': return a * x * x + b;
    case 'sin': return a * Math.sin(x) + b;
    case 'exp': return a * Math.exp(x) + b;
  }
}

function draw() {
  // sync sizes
  graph.width = canvas.width = canvas.clientWidth || canvas.width;
  graph.height = canvas.height = canvas.clientHeight || canvas.height;
  // adjust padding by computed border width so content sits inside frame
  const style = getComputedStyle(canvas);
  const border = parseInt(style.borderLeftWidth || '0', 10);
  graph.padding = Math.max(20, 28 + border);
  clear();
  drawGrid();

  const a = Number(aRange.value);
  const b = Number(bRange.value);

  // draw curve
  ctx.beginPath();
  let first = true;
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#ff8a3d';
  for (let px = 0; px <= graph.width; px++) {
    const x = graph.xMin + (px / graph.width) * (graph.xMax - graph.xMin);
    let y = evalFunction(x, a, b);
    // clamp y to drawing area for continuity
    const cx = xToCanvas(x);
    const cy = yToCanvas(y);
    if (first) { ctx.moveTo(cx, cy); first = false; }
    else ctx.lineTo(cx, cy);
  }
  ctx.stroke();
}

// Redraw when theme changes
document.getElementById('themeToggle').addEventListener('click', () => {
  setTimeout(draw, 20);
});

// initial draw
window.addEventListener('load', () => {
  // resize canvas to CSS pixels
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width);
  canvas.height = Math.round(rect.height);
  draw();
});

window.addEventListener('resize', () => {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width);
  canvas.height = Math.round(rect.height);
  draw();
});
