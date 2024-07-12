import React from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import RelayEnvironment from './RelayEnvironment';
import Router from './Router';

function App() {
  return (
    <React.StrictMode>
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <Router />
      </RelayEnvironmentProvider>
    </React.StrictMode>
  );
}

export default App;
