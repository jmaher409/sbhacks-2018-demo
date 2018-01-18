const WebSocket = require('ws');
const { isValidMessage } = require('./common');
const from = process.argv[2] || 'unknown';
const serverAddress = process.argv[3] || 'ws://localhost:8080';

// read stdin as utf8 text
process.stdin.setEncoding('utf8');

console.log(`serverAddress: ${serverAddress}`);
console.log(`from: ${from}`);

const ws = new WebSocket(serverAddress);

ws.on('message', message => {
    const parsed = JSON.parse(message)
    // only print valid messages
    if (isValidMessage(parsed)) {
        process.stdout.write(`${parsed.from}: ${parsed.content}`);
    } else {
        console.error(`INVALID message received: ${message}`)
    }
});

// observe stdin for new meessages to send
process.stdin.on('data', content => ws.send(JSON.stringify({ from, content })));