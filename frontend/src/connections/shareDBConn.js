import ShareDB from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnecting-websocket';

ShareDB.types.register(require('rich-text').type);

const shareDBSocket = new ReconnectingWebSocket("ws://localhost:4200/graphql");
const shareDBConnection = new ShareDB.Connection(shareDBSocket);

shareDBSocket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
  });
  shareDBSocket.addEventListener('open', (event) => {
    console.log('Websocket open');
  });
  shareDBSocket.addEventListener('close', (event) => {
    console.log('Websocket close');
  });
export default shareDBConnection;