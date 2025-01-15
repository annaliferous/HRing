//Websocket for everything
const Websocket = require('ws')

//Connection to Pico
const { SerialPort } = require('serialport');
//const { Readline } = require('@serialport/parser-readline')


const http = require('http');
const fs = require("fs");
const path = require('path');


//define Websocket
const ws = new Websocket.Server({port: 8080});

// define Port and Parser for Pico connection
const port = new SerialPort({
    path: '/dev/ttyUSB0',
    baudRate: 115200,
});
//const parser = port.pipe(new Readline({ delimiter: '\n' }))


//connect to Pico
ws.on('connection', value => {
    console.log('Value Send to Pico:', value);
    //Forward slider values to Pico
    port.write(value + '\n', err => {
        if(err) {
            console.log('Error with Pico:', err.message)
        }
    });
});




// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        filePath = '';
        if (req.url === '/' || req.url === '/trial.html') {
            filePath = path.join(__dirname, 'public', 'trial.html');
        } else if (req.url === '/trial.css') {
        filePath = path.join(__dirname, 'public', 'trial.css');
        res.setHeader('Content-Type', 'text/css');
        } else if (req.url === '/trial.js') {
            filePath = path.join(__dirname, 'public', 'trial.js');
            res.setHeader('Content-Type', 'application/javascript');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404: File Not Found');
            return;
        }
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File Not Found');
            } else {
                res.writeHead(200);
                res.end(data);
        }});
    }}
    
    
);


// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
