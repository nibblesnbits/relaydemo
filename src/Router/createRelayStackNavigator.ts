import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from '../LoadingScreen';
import relayNavigatorFactory from './relayNavigatorFactory';
import withRelay from './withRelay';
import type { RootStack } from '../Navigation.types';
import type { RelayScreenRouteDefinition } from '../RootNavigation';
import type { OperationType } from 'relay-runtime';

function createRelayStackNavigator(
  routes: RelayScreenRouteDefinition<OperationType>[]
) {
  return withRelay(
    routes,
    // @ts-ignore
    relayNavigatorFactory<RootStack>(createNativeStackNavigator()),
    LoadingScreen
  );
}
export default createRelayStackNavigator;
