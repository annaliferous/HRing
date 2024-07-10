
const http = require("http");
const socketIo = require("socket.io");
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');


// Define the serial port for the Raspberry Pi Pico
const port = new SerialPort(
  { path: 'COM3', baudRate: 9600, dataBits: 8, parity: 'none', stopBits: 1, flowControl: false }
);

const parser = SerialPort.pipe(new Readline({ delimiter: '\n' }));


// Create and Start HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Sever is running");
});

// Attach socket.io to HTTP server
const io = socketIo(server);

io.on('connection', socket => {
  socket.on('message', message => {
    try {
      const data = JSON.parse(message);
      const { id, value } = data;
      port.write(data);

      // Check if values are received
      console.log(`Received values for ${id}: ${value}`);

    } catch (err){
      console.error('Error:', err.message);
    }
    
  });

  io.send('Connection established');
});




server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server is running on http://127.0.0.1:${PORT}/HRing/Basics/basics.html`);
});
