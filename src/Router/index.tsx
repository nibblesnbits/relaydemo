import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '../RootNavigation';
import MainStack from '../MainStack';
import { DarkTheme } from '../theme';

export default function Router() {
  return (
    <NavigationContainer ref={navigationRef} theme={DarkTheme}>
      <MainStack />
    </NavigationContainer>
  );
}
