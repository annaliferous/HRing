const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const qs = require("qs");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const server = express();

server.set("query parser", (str) => qs.parse(str, {}));
server.use(cors());
server.use(express.json());

// Create Data Directory
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let port;
let parser;

function initializeSerial() {
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
        resetMotors();

        // Listener for data from Pico
        /* parser.on("data", (data) => {
          console.log(`📥 Received from Pico: ${data}`);
        }); */
      }
    });

    port.on("error", (err) => {
      console.error("Serial port error:", err);
    });
  } catch (err) {
    console.error("Failed to initialize serial port:", err);
  }
}

function sendToPico(value, mode) {
  if (!port || !port.isOpen) {
    console.warn("Serial port not open — cannot send");
    return;
  }

  const message = `${value}\n`;
  port.write(message, (err) => {
    if (err) console.error("Serial write failed:", err.message);
    /* else console.log(`📤 Sent to Pico [mode: ${mode}] → ${value}`); */
  });
}
//reset Motors after every mode chnage
function resetMotors() {
  console.log("🔄 Resetting motors to 0...");
  sendToPico(0, currentMode);
}

// Data Storage
let calibrationValue = null;
let currentMode = "unknown";
let logFile = null;

// Helper to write logs
function appendToFile(line) {
  if (!logFile) return;
  fs.appendFile(logFile, line + "\n", (err) => {
    if (err) console.error("❌ File write error:", err.message);
  });
}

// Express Routes
server.get("/", (req, res) => {
  res.send("Express server is up and running!");
});
//cal Val handler
server.get("/save/:currentCalVal", (req, res) => {
  const currentCalVal = req.params.currentCalVal;
  console.log(`📩 Received Cal Value: ${currentCalVal} `);

  sendToPico(picoValue, "calVal");

  res.send("Cal Value received and sent");
});

server.get("/save/participationId/:id", (req, res) => {
  res.send("ParticipationId was send!");
  console.log(req.params.id);
  participation_id = req.params.id;
});

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
// Mode tracking from frontend
server.get("/save/mode/:mode", (req, res) => {
  currentMode = req.params.mode;
  console.log(`Mode changed → ${currentMode}`);
  appendToFile(`Mode changed → ${currentMode}`);
  res.send("Mode updated");
  resetMotors();
});

// Pico value handler
server.get("/save/main/:value", (req, res) => {
  const picoValue = req.params.value;
  console.log(`📩 Received Pico Value: ${picoValue} [mode: ${currentMode}]`);

  appendToFile(`[mode: ${currentMode}] ${picoValue}`);
  sendToPico(picoValue, currentMode);

  res.send("Pico Value received and sent");
});

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
  initializeSerial();
});
