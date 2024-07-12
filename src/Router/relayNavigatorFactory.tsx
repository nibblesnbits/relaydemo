import React from 'react';
// import ErrorBoundary from '../ErrorBoundary';
import type {
  ParamListBase,
  RouteConfig,
  RouteProp,
  NavigationState,
  EventMapBase,
  createNavigatorFactory,
} from '@react-navigation/native';
import type { RouteDefinition } from './withRelay';
import type {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

interface RelayNavigationScreenProps {
  route: RouteProp<ParamListBase, string>;
  Component: React.ComponentType<any>;
}

const RelayNavigationScreen = ({
  route,
  Component,
  ...props
}: RelayNavigationScreenProps) => {
  return <Component route={route} queryVars={route.params} {...props} />;
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

type RelayRouteConfig = RouteDefinition &
  RouteConfig<
    ParamListBase,
    keyof ParamListBase,
    NavigationState,
    {},
    EventMapBase
  >;

interface NavigatorWrapperProps {
  readonly screens: RelayRouteConfig[];
  readonly [key: string]: any;
}

export default function relayNavigatorFactory<TParamList extends ParamListBase>(
  navigator: NavigatorFactory<TParamList>
) {
  return function NavigatorWrapper({
    screens,
    ...wrapperProps
  }: NavigatorWrapperProps) {
    return (
      <navigator.Navigator {...wrapperProps}>
        {screens.map(({ name, component, initialParams, options, ...r }) => (
          <navigator.Screen
            key={name}
            name={name}
            initialParams={initialParams ?? {}}
            options={options}
          >
            {(props) => (
              <RelayNavigationScreen {...props} {...r} Component={component} />
            )}
          </navigator.Screen>
        ))}
      </navigator.Navigator>
    );
  };
}
