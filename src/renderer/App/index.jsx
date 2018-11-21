import React from 'react';
// import { ApolloProvider } from 'react-apollo';
import { MemoryRouter, HashRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
// import client from './apollo';
import Routes from './pages';
import Layout from './components/Layout';

const isDevelopment = process.env.NODE_ENV !== 'production';

const Router = props => {
  if (!isDevelopment) return <MemoryRouter {...props} />;
  else return <HashRouter {...props} />;
};

const Store = require('electron-store');

const store = new Store();

window.store = store;

// const App = () => (
//   <ApolloProvider client={client(window.fetch)}>
//     <MemoryRouter>
//       <Layout>
//         <Routes />
//       </Layout>
//     </MemoryRouter>
//   </ApolloProvider>
// );

const App = () => (
  //   <ApolloProvider client={client(window.fetch)}>
  <Router>
    <Layout>
      <Routes />
    </Layout>
  </Router>
  //   </ApolloProvider>
);

export default hot(module)(App);
