const WebSocket = require('ws');
const { isValidMessage } = require('./common');
process.stdin.setEncoding('utf8');

console.log(`argv: ${process.argv}`);
const from = process.argv[2] || 'unknown';
const serverAddress = process.argv[3] || 'ws://localhost:8080';

console.log(`serverAddress: ${serverAddress}`);
console.log(`from: ${from}`);

const ws = new WebSocket(serverAddress);
let isAlive = false;

ws.on('message', message => {
    const parsed = JSON.parse(message)
    if (isValidMessage(parsed)) {
        process.stdout.write(`${parsed.from}: ${parsed.content}`);
    } else {
        console.error(`INVALID message received: ${message}`)
    }
});

ws.on('connection', ws => {
    isAlive = true;
    ws.on('pong', () => {
        isAlive = true;
    })
});


process.stdin.on('data', content => ws.send(JSON.stringify({ from, content })));