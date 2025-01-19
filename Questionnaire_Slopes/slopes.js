//Touch Screen lag when dragging slider
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

// Coordinates
const canvasData = {
    slipperyUp: { x1: 50, y1: 150, x2: 100, y2: -50, x3: 150, y3: 150 },
    slipperyDown: { x1: 50, y1: 50, x2: 100, y2: 250, x3: 150, y3: 50 },

};

// Functions that draw the forms
function slipperySlope(id, ctx) {
const data = canvasData[id];
ctx.clearRect(0, 0, 200, 200);
ctx.beginPath();
ctx.moveTo(data.x1, data.y1);
ctx.lineTo(data.x3, data.y3)
ctx.stroke();


ctx.lineWidth = 2;

ctx.beginPath();
ctx.moveTo(data.x1, data.y1);
ctx.quadraticCurveTo(data.x2, data.y2, data.x3, data.y3)
ctx.strokeStyle = 'white';
ctx.stroke();




}


document.addEventListener("DOMContentLoaded", () => {
    Object.keys(canvasData).forEach(id => {
        const canvas = document.getElementById(`${id}Canvas`);
        const ctx = canvas.getContext("2d");
        slipperySlope(id, ctx);
    });

});

let selectedCanvas = ""; // Variable to track the selected canvas

function buttonFunctions(canvasId) {
    // Update the selected canvas ID
    selectedCanvas = canvasId;
    console.log(`Canvas ${canvasId} selected`);
}


//Question 1
var q1slider = document.getElementById("q1Range");
var q1output = document.getElementById("q1output");
q1output.innerHTML = q1slider.value;
// Update the current slider value (each time you drag the slider handle)
q1slider.oninput = function() {
q1output.innerHTML = this.value;
}

//Question 2
var q2slider = document.getElementById("q2Range");
var q2output = document.getElementById("q2output");
q2output.innerHTML = q2slider.value;
// Update the current slider value (each time you drag the slider handle)
q2slider.oninput = function() {
q2output.innerHTML = this.value;
}



// Functions for the set Button, activated after clicking
function sendQuestionnaire() {
  var q2slider = document.getElementById("q2Range");
  var q2output = document.getElementById("q2output");
  q2output.innerHTML = q2slider.value;
}