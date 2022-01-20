const dgram = require('dgram')
const fs = require('fs')
const path = require('path')
const http = require('http')
const express = require('express')
const cors = require('cors')
 
const app = express()

const webInterface = http.createServer(app)

app.use(cors())
app.use(express.json())


const PORTUDP = 6969
const PORTWEB = 3000
var clientAddress 

// ---> UDP Shit

const server = dgram.createSocket('udp4')
const telemetryLogStream = fs.createWriteStream(path.join(__dirname, 'telemetry.log'), {flags: 'a'})

server.bind(PORTUDP);

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', (msg, remote) => {
    msg = msg.toString()
    msg = JSON.parse(msg)
    console.log(msg.telemetry);
    console.log(remote.address + ':' + remote.port)
    telemetry(msg, remote)

})

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

app.post("/api/control", (req,res) => {
    console.log(req.body);
    let message = Buffer.from(JSON.stringify({category: 'control', content: req.body.content}))
    try {
        server.send(message, 5005, clientAddress, function(err, bytes) {
            console.log('control with content: '+req.body.content+' sent to ' + clientAddress +':'+ 5005);
        })
        res.status(200)
    } catch(err) {
        res.status(500)
    }

})


webInterface.listen(PORTWEB, () => {
    console.log("[HTTP] Online on port " + PORTWEB);
})

