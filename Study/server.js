const http = require('http');
const fs = require("fs");
const { parse } = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");

const csvFilePath = 'Data_Files/Data_file.csv';


const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: [
        { id: 'condition_id', title: 'condition_id' },
        { id: 'participation_id', title: 'participation_id' },
        { id: 'calibration_value', title: 'calibration_value' },
        { id: 'canvas_select', title: 'canvas_select' },
        { id: 'intensity', title: 'intensity' },
        { id: 'step_id', title: 'step_id' },
        { id: 'min', title: 'min' },
        { id: 'max', title: 'max' },
        { id: 'time_start', title: 'time_start' },
        { id: 'time_stop', title: 'time_stop' }
    ],
    append: false  // Overwrite
});

// Read and update CSV function
function updateCSV(calibrationValue, participationId, conditionId) {
    fs.readFile(csvFilePath, (err, data) => {
        if (err) {
            console.error('Error reading CSV file:', err);
            return;
        }

        // Parse the CSV data
        parse(data, { delimiter: ',', columns: true }, (err, records) => {
            if (err) {
                console.error('Error parsing CSV file:', err);
                return;
            }

            // Find the row by condition_id
            const updatedRecords = records.map((row) => {
                if (row.condition_id === conditionId) {
                    // Update the min and max values
                    row.calibration_value = calibrationValue
                    row.min = calibrationValue;
                    row.max = parseInt(row.max) + calibrationValue;
                }
                return row;
            });

            // Write the updated records back to the CSV file
            csvWriter.writeRecords(updatedRecords)
                .then(() => {
                    console.log('CSV updated successfully');
                })
                .catch((error) => {
                    console.error('Error writing to CSV file:', error);
                });
        });
    });
}

// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/save-calibration') {
        let body = '';

        // Collect data sent in the request
        req.on('data', chunk => {
            body += chunk.toString();  // Convert buffer to string
        });

        req.on('end', () => {
            // Parse the received data (assuming it's JSON)
            const data = JSON.parse(body);
            const { calibrationValue, participationId, conditionId } = data;

            // Validate the received values
            if (calibrationValue !== undefined) {
                appendRepeatValue(calibrationValue, participationId, conditionId);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Values saved successfully' }));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid calibration value' }));
            }
        });
    } else {
        // Handle other routes or methods
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});