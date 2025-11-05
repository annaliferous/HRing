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
let participation_id = "default";

// Data Storage
let dataStorage = [];
let currentSession = {
  mode: null,
  startTime: null,
  stopTime: null,
  array: null,
  canvas: null,
  intensity: null,
  height: null,
};

function initializeLogFile() {
  const timestamp = new Date().toISOString().replace(/:/g, "-").split(".")[0];
  const filename = `participant_${participation_id}_${timestamp}.txt`;
  logFile = path.join(dataDir, filename);

  // Write header
  const header =
    "Mode\tStartTime\tStopTime\tArray\tCanvas\tIntensity\tHeight\n";
  fs.writeFileSync(logFile, header);
  console.log(`📝 Log file created: ${filename}`);
}

// Helper to write logs
function appendToFile(array) {
  if (!logFile) {
    console.error("❌ No log file initialized");
    return;
  }

  const session = currentSession;
  const line = `${session.mode}\t${session.startTime}\t${session.stopTime}\t${session.array}\t${session.canvas}\t${session.intensity}\t${session.height}\n`;

  fs.appendFileSync(logFile, line);
  console.log(`✅ Session written to file: ${logFile}`);
}

function safeCurrentSession() {
  if (currentSession.mode !== null) {
    const sessionArray = [
      currentSession.mode,
      currentSession.startTime,
      currentSession.stopTime,
      currentSession.array,
      currentSession.canvas,
      currentSession.intensity,
      currentSession.height,
    ];
    dataStorage.push(sessionArray);
    console.log(`💾 Session saved:`, sessionArray);
    console.log(`📊 Total sessions: ${dataStorage.length}`);

    appendToFile();
  }

  // Reset current session
  currentSession = {
    mode: null,
    startTime: null,
    stopTime: null,
    array: null,
    canvas: null,
    intensity: null,
    height: null,
  };
}

// Express Routes
server.get("/", (req, res) => {
  res.send("Express server is up and running!");
});
//cal Val handler
server.get("save/calibration/:currentCalVal", (req, res) => {
  const currentCalVal = req.params.currentCalVal;
  console.log(`📩 Received Cal Value: ${currentCalVal} `);

  sendToPico(currentCalVal, "calVal");

  res.send("Cal Value received and sent");
});

server.get("/save/participationId/:id", (req, res) => {
  try {
    participation_id = req.params.id;
    console.log(`Participation ID: ${participation_id}`);

    if (!logFile) {
      initializeLogFile();
    }

    res.status(200).send("ParticipationId received!");
  } catch (err) {
    console.error("Error setting participation ID:", err);
    res.status(500).send("Error setting participation ID");
  }
});

server.get("/save/calibrationValue/:calVal", (req, res) => {
  res.send("calibrationValue was send!");
  console.log(req.params.calVal);
  calibrationValue = req.params.calVal;
});
server.get("/save/startTime/:start", (req, res) => {
  res.send("startTime was send!");
  console.log(req.params.start);
  currentSession.startTime = req.params.start;
});
server.get("/save/stopTime/:stop", (req, res) => {
  res.send("stopTime was send!");
  console.log(req.params.stop);
  currentSession.stopTime = req.params.stop;
});
server.get("/save/array/:array", (req, res) => {
  res.send("ConditionArray was send!");
  console.log(req.params.array);
  currentSession.array = req.params.array;
});
server.get("/save/mode/:mode", (req, res) => {
  const newMode = req.params.mode;
  if (currentMode !== "unknown" && currentMode !== newMode) {
    safeCurrentSession();
  }
  currentMode = newMode;
  currentSession.mode = newMode;
  console.log(`Mode changed → ${currentMode}`);
  res.send("Mode updated");
  resetMotors();
});
server.get("/save/canvas/:selectedCanvas", (req, res) => {
  res.send("selectedCanvas was send!");
  console.log(req.params.selectedCanvas);
  currentSession.canvas = req.params.selectedCanvas;
});
server.get("/save/intensity/:intensity", (req, res) => {
  res.send("Intensity was send!");
  currentSession.intensity = req.params.intensity;
  console.log(req.params.intensity);
});
server.get("/save/height/:height", (req, res) => {
  res.send("Height was send!");
  currentSession.height = req.params.height;
  console.log(req.params.height);
});
// Pico value handler
server.get("/save/main/:value", (req, res) => {
  const picoValue = req.params.value;
  console.log(`📩 Received Pico Value: ${picoValue} [mode: ${currentMode}]`);

  sendToPico(picoValue, currentMode);

  res.send("Pico Value received and sent");
});

// Shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  safeCurrentSession();
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
