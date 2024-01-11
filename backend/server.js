const express = require("express");
const cors = require("cors");
const {makeExecutableSchema}=require('@graphql-tools/schema')
const {gql}=require('graphql-tag');
const { startStandaloneServer } =require('@apollo/server/standalone');
const {createServer}=require("http");
const {useServer}=require("graphql-ws/lib/use/ws");
const { ApolloServer } =require('@apollo/server');
const { ApolloServerPluginDrainHttpServer } =require('@apollo/server/plugin/drainHttpServer');
const { expressMiddleware } =require("@apollo/server/express4");
const { PubSub } = require('graphql-subscriptions');
const bodyParser =require('body-parser');
const cookieParser=require('cookie-parser');
// Import your existing ShareDB and other dependencies
const {WebSocketServer} = require("ws");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const typeDefs= require('./graphql/schema/index.js');

const rootResolver= require('./graphql/resolvers/index.js');

(async function () {
  dotenv.config();
  const port = process.env.PORT || 4200;
  const pubsub = new PubSub(); // Publish and Subscribe, Publish -> everyone gets to hear it

  const app = express();
  app.use(cookieParser());
  const httpServer = createServer(app);

  const corsOption = {
    origin: [
      "http://localhost:3000",
      "http://localhost:4200/graphql",
      "https://studio.apollographql.com",
    ],
    credentials: true,
  };

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });


const schema = makeExecutableSchema({typeDefs, rootResolver});

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Failed to connect to MongoDB", err));

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql", // localhost:3000/graphql
  });

  const serverCleanup = useServer({ schema }, wsServer); // dispose

  
  const server = new ApolloServer({
    typeDefs,
    resolvers:rootResolver,
    // schema
    
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
    ]

  });

 await server.start()

  app.use('/graphql', cors(),bodyParser.json(),  expressMiddleware(server, {
    context: async ({ req,res }) => {
      return ({req,res});
    },
  }),);

  httpServer.listen(4200, () => {
    console.log("Server running on http://localhost:" + "4200" + "/graphql");
  });
})();
