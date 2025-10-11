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
let calibrationValue = 0;

// ===== SLIDER DRAG FOR TOUCH =====
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
  if (currentFunctionIndex <= funcArray.length) {
    // Set new Range
    //funcArray[currentFunctionIndex](screenSlider.value);
    funcArray[currentFunctionIndex](calibrationValue);
    // Set new Min
    //screenSlider.value = screenSlider.min;
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
    stopTime = Date.now();
    sendData("/save", {
      startTime,
      stopTime,
      participationId: participationIdInput.value,
      functionIndex: currentFunctionIndex,
    }).then(() => {
      screenSlider.value = 0;
      currentFunctionIndex++;
      initializeSliderForCurrentFunction();
    });
  }
});

// ===== HELPER FUNCTIONS =====
function fetchValue(value) {
  // Placeholder for server communication
  console.log("Fetching value:", value);
}
function sendData(endpoint, data) {
  // Placeholder for server communication
  console.log("Sending data to", endpoint, ":", data);
  return Promise.resolve("Success");
}
