// Function to change the angle
// Send angle changes to backend via WebSocket
const http = require("http");
const io = require("socket.io")(http);
const PORT = 5500;
// const PORT = new SerialPort({
//   path: "COM3",
//   baudRate: 9600,
//   dataBits: 8,
//   parity: "none",
//   stopBits: 1,
//   flowControl: false,
// });


angle = parseInt(document.getElementById("angle").value);


// Listen for WebSocket connections
io.on("connection", function (socket) {
    // Handle angle changes from frontend
    socket.on("angleChange", (data) => {
        const { angle } = data;
        console.log("Received new angle:", angle);
        const pulseWidth = angleToPulseWidth(angle);
        servo.servoWrite(pulseWidth); // Set servo position
    });
    socket.emit("angleChange", { angle: angle });
});

// Start HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(".");
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
