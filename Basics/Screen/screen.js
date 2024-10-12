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
  //let clientX;
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
  



// Retrieve the values from localStorage
const canvasId = localStorage.getItem('canvasId');
const pathValue = localStorage.getItem('pathValue');
const calibrationValue = localStorage.getItem('calibrationValue')
document.getElementById('canvasId').textContent = canvasId;
document.getElementById('pathValue').textContent = pathValue;

let port;
let writer;

// Connects to the Pico
async function connect() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });

    const textEncoder = new TextEncoderStream();
    const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    writer = textEncoder.writable.getWriter();

    console.log('Connected to Pico');

    } catch (err) {
      console.error('Failed to connect: ', err);
    }
}

// Calculate degrees from slider value for rise
function calculateDegreesRise(value) {  

  const slider = document.getElementById('myRange');
  slider.max = 150 - pathValue;

  return value * (360/150);
};

// Calculate degrees from slider value for fall
function calculateDegreesFall(value){

  return ((150 - pathValue) - value) * (360/150);

}

//Calculate degrees from slider value for olymp
function calculateDegreesOlymp(value){
  //const slider = document.getElementById('myRange');
  const peakValue = 150 - pathValue;
  if (value <= 50){
    return ((value / 50) * peakValue) * (360/150)
  } else {
    return (((100 - value) / 50) * peakValue) * (360/150);
  }

}



//Calculate degrees from slider value fo tartarus
function calculateDegreesTartarus(value){
  const slider = document.getElementById('myRange');
  const peakValue = 150 - pathValue;

  if (peakValue === 50) {
    return 50 * (360/150);
  }

  if (value <= 50){
    return (50 - ((value / 50) * (50 - peakValue))) * (360/150);
  } else {
    return (peakValue + (((value - 50) / 50) * (50 - peakValue))) * (360/150);
  }
}
// * (360/150)




// Sends the translated slider value to the Pico
async function sendSliderValue() {
  if (writer) {
    const slider = document.getElementById('myRange');
    let degrees;
    switch(canvasId){
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

    }

    //const degrees = calculateDegreesFall(parseInt(slider.value));
    
    await writer.write(degrees.toString() + '\n');
    console.log('Sent value:', degrees);
    console.log(canvasId);
  } else {
    console.log('Writer is not available. Connect to Pico first.');
  }
}

