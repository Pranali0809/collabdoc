
const rootResolver= require('../resolvers/index.js');
const {makeExecutableSchema}=require('@graphql-tools/schema')

const typeDefs=`
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
 
    type Query{
        authData(email:String!,password:String!):AuthData!
    }
    type Mutation{
        createUser(email:String!,password:String!):AuthData!
        login(email:String!,password:String!):AuthData!
        createDocument(userId:String!):Document!
        updateDocument(documentId:String!,content: String!): Document

        
    }

    type Subscription{
        documentChanged:Document
    }

    
`;


  module.exports = typeDefs;
