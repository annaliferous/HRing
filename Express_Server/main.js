//Touch screen lag when dragging slider
const slider = document.getElementById('myRange');
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

slider.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', endDrag);

slider.addEventListener('touchstart', startDrag);
document.addEventListener('touchmove', drag);
document.addEventListener('touchend', endDrag);

const socket = io()

//show current value
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.addEventListener('input', function() {
    const value = this.value;
    sendSliderValue(value);  // Call sendSliderValue when slider moves
    output.innerHTML = value;  // Update the displayed value
});



// sends the Slider values to the Pico
function sendSliderValue(value) {
    value = parseInt(value);
    console.log('${value}')
    fetch("http://localhost:3000/live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: value}),
    });
}
// Saves the current Slider value in localStorage
function set(value){
    const calibrationValue = parseInt(value);
    localStorage.setItem('calibrationValue', calibrationValue);
}

// Log connection messages
socket.on('connect', () => {
    console.log('Connected to the server');
});


