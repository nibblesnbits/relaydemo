import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStack } from './Navigation.types';
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
    RouteConfig<RootStack, keyof RootStack, NavigationState, {}, EventMapBase>
  >;

export const navigationRef = createNavigationContainerRef<RootStack>();

export function navigate(name: keyof RootStack, params: any = {}) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
