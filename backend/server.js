const express = require("express");
const cors = require("cors");
const {makeExecutableSchema}=require('@graphql-tools/schema')
const {gql}=require('graphql-tag');
const {createServer}=require("http");
const {useServer}=require("graphql-ws/lib/use/ws");
const { ApolloServer } =require('@apollo/server');
const { ApolloServerPluginDrainHttpServer } =require('@apollo/server/plugin/drainHttpServer');
const { expressMiddleware } =require("@apollo/server/express4");
const bodyParser =require('body-parser');
const cookieParser=require('cookie-parser');
const ShareDB = require('sharedb');
const { MongoClient } = require('mongodb');
const {WebSocketServer} = require("ws");
const mongoose = require("mongoose");
const shareDBMongo = require('sharedb-mongo');
const dotenv = require("dotenv");
const schema=require('./graphql/schema/index.js')
const WebSocketJSONStream = require('@teamwork/websocket-json-stream')
dotenv.config();
const port = process.env.PORT || 4200;
const richText = require('rich-text');
const WebSocket = require('ws')

ShareDB.types.register(richText.type);
// let backend = new ShareDB();
const backend = new ShareDB({
    db: require('sharedb-mongo')(process.env.MONGODB_URI),
    presence:true,
    doNotForwardSendPresenceErrorsToClient: true
    
  });;

createDoc(startServer);
// Create initial document then fire callback
function createDoc(callback) {
  let connection = backend.connect();
  let doc = connection.get('examples', 'test-doc7');
  doc.fetch(function(err) {
      if (err) throw err;
          doc.create([{insert: 'Hi2!', attributes:{author: 3}}], 'rich-text', callback);
          return;
      callback();
  });
}

async function startServer() {

  const app = express();
  const httpServer = createServer(app);

  const corsOption = {
    origin: [
      "http://localhost:3000",
      "http://localhost:4200/graphql",
      "https://studio.apollographql.com",
      "ws://localhost:4200/graphql"
    ],
    credentials: true,
  };

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  app.use(express.static('static'));
  app.use(express.static('node_modules/quill/dist'));

 let wss=new WebSocket.Server({server: httpServer});
    wss.on('connection', function(ws) {
        let stream = new WebSocketJSONStream(ws);
        backend.listen(stream);
        ws.on('open', () => {
          console.log("Websocket Connected");
          
          // Check if the WebSocket is open
          if (ws.readyState === WebSocket.OPEN) {
            console.log("WebSocket is open and connected");
          } else {
            console.log("WebSocket is not open");
          }
        });
        ws.on('close', (code, reason) => {
              console.log(`WebSocket closed with code ${code} and reason: ${reason}`);
        });
    });
  // const serverCleanup = useServer({ schema }, wsServer);
  const server = new ApolloServer({
    schema,
  });


  await server.start();

  app.use('/graphql', cors(),bodyParser.json(),cookieParser(),  expressMiddleware(server, {
    context: async ({ req,res }) => ({ req,res }),
  }));

  httpServer.listen(port, () => {
    console.log("Server hi " + "4200" + "/graphql");
  });
}; 