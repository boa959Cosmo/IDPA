const dgram = require('dgram')
const net = require('net')
const fs = require('fs')
const path = require('path')
const http = require('http')
const express = require('express')
const cors = require('cors')
const app = express()
const socketio = require("socket.io")
const webInterface = http.createServer(app)



app.use(cors({
    origin: 'http://188.63.53.11:8080',
    credentials: true,
}));
  
app.use(express.json())

const PORTTCP = 8088
const PORTUDP = 6969
const PORTWEB = 3000  
var command = {}

// Sockets 

const webIO = socketio(webInterface, { //creates websocket to communicate with frontend
    cors: {
        origins:['http://188.63.53.11:8080'],
        rejectUnauthorized: false
    }
})

const telemetryLogStream = fs.createWriteStream(path.join(__dirname, 'telemetry.log'), {flags: 'a'}) //opens write Stream for log file

const udpIO = dgram.createSocket('udp4') //creates udp socket to recieve data from the client
udpIO.bind(PORTUDP); // Binds Ports to UDP socket

const tcpIO = net.createServer((socket) => { // creates tcp socket to answer the client with commands
    socket.on('data', () => {
        socket.write(JSON.stringify(command)) //replies whatever in this var is
        command = {}
    })
    socket.on('end', () => {
        console.log('client disconnected');
    });
})
 
tcpIO.listen(PORTTCP, () => {
    console.log('TCP Socket   listening on ' + tcpIO.address().port);
});



udpIO.on('listening', () => {
    console.log('UDP Socket   listening on ' + udpIO.address().port);
});

udpIO.on('message', (msg, remote) => {
    msg = parsePythontoJSON(msg) // parse socket input to usable JSON

    webIO.emit("data", msg) //send UDP data to 
    
    console.log(remote.address + ':' + remote.port)
    //console.log(msg.camera);
    telemetry(msg, remote)
})



/*
webIO.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
*/

function telemetry(msg, remote) {
    let now = new Date()
    telemetryLogStream.write(now.getDate()+'.'
                        +(now.getMonth() + 1)+'.'
                        +now.getFullYear()+';'
                        +now.getHours()+':'
                        +now.getMinutes()+':'
                        +now.getSeconds()+';'
                        +remote.address +';'
                        +msg.telemetry.TEMPERATURE +'\r\n'
                        )
                        
}

function parsePythontoJSON(input) {
    try {
        return JSON.parse(input.toString().replaceAll("'", `"`).replaceAll(`b"`, `"`).replaceAll(`"{`, "{").replaceAll(`}"`, "}"))
    } catch (err) {
        console.log('Failed to parse UDP socket Input to JSON');
    }
}

// ----------------------------------------------------------------
// ---> Web Shit

app.post("/command", (req,res) => {
    command = req.body
    //check if tcp connectin is established and send succes or error message
});


webInterface.listen(PORTWEB, () => {
    console.log("HTTP Server  listening on " + PORTWEB);
})