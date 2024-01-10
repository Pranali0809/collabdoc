const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const sharedb = require("sharedb");
const WebSocket = require("ws");
const WebSocketJSONStream = require("websocket-json-stream");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { ApolloServer } = require("apollo-server-express");
const rootResolver = require("./graphql/resolvers/index.js");
const schema = require("./graphql/schema/index.js");
const cookieParser = require("cookie-parser");

dotenv.config();
const port = process.env.PORT || 4200;
const app = express();
app.use(cookieParser());

const corsOption = {
  origin: [
    "http://localhost:3000/",
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
const sharedbBackend = new sharedb();

// Create an ApolloServer instance with your schema and resolvers
const server = new ApolloServer({
  schema,
  resolvers: rootResolver,
  context: ({ req, res }) => ({ req, res }), // Add any necessary context
});

const httpServer = app.listen(port, async () => {
  await server.start();
  server.applyMiddleware({ app, cors: corsOption });

  console.log(`Server listening at http://localhost:${port}`);
});

// WebSocket setup for ShareDB
const wss = new WebSocket.Server({ server: httpServer });
wss.on("connection", (ws, req) => {
  console.log(ws);
});
// Subscription setup for Apollo Server
SubscriptionServer.create(
  {
    execute,
    subscribe,
    schema: server.schema,
  },
  {
    server: wss,
    path: server.graphqlPath,
  }
);
