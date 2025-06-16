const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { SerialPort } = require("serialport");
const server = express();

const port = new SerialPort({ path: "/dev/ttyACM0", baudRate: 9600 });

server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
  res.send('Express server is up and running!');
});



server.post("/save", (req, res) => {
    const {calibrationValue, participationId, startTime, stopTime} = req.body;

    //Safe CalibratinValue and ParticipationID
    if(calibrationValue && participationId){
        const content = `calibrationValue: ${calibrationValue}\nparticipationId: ${participationId}\n`;
        fs.appendFile(`data/data_output${participationId}.txt`, content, (err) => {
          if (err) {
            console.error("File write error:", err);
            return res.status(500).send("Error writing file");
          }
            //res.send("Data saved");
          });


    }
    //Safe startTime and stopTime
    else if (startTime && stopTime) {
        const content = `startTime: ${startTime}\nstopTime ${stopTime}\n`;
        fs.appendFile(`data/data_output${participationId}.txt`, content, (err) => {
            if (err) {
              console.error("File write error:", err);
              return res.status(500).send("Error writing file");
            }
            //res.send("Data saved");
            });


    }


});

server.post("/live", (req, res) => {
  const { value } = req.body;

  if (!value) return res.status(400).send("Missing value");

  // Send to Pico
  port.write(`${value}\n`, err => {
    if (err) {
      console.error("Live write failed:", err);
      return res.status(500).send("Serial write error");
    }
    //res.send("Live value sent to Pico");
  });
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
