const WebSocket = require('ws');
const { isValidMessage } = require('./common');

const server = new WebSocket.Server({ port: 8080 });

const messages = [];

server.on('connection', connection => {
    connection.isAlive = true;

    connection.on('pong', () => connection.isAlive = true);

    messages.forEach(message => connection.send(message));

    connection.on('message', message => {
        // store message so we can give new clients full history
        const parsed = JSON.parse(message);
        if (!isValidMessage(parsed)) {
            console.error(`INVALID message received: ${message}`);
            return;
        } else {
            console.info(`VALID message received: ${message}`)
        }

        messages.push(message);

        // broadcast message to all other clients
        server.clients.forEach(client => {
            if (client !== connection && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});


const interval = setInterval(() => {
    server.clients.forEach(client => {
        if (client.isAlive === false) return client.terminate();

        client.isAlive = false;
        client.ping(() => { });
    });
}, 30000);