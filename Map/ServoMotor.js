if (!window.sessionStorage.getItem('clientId')) {
  window.sessionStorage.setItem("clientId", Math.random(0, 20));
}


// let data = [{
//   "land": "de-increase-vertical",
//   "elevation": { "min": 52, "max": 1275 },
//   "start": { "lat": 53.556130, "long": 9.99818 }, "end": { "lat": 47.3982, "long": 11.11831 }, "setview": { "lat": 50.55, "long": 9.99 }
// }, {
//   "land": "mr-increase-horizantal",
//   "elevation": { "min": 23, "max": 1204 },
//   "start": { "lat": 33.9615862897991, "long": -6.836905278558578 }, "end": { "lat": 33.94335994657882, "long": -2.9687421419304294 }, "setview": { "lat": 33.9615862897991, "long": -6.836905278558578 }
// }, {
//   "land": "it-decrease-horizantal",
//   "elevation": { "min": 177, "max": 2654 },
//   "start": { "lat": 45.8326, "long": 6.8652 }, "end": { "lat": 45.521743896993634, "long": 12.591778856022392 }, "setview": { "lat": 45.8326, "long": 6.8652 }
// }, {
//   "land": "it-decrease-vertical",
//   "elevation": { "min": 54, "max": 1378 },
//   "start": { "lat": 46.694667307773116, "long": 11.296084918124196 }, "end": { "lat": 42.309815415686664, "long": 11.933452707682221 }, "setview": { "lat": 45.694667307773116, "long": 11.296084918124196 }
// }, {
//   "land": "sp-Bump-vertical",
//   "elevation": { "min": 350, "max": 1128 },
//   "start": { "lat": 43.229195113965005, "long": -4.240744829809729 }, "end": { "lat": 37.71859032558816, "long": -3.849034239413561 }, "setview": { "lat": 40.13306116240615, "long": -4.420467430051805 }
// }, {
//   "land": "sp-Bump-horizantal",
//   "elevation": { "min": 392, "max": 1280 },
//   "start": { "lat": 40.16208338164619, "long": -8.394558041077802 }, "end": { "lat": 39.90973623453719, "long": -0.28460237394266846 }, "setview": { "lat": 40.16208338164619, "long": -8.394558041077802 }
// }, {
//   "land": "it-Hole-vertical",
//   "elevation": { "min": 17, "max": 800 },
//   "start": { "lat": 45.89000815866184, "long": 11.271961801188953 }, "end": { "lat": 43.992814500489914, "long": 11.293945312500002 }, "setview": { "lat": 45.78284835197676, "long": 11.294488065553342 }
// }, {
//   "land": "Östereich-Romania-Hole-horizantal",
//   "elevation": { "min": 81, "max": 800 },
//   "start": { "lat": 47.29413372501023, "long": 14.943219045198195 }, "end": { "lat": 47.08508535995386, "long": 24.725881578622932 }, "setview": { "lat": 47.29413372501023, "long": 14.943219045198195 }
// }
// ]

data = [...randomArray(data), ...randomArray(data, 1), ...randomArray(data, 2)]
console.log(data);

let counter = 0;
let currentPosition = data[0];
var marker = L.marker([currentPosition.start.lat, currentPosition.start.long], { draggable: true });


function mapoutput(position) {


  const value = "Hello, server!";
  // var slidertovibrationmotor = maprange(slidervalue, position.elevation.min, position.elevation.max, 0, 255);
  // socket.emit("message",  slidertovibrationmotor.toString() );

  // output.innerHTML = slider.value;
  // slider.oninput =  onSliderChange(position)


}

//set Slider
function onSliderChange(evt) {
  output.innerHTML = evt.target.value;


  var slidervalue = parseInt(output.innerHTML);
  var slidertoservonmotor = maprange(slidervalue, 0, 1270, 0, 180);

  socket.emit('servoposition', { "status": slidertoservonmotor.toString() });
}

