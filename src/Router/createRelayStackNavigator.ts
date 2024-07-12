import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from '../LoadingScreen';
import relayNavigatorFactory from './relayNavigatorFactory';
import withRelay from './withRelay';
import type { RouteDefinition } from './withRelay';
import { RootStackParamList } from '../Navigation.types';

function createRelayStackNavigator(routes: RouteDefinition[]) {
  return withRelay(
    relayNavigatorFactory<RootStackParamList>(createNativeStackNavigator()),
    routes,
    LoadingScreen
  );
}
export default createRelayStackNavigator;
