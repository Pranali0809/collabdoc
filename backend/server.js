const express = require("express");
const cors=require("cors");
const dotenv=require('dotenv');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const rootResolver = require("./graphql/resolvers/index.js");
const schema = require("./graphql/schema/index.js");
const cookieParser = require('cookie-parser');

dotenv.config();
const port = process.env.PORT || 4200;
const app = express();
app.use(cookieParser());

const corsOption={
    origin: 'http://localhost:3000',
    credentials: true,

}
mongoose.connect(process.env.MONGODB_URI).then(
  () => { console.log("Connected to MongoDB"); },
  (err) => { console.log("Failed to connect to MongoDB", err); }
);

app.use(cors(corsOption));
const startServer = async () => {
    const server = new ApolloServer({
      typeDefs: schema,
      resolvers: rootResolver,
      context: ({ req, res }) => ({ req, res }),
    });

    await server.start();
    server.applyMiddleware({ app,cors:corsOption });

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    })
  };

startServer();

