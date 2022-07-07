// https://www.npmjs.com/package/ws
// Starts a WebSocket server.
import { WebSocketServer } from "ws";

const port = 1234
const wss = new WebSocketServer({port})

wss.on('connection', (ws) => {
    // Handles new client connections

    ws.on('message', (data) => {
        console.log(`Received from client › ${data}`);

        // TODO: Broadcast to other clients
    })

    ws.send(`Some message from the server.`)
});

console.log(`Listening at ${port}...`);