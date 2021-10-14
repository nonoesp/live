import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import * as awarenessProtocol from 'y-protocols/awareness.js'

const ydoc = new Y.Doc();
const provider = new WebrtcProvider(
  'webrtc-test',
  ydoc,
  {
    // Specify signaling servers. The client will connect to every signaling server concurrently to find other peers as fast as possible.
    signaling: ['ws://localhost:4444'],
    // If password is a string, it will be used to encrypt all communication over the signaling servers.
    // No sensitive information (WebRTC connection info, shared data) will be shared over the signaling servers.
    // The main objective is to prevent man-in-the-middle attacks and to allow you to securely use public / untrusted signaling instances.
    password: null,
    // Specify an existing Awareness instance - see https://github.com/yjs/y-protocols
    awareness: new awarenessProtocol.Awareness(ydoc),
    // Maximal number of WebRTC connections.
    // A random factor is recommended, because it reduces the chance that n clients form a cluster.
    maxConns: 20,
    // Whether to disable WebRTC connections to other tabs in the same browser.
    // Tabs within the same browser share document updates using BroadcastChannels.
    // WebRTC connections within the same browser are therefore only necessary if you want to share video information too.
    filterBcConns: false,
    // simple-peer options. See https://github.com/feross/simple-peer#peer--new-peeropts for available options.
    // y-webrtc uses simple-peer internally as a library to create WebRTC connections.
    peerOpts: {}
  }
)

// const yarray = ydoc.get('array', Y.Array);

const yarray = ydoc.getArray('array');

provider.on('synced', () => {
  console.log(`Synced!`);
})

yarray.observeDeep(() => {
  console.log(`yarray updated: `, yarray.toJSON());
})

yarray.insert(0, ['nono'])

// window.example = { provider, ydoc, yarray };

// doc.on('update', (update: Uint8Array, origin: any, doc: Y.Doc, tr: Transaction) => {

// });


type AppProps = {
  // using `interface` is also ok
  // message: string;
};

type AppState = {
  text: string; // like this
};

class App extends React.Component<AppProps, AppState> {
  state: AppState = {
    // optional second annotation for better type inference
    text: this.yArrayAsText(yarray),
  };

  constructor(props: AppProps) {
    super(props);
    // this.handleClick = this.handleClick.bind(this);
  }

  yArrayAsText(yarray: Y.Array<unknown>) {
    return yarray.toJSON().join(' · ');
  }

  handleClick() {
    // this --> App
    yarray.insert(0, ['test'])
    this.update();
  }

  update() {
    const text = this.yArrayAsText(yarray);
    this.setState({ text })
  }

  render() {

    return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hi, this is Nono! 👋🏻
        </p>
        <p>
          {yarray.toJSON()}
        </p>
        <p>
          {this.state.text}
        </p>
        <div
        onClick={() => this.handleClick()}
        style={{
          cursor: "pointer"
        }}>
          Add value
        </div>
      </header>
    </div>
  );
      }
}

export default App;
