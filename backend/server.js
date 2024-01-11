const express = require("express");
const cors = require("cors");
const {createServer}=require("http");
const {useServer}=require("graphql-ws/lib/use/ws");
const { ApolloServer } =require('@apollo/server');
const { ApolloServerPluginDrainHttpServer } =require('@apollo/server/plugin/drainHttpServer');
const { expressMiddleware } =require("@apollo/server/express4");
const bodyParser =require('body-parser');
const cookieParser=require('cookie-parser');
const {WebSocketServer} = require("ws");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const schema=require('./graphql/schema/index.js')
dotenv.config();
const port = process.env.PORT || 4200;

(async function () {

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


  mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
  
  app.use(cors(corsOption));
  // const sharedbBackend = new sharedb();

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql", 
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,


    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use('/graphql', cors(),bodyParser.json(),cookieParser(),  expressMiddleware(server, {
    context: async ({ req,res }) => ({ req,res }),
  }));

  httpServer.listen(port, () => {
    console.log("Server running on http://localhost:" + "4200" + "/graphql");
  });
})();