function getElevation(evt) {

  var latlng = evt.latlng;
  const api_url = 'http://localhost:5000/v1/test-dataset?locations=' + latlng.lat + ',' + latlng.lng;


  const response = fetch(api_url).then(response => response.json()).then((data) => {

    if (data.results[0].elevation >= 0) {


      var vibrationminouput = maprange(parseInt(slider.value), 0, 1270, 0, 180);

      var minoutput = parseInt(vibrationminouput);



      var vibrationvalue = maprange(data.results[0].elevation, currentPosition.elevation.min, currentPosition.elevation.max, minoutput, 180);
      vibrationvalue = parseInt(vibrationvalue);

      var Time = new Date().getHours() + ":" + new Date().getMinutes().toString() + ":" + new Date().getSeconds().toString() + ":" + new Date().getMilliseconds().toString();
      socket.emit('servoposition_elevation', { "status": vibrationvalue.toString(), "elevation": data.results[0].elevation.toString(), "Latitude": latlng.lat, "Longitude": latlng.lng, "Scenario": currentPosition.land, "Time": Time, "scenarionumber": counter });
    } else { }

  });

  let length = map.distance(latlng, circle2.getLatLng());

  var isInside = length < circle2.getRadius();
  circle2.setStyle({
    fillColor: isInside ? 'green' : '#5f1ee3'
  })

}

function maprange(value, min1, max1, min2, max2) {
  return ((value - min1) * (max2 - min2)) / (max1 - min1) + min2;
}

function skip() {
  if (counter === data.length - 1) {
    console.log('Senarios finished');

    return;
  }
  if (counter < data.length - 1) {
    counter++;
    const nextPos = data[counter];
    var newStartLatLng = new L.LatLng(nextPos.start.lat, nextPos.start.long);
    var newEndLatLng = new L.LatLng(nextPos.end.lat, nextPos.end.long);
    marker.setLatLng(newStartLatLng);
    circle1.setLatLng(newStartLatLng)
    circle2.setLatLng(newEndLatLng)
    map.setView([nextPos.setview.lat, nextPos.setview.long], 6);
  }
}


function changePosition(evt) {
  var lastPos = evt.target._latlng;

  const markerPos = { lat: parseFloat(lastPos.lat.toFixed(1)), long: parseFloat(lastPos.lng.toFixed(1)) }

  let length = map.distance(lastPos, circle2.getLatLng());

  var isInside = length < circle2.getRadius();

  const findPosition = data.find((position) => {
    return parseFloat(position.end.lat.toFixed(1)) === markerPos.lat && parseFloat(position.end.long.toFixed(1)) === markerPos.long
  })

  if (isInside) {

    counter++;

    if (counter === data.length) {
      console.log('Senarios finished');
      var finichvalue = 0;
      socket.emit('servoposition_elevation_finich', { "status": finichvalue.toString() });

    }


    const nextPos = data[counter];

    currentPosition = nextPos

    var calibrationouput = maprange(parseInt(slider.value), 0, 1270, 0, 180);

    socket.emit('servocalibrationmotorreset', { "status": calibrationouput.toString() });


    var newStartLatLng = new L.LatLng(nextPos.start.lat, nextPos.start.long);
    var newEndLatLng = new L.LatLng(nextPos.end.lat, nextPos.end.long);
    marker.setLatLng(newStartLatLng);
    circle1.setLatLng(newStartLatLng)
    circle2.setLatLng(newEndLatLng)
    circle2.setStyle({ fillColor: 'blue' });
    map.setView([nextPos.setview.lat, nextPos.setview.long], 6);
  }

}


function randomArray(array, acc = 0) {
  const nextArray = [...array]

  const generator = new Math.seedrandom((window.sessionStorage.getItem("clientId") ?? 0) + acc);
  for (let i = nextArray.length - 1; i > 0; i--) {
    const randomNumber = generator();
    const j = Math.floor(randomNumber * (i + 1));
    const temp = nextArray[i];
    nextArray[i] = nextArray[j];
    nextArray[j] = temp;

  }
  return nextArray
}

var socket = io("ws://localhost:5501");
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");



slider.oninput = onSliderChange


document.getElementById('map').innerHTML = "<div id='mapoutput' style='width: 100%; height: 550px; top: 113px'></div>";
var map = L.map('mapoutput', {/*rotate: true,*/dragging: false }/*,{dragging: false}*/).setView([currentPosition.setview.lat, currentPosition.setview.long], 6);


L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.{ext}', {
  attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  ext: 'png'
}).addTo(map);

map.addControl(new L.Control.Fullscreen());
map.removeControl(map.zoomControl);
map.scrollWheelZoom.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();


marker.addTo(map);
// START POINT 
var circle1 = L.circle([currentPosition.start.lat, currentPosition.start.long], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  // radius: 1
  radius: 6000

}).addTo(map);
// END POINT 
var circle2 = L.circle([currentPosition.end.lat, currentPosition.end.long], {
  color: 'blue',
  fillColor: '#5f1ee3',
  fillOpacity: 0.5,
  // radius: 1
  radius: 34000

}).addTo(map);
marker.addTo(map);
marker.on('drag', getElevation);
marker.on('dragend', changePosition);

mapoutput(currentPosition);

