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