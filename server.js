const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const server = express();

// SerialPort mit Fehlerbehandlung und Parser
let port;
let parser;

try {
    // Erst verfügbare Ports auflisten
    const { SerialPort } = require("serialport");
    
    port = new SerialPort({ 
        path: "/dev/ttyACM0", 
        baudRate: 9600,
        autoOpen: false
    });
    
    // Parser für eingehende Daten
    parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
    
    // Port öffnen
    port.open((err) => {
        if (err) {
            console.error('Failed to open serial port:', err);
            port = null;
        } else {
            console.log('Serial port opened successfully');
            
            // Listener für eingehende Daten vom Pico
            parser.on('data', (data) => {
                console.log(`📥 Received from Pico: ${data}`);
            });
        }
    });
    
    port.on('error', (err) => {
        console.error('Serial port error:', err);
    });
    
} catch (err) {
    console.error('Failed to initialize serial port:', err);
    console.log('Server will continue without serial port functionality');
    port = null;
}

server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
    res.send('Express server is up and running!');
});

server.post("/live", (req, res) => {
    const { value } = req.body;
    
    if (value === undefined || value === null) {
        return res.status(400).send("Missing value");
    }
    
    // Prüfe ob SerialPort verfügbar ist
    if (!port || !port.isOpen) {
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