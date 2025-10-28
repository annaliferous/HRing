// Initial SetUp
const calibrationSection = document.getElementById("calibration");
const screenSection = document.getElementById("screen");

const calibrationSlider = document.getElementById("calibration_slider");
const screenSlider = document.getElementById("screen_slider");
const participationIdInput = document.getElementById("participation_id");
const calibrationOutput = document.getElementById("demo");

const url = "http://localhost:3000/save/";

let startTime, stopTime;
let calibrationValue = 0;
let participation_id = 0;
let participation_id_matrix = 0;
let currentModeIndex = 0;

// Slider Drag for touch (no lagging)
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
}

[calibrationSlider, screenSlider].forEach((slider) => {
  slider.addEventListener("mousedown", startDrag);
  slider.addEventListener("touchstart", startDrag);
});
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", endDrag);
document.addEventListener("touchmove", drag);
document.addEventListener("touchend", endDrag);

// Calibration
calibrationSlider.addEventListener("input", () => {
  calibrationOutput.textContent = calibrationSlider.value;
  //TODO
  let currentCalVal = calibrationSlider.value;
  const sendCurrentCalVal = url + "main/" + currentCalVal;
  console.log(`Current CalVal "${currentCalVal}"`);
  fetch(sendCurrentCalVal).catch((err) =>
    console.error("❌ Fetch error:", err)
  );
});
document.getElementById("calibration_send").addEventListener("click", () => {
  if (!participationIdInput.value) {
    alert("Please enter a Participation ID!");
    return;
  }
  calibrationValue = parseInt(calibrationSlider.value);
  participation_id = parseInt(participationIdInput.value);
  participation_id_matrix =
    parseInt(participationIdInput.value) % modeMatrix.length;

  // Send calibrationValue + participantId
  fetch(url + "participationId/" + participation_id);
  fetch(url + "calibrationValue/" + calibrationValue);

  choosePath();

  calibrationSection.style.display = "none";
  screenSection.style.display = "block";
});

// Screen Slider
screenSlider.addEventListener("mousedown", () => {
  startTime = Date.now();
  fetch(url + "startTime/" + startTime);
});

screenSlider.addEventListener("mouseup", () => {
  if (screenSlider.value >= screenSlider.max) {
    stopTime = Date.now();
    fetch(url + "stopTime/" + stopTime);

    setTimeout(() => {
      screenSlider.value = 0;
      nextMode();
    }, 100);
  } else {
    alert("Please start from the beginning");
    screenSlider.value = 0;
  }
});

screenSlider.addEventListener("input", () => {
  const picoValue = realTimeCalculation();
  const currentMode = modeMatrix[participation_id_matrix][currentModeIndex];

  const endpoint = url + "main/" + picoValue;
  console.log(`📤 Mode "${currentMode}" → PicoValue: ${picoValue}`);
  fetch(endpoint).catch((err) => console.error("❌ Fetch error:", err));
});

// the Modes
// https://damienmasson.com/tools/latin_square/
const modeMatrix = [
  [/* 0: */ "up", "down", "tartarus", "olymp"],
  [/* 1: */ "down", "olymp", "up", "tartarus"],
  [/* 2: */ "olymp", "tartarus", "down", "up"],
  [/* 3: */ "tartarus", "up", "olymp", "down"],
];

const conditionMatrix = [
  [0, "up", 25, null],
  [1, "up", 50, null],
  [2, "up", 75, null],
  [3, "up", 100, null],
  [4, "down", 25, null],
  [5, "down", 50, null],
  [6, "down", 75, null],
  [7, "down", 100, null],
  [8, "olymp", 25, null],
  [9, "olymp", 50, null],
  [10, "olymp", 75, null],
  [11, "olymp", 100, null],
  [12, "tartarus", 25, null],
  [13, "tartarus", 50, null],
  [14, "tartarus", 75, null],
  [15, "tartarus", 100, null],
];

function choosePath() {
  const currentMode = modeMatrix[participation_id_matrix][currentModeIndex];
  console.log(`🎯 Starting mode: ${currentMode}`);
  fetch(url + "mode/" + currentMode);
}

function nextMode() {
  currentModeIndex++;
  if (currentModeIndex >= modeMatrix[participation_id_matrix].length) {
    currentModeIndex = 0;
    console.log("🔁 Restarting mode cycle");
  }
  choosePath();
}

// ===== CALCULATION =====
function realTimeCalculation() {
  const sliderValue = parseInt(screenSlider.value);
  const min_pico_value = calibrationValue;
  const max_pico_value = 80 + calibrationValue;

  let actualPicoValue =
    min_pico_value + (sliderValue / 100) * (max_pico_value - min_pico_value);

  const currentMode = modeMatrix[participation_id_matrix][currentModeIndex];

  if (currentMode === "down") {
    actualPicoValue = max_pico_value - (actualPicoValue - min_pico_value);
  } else if (currentMode === "olymp") {
    if (sliderValue <= 50) {
      min_pico_value + (sliderValue / 100) * (max_pico_value - min_pico_value);
    } else {
      actualPicoValue = max_pico_value - (actualPicoValue - min_pico_value);
    }
  } else if (currentMode === "tartarus") {
    if (sliderValue > 50) {
      min_pico_value + (sliderValue / 100) * (max_pico_value - min_pico_value);
    } else {
      actualPicoValue = max_pico_value - (actualPicoValue - min_pico_value);
    }
  }

  return Math.round(actualPicoValue);
}
