const http = require("http");
const socketIo = require("socket.io");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const { serialize } = require("v8");


// Define the serial port for the Raspberry Pi Pico
const port = new SerialPort(
  { path: 'COM3', baudRate: 115200, dataBits: 8, parity: 'none', stopBits: 1, flowControl: false }
);

const parser = SerialPort.pipe(new Readline({ delimiter: '\n' }));

SerialPort.on('open', () => {
  console.log('Serial Port connected to Pico')
})

/* parser.on('data', data => {
  console.log('Received data from Pico:', data);
}) */


// Create and Start HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Sever is running");
});

// Attach socket.io to HTTP server
const io = socketIo(server);

io.on('connection', socket => {
  console.log('Client connected');

  socket.on('value', data => {
    const value = data;
    const message = '${value}';

    //Send command to Pico via SerialPort
    SerialPort.write(message, err => {
      if(err) {
        console.log('Error on write', err.message)
      }else {
        console.log('Sent to Pico: ${message}')
      }
    })
    
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });


});




server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
