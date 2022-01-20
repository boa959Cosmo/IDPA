import server from '../server.js'

function foo() {
    server.testSend(Buffer.from(JSON.stringify({category: 'telemetry', auto: 'audi', bus: 'bmw'})))
}
