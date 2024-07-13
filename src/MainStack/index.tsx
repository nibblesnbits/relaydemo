import React from 'react';
import { route as HomeRoute } from '../Screens/Home';
import { route as OtherRoute } from '../Screens/Other';
import { route as ClientsRoute } from '../Screens/Clients';
import { route as ClientRoute } from '../Screens/Client';
import createRelayStackNavigator from '../Router/createRelayStackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import DarkTheme from '../theme';

// @ts-ignore
const Navigator = createRelayStackNavigator([
  HomeRoute,
  OtherRoute,
  ClientsRoute,
  ClientRoute,
]);

export default function MainStack() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Navigator theme={DarkTheme} id="MainStack" initialRouteName="Home" />
    </SafeAreaView>
  );
}
