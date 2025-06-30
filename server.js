const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { SerialPort } = require("serialport");

const server = express();

// Erstelle data Ordner falls er nicht existiert
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// SerialPort mit Fehlerbehandlung
let port;
try {
    port = new SerialPort({ path: "/dev/ttyACM0", baudRate: 9600 });
    
    port.on('open', () => {
        console.log('Serial port opened successfully');
    });
    
    port.on('error', (err) => {
        console.error('Serial port error:', err);
    });
} catch (err) {
    console.error('Failed to initialize serial port:', err);
    console.log('Server will continue without serial port functionality');
}

server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
    res.send('Express server is up and running!');
});

server.post("/save", (req, res) => {
    const { 
        calibrationValue, 
        participationId, 
        startTime, 
        stopTime, 
        canvasId, 
        q1slider, 
        q2slider 
    } = req.body;

    // Validierung: participationId ist für alle Operationen erforderlich
    if (!participationId && (calibrationValue || startTime || stopTime || canvasId || q1slider || q2slider)) {
        return res.status(400).send("participationId ist erforderlich");
    }

    let content = '';
    let responseMessage = '';

    // Speichere CalibrationValue und ParticipationID
    if (calibrationValue !== undefined && participationId) {
        content = `calibrationValue: ${calibrationValue}\nparticipationId: ${participationId}\n`;
        responseMessage = "Calibration data saved";
    }
    // Speichere startTime und stopTime
    else if (startTime && stopTime && participationId) {
        content = `startTime: ${startTime}\nstopTime: ${stopTime}\nparticipationId: ${participationId}\n`;
        responseMessage = "Time data saved";
    }
    // Speichere canvasId
    else if (canvasId && participationId) {
        content = `canvasId: ${canvasId}\nparticipationId: ${participationId}\n`;
        responseMessage = "Canvas selection saved";
    }
    // Speichere Fragebogen-Antworten
    else if (q1slider !== undefined && q2slider !== undefined && participationId) {
        // Hole die Werte aus den Slider-Objekten
        const q1Value = q1slider.value || q1slider;
        const q2Value = q2slider.value || q2slider;
        content = `q1Value: ${q1Value}\nq2Value: ${q2Value}\nparticipationId: ${participationId}\n`;
        responseMessage = "Questionnaire data saved";
    }
    else {
        return res.status(400).send("Ungültige Daten oder fehlende participationId");
    }

    // Schreibe in Datei
    const filename = `data/data_output${participationId}.txt`;
    fs.appendFile(filename, content, (err) => {
        if (err) {
            console.error("File write error:", err);
            return res.status(500).send("Error writing file");
        }
        console.log(`Data saved to ${filename}:`, content.trim());
        res.send(responseMessage);
    });
});

server.post("/live", (req, res) => {
    const { value } = req.body;

    if (value === undefined || value === null) {
        return res.status(400).send("Missing value");
    }

    // Prüfe ob SerialPort verfügbar ist
    if (!port) {
        console.log("Serial port not available, value would be:", value);
        return res.send("Serial port not available, but value received");
    }

    // Sende an Pico
    port.write(`${value}\n`, (err) => {
        if (err) {
            console.error("Live write failed:", err);
            return res.status(500).send("Serial write error");
        }
        console.log(`Live value sent to Pico: ${value}`);
        res.send("Live value sent to Pico");
    });
});

// Fehlerbehandlung für unbekannte Routen
server.use((req, res) => {
    res.status(404).send("Route not found");
});

// Globale Fehlerbehandlung
server.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).send("Internal server error");
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    if (port && port.isOpen) {
        port.close(() => {
            console.log('Serial port closed');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

// Starte den Server auf Port 3000
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});