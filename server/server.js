const dgram = require('dgram')
const fs = require('fs')
const path = require('path')

const PORT = 6969
const HOST = '127.0.0.1'

const server = dgram.createSocket('udp4')
const telemetryLogStream = fs.createWriteStream(path.join(__dirname, 'telemetry.xlsx'), {flags: 'a'})

server.bind(PORT, HOST);

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



//test 2
// ---> giver
// ---> requester
// ---> web
