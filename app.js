var http = require('http');
var fs = require('fs');
const { convertArrayToCSV } = require('convert-array-to-csv');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

var dataArrays = [];
// ?????
const header = ['elevationvalue','Time','Latitude','Longitude','Scenario','scenarionumber'];

//there is no index file???
var index = fs.readFileSync( 'index.html');

const parser = new ReadlineParser({ delimiter: '\r\n' });

var port = new SerialPort(
    { path: 'COM3', baudRate: 9600 , dataBits: 8, parity: 'none', stopBits: 1, flowControl: false}
    );

port.pipe(parser);

var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});



const io = require('socket.io')(app, {
    cors: {
     origin:"*"
     }
   });
//var io = require('socket.io').listen(app);
//var io = require('socket.io')(app);

io.on('connection', function(socket) {
    
    socket.on('lights',function(data){
        
        console.log( data );
        
        port.write( data.status );
    
    });

    socket.on('servoposition',function(data){
        
        //console.log( data );
        
        port.write( data.status );
    
    });

    socket.on('servoposition_elevation',function(data){
        
        //console.log( data.status );
        
        port.write( data.status );
        exportcsvservo(data);
    
    });

    socket.on('vibrationmotorcalibration',function(data){
        
        //console.log('vibrationmotorcalibration: ', data );
        
        port.write( data.status );
    
    });

    socket.on('motor_elevation',function(data){
        
        //console.log('motor_elevation: ', data );
        
        port.write( data.status );
        exportcsv(data);
    
    });
    
    socket.on('vibrationmotorreset',function(data){
        
        console.log('motor_elevation_reset: ', data );
        
        port.write( data.status );
        
    
    });

    socket.on('servocalibrationmotorreset',function(data){
        
        console.log('servo_elevation_reset: ', data );
        
        port.write( data.status );
        
    
    });
    socket.on('servoposition_elevation_finich',function(data){
        
        console.log('servoposition_elevation_finich: ', data );
        
        port.write( data.status );
        
    
    });
});

//app.listen(5501,"localhost");

function exportcsv(data){
    //console.log("X",data);
    dataArrays = [
        [ data.elevation,data.Time,data.Latitude,data.Longitude,data.Scenario,data.scenarionumber]
        ];
      
      const csvFromArrayOfArrays = convertArrayToCSV(dataArrays, {
        //header,
        separator: ','
      });
      
        fs.appendFileSync("file/vmotorouput.csv", csvFromArrayOfArrays, err =>{
        if(err){
            console.log(18, err);
        }


        console.log('CSV File saved successfully');
        })
    }


    function exportcsvservo(data){
        //console.log("X",data);
        dataArrays = [
            [ data.elevation,data.Time,data.Latitude,data.Longitude,data.Scenario,data.scenarionumber]
            ];
          
          const csvFromArrayOfArrays = convertArrayToCSV(dataArrays, {
            //header,
            separator: ','
          });
            fs.appendFileSync('file/servomotorouput.csv', csvFromArrayOfArrays, err =>{
            if(err){
                console.log(18, err);
            }
    
    
            console.log('CSV File saved successfully');
            })
        }

app.listen(5501,"localhost");

