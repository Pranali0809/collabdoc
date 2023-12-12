const express = require("express");
const { ApolloServer } = require("apollo-server");
const rootResolver = require("./graphql/resolvers/index.js");
const schema = require("./graphql/schema/index.js");

const app = express();
const port = process.env.PORT || 4200;

app.use(express.json());

const server = new ApolloServer({
    rootResolver,
    schema
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
