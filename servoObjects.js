//set Slider
function onSliderChange(evt) {
    output.innerHTML = evt.target.value;
  
  
    var slidervalue = parseInt(output.innerHTML);
    var slidertoservonmotor = maprange(slidervalue, 0, 1270, 0, 180);
  
    socket.emit('servoposition', { "status": slidertoservonmotor.toString() });

    document.getElementById("#sliderBtn").onclick = function() {
      document.getElementById("circle").style.display = "none";
    }
  }

//we are using p5.js for the 2D objects

// First Scenario: Rotating circle;
var deg = 12;
function setup(){
  let canvasContainer = select('#CanvasContainer')
  let canvas = createCanvas(400, 400);
  canvas.parent(canvasContainer);



}

// https://editor.p5js.org/LindseyPiscitell/sketches/SJgoswgp
function draw(){
  background(220);
  //line(-200, 0,200,200)

  push(); 
  translate (200,200);
  rotate (radians (deg));
  ellipse (0,0,100,100);
  line(0, 40, 0, 0);
  pop(); 
  
  // triangle(-20, 25, 8, -30, 36, 25);

  deg+=2;

}