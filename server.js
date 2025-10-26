const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const qs = require("qs");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const server = express();
const port_frontend = 5500;

server.set("query parser", (str) => qs.parse(str, {}));
server.use(cors());
server.use(express.json());

// Erstelle data Ordner falls er nicht existiert
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let port;
let parser;

try {
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
  port.open((err) => {
    if (err) {
      console.error("Failed to open serial port:", err);
      port = null;
    } else {
      console.log("✅ Serial port opened successfully");

      // Listener for data from Pico
      parser.on("data", (data) => {
        console.log(`📥 Received from Pico: ${data}`);
      });
    }

    function sendToPico(value) {
      if (!port.isOpen) {
        console.warn("Port not open yet, cannot send");
        return;
      }
      port.write(`${value}\n`, (err) => {
        if (err) console.error("Write failed:", err);
        else console.log(`📤 Sent to Pico: ${value}`);
      });
    }
  });

  port.on("error", (err) => {
    console.error("Serial port error:", err);
  });
} catch (err) {
  console.error("Failed to initialize serial port:", err);
  port = null;
}

// Express Routes
server.get("/", (req, res) => {
  res.send("Express server is up and running!");
});

server.get("/save/participationId/:id", (req, res) => {
  res.send("ParticipationId was send!");
  console.log(req.params.id);
  participation_id = req.params.id;
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

// Shutdown
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

// https://damienmasson.com/tools/latin_square/
const mode = [
  [/* 0: */ "up", "down", "tartarus", "olymp"],
  [/* 1: */ "down", "olymp", "up", "tartarus"],
  [/* 2: */ "olymp", "tartarus", "down", "up"],
  [/* 3: */ "tartarus", "up", "olymp", "down"],
];
let participation_id = 0; //mode % participant_id
let mode_turn = 0; //0-3
let run = 0; //0+11

let min_pico_value = 0;
let max_pico_value = 0;

function ccd_values() {
  //berechnung der ccd_values (+ calibration value)
}

function choosePath(mode) {
  let valueToSend;

  const currentMode = mode[participation_id][mode_turn];
  console.log(`🎯 Current mode: ${currentMode}`);

  switch (currentMode) {
    case "up":
      valueToSend = realTimeCalculation();
      console.log("⬆️ upValue:", valueToSend);
      break;

    case "down":
      valueToSend = -realTimeCalculation();
      console.log("⬇️ downValue:", valueToSend);
      break;

    case "olymp":
    case "tartarus":
      console.log(`Mode ${currentMode} selected — no serial output.`);
      break;

    default:
      console.warn("⚠️ Unknown mode:", currentMode);
      break;
  }
  sendToPico(valueToSend);

  // Move to the next mode
  mode_turn++;
  if (mode_turn >= mode[participation_id].length) {
    mode_turn = 0;
    participation_id++;
    if (participation_id >= mode.length) {
      participation_id = 0;
      console.log("Completed full mode sequence, starting again");
    }
  }
}

function initializeSliderValuesForPico() {
  mode_turn = mode[0];
  min_pico_value = calibration_value;
  max_pico_value = 80 + calibrationValue;
}

function realTimeCalculation() {
  initializeSliderValuesForPico();
  if (oldSliderValue != sliderValue) {
    actualPicoValue = min_pico_value + (sliderValue / 100) * max_pico_value;
    oldSliderValue = sliderValue;
    //actualPicoValue weiterleiten
  }
  return sliderValue;
}
