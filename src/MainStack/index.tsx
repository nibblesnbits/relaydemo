import React from 'react';
import { route as HomeRoute } from '../Screens/Home';
import { route as OtherRoute } from '../Screens/Other';
import { route as ClientsRoute } from '../Screens/Clients';
import { route as ClientRoute } from '../Screens/Client';
import createRelayStackNavigator from '../Router/createRelayStackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

const Navigator = createRelayStackNavigator([
  HomeRoute,
  OtherRoute,
  ClientsRoute,
  ClientRoute,
]);

export default function MainStack() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navigator id="MainStack" initialRouteName="Login" />
    </SafeAreaView>
  );
}
