import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

const AppComponent = () => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

AppRegistry.registerComponent(appName, () => AppComponent);
