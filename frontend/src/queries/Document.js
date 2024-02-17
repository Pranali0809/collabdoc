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

const GET_DOCUMENTS = gql`
  mutation($userId: String!) {
    getDocuments(userId: $userId) {
      _id
      title
      owner
      content
      associatedUsers
    }
  }
`;

const ADD_CLICKED_DOCUMENTS = gql`
  mutation($userId: String!, $docId: String!) {
    addClickedDocuments(userId: $userId, docId: $docId) {
      _id
      title
      owner
      content
      associatedUsers
    }
  }
`;

const CHANGE_DOCUMENT_TITLE=gql`
  mutation($title:String!, $docId: String!){
    changeDocumentTitle(title:$title, docId:$docId){
      title
    }
  }
`
const GET_DOCUMENT=gql`
  mutation($docId:String!){
    getDocument(docId:$docId){
      _id
      title
      owner
      content
      associatedUsers
    }
  }
`



export {CREATE_DOCUMENT,DOCUMENT_CHANGED_SUBSCRIPTION,GET_DOCUMENTS,ADD_CLICKED_DOCUMENTS,CHANGE_DOCUMENT_TITLE,GET_DOCUMENT}