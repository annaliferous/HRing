// ===== INITIAL SETUP =====

const calibrationSection = document.getElementById("calibration");
const screenSection = document.getElementById("screen");

const calibrationSlider = document.getElementById("calibration_slider");
const screenSlider = document.getElementById("screen_slider");
const participationIdInput = document.getElementById("participation_id");
const calibrationOutput = document.getElementById("demo");

const url = "http://localhost:3000/save/";

let currentFunctionIndex = 0;
let startTime, stopTime;
let calibrationValue = 0;

// ===== SLIDER DRAG FOR TOUCH ===== //
function createSlider() {
  const trialSlider = document.getElementById("screen");
  trialSlider.innerHTML = `
  <div class="container">
    <div class="outline">
      <div class="headline">
        <p>Please move the circle to the end point</p>
      </div>
      <div class="slidecontainer">
        <input
          type="range"
          min="0"
          max="100"
          value="0"
          class="slider"
          id="screen_slider"
        />
      </div>
    </div>
  </div>;`;
}

// ===== SLIDER DRAG FOR TOUCH ===== //
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

// ===== CALIBRATION EVENTS ===== //
calibrationSlider.addEventListener("input", () => {
  calibrationOutput.textContent = calibrationSlider.value;
});
document.getElementById("calibration_send").addEventListener("click", () => {
  if (!participationIdInput.value) {
    alert("Please enter a Participation ID!");
    return;
  }
  calibrationValue = parseInt(calibrationSlider.value);

  let partId = url + "participationId/" + participationIdInput.value;
  fetch(partId);

  let calVal = url + "calibrationValue/" + calibrationValue;
  fetch(calVal);

  calibrationSection.style.display = "none";
  screenSection.style.display = "block";
});

// ===== SCREEN SLIDER EVENTS =====

let functions = ["up", "slopDown"];
let random;
function chooseFunction(arr) {
  for (let i; i < arr.length; i++) {
    random = arr[Math.random];
  }
  return random;
}

screenSlider.addEventListener("mousedown", () => {
  startTime = Date.now();
  let start = url + "startTime/" + startTime;
  fetch(start);
});

screenSlider.addEventListener("input", () => {
  let main = url + screenSlider.value;
  console.log(main);
  fetch(main);
});

screenSlider.addEventListener("mouseup", () => {
  if (screenSlider.value == screenSlider.max) {
    stopTime = Date.now();
    let stop = url + "stopTime/" + startTime;
    fetch(stop);

    screenSlider.value = 0;
  } else {
    alert("Please start from the beginning");
    screenSlider.value = 0;
  }
});
