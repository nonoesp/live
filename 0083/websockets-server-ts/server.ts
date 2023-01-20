// https://www.npmjs.com/package/ws
// Start a WebSocket server.
import { WebSocketServer } from "ws";

const port = 1234;
const wss = new WebSocketServer({port});

wss.on('connection', (ws: any) => {
    // Handles new connections

    console.log(`New client connected.`);

    ws.on('message', (data: any) => {
        console.log(`Received message from client: ${data}`);
    })

    ws.send(`Hello, this is server.ts! 👋🏻`);
})

console.log(`Listening at ${port}...`);