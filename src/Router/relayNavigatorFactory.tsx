import React, { useEffect } from 'react';
import {
  type ParamListBase,
  type RouteConfig,
  type RouteProp,
  type NavigationState,
  type EventMapBase,
  type createNavigatorFactory,
} from '@react-navigation/native';
import { useRelayEnvironmentProvider, type RouteDefinition } from './withRelay';
import type {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import type { OperationType } from 'relay-runtime';
import { type EntryPoint, useEntryPointLoader } from 'react-relay/hooks';

interface RelayNavigationScreenProps {
  route: RouteProp<ParamListBase, string>;
  entryPoint: EntryPoint<any, any>;
  Component: React.ComponentType<any>;
}

const RelayNavigationScreen = ({
  route,
  entryPoint,
  Component,
  ...props
}: RelayNavigationScreenProps) => {
  const provider = useRelayEnvironmentProvider();
  const [entryPointReference, loadEntryPoint] = useEntryPointLoader(
    provider,
    entryPoint
  );

  useEffect(() => {
    loadEntryPoint(route.params);
  }, [loadEntryPoint, route.params]);

  return (
    <Component
      route={route}
      entryPointReference={entryPointReference}
      {...props}
    />
  );
};

type CreateNavigatorFactoryType<
  TParamList extends ParamListBase,
  NativeStackNavigator extends React.ComponentType<any>
> = typeof createNavigatorFactory<
  NavigationState<TParamList>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap,
  NativeStackNavigator
>;

type NavigatorReturnType<
  TParamList extends ParamListBase,
  TNav extends React.ComponentType<any>
> = ReturnType<CreateNavigatorFactoryType<TParamList, TNav>>;

type NavigatorFactory<ParamList extends ParamListBase> = ReturnType<
  NavigatorReturnType<ParamList, React.ComponentType<any>>
>;

type RelayRouteConfig<TEntryPointComponent> =
  RouteDefinition<TEntryPointComponent> &
    RouteConfig<
      ParamListBase,
      keyof ParamListBase,
      NavigationState,
      {},
      EventMapBase
    >;

interface NavigatorWrapperProps<
  TPreloadedQueries extends Record<string, OperationType>,
  TNestedEntryPoints extends Record<string, EntryPoint<any, any> | undefined>
> {
  readonly screens: RelayRouteConfig<TPreloadedQueries, TNestedEntryPoints>[];
  readonly [key: string]: any;
}

export default function relayNavigatorFactory<TParamList extends ParamListBase>(
  navigator: NavigatorFactory<TParamList>
) {
  return function NavigatorWrapper({
    screens,
    ...wrapperProps
  }: NavigatorWrapperProps<any, any>) {
    return (
      <navigator.Navigator {...wrapperProps}>
        {screens.map(({ component, ...r }) => (
          <navigator.Screen key={name} name={name}>
            {(props) => (
              <RelayNavigationScreen {...props} {...r} Component={component} />
            )}
          </navigator.Screen>
        ))}
      </navigator.Navigator>
    );
  };
}
