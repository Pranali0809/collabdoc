const express = require("express");
const { ApolloServer,gql } = require("apollo-server");
const rootResolver = require("./graphql/resolvers/index.js");
const schema = require("./graphql/schema/index.js");

// const app = express();
const port = process.env.PORT || 4200;

// app.use(express.json());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: rootResolver,
});

server.listen({ port: process.env.PORT || 4200 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

// Create an async function to start the Apollo Server and apply middleware
// const startServer = async () => {
//   const server = new ApolloServer({
//     typeDefs: schema,
//     resolvers: rootResolver,
//   });

//   // Await the start of the Apollo Server
//   await server.start();

//   // Apply the Apollo Server middleware to the Express app
//   server.applyMiddleware({ app });

//   // Start the Express app
//   app.listen(port, () => {
//     console.log(`Server listening at http://localhost:${port}`);
//   });
// };

// // Call the async function to start the server
// startServer();