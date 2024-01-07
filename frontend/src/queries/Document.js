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
  subscription DocumentChanged($docId: String!) {
    documentChanged(docId: $docId) {
      _id
      title
      owner
      content
      associatedUsers
    }
  }
`;


export {CREATE_DOCUMENT,DOCUMENT_CHANGED_SUBSCRIPTION}