const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require('@serialport/parser-readline');

const server = express();

// Erstelle data Ordner falls er nicht existiert
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// SerialPort mit Fehlerbehandlung und Parser
let port;
let parser;

try {
    port = new SerialPort({ path: "/dev/ttyACM0", baudRate: 9600 });
    parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
    
    port.on('open', () => {
        console.log('Serial port opened successfully');
    });
    
    port.on('error', (err) => {
        console.error('Serial port error:', err);
    });
    
    // Höre auf Rückmeldungen vom Pico
    parser.on('data', (data) => {
        const response = data.trim();
        console.log(`Pico response: ${response}`);
        
        // Parse die Antwort
        if (response.startsWith('OK:')) {
            const values = response.substring(3).split(',');
            if (values.length >= 4) {
                const [pos1, pos2, pulse1, pulse2] = values;
                console.log(`✓ Servos set - Pos1: ${pos1}°, Pos2: ${pos2}°, Pulse1: ${pulse1}ns, Pulse2: ${pulse2}ns`);
                
                // Optional: Speichere die Servo-Werte in eine Log-Datei
                const logEntry = `${new Date().toISOString()}: Pos1=${pos1}, Pos2=${pos2}, Pulse1=${pulse1}, Pulse2=${pulse2}\n`;
                fs.appendFile('data/servo_log.txt', logEntry, (err) => {
                    if (err) console.error('Log write error:', err);
                });
            }
        } else if (response.startsWith('ERROR:')) {
            console.error(`❌ Pico error: ${response.substring(6)}`);
        }
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

// Neue Route zum Abrufen der Servo-Logs
server.get('/servo-log', (req, res) => {
    const logFile = path.join(__dirname, 'data/servo_log.txt');
    if (fs.existsSync(logFile)) {
        const logData = fs.readFileSync(logFile, 'utf8');
        const lines = logData.split('\n').filter(line => line.trim()).slice(-50); // Letzte 50 Einträge
        res.json({ logs: lines });
    } else {
        res.json({ logs: [] });
    }
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
        console.log(`📤 Sent to Pico: ${value}`);
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