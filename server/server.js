const dgram = require('dgram')
const net = require('net')
const fs = require('fs')
const path = require('path')
const http = require('http')
const express = require('express')
const cors = require('cors')
const app = express()
const socketio = require("socket.io")
const { resolve } = require('dns/promises')
const webInterface = http.createServer(app)


const webIO = socketio(webInterface, {
    cors: {
        origins:['http://localhost:8080'],
        rejectUnauthorized: false
    }
})



app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
  }));
  
app.use(express.json())
//app.use(express.static(__dirname + '/client'))

const PORTTCP = 8088
const PORTUDP = 6969
const PORTWEB = 3000
var clientAddress 

// ---> UDP Shit

const udpIO = dgram.createSocket('udp4')

 
  



const telemetryLogStream = fs.createWriteStream(path.join(__dirname, 'telemetry.log'), {flags: 'a'})

udpIO.bind(PORTUDP);

udpIO.on('listening', function () {
    var address = udpIO.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

udpIO.on('message', (msg, remote) => {
    msg = msg.toString()
    msg = msg.replaceAll("'", `"`)
    msg = msg.replaceAll(`b"`, `"`)
    msg = msg.replaceAll(`"{`, "{")
    msg = msg.replaceAll(`}"`, "}")

   //msg = msg.replaceAll(`}"}`, "}}")
    
    msg = JSON.parse(msg)
    webIO.emit("data", msg)
    clientAddress =remote.address
    console.log(remote.address + ':' + remote.port)
    //console.log(msg.camera);
    telemetry(msg, remote)
})

webIO.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });


function telemetry(msg, remote) {
    let now = new Date()
    telemetryLogStream.write(now.getDate()+'.'
                        +(now.getMonth() + 1)+'.'
                        +now.getFullYear()+';'
                        +now.getHours()+':'
                        +now.getMinutes()+':'
                        +now.getSeconds()+';'
                        +remote.address +';'
                        + msg.telemetry.TEMPERATURE +'\r\n')  
}

// ----------------------------------------------------------------
// ---> Web Shit

app.post("/command", (req,res) => {
    console.log(req.body);
    console.log('initial check');
    udpIO.send(JSON.stringify(req.body), 5000, clientAddress, (err) =>{
        if(err){
            client.close();
        }else{
            console.log('Data sent !!!');
      }
    });
    /*
    let message = Buffer.from(JSON.stringify({category: 'control', content: req.body.content}))
    try {
        server.send(message, 5005, clientAddress, function(err, bytes) {
            console.log('control with content: '+req.body.content+' sent to ' + clientAddress +':'+ 5005);
        })
        res.status(200)
    } catch(err) {
        res.status(500)
    }
*/
})


webInterface.listen(PORTWEB, () => {
    console.log("[HTTP] Online on port " + PORTWEB);
})

