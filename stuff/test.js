
function rise(){
  let riseCanvas = document.getElementById("riseCanvas");
  let rctx = riseCanvas.getContext("2d");

  rctx.clearRect(0, 0, riseCanvas.width, riseCanvas.height);
  // Coordinates for the triangle
  const x1 = 150, y1 = 150; // Right bottom Point
  const x2 = 150, y2 = 50;  // Point above
  const x3 = 50, y3 = 150;  // Point to the bottom left

  // Drawing the triangle
  rctx.beginPath();
  rctx.moveTo(x1, y1);
  rctx.lineTo(x2, y2);
  rctx.lineTo(x3, y3);
  rctx.closePath();
  rctx.stroke();

  rctx.lineWidth = 2;
  rctx.beginPath();
  rctx.moveTo(x2, y2);
  rctx.lineTo(x3, y3);
  rctx.strokeStyle = 'white';  
  rctx.stroke();


}

rise();
//window.onload = rise;

let fallCanvas = document.getElementById("fallCanvas");
let fctx = fallCanvas.getContext("2d");

function fall(){
  
  fctx.clearRect(0, 0, fallCanvas.width, fallCanvas.height);

  // Coordinates for the triangle
  const x1 = 50, y1 = 150;  // Left bottom point
  const x2 = 50, y2 = 50;   // Point above
  const x3 = 150, y3 = 150; // Point to the bottom right

  // Drawing the triangle
  fctx.beginPath();
  fctx.moveTo(x1, y1);
  fctx.lineTo(x2, y2);
  fctx.lineTo(x3, y3);
  fctx.closePath();
  fctx.stroke();

  fctx.lineWidth = 2;
  fctx.beginPath();
  fctx.moveTo(x2, y2);
  fctx.lineTo(x3, y3);
  fctx.strokeStyle = 'white';  
  fctx.stroke();

}

fall();

let olympCanvas = document.getElementById("olympCanvas");
let octx = olympCanvas.getContext("2d");

function olymp(){
  octx.clearRect(0, 0, olympCanvas.width, olympCanvas.height);
  // Coordinates for the triangle
  const x1 = 20, y1 = 150;  // Left bottom angle
  const x2 = 100, y2 = 50;  // Point above
  const x3 = 180, y3 = 150; // Point to the bottom right

  // Drawing the triangle
  octx.beginPath();
  octx.moveTo(x1, y1);
  octx.lineTo(x2, y2);
  octx.lineTo(x3, y3);
  octx.closePath(); 
  octx.stroke();

  octx.lineWidth = 2;
  octx.beginPath();
  octx.moveTo(x1, y1);
  octx.lineTo(x2, y2);
  octx.lineTo(x3, y3);
  octx.strokeStyle = 'white';  
  octx.stroke();
}

olymp();

let tartarusCanvas = document.getElementById("tartarusCanvas");
let tctx = tartarusCanvas.getContext("2d");

function tartarus(){
  tctx.clearRect(0, 0, tartarusCanvas.width, tartarusCanvas.height);
  
  // Coordinates for the triangle
  const x1 = 20, y1 = 50;   // Left top point
  const x2 = 20, y2 = 150;  // Left bottom point
  const x3 = 180, y3 = 150; // Right bottom point
  const x4 = 180, y4 = 50;  // Right top point
  const x5 = 100, y5 = 120; // Middle point

  // Drawing the triangle
  tctx.beginPath();
  tctx.moveTo(x1, y1); 
  tctx.lineTo(x2, y2);
  tctx.lineTo(x3, y3); 
  tctx.lineTo(x4, y4);
  tctx.lineTo(x5, y5);
  tctx.closePath();
  tctx.stroke();

  tctx.lineWidth = 2;
  tctx.beginPath();
  tctx.moveTo(x1, y1);
  tctx.lineTo(x5, y5);
  tctx.lineTo(x4, y4);
  tctx.strokeStyle = 'white';  
  tctx.stroke();
  
}

tartarus();


document.querySelectorAll('.canvas').forEach(canvas => {
  canvas.addEventListener('mouseenter', () => {
    canvas.style.backgroundColor = '#87d6e3';
  });
  canvas.addEventListener('mouseleave', () => {
    canvas.style.backgroundColor = '#9adde8';
  });
  canvas.addEventListener('click', () => {
    alert(`You clicked on ${canvas.parentElement.id}`);
  });
});