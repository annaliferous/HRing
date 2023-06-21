var http = require('http');
var fs = require('fs');
var index = fs.readFileSync( 'index.html');

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const { Server } = require("socket.io");

const parser = new ReadlineParser({ delimiter: '\r\n' });

var port = new SerialPort(
    { path: 'COM3', baudRate: 9600 , dataBits: 8, parity: 'none', stopBits: 1, flowControl: false}
    );

port.pipe(parser);
//setTimeout(function(){
//    port.write("1");
//    console.log("i send 1 to ardouino");
//}, 3000);

//port.on('error', function(err) { console.log('Error: ', err.message); })

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
        
        console.log( data );
        
        port.write( data.status );
    
    });

    socket.on('servoposition_elevation',function(data){
        
        console.log( data );
        
        port.write( data.status );
    
    });
    
});

app.listen(5500,"localhost");
//app.listen(5500,"10.181.128.6");

