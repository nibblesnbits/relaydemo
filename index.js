import React from 'react';
import { AppRegistry } from 'react-native';
import {
  MD3DarkTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import App from './src/App';
import { name as appName } from './app.json';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

const AppComponent = () => (
  <PaperProvider theme={theme}>
    <App />
  </PaperProvider>
);

AppRegistry.registerComponent(appName, () => AppComponent);
