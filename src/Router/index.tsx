import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '../RootNavigation';
import MainStack from '../MainStack';

export default function Router() {
  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack />
    </NavigationContainer>
  );
}
