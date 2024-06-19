//set Slider
function onSliderChange(evt) {
    output.innerHTML = evt.target.value;
  
  
    var slidervalue = parseInt(output.innerHTML);
    var slidertoservonmotor = maprange(slidervalue, 0, 1270, 0, 180);
  
    socket.emit('servoposition', { "status": slidertoservonmotor.toString() });

    
  }

//we are using p5.js for the 2D objects

let sword;
let y = 0;
let speed = 1;

// Load the image.
function preload() {
  sword = loadImage('/sword.jpg');
}

var deg = 0;
var buttonPause = false;


function setup(){
  let canvasContainer = select('#canvas')
  let canvas = createCanvas(400, 400);
  canvas.parent(canvasContainer);

  background(220);

  // Resize and load image
  sword.resize(200, 200);

  


}
function draw(){
  
  //displaySword();
  

  let buttonPlay = select('#play');
  buttonPlay.mousePressed(play);
  let buttonPause = select('#pause');
  buttonPause.mousePressed(pause);
  let buttonNext = select('#next');
  buttonNext.mousePressed(next);
  //Line to show the "table"
  line(0, 200, 400, 200)
  // Translate to the center of the canvas
  translate(width / 2, height / 2);

  // Rotate the canvas around the center
  rotate(radians(deg));

  //Draw Circle
  //drawCircle();
  
  //Draw Triangle
  //drawTriangle();

  //Draw Rectangle
  drawRectangle();

  // Draw Heart Shape
  //drawHeart();

  
  

  deg+=1;

}

// https://editor.p5js.org/LindseyPiscitell/sketches/SJgoswgp
function drawCircle(){
  ellipse (0,0,100,100);
  line(0, 40, 0, 0);

}

function drawTriangle(){
  // doesn't rotate around center
  triangle(-20, 25, 8, -30, 36, 25);

  // // Calculate the center point of the triangle
  let centerX = ( -20 + 8 + 36 ) / 3; // Average of x-coordinates
  let centerY = ( 25 - 30 + 25 ) / 3; // Average of y-coordinates
  
  // Draw a dot at the center of the triangle
  ellipse(centerX, centerY, 6, 6); 
}

function drawRectangle(){
  rectMode (CENTER);
  rect(0,0,50,50); 
}


// https://editor.p5js.org/Supriyo/sketches/N2nRmPYL7
function drawHeart(){

  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.1) {
    const r = 5;
    const x = r * 16 * pow(sin(a), 3);
    const y = -r * (13 * cos(a) - 5 * cos(2 * a) - 2 * cos(3 * a) - cos(4 * a));

    vertex(x, y);
  }
  endShape();
  
}

function play(){
  if (buttonPause == true){
    loop();
    buttonPause=false;
  }else{
    pause();
  }
}

function pause(){
  if (buttonPause == false){
    noLoop();
    buttonPause=true;
  }else{
    play();
  }

}
function next(){

}

function displaySword(){
  
  background(220);

  //Line to show the "table"
  line(0, 200, 400, 200)

  // Move the sword up and down
  y += speed;

  // Change the direction when the sword reaches the top or bottom of the canvas
  if (y > 50 || y < -50) {
    speed *= -1;
  }

  // Rotate the canvas and display the rotated image
  translate(width/2, height/2);
  rotate(PI);
  
  image(sword, -sword.width/2, -sword.height/2 + y);

}