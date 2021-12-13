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
const PORTBACKEND = 3000
var clientAddress 

const server = dgram.createSocket('udp4')
const telemetryLogStream = fs.createWriteStream(path.join(__dirname, 'telemetry.xlsx'), {flags: 'a'})
//------------------------------HTTP APIS


app.post("/move1", (req, res) => {
    console.log('Move 1');
})



//--------------------------FUNCTIONS
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

//----------------------------UDP SHIT
server.bind(PORTUDP);

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', (msg, remote) => {
    msg = JSON.parse(msg)

    console.log(remote.address + ':' + remote.port +' - ' + msg.category)
    if (msg.category == 'telemetry') {
        telemetry(msg, remote)
        clientAddress = remote.address
    }
    console.log(clientAddress);
});


webInterface.listen(PORTBACKEND, () => {
    console.log("[HTTP] Online on port " + PORTBACKEND);
})


