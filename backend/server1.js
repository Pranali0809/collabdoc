const express = require("express");
const cors = require("cors");
const {makeExecutableSchema}=require('@graphql-tools/schema')
const {gql}=require('graphql-tag');
const {createServer}=require("http");
const {useServer}=require("graphql-ws/lib/use/ws");
const { ApolloServer } =require('@apollo/server');
const { ApolloServerPluginDrainHttpServer } =require('@apollo/server/plugin/drainHttpServer');
const { expressMiddleware } =require("@apollo/server/express4");
const { PubSub } = require('graphql-subscriptions');
const {bodyParser} =require('body-parser');
// Import your existing ShareDB and other dependencies
const {WebSocketServer} = require("ws");

( async function () {
    // Server code in here!
    const pubsub = new PubSub(); // Publish and Subscribe, Publish -> everyone gets to hear it
    const app = express();
    const httpServer = createServer(app);

    // GraphQL Typedefs and resolvers
    const typeDefs = gql`
        type NewsEvent {
            title: String
            description: String
        }

        type Query {
            placeholder: Boolean
        }
        
        type Mutation {
            createNewsEvent(title: String, description: String) : NewsEvent
        }

        type Subscription {
            newsFeed: NewsEvent
        }
    `

    // interface createNewsEventInput {
    //     title: string
    //     description: string
    // }

    const resolvers = {
        Query: {
            placeholder: () => { return true }
        },
        Mutation: {
            createNewsEvent: (_parent , args  ) => {
                console.log(args);
                pubsub.publish('EVENT_CREATED', { newsFeed: args });

                // Save news events to a database: you can do that here!

                // Create something : EVENT_CREATED
                // Subscribe to something: EVENT_CREATED
                // return args;
            }
        },
        Subscription: {
            newsFeed: {
                subscribe: () => pubsub.asyncIterator(['EVENT_CREATED'])
            }
        }
    }

    const schema = makeExecutableSchema({typeDefs, resolvers});

    // ws Server
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/graphql" // localhost:3000/graphql
    });

    const serverCleanup = useServer({ schema }, wsServer); // dispose

    // apollo server
    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        }
                    }
                }
            }
        ]
    });

    // start our server
    await server.start();

    // apply middlewares (cors, expressmiddlewares)
    app.use('/graphql', cors(), expressMiddleware(server));

    // http server start
    httpServer.listen(4200, () => {
        console.log("Server running on http://localhost:" + "4200" + "/graphql");
    });

})();