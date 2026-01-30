// Funkcijų vizualizatorius


let currentFunction = "power";

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
    case "log":
      return `y = ${a}·log(x) + ${b}`;
    case "power":
      return `y = ${a}·x^${b}`;
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
  case 'log': return (x <= 0) ? NaN : a * Math.log(x) + b;
  case 'power': {
    if (x < 0 && Math.abs(b % 1) > 1e-9) return NaN;
    return a * Math.pow(x, b);
  }
  }
}

function drawAxes() {
  const { xMin, xMax, yMin, yMax } = graph;
  ctx.save();
  ctx.strokeStyle = '#062626';
  ctx.fillStyle = '#062626';
  ctx.lineWidth = 2;

  // X axis
  if (yMin <= 0 && yMax >= 0) {
    const y0 = yToCanvas(0);
    ctx.beginPath();
    ctx.moveTo(xToCanvas(xMin), y0);
    ctx.lineTo(xToCanvas(xMax), y0);
    ctx.stroke();
    const ax = xToCanvas(xMax);
    ctx.beginPath();
    ctx.moveTo(ax - 10, y0 - 6);
    ctx.lineTo(ax, y0);
    ctx.lineTo(ax - 10, y0 + 6);
    ctx.fill();
  }

  // Y axis
  if (xMin <= 0 && xMax >= 0) {
    const x0 = xToCanvas(0);
    ctx.beginPath();
    ctx.moveTo(x0, yToCanvas(yMin));
    ctx.lineTo(x0, yToCanvas(yMax));
    ctx.stroke();
    const ay = yToCanvas(yMax);
    ctx.beginPath();
    ctx.moveTo(x0 - 6, ay + 10);
    ctx.lineTo(x0, ay);
    ctx.lineTo(x0 + 6, ay + 10);
    ctx.fill();
  }

  ctx.restore();
}

function draw() {
  // sync sizes
  graph.width = canvas.width = canvas.clientWidth || canvas.width;
  graph.height = canvas.height = canvas.clientHeight || canvas.height;
  const style = getComputedStyle(canvas);
  const border = parseInt(style.borderLeftWidth || '0', 10);
  graph.padding = Math.max(20, 28 + border);
  clear();
  drawGrid();

  const a = Number(aRange.value);
  const b = Number(bRange.value);

  
  ctx.beginPath();
  let started = false;
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#ff8a3d';
  for (let px = 0; px <= graph.width; px++) {
    const x = graph.xMin + (px / graph.width) * (graph.xMax - graph.xMin);
    let y = evalFunction(x, a, b);
    if (!isFinite(y) || Number.isNaN(y)) {
      // break the path on invalid points
      started = false;
      continue;
    }
    const cx = xToCanvas(x);
    const cy = yToCanvas(y);
    if (!started) {
      ctx.moveTo(cx, cy);
      started = true;
    } else {
      ctx.lineTo(cx, cy);
    }
  }
  ctx.stroke();

  // draw axis arrows on top
  drawAxes();
}

// Redraw when theme changes
document.getElementById('themeToggle').addEventListener('click', () => {
  setTimeout(draw, 20);
});

// initial draw
window.addEventListener('load', () => {
  
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
