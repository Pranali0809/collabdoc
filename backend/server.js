const express = require("express");
const cors=require("cors");
const dotenv=require('dotenv');
const { ApolloServer } = require('apollo-server-express');
const rootResolver = require("./graphql/resolvers/index.js");
const schema = require("./graphql/schema/index.js");

dotenv.config();
const port = process.env.PORT || 4200;
const app = express();
app.use(cors());

const startServer = async () => {
    const server = new ApolloServer({
      typeDefs: schema,
      resolvers: rootResolver,
    });

    await server.start();
    server.applyMiddleware({ app });

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  };

startServer();

