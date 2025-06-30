//Only show Calibration slider in the beginning
document.getElementById("screen").style.display = "none";
document.getElementById("selection").style.display = "none";

//Define Sliders
const calibration_slider = document.getElementById('calibration_slider');
const screen_slider = document.getElementById('screen_slider');
const participation_id = document.getElementById('participation_id');

//Fixing TouchScreen lag when dragging slider
let isDragging = false;

const startDrag = (e) => {
    isDragging = true;
    updateSlider(e);
};

const endDrag = () => {
    isDragging = false;
};

const drag = (e) => {
    if (isDragging) {
        updateSlider(e);
    }
};

const updateSlider = (e) => {
    let clientX;
    if (e.touches) {
        clientX = e.touches[0].clientX;
    } else {
        clientX = e.clientX;
    }
    // Update slider position logic here using clientX
};

// Time how long dragging the slider takes
let startTime;
let stopTime;
let lastTimestamp = null;
let minInterval = 350;  // Minimum time (ms) between movements to avoid "too quick" warning
let maxInterval = 400; 

screen_slider.addEventListener('mousedown', () => {
    if (screen_slider.value == screen_slider.min) {
        isDragging = true;
        startTime = Date.now(); // Record the start time
        console.log('Start time:', startTime);
    }
});

// Detect when the slider is dragged (input event)
//sending value to pico
calibration_slider.addEventListener('input', () => {
    const value = calibration_slider.value;
    fetch("http://localhost:3000/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
    })
    .catch(err => console.error('Live value send error:', err));
});

// sending values to the pico
screen_slider.addEventListener('mouseup', () => {
    // BUGFIX: Entferne das "res" am Ende der Zeile
    const participationId = participation_id.value;
    
    if (screen_slider.value == screen_slider.max) {
        stopTime = Date.now(); 
        console.log('Stop time:', stopTime);
        
        fetch("http://localhost:3000/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                startTime,
                stopTime,
                participationId
            }),
        })
        .then(response => response.text())
        .then(data => {
            console.log('Time data saved:', data);
            alert(data);
        })
        .catch(err => console.error('Save time data error:', err));
    }
}); 

// Calibration
const sliders = [calibration_slider, screen_slider];
sliders.forEach(slider => {
    slider.addEventListener('mousedown', startDrag);
    slider.addEventListener('touchstart', startDrag);
});

document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchmove', drag);
document.addEventListener('touchend', endDrag);

//show current value
var output = document.getElementById("demo");
output.innerHTML = calibration_slider.value;

calibration_slider.addEventListener('input', function() {
    const value = this.value;
    calibration_sendSliderValue(value);  // Call sendSliderValue when slider moves
    output.innerHTML = value;  // Update the displayed value
});

// Saves the current Slider value in localStorage
function setSliderValue(value){
    const calibrationValue = parseInt(value);
    localStorage.setItem('calibrationValue', calibrationValue);
}

function calibration_sendSliderValue(value) {
    // You can do something useful here, like logging or storing the value
    console.log("Slider value:", value);
}

// Functions activated after clicking the Button "Send"
function sendButtonFunction(){
    const calibrationValue = calibration_slider.value;
    const participationId = participation_id.value;

    // Validierung
    if (!participationId) {
        alert('Bitte geben Sie eine Participation ID ein!');
        return;
    }

    setSliderValue(calibrationValue);
    console.log('Calibration value:', calibrationValue);
    
    document.getElementById("calibration").style.display = "none";
    document.getElementById("screen").style.display = "block";

    fetch("http://localhost:3000/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            calibrationValue,
            participationId
        }),
    })
    .then(response => response.text())
    .then(data => {
        console.log('Calibration data saved:', data);
        // Entferne Alert hier, da es störend sein kann
        // alert(data);
    })
    .catch(err => {
        console.error('Save calibration error:', err);
        alert('Fehler beim Speichern der Kalibrierdaten');
    });
}

// Screen

// Retrieve the values from localStorage
const calibrationValue = parseInt(localStorage.getItem('calibrationValue')) || 0;
//Get slider
const slider = document.getElementById('screen_slider');

// Calculate degrees from slider value for rise
function riseCalc(min, max, value) {  
    const slider = document.getElementById('screen_slider'); 
    slider.min = parseInt(calibrationValue) + min;
    slider.max = parseInt(calibrationValue) + max;
    return value;
};

// Calculate degrees from slider value for fall
function fallCalc(min, max, value){
    const slider = document.getElementById('screen_slider');
    slider.max = parseInt(calibrationValue) + min;
    slider.min = parseInt(calibrationValue) + max;
    return slider.max - value;
}

function olympCalc(min, max, value) {
    const minVal = parseInt(calibrationValue) + min;
    const maxVal = parseInt(calibrationValue) + max;
    const midVal = (minVal + maxVal) / 2;

    slider.min = minVal;
    slider.max = maxVal;

    if (value <= midVal) {
        // Rising part
        return (value - minVal) * 2;
    } else {
        // Falling part
        return (maxVal - value) * 2;
    }
}

function tartarusCalc(min, max, value) {
    const minVal = parseInt(calibrationValue) + min;
    const maxVal = parseInt(calibrationValue) + max;
    const midVal = (minVal + maxVal) / 2;

    slider.min = minVal;
    slider.max = maxVal;

    if (value <= midVal) {
        // Falling part
        return (midVal - value) * 2;
    } else {
        // Rising part
        return (value - midVal) * 2;
    }
}

//Fixed min and max values for the functions
const funcArray = [
    [
        (value) => riseCalc(0, 50, value),
        (value) => fallCalc(80, 0, value),
        (value) => olympCalc(0, 100, value),
        (value) => tartarusCalc(90, 0, value),
    ]
];

