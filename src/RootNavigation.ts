import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './Navigation.types';
import { RouteDefinition } from './Router/withRelay';
import type {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import type { OperationType } from 'relay-runtime';

export type RelayScreenRouteDefinition<TOperationType extends OperationType> =
  RouteDefinition<
    TOperationType,
    RouteConfig<
      RootStackParamList,
      keyof RootStackParamList,
      NavigationState,
      {},
      EventMapBase
    >
  >;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params: any = {}) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
