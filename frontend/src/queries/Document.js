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
const DOCUMENT_CHANGED_SUBSCRIPTION = gql`
  subscription DocumentChanged($userId: String!) {
    documentChanged(documentId:"657ede539e01bb0d81685798",userId: $userId) {
      _id
      title
      owner
      content
      associatedUsers
    }
  }
`;


export {CREATE_DOCUMENT,DOCUMENT_CHANGED_SUBSCRIPTION}