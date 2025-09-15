// ===== INITIAL SETUP =====
const calibrationSection = document.getElementById("calibration");
const screenSection = document.getElementById("screen");
const selectionSection = document.getElementById("selection");

const calibrationSlider = document.getElementById("calibration_slider");
const screenSlider = document.getElementById("screen_slider");
const participationIdInput = document.getElementById("participation_id");
const calibrationOutput = document.getElementById("demo");

let currentFunctionIndex = 0;
let startTime, stopTime;
let selectedCanvas = "";
let calibrationValue = parseInt(localStorage.getItem("calibrationValue")) || 0;

// ===== SLIDER DRAG FIX FOR TOUCH =====
let isDragging = false;

function startDrag(e) {
  isDragging = true;
  updateSlider(e);
}
function endDrag() {
  isDragging = false;
}
function drag(e) {
  if (isDragging) updateSlider(e);
}
function updateSlider(e) {
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  // (Optional) custom slider position logic
}

[calibrationSlider, screenSlider].forEach((slider) => {
  slider.addEventListener("mousedown", startDrag);
  slider.addEventListener("touchstart", startDrag);
});
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", endDrag);
document.addEventListener("touchmove", drag);
document.addEventListener("touchend", endDrag);

// ===== FUNCTION MAPPINGS =====
function riseCalc(min, max, value) {
  screenSlider.min = calibrationValue + min;
  screenSlider.max = calibrationValue + max;
  return value;
}
function fallCalc(min, max, value) {
  screenSlider.max = calibrationValue + min;
  screenSlider.min = calibrationValue + max;
  return screenSlider.max - value;
}
function olympCalc(min, max, value) {
  const minVal = calibrationValue + min;
  const maxVal = calibrationValue + max;
  const midVal = (minVal + maxVal) / 2;
  screenSlider.min = minVal;
  screenSlider.max = maxVal;
  return value <= midVal ? (value - minVal) * 2 : (maxVal - value) * 2;
}
function tartarusCalc(min, max, value) {
  const minVal = calibrationValue + min;
  const maxVal = calibrationValue + max;
  const midVal = (minVal + maxVal) / 2;
  screenSlider.min = minVal;
  screenSlider.max = maxVal;
  return value <= midVal ? (midVal - value) * 2 : (value - midVal) * 2;
}

const funcArray = [
  (value) => riseCalc(0, 50, value),
  (value) => fallCalc(80, 0, value),
  (value) => olympCalc(0, 100, value),
  (value) => tartarusCalc(90, 0, value),
];

// ===== INITIALIZE SLIDER FOR CURRENT FUNCTION =====
function initializeSliderForCurrentFunction() {
  if (currentFunctionIndex < funcArray.length) {
    screenSlider.value = screenSlider.min;
    funcArray[currentFunctionIndex](screenSlider.value);
    screenSlider.disabled = false;
  } else {
    screenSlider.disabled = true;
    alert("All functions completed!");
  }
}

// ===== CALIBRATION EVENTS =====
calibrationSlider.addEventListener("input", () => {
  calibrationOutput.textContent = calibrationSlider.value;
  fetchValue(calibrationSlider.value);
});
document.getElementById("calibration_send").addEventListener("click", () => {
  if (!participationIdInput.value) {
    alert("Please enter a Participation ID!");
    return;
  }
  calibrationValue = parseInt(calibrationSlider.value);
  localStorage.setItem("calibrationValue", calibrationValue);

  sendData("/save", {
    calibrationValue,
    participationId: participationIdInput.value,
  });

  calibrationSection.style.display = "none";
  screenSection.style.display = "block";
  initializeSliderForCurrentFunction();
});

// ===== SCREEN SLIDER EVENTS =====
screenSlider.addEventListener("mousedown", () => {
  if (screenSlider.value == screenSlider.min) startTime = Date.now();
});
screenSlider.addEventListener("input", () => {
  if (currentFunctionIndex < funcArray.length) {
    const value = funcArray[currentFunctionIndex](screenSlider.value);
    fetchValue(value);
  }
});
screenSlider.addEventListener("mouseup", () => {
  if (screenSlider.value == screenSlider.max) {
    screenSection.style.display = "none";
    selectionSection.style.display = "block";
    stopTime = Date.now();
    sendData("/save", {
      startTime,
      stopTime,
      participationId: participationIdInput.value,
      functionIndex: currentFunctionIndex,
    }).then(() => {
      screenSection.style.display = "none";
      selectionSection.style.display = "block";
    });
  }
});

