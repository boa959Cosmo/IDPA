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
app.use(express.static("./client-vanilla"))


const PORTUDP = 6969
const PORTWEB = 8080
const HOST = '127.0.0.1'

const server = dgram.createSocket('udp4')
const telemetryLogStream = fs.createWriteStream(path.join(__dirname, 'telemetry.xlsx'), {flags: 'a'})

server.bind(PORTUDP, HOST);

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
    telemetry(msg, remote)

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
                        +msg.auto +'\r\n')  
}



webInterface.listen(PORTWEB, () => {
    console.log("[HTTP] Online on port " + PORTWEB);
})

//test 2
// ---> giver
// ---> requester
// ---> web
