import React from 'react';
import { route as HomeRoute } from '../Screens/Home';
import createRelayStackNavigator from '../Router/createRelayStackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

const Navigator = createRelayStackNavigator([HomeRoute]);

export default function MainStack() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navigator id="MainStack" initialRouteName="Home" />
    </SafeAreaView>
  );
}
