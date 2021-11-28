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
app.use(express.static("./web"))


const PORTUDP = 6969
const PORTWEB = 3000
var clientAddress 

const server = dgram.createSocket('udp4')
const telemetryLogStream = fs.createWriteStream(path.join(__dirname, 'telemetry.xlsx'), {flags: 'a'})

server.bind(PORTUDP);

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});


/*
server.on('message', function (msg, remote) {

    console.log(remote.address + ':' + remote.port +' - ' + msg);
});
*/
server.on('message', (msg, remote) => {
    msg = JSON.parse(msg)

    console.log(remote.address + ':' + remote.port +' - ' + msg.category)
    if (msg.category == 'telemetry') {
        telemetry(msg, remote)
        clientAddress = remote.address
    }
    console.log(clientAddress);
});


export function testSend(message) {
    server.send(message, PORTUDP, clientAddress, function(err, bytes) {
        if (err) throw err;
        console.log('UDP message sent to ' + HOST +':'+ PORT);
        client.close()
    })
}


function telemetry(msg, remote) {
    let now = new Date()
    telemetryLogStream.write(now.getDate()+'.'
                        +(now.getMonth() + 1)+'.'
                        +now.getFullYear()+';'
                        +now.getHours()+':'
                        +now.getMinutes()+':'
                        +now.getSeconds()+';'
                        +remote.address +';'
                        +msg.auto +'\r\n')  
}



webInterface.listen(PORTWEB, () => {
    console.log("[HTTP] Online on port " + PORTWEB);
})

//test 2
// ---> giver
// ---> requester
// ---> web
