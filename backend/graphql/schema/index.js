
const { buildSchema } = require('graphql');

module.exports= buildSchema(`
    type User{
        _id:ID!
        email:String!
        password:String!
    }
    type AuthData{
        userId:String!
        token:String!
        tokenExpiration:Int!
    
    }
    type Document{
        _id:ID!
        title:String!
        owner:String!
        content:String!
        associatedUsers:[String]!
    }
 
    type RootQuery{
        authData(email:String!,password:String!):AuthData!
    }
    type RootMutation{
        createUser(email:String!,password:String!):AuthData!
        login(email:String!,password:String!):AuthData!
        createDocument(userId:String!):Document!

        
    }

    schema{
        query:RootQuery
        mutation:RootMutation
    }
`)