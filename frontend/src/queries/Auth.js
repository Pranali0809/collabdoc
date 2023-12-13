import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      userId
      token
      tokenExpiration
    }
  }
`;