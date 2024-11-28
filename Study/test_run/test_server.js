const http = require('http');
const fs = require("fs");
const path = require('path');
const { parse } = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");
const querystring = require('querystring');

const csvFilePath = 'test_data/test_data_file.csv';


// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        filePath = '';
        if (req.url === '/' || req.url === '/test_run.html') {
            filePath = path.join(__dirname, 'public', 'test_run.html');
        } else if (req.url === '/test_run.css') {
        filePath = path.join(__dirname, 'public', 'test_run.css');
        res.setHeader('Content-Type', 'text/css');
        } else if (req.url === '/test_run.js') {
            filePath = path.join(__dirname, 'public', 'test_run.js');
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
    }
    

    else if(req.method === 'POST' && req.url === '/sendCal') {
        console.log('POST request received for /sendCal');
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString();  
        });

        req.on('end', () => {
            const data = querystring.parse(body); 
            const { calibrationValue, participationId} = data;

            if (!calibrationValue || !participationId) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid or missing data');
            } else {
                updateCSVCalibration(calibrationValue, participationId);
                
            }
        });        
    }

    if(req.method === 'POST' && req.url === '/sendTimeStart') {
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString(); 
        });

        req.on('end', () => {
            const data = querystring.parse(body); 
            const { time_start} = data;


            if (time_start == undefined) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid or missing data');
            } else {
                updateCSVTimeStart(time_start);
                
            }
        });        
    }

    if(req.method === 'POST' && req.url === '/sendTimeStop') {
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const data = querystring.parse(body); 
            const { time_stop} = data;


            if (time_stop == undefined) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid or missing data');
            } else {
                updateCSVTimeStop(time_stop);
                
            }
        });        
    }

    if(req.method === 'POST' && req.url === '/meassurements') {
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const data = querystring.parse(body); 
            const { canvas_select, intensity, height} = data;


            if (time_stop == undefined) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid or missing data');
            } else {
                updateCSVMeassurements(canvas_select, intensity, height);
                
            }
        });        
    }
    
    }
    
);

// Set up the CSV writer
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
    append: true 
});
 

// Read and update CSV function
function updateCSVCalibration(calibrationValue, participationId) {
    const updatedRecords = [];
    const readStream = fs.createReadStream(csvFilePath);

    readStream.pipe(parse({ delimiter: ',', columns: true }))
        .on('data', (row) => {
            row.participation_id = participationId;
            row.calibration_value = calibrationValue;
            row.min = calibrationValue;
            row.max = parseInt(row.max) + calibrationValue;
            updatedRecords.push(row);   
            
        })
        .on('end', () => {
            // Write the updated records back to the CSV file
            csvWriter.writeRecords(updatedRecords)
                .then(() => {
                    console.log('CSV updated successfully');
                })
                .catch((error) => {
                    console.error('Error writing to CSV file:', error);
                });
        })
        .on('error', (err) => {
            console.error('Error reading CSV file:', err);
        });
} 

function updateCSVTimeStart (time_start){
    const updatedRecords = [];
    const readStream = fs.createReadStream(csvFilePath);

    readStream.pipe(parse({ delimiter: ',', columns: true }))
        .on('data', (row) => {
            row.time_start = time_start;
            updatedRecords.push(row);  
            
        })
        .on('end', () => {
            // Write the updated records back to the CSV file
            csvWriter.writeRecords(updatedRecords)
                .then(() => {
                    console.log('CSV updated successfully');
                })
                .catch((error) => {
                    console.error('Error writing to CSV file:', error);
                });
        })
        .on('error', (err) => {
            console.error('Error reading CSV file:', err);
        });

}

function updateCSVTimeStop (time_stop){
    const updatedRecords = [];
    const readStream = fs.createReadStream(csvFilePath);

    readStream.pipe(parse({ delimiter: ',', columns: true }))
        .on('data', (row) => {
            row.time_stop = time_stop;
            updatedRecords.push(row);  
            
        })
        .on('end', () => {
            // Write the updated records back to the CSV file
            csvWriter.writeRecords(updatedRecords)
                .then(() => {
                    console.log('CSV updated successfully');
                })
                .catch((error) => {
                    console.error('Error writing to CSV file:', error);
                });
        })
        .on('error', (err) => {
            console.error('Error reading CSV file:', err);
        });

}

function updateCSVMeassurements(canvas_select, intensity, height){
    readStream.pipe(parse({ delimiter: ',', columns: true }))
        .on('data', (row) => {
            row.canvas_select = canvas_select;
            row.intensity = intensity;
            row.height = height;
            updatedRecords.push(row);  
            
        })
        .on('end', () => {
            // Write the updated records back to the CSV file
            csvWriter.writeRecords(updatedRecords)
                .then(() => {
                    console.log('CSV updated successfully');
                })
                .catch((error) => {
                    console.error('Error writing to CSV file:', error);
                });
        })
        .on('error', (err) => {
            console.error('Error reading CSV file:', err);
        });

}

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
