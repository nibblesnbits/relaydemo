import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from '../LoadingScreen';
import relayNavigatorFactory from './relayNavigatorFactory';
import withRelay from './withRelay';
import type { RootStackParamList } from '../Navigation.types';
import type { RelayScreenRouteDefinition } from '../RootNavigation';
import type { OperationType } from 'relay-runtime';

function createRelayStackNavigator(
  routes: RelayScreenRouteDefinition<OperationType>[]
) {
  return withRelay(
    // @ts-ignore
    relayNavigatorFactory<RootStackParamList>(createNativeStackNavigator()),
    routes,
    LoadingScreen
  );
}
export default createRelayStackNavigator;
