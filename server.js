const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const server = express();
const port_frontend = 5500;
const qs = require("qs");
server.set("query parser", (str) => qs.parse(str, {}));

// Erstelle data Ordner falls er nicht existiert
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// SerialPort mit Fehlerbehandlung und Parser
let port;
let parser;

/* try {
  //Connection with Pico with Serial
  const { SerialPort } = require("serialport");

  port = new SerialPort({
    path: "/dev/ttyACM0",
    baudRate: 9600,
    autoOpen: false,
  });

  // Parser for received data
  parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

  //Open Port
  // Port öffnen
  port.open((err) => {
    if (err) {
      console.error("Failed to open serial port:", err);
      port = null;
    } else {
      console.log("Serial port opened successfully");

      // Listener für eingehende Daten vom Pico
      parser.on("data", (data) => {
        console.log(`📥 Received from Pico: ${data}`);
      });
    }
  });

  port.on("error", (err) => {
    console.error("Serial port error:", err);
  });
} catch (err) {
  console.error("Failed to initialize serial port:", err);
  console.log("Server will continue without serial port functionality");
  port = null;
} */

//Server

server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.send("Express server is up and running!");
});

server.get("/save/participationId/:id", (req, res) => {
  res.send("ParticipationId was send!");
  console.log(req.params.id);
});

let calibrationValue;
server.get("/save/calibrationValue/:calVal", (req, res) => {
  res.send("calibrationValue was send!");
  console.log(req.params.calVal);
  calibrationValue = req.params.calVal;
});
server.get("/save/startTime/:start", (req, res) => {
  res.send("startTime was send!");
  console.log(req.params.start);
});
server.get("/save/stopTime/:stop", (req, res) => {
  res.send("stopTime was send!");
  console.log(req.params.stop);
});
let sliderValue;
server.get("/save/main", (req, res) => {
  res.send("SliderValue was send!");
  console.log(req.params.main);
  sliderValue = req.params.main;
});

// Schreibe in Datei
/* const filename = `data/data_output${participationId}.txt`;
fs.appendFile(filename, content, (err) => {
  if (err) {
    console.error("File write error:", err);
    return res.status(500).send("Error writing file");
  }
  console.log(`Data saved to ${filename}:`, content.trim());
  res.send(responseMessage);
}); */

//Pico Server Data
/* server.post("/live", (req, res) => {
  const { value } = req.body;

  if (value === undefined || value === null) {
    return res.status(400).send("Missing value");
  }

  // Check if SerialPort is available
  if (!port || !port.isOpen) {
    console.log("Serial port not available, value would be:", value);
    return res.send("Serial port not available, but value received");
  }

  // Send to  Pico
  port.write(`${value}\n`, (err) => {
    if (err) {
      console.error("Live write failed:", err);
      return res.status(500).send("Serial write error");
    }
    console.log(`📤 Sent to Pico: ${value}`);
    res.send("Live value sent to Pico");
  });
});

// Error Handling for unknown Routes
server.use((req, res) => {
  res.status(404).send("Route not found");
});

// Global Error Handling
server.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send("Internal server error");
}); */

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  if (port && port.isOpen) {
    port.close(() => {
      console.log("Serial port closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

// Start Server on Port 3000
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});

// ===== data input ===== //

let data = [
  ["up", 20],
  ["down", 50],
  ["olymp", 120],
  ["tartarus", 80],
];

// https://damienmasson.com/tools/latin_square/
const mode = [
  [/* 0: */ "up", "down", "tartarus", "olymp"],
  [/* 1: */ "down", "olymp", "up", "tartarus"],
  [/* 2: */ "olymp", "tartarus", "down", "up"],
  [/* 3: */ "tartarus", "up", "olymp", "down"],
];

let participation_id = 0; //mode % participant_id
let mode_durchgang = 0; //0 bis 3
let run = 0; //0 bis 11

function ccd_values() {
  //berechnung der ccd_values (+ calibration value)
}

function initializeSliderToPico() {
  //1. welcher modus
  //2. min_pico_value = calibration_value
  //3. max_picov_value  (inkl. calibration wert)
}

function realTimeCalculation() {
  if (oldSliderValue != sliderValue) {
    actualPicoValue = in_pico_value + (sliderValue / 100) * max_pico_value;
    oldSliderValue = sliderValue;
    //mactualPicoValue weiterleiten
  }
}

// ===== CalculationFunctions ===== //

//Berechnung der Steigung
/* function line(calVal, dataArray) {
  // Geradenfunktion a = y/x
  // y = dataPoint/100
  // x = calVal
  dataPoint = dataArray[1];
  return (value = dataPoint / 100 / calVal);
} */

/* function parabola(calVal, y, vertex) {
  // Geradenfunktion y = ax²
  // x = sliderPoint
  // y = vertex
  return (value = (dataPoint / 100) * (calVal ^ 2));
} */
