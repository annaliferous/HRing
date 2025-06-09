const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { SerialPort } = require("serialport");
const server = express();

const port = new SerialPort({ path: "/dev/ttyACM1", baudRate: 9600 });

server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
  res.send('Hello World!')
})


server.post("/save", (req, res) => {
    const {calibrationValue, participationId} = req.body;
    const content = `calibrationValue: ${calibrationValue}\nparticipationId: ${participationId}\n`;
    const dataToSend = `${calibrationValue}`

    fs.writeFile("data/data_output.txt", content, err => {
        if (err) {
            console.error("Error writing to file", err);
            return res.status(500).send("Failed to save data.");
        }
        port.write(dataToSend, err => {
            if (err) {
                console.error("Failed to write to Pico:", err);
                return res.status(500).send("Serial write error");
            }
        res.send("Data saved and sent successfully!");
    });
})
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
