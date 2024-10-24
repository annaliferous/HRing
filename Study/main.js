document.getElementById("screen").style.display = "none";
document.getElementById("selection").style.display = "none";

//Touch screen lag when dragging slider
const calibration_slider = document.getElementById('calibration_slider');
if (!calibration_slider) {
  console.error('screen_slider not found in DOM.');
}
const screen_slider = document.getElementById('screen_slider');
if (!screen_slider) {
  console.error('screen_slider not found in DOM.');
}

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
  
let port;
let writer;

//show current value
var output = document.getElementById("demo");
output.innerHTML = calibration_slider.value;

calibration_slider.addEventListener('input', function() {
    const value = this.value;
    calibration_sendSliderValue(value);  // Call sendSliderValue when slider moves
    output.innerHTML = value;  // Update the displayed value
});
   

// connects to the pico
async function connect() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });

        const textEncoder = new TextEncoderStream();
        const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
        writer = textEncoder.writable.getWriter();

        console.log('Connected to Pico');

    } catch (error) {
      console.error('Failed to connect:', error);
    }
    
}

// sends the Slider values to the Pico
async function calibration_sendSliderValue(value) {
    if (writer) {
        try {
            value = parseInt(value);
            await writer.write(value.toString() + '\n');
            console.log('Sent value:', value);
        }catch (error){
            console.error('Failed to send value:', error);
        }
    }else {
        console.log('Writer not initialized. Cannot send value.');
    }
}

// Saves the current Slider value in localStorage
function setSliderValue(value){
    const calibrationValue = parseInt(value);
    localStorage.setItem('calibrationValue', calibrationValue);
}




// Functions activated after clicking the Button "Send"
function sendButtonFunction(){

  const calibrationValue = calibration_slider.value;

  setSliderValue(calibrationValue);
  console.log(calibrationValue);
  document.getElementById("calibration").style.display = "none";
  document.getElementById("screen").style.display = "block";
}


// Screen

//Data File as Array
const data_file = [
  ['canvas_id', 'min', 'max'],
  ['rise', '0', '50'],
  ['fall', '80', '0'],
  ['olymp', '0', '120'],
  ['tartarus', '40', '0']
  ['tartarus', '90', '0']
];

function test(data_file){
  // go through data file array and call fitting array
}
// Retrieve the values from localStorage
const canvasId = localStorage.getItem('canvasId');
const pathValue = localStorage.getItem('pathValue');
const calibrationValue = localStorage.getItem('calibrationValue')


// Calculate degrees from slider value for rise
function calculateDegreesRise(value) {  

    const slider = document.getElementById('screen_slider'); 
    slider.max = 100  + calibrationValue;
    slider.min = calibrationValue
  
    return value;
  };
  
  // Calculate degrees from slider value for fall
  function calculateDegreesFall(value){
    const slider = document.getElementById('screen_slider');
    const calibrationValueN = parseInt(calibrationValue)
    slider.max = 120 + calibrationValueN;
    slider.min = calibrationValueN;

  
    return slider.max - value;
  
  }
  
  //Calculate degrees from slider value for olymp
  function calculateDegreesOlymp(value){

    const slider = document.getElementById('screen_slider');
    const calibrationValueN = parseInt(calibrationValue, 10)
    slider.min = calibrationValueN
    slider.max = 140  + calibrationValueN
    const peakValue = 140  + calibrationValueN;
    console.log("Peak:",peakValue);


    if (value <= (peakValue/2)) {
      // First half: Increase from min to peak
      return value*2;
    } else {
      // Second half: Decrease from peak back to min
      return (peakValue - value)*2;
    }
  
  }
  
  
  
  //Calculate degrees from slider value fo tartarus
  function calculateDegreesTartarus(value){
    const slider = document.getElementById('screen_slider');
    const calibrationValueN = parseInt(calibrationValue, 10)
    slider.min = calibrationValueN
    slider.max = 90  + calibrationValueN
    const peakValue = slider.max;
    console.log("Peak:",peakValue);


  
    if (value <= (peakValue/2)){
      return (peakValue - value)*2;
    } else {
      return value*2;
    }
  }
  // * (360/150)

// Function to reset the servos before moving the slider
async function resetServos() {
  if (writer) {
      try {
          let resetValue = parseInt(calibrationValue, 10);
          await writer.write(resetValue.toString() + '\n');  // Reset both servos to 0
          console.log('Reset servos to calibrationValue:', resetValue);
      } catch (error) {
          console.error('Failed to reset servos:', error);
      }
  } else {
      console.log('Writer not initialized. Cannot reset servos.');
  }
}
  
  document.getElementById('screen_slider').addEventListener('input', function() {
    // Get the slider element and its current value
    const slider = document.getElementById('screen_slider');
    const max = parseInt(slider.max);  // Get the maximum value of the slider

    // Check if the current value of the slider equals the maximum
    if (parseInt(slider.value) === max) {
        // Redirect to a new HTML page when the slider reaches the end
        setTimeout(function(){
          document.getElementById("screen").style.display = "none";
          document.getElementById("selection").style.display = "block";
        }, 2000)
        
    }
});

  
  
  // Sends the translated slider value to the Pico
  async function screen_sendSliderValue() {
    //resetServos();
    if (writer) {
      
      const slider = document.getElementById('screen_slider');
      let degrees;
      degrees = calculateDegreesRise(parseInt(slider.value));
      //degrees = calculateDegreesFall(parseInt(slider.value));
      //degrees = calculateDegreesOlymp(parseInt(slider.value));
      //degrees = calculateDegreesTartarus(parseInt(slider.value));
      /* switch(canvasId){
        case 'rise':
          degrees = calculateDegreesRise(parseInt(slider.value));
          break;
        case 'fall':
          degrees = calculateDegreesFall(parseInt(slider.value));
          break;
        case 'olymp':
          degrees = calculateDegreesOlymp(parseInt(slider.value));
          break;
        case 'tartarus':
          degrees = calculateDegreesTartarus(parseInt(slider.value));
          break;
  
      } */
  
      
      await writer.write(degrees.toString() + '\n');
      console.log('Sent value: ', degrees);
      console.log(calibrationValue);
    } 
  }
  screen_sendSliderValue()

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

  });
  
});




// Functions for the set Button, activated after clicking
function buttonFunctions(id) {
  //setValue(id, slider.value);
  console.log("Button pressed");
  document.getElementById("screen").style.display = "block";
  document.getElementById("selection").style.display = "none";
  screen_slider.min = 0;
  screen_slider.value = screen_slider.min;
}