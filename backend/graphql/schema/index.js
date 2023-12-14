
const { buildSchema } = require('graphql');

module.exports= buildSchema(`
    type User{
        _id:ID!
        email:String!
        password:String
    }
    type AuthData{
        userId:String!
        token:String!
        tokenExpiration:Int!
    
    }
 
    type RootQuery{
        authData(email:String!,password:String!):AuthData!
        login(email:String!,password:String!):AuthData!
    }
    type RootMutation{
        createUser(email:String!,password:String!):AuthData!
        
    }

    schema{
        query:RootQuery
        mutation:RootMutation
    }
`)