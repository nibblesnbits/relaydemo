import React from 'react';
import { route as HomeRoute } from '../Screens/Home';
import { route as OtherRoute } from '../Screens/Other';
import createRelayStackNavigator from '../Router/createRelayStackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

// @ts-ignore
const Navigator = createRelayStackNavigator([HomeRoute, OtherRoute]);

export default function MainStack() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <Navigator id="MainStack" initialRouteName="Home" />
    </SafeAreaView>
  );
}
