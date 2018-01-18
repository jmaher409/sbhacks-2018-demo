const WebSocket = require('ws');
const { isValidMessage } = require('./common');

const server = new WebSocket.Server({ port: 8080 });

const messages = [];

server.on('connection', connection => {
    // send message history to new connections
    messages.forEach(message => connection.send(message));

    connection.on('message', message => {
        // check if incoming message is valid
        const parsed = JSON.parse(message);
        if (!isValidMessage(parsed)) {
            console.error(`INVALID message received: ${message}`);
            return;
        } else {
            console.info(`VALID message received: ${message}`)
        }

        // store message so we can give new clients full history
        messages.push(message);

        // broadcast message to all other clients
        server.clients.forEach(client => {
            if (client !== connection && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});