import React from 'react';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import App from './src/App';
import { name as appName } from './app.json';
import DarkTheme from './src/theme';

const AppComponent = () => (
  <PaperProvider>
    <App />
  </PaperProvider>
);

AppRegistry.registerComponent(appName, () => AppComponent);
