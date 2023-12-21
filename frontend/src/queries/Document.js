import gql from 'graphql-tag';

const CREATE_DOCUMENT = gql`
mutation($userId: String!){
  createDocument(userId: $userId) {
    
    _id
      title
      owner
      content
      associatedUsers
  }
}
`;


export {CREATE_DOCUMENT}