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

// Function that changes y2/y5 coordinate depending on the slider value
function changeCoordinates(id, dx, dy) {
  const data = canvasData[id];
  if (id === 'tartarus') {
      if (data.y5 + dy >= 0 && data.y5 + dy <= 200) {
          data.x5 += dx;
          data.y5 += dy;
      }
  } else {
      if (data.y2 + dy >= 0 && data.y2 + dy <= 150) {
          data.x2 += dx;
          data.y2 += dy;
      }
  }

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

      const slider = document.getElementById(`${id}Slider`);
      const value = document.getElementById(`${id}Value`);
      value.innerHTML = slider.value;

      slider.oninput = function() {
          value.innerHTML = this.value;
          changeCoordinates(id, 0, this.value - canvasData[id].y2);
          changeCoordinates(id, 0, this.value - canvasData[id].y5);
          console.log(this.value)

      }
  });
  
});


// saves canvas id and changed value to give it to the screen file
function setValue(id, value) {
  const pathValue = parseInt(value);
  localStorage.setItem('pathValue', pathValue);
  localStorage.setItem('canvasId', id);
  console.log('Sent value:', pathValue);
}

// Functions for the set Button, activated after clicking
function buttonFunctions(id) {
  const slider = document.getElementById(`${id}Slider`);
  setValue(id, slider.value);
  window.open('Screen/screen.html');
  console.log("Button pressed");
}