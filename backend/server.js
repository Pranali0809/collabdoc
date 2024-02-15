const express = require("express");
const cors = require("cors");
const {createServer}=require("http");
const { ApolloServer } =require('@apollo/server');
const { expressMiddleware } =require("@apollo/server/express4");
const bodyParser =require('body-parser');
const cookieParser=require('cookie-parser');
const mongoose = require("mongoose");
const ShareDB = require('sharedb');
const dotenv = require("dotenv");
dotenv.config();
const schema=require('./graphql/schema/index.js')
const WebSocketJSONStream = require('@teamwork/websocket-json-stream')
const port = process.env.PORT || 4200;
const richText = require('rich-text');
const WebSocket = require('ws');


ShareDB.types.register(richText.type);

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

const backend = new ShareDB({
    db: require('sharedb-mongo')(process.env.MONGODB_URI),
    presence:true,
    doNotForwardSendPresenceErrorsToClient: true
    
  });;

startServer()


async function startServer() {

  const app = express();
  const httpServer = createServer(app);

  const corsOption = {
    origin: 
      ["http://localhost:3000","http://localhost:4200/graphql"]
    ,
    credentials: true,
  };

  
  app.use(cors(corsOption));

  app.use(express.static('static'));
  app.use(express.static('node_modules/quill/dist'));

 let wss=new WebSocket.Server({server: httpServer});
    wss.on('connection', function(ws) {
        let stream = new WebSocketJSONStream(ws);
        backend.listen(stream);

    });

  const server = new ApolloServer({
    schema,
  });


  await server.start();

  app.use('/graphql',bodyParser.json(),cookieParser(), expressMiddleware(server, {
    context: async ({ req,res }) => ({ req,res }),
  }));

  httpServer.listen(port, () => {
    console.log("Server hi " + "4200" + "/graphql");
  });
}; 
module.exports=backend;