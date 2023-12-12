
const { buildSchema } = require('graphql');

module.exports= buildSchema(`
    type User{
        _id:ID!
        email:String!
        password:String
    }
    type AuthData{
        userId:ID!
        token:String!
        tokenExpiration:Int!
    
    }

    
    type RootQuery{
        login(email:String!,password:String!):AuthData!
    }
    type RootMutation{
        createUser(email:String!,password:String!):User
    }

    schema{
        query:RootQuery
        mutation:RootMutation
    }

`)