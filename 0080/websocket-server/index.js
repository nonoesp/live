/**
 * A minimal WebSockets server in node
 * using http://github.com/websockets/ws
 */

import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const PORT = process.env.PORT || 3000;

const server = express()
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {

    const uuid = uuidv4();

    console.log(`[${uuid}] Client connected`);

    ws.on('close', () => console.log(`[${uuid}] Client disconnected`));

    ws.on('message', (message) => {

        console.log(`[${uuid}] Received message: ${message}`);

        // Broadcast to everyone else.
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

    });
});