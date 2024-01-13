import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { split,ApolloClient, InMemoryCache,ApolloProvider,createHttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';


const httpLink = createHttpLink({
  uri: 'http://localhost:4200/graphql',
  credentials: 'include',
});

// const wsLink=new WebSocketLink({
//   uri:'ws://localhost:4200/graphql',
//   options:{
//     reconnect:true
//   }
// })

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   httpLink
// );

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <Provider store={store}>
    <App />

    </Provider>
    </ApolloProvider>
  </React.StrictMode>
);
