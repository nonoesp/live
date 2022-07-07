// https://www.npmjs.com/package/ws
// Stars a WebSocket client.
import WebSocket from "ws";

const port = 1234
const ws = new WebSocket(`ws://localhost:${port}`)

ws.on('open', () => {
    console.log(`[Client] Connected.`);
    ws.send(`My first message.`)
});

ws.on('message', (data) => {
    console.log(`[Client] Received message from server › ${data}`);

    // TODO: Add handlers for JSON messages that contain method/params
})