// ===== CANVAS DRAWING =====
const canvasData = {
  rise: { x1: 150, y1: 150, x2: 150, y2: 50, x3: 50, y3: 150 },
  fall: { x1: 50, y1: 150, x2: 50, y2: 50, x3: 150, y3: 150 },
  olymp: { x1: 20, y1: 150, x2: 100, y2: 50, x3: 180, y3: 150 },
  tartarus: {
    x1: 20,
    y1: 50,
    x2: 20,
    y2: 150,
    x3: 180,
    y3: 150,
    x4: 180,
    y4: 50,
    x5: 100,
    y5: 120,
  },
};

// Functions that draw the forms 
function rise_and_fall(id, ctx) { 
    const data = canvasData[id]; ctx.clearRect(0, 0, 200, 200); 
    ctx.beginPath(); 
    ctx.moveTo(data.x1, data.y1); 
    ctx.lineTo(data.x2, data.y2); 
    ctx.lineTo(data.x3, data.y3); 
    ctx.closePath(); ctx.stroke(); 
    ctx.lineWidth = 2; ctx.beginPath(); 
    ctx.moveTo(data.x2, data.y2); 
    ctx.lineTo(data.x3, data.y3); 
    ctx.strokeStyle = "white"; 
    ctx.stroke(); 
} 
    
function olymp(id, ctx) { 
    const data = canvasData[id]; 
    ctx.clearRect(0, 0, 200, 200); 
    ctx.beginPath(); 
    ctx.moveTo(data.x1, data.y1); 
    ctx.lineTo(data.x2, data.y2); 
    ctx.lineTo(data.x3, data.y3); 
    ctx.closePath(); ctx.stroke(); 
    ctx.lineWidth = 2; ctx.beginPath(); 
    ctx.moveTo(data.x1, data.y1); 
    ctx.lineTo(data.x2, data.y2); 
    ctx.lineTo(data.x3, data.y3); 
    ctx.strokeStyle = "white"; 
    ctx.stroke(); 
} 
    
function tartarus(id, ctx) { 
    const data = canvasData[id]; 
    ctx.clearRect(0, 0, 200, 200); 
    ctx.beginPath(); 
    ctx.moveTo(data.x1, data.y1); 
    ctx.lineTo(data.x2, data.y2); 
    ctx.lineTo(data.x3, data.y3); 
    ctx.lineTo(data.x4, data.y4); 
    ctx.lineTo(data.x5, data.y5); 
    ctx.closePath(); ctx.stroke(); 
    ctx.lineWidth = 2; 
    ctx.beginPath(); 
    ctx.moveTo(data.x1, data.y1); 
    ctx.lineTo(data.x5, data.y5); 
    ctx.lineTo(data.x4, data.y4); 
    ctx.strokeStyle = "white"; 
    ctx.stroke(); } 
    
document.addEventListener("DOMContentLoaded", () => { Object.keys(canvasData).forEach((id) => { const canvas = document.getElementById(${id}Canvas); if (canvas) { const ctx = canvas.getContext("2d"); switch (id) { case "olymp": olymp(id, ctx); break; case "tartarus": tartarus(id, ctx); break; default: rise_and_fall(id, ctx); } } }); });

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".canvas-container").forEach((container) => {
    const id = container.dataset.id;
    const ctx = container.querySelector("canvas").getContext("2d");
    drawCanvas(id, ctx);
  });
});

// ===== CANVAS SELECTION =====
document.querySelectorAll(".select-canvas").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const canvasId = e.target.closest(".canvas-container").dataset.id;
    selectedCanvas = canvasId;
    sendData("/save", {
      canvasId,
      participationId: participationIdInput.value,
      functionIndex: currentFunctionIndex,
    }).then(() => {
      document.getElementById("canvases").style.display = "none";
      document.getElementById("q1").style.display = "block";
      document.getElementById("q2").style.display = "block";
    });
  });
});

// ===== QUESTIONNAIRE =====
document.getElementById("q1Range").addEventListener("input", (e) => {
  document.getElementById("q1output").textContent = e.target.value;
});
document.getElementById("q2Range").addEventListener("input", (e) => {
  document.getElementById("q2output").textContent = e.target.value;
});
document
  .getElementById("questionnaire_submit")
  .addEventListener("click", () => {
    const q1Value = document.getElementById("q1Range").value;
    const q2Value = document.getElementById("q2Range").value;
    sendData("/save", {
      q1slider: q1Value,
      q2slider: q2Value,
      participationId: participationIdInput.value,
      functionIndex: currentFunctionIndex,
    }).then(() => {
      currentFunctionIndex++;
      if (currentFunctionIndex < funcArray.length) {
        selectionSection.style.display = "none";
        screenSection.style.display = "block";
        screenSlider.value = screenSlider.min;
        initializeSliderForCurrentFunction();
      } else {
        alert("Thank you for your participation!");
      }
    });
  });

// ===== HELPER FUNCTIONS =====
function fetchValue(value) {
  fetch("http://localhost:3000/live", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
}
function sendData(endpoint, data) {
  return fetch(`http://localhost:3000${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.text());
}