let currentMinMaxIndex = 0;
//activate Questionnaire
let isQuestionnaireActive = false;

// Initialize slider with the first range
function updateSliderRange(index) {
    const functions = funcArray[index];
    const currentValue = parseInt(slider.value);

    /* functions.forEach((fn, i) => {
        const simulatedValue = fn(currentValue);
        console.log(`Function ${i}:`, simulatedValue)

        fetch("http://localhost:3000/live", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: simulatedValue}),
        });
    }); */
}

//changes
updateSliderRange(currentMinMaxIndex);

// Event listener for slider
slider.addEventListener('input', () => {
    const maxVal = parseInt(slider.max);
    const currentVal = parseInt(slider.value);

    if (currentVal >= maxVal) {
        currentMinMaxIndex++;

        if (currentMinMaxIndex < funcArray.length) {
            slider.value = 0;
            updateSliderRange(currentMinMaxIndex);
        } else {
            slider.disabled = true;
            console.log('All functions complete.');
            // Aktiviere Fragebogen
            document.getElementById("screen").style.display = "none";
            document.getElementById("selection").style.display = "block";
        }
    }
});

// Selection

// Coordinates
const canvasData = {
    rise: { x1: 150, y1: 150, x2: 150, y2: 50, x3: 50, y3: 150 },
    fall: { x1: 50, y1: 150, x2: 50, y2: 50, x3: 150, y3: 150 },
    olymp: { x1: 20, y1: 150, x2: 100, y2: 50, x3: 180, y3: 150 },
    tartarus: { x1: 20, y1: 50, x2: 20, y2: 150, x3: 180, y3: 150, x4: 180, y4: 50, x5: 100, y5: 120 }
};

// Functions that draw the forms
function rise_and_fall(id, ctx) {
    const data = canvasData[id];
    ctx.clearRect(0, 0, 200, 200);
    ctx.beginPath();
    ctx.moveTo(data.x1, data.y1);
    ctx.lineTo(data.x2, data.y2);
    ctx.lineTo(data.x3, data.y3);
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(data.x2, data.y2);
    ctx.lineTo(data.x3, data.y3);
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

function olymp(id, ctx) {
    const data = canvasData[id];
    ctx.clearRect(0, 0, 200, 200);
    ctx.beginPath();
    ctx.moveTo(data.x1, data.y1);
    ctx.lineTo(data.x2, data.y2);
    ctx.lineTo(data.x3, data.y3);
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(data.x1, data.y1);
    ctx.lineTo(data.x2, data.y2);
    ctx.lineTo(data.x3, data.y3);
    ctx.strokeStyle = 'white';
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
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(data.x1, data.y1);
    ctx.lineTo(data.x5, data.y5);
    ctx.lineTo(data.x4, data.y4);
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

document.addEventListener("DOMContentLoaded", () => {
    Object.keys(canvasData).forEach(id => {
        const canvas = document.getElementById(`${id}Canvas`);
        if (canvas) {
            const ctx = canvas.getContext("2d");
            switch (id) {
                case 'olymp':
                    olymp(id, ctx);
                    break;
                case 'tartarus':
                    tartarus(id, ctx);
                    break;
                default:
                    rise_and_fall(id, ctx);
            }
        }
    });
});

let selectedCanvas = ""; // Variable to track the selected canvas

function buttonFunctions(canvasId) {
    // Update the selected canvas ID
    selectedCanvas = canvasId;
    console.log(`Canvas ${canvasId} selected`);
    
    const participationId = participation_id.value;
    
    fetch("http://localhost:3000/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            canvasId,
            participationId
        }),
    })
    .then(response => response.text())
    .then(data => {
        console.log('Canvas selection saved:', data);
        // Zeige Fragebogen-Fragen an
        document.getElementById("canvases").style.display = "none";
        document.getElementById("q1").style.display = "block";
        document.getElementById("q2").style.display = "block";
    })
    .catch(err => {
        console.error('Save canvas selection error:', err);
        alert('Fehler beim Speichern der Canvas-Auswahl');
    });
}

//Question 1
var q1slider = document.getElementById("q1Range");
var q1output = document.getElementById("q1output");
if (q1output && q1slider) {
    q1output.innerHTML = q1slider.value;
    // Update the current slider value (each time you drag the slider handle)
    q1slider.oninput = function() {
        q1output.innerHTML = this.value;
    }
}

//Question 2
var q2slider = document.getElementById("q2Range");
var q2output = document.getElementById("q2output");
if (q2output && q2slider) {
    q2output.innerHTML = q2slider.value;
    // Update the current slider value (each time you drag the slider handle)
    q2slider.oninput = function() {
        q2output.innerHTML = this.value;
    }
}

// Functions for the set Button, activated after clicking
function sendQuestionnaire() {
    const q1slider = document.getElementById("q1Range");
    const q2slider = document.getElementById("q2Range");
    const participationId = participation_id.value;

    if (!q1slider || !q2slider) {
        console.error('Slider elements not found');
        return;
    }

    const q1Value = q1slider.value;
    const q2Value = q2slider.value;

    console.log("Questionnaire submitted - Q1:", q1Value, "Q2:", q2Value);

    fetch("http://localhost:3000/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            q1slider: q1Value,
            q2slider: q2Value,
            participationId
        }),
    })
    .then(response => response.text())
    .then(data => {
        console.log('Questionnaire data saved:', data);
        alert('Vielen Dank! Das Experiment ist abgeschlossen.');
        
        // Optional: Reset für nächsten Teilnehmer
        // location.reload();
    })
    .catch(err => {
        console.error('Save questionnaire error:', err);
        alert('Fehler beim Speichern der Fragebogen-Daten');
    });
}