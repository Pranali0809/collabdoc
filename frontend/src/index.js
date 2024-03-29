import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache,ApolloProvider,createHttpLink } from '@apollo/client';


const httpLink = createHttpLink({
  uri: 'http://localhost:4200/graphql',
  credentials: 'include',
});

const client = new ApolloClient({
  link:httpLink,
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
