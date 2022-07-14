// https://www.npmjs.org/package/ws
// Starts a WebSocket client and connects to a server
import WebSocket from "ws";

const port = `1234`;
const ws = new WebSocket(`ws://localhost:${port}`);

ws.on('open', () => {
    console.log(`[Client] Connected.`);
    ws.send(`Hi, this is a client!`);
});

ws.on('message', (data) => {
    console.log(`Received a message from the server: ${data}`);
});