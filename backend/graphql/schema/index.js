
const { buildSchema } = require('graphql');
const { gql } = require('apollo-server');

module.exports= gql`
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
        login(email:String!,password:String!):AuthData!
    }
    type RootMutation{
        createUser(email:String!,password:String!):AuthData!
    }

    schema{
        query:RootQuery
        mutation:RootMutation
    }

`