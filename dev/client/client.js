const dgram = require('dgram');
const { stringify } = require('querystring');

const PORT = 6969;
const HOST = '127.0.0.1';

//let message = Buffer.from('My KungFu is Good!');
let message = Buffer.from(JSON.stringify({category: 'telemetry', auto: 'audi', bus: 'bmw'}))

let message2 = Buffer.from('Zieh dürre du siebe sich')
let client = dgram.createSocket('udp4');


client.send(message, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);
    client.close()
});






// ---> giver
// ---> requester

