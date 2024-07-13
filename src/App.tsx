import React from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import RelayEnvironment from './RelayEnvironment';
import Router from './Router';
import { PaperProvider } from 'react-native-paper';
import { DarkTheme } from './theme';
import { AuthProvider } from './Providers/AuthProvider';
import Login from './Login';

function App() {
  return (
    <PaperProvider theme={DarkTheme}>
      <AuthProvider LoginComponent={Login}>
        <RelayEnvironmentProvider environment={RelayEnvironment}>
          <Router />
        </RelayEnvironmentProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

export default App;
