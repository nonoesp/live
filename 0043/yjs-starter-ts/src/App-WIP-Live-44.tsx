import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useState, useEffect } from "react";

// Import Yjs, y-webrtc, and y-protocols
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import * as awarenessProtocol from 'y-protocols/awareness.js'

// Create a Yjs document
const ydoc = new Y.Doc();

// Define our WebRTC provider
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

// Create/Get a YArray
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

function yArrayAsText(yarray: Y.Array<unknown>) {
  return yarray.toJSON().join(' · ');
}

// class App extends React.Component<AppProps, AppState> {
  function App () {

    const arr = useYArray(yarray);

    return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hi, this is Nono! 👋🏻
        </p>
        <p>
          {/* {this.state.text} */}
        </p>
        <p>
          {yArrayAsText(arr)}
        </p>
        <div
        onClick={() => {
          arr.insert(0, ['test'])
        }}
        style={{
          cursor: "pointer"
        }}>
          Add value
        </div>
      </header>
    </div>
  );
      }

function useYArray(yarray: Y.Array<unknown>) {
  // State for keeping track of whether key is pressed
  const [array, setArray] = useState<Y.Array<unknown>>(yarray);
  // If pressed key is our target key then set to true

  function setArrayValue() {
    console.log(`yarray updated (hook): `, yarray.toJSON());
    setArray(yarray);
  }

  // Add event listeners
  useEffect(() => {
    yarray.observeDeep(() => setArrayValue)
    // Remove event listeners on cleanup
    return () => {
      yarray.unobserveDeep(() => setArrayValue)
    };
  }, [yarray]); // Empty array ensures that effect is only run on mount and unmount
  return array;
}

export default App;
