import React, {
  type ElementType,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  type PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from 'react-relay';
import type {
  GraphQLTaggedNode,
  OperationType,
  PreloadableConcreteRequest,
} from 'relay-runtime';

export type RelayNavigatorContextType = Readonly<{
  suspenseFallback: React.ReactNode | JSX.Element | (() => JSX.Element);
}>;
export type RelayScreenContextType = Readonly<{
  readonly queryReference: any;
  readonly refresh: () => void;
  readonly variables: any;
}>;

const RelayNavigatorContext = React.createContext<RelayNavigatorContextType>(
  {} as RelayNavigatorContextType
);
const RelayScreenContext = React.createContext<RelayScreenContextType>(
  {} as RelayScreenContextType
);

export function useRelayNavigatorContext() {
  return useContext(RelayNavigatorContext);
}
export function useRelayScreenContext() {
  return useContext(RelayScreenContext);
}

type ComponentWrapperProps = Readonly<{
  Component: React.ComponentType<any>;
  [key: string]: any;
}>;

type RelayComponentWrapperProps<TQuery extends OperationType> = Readonly<{
  Component: React.ComponentType<any>;
  gqlQuery: GraphQLTaggedNode;
  queryReference: PreloadedQuery<TQuery>;
}>;

const ComponentWrapper = React.forwardRef<unknown, ComponentWrapperProps>(
  ({ Component, ...props }, ref) => {
    return <Component ref={ref} {...props} />;
  }
);
ComponentWrapper.displayName = 'RelayComponentWrapper';

function RelayComponentWrapper<T extends OperationType>({
  Component,
  gqlQuery,
  queryReference,
  ...props
}: RelayComponentWrapperProps<T>) {
  const data = usePreloadedQuery(gqlQuery, queryReference);
  return <Component data={data} {...props} />;
}

export type RelayRoute<T extends OperationType> = Readonly<{
  data: T['response'];
  params?: T['variables'];
}>;

type RelayRouteDefinition<T extends OperationType> = Readonly<{
  query: PreloadableConcreteRequest<T>;
  gqlQuery: GraphQLTaggedNode;
  fetchPolicy?: 'store-or-network' | 'store-and-network' | 'network-only';
  skeleton?: React.ReactNode | JSX.Element | (() => JSX.Element);
}>;

type BaseRouteDefinition = {
  name: string;
  component: React.ComponentType<any>;
};

export type RouteDefinition<
  T extends OperationType = OperationType,
  TScreenProps = unknown
> = Readonly<
  (T extends never
    ? BaseRouteDefinition
    : BaseRouteDefinition & RelayRouteDefinition<T>) &
    (TScreenProps extends never ? {} : Omit<TScreenProps, 'component'>)
>;

type RelayScreenWrapperProps<T extends OperationType> = RouteDefinition<T> & {
  readonly queryVars: {
    readonly [key: string]: any;
  };
};

function RelayScreenWrapper<T extends OperationType>({
  fetchPolicy,
  query,
  skeleton,
  component,
  queryVars,
  gqlQuery,
  ...props
}: RelayScreenWrapperProps<T>) {
  const { suspenseFallback } = useRelayNavigatorContext();
  const [queryReference, loadQuery, disposeQuery] = useQueryLoader(query);

  const vars = useMemo(() => ({ ...queryVars }), [queryVars]);

  React.useEffect(() => {
    if (!queryReference) {
      loadQuery(vars, { fetchPolicy });
    }
  }, [loadQuery, disposeQuery, queryReference, vars, fetchPolicy]);

  React.useEffect(() => () => disposeQuery(), [disposeQuery]);

  const refresh = useCallback(() => {
    loadQuery(vars, { fetchPolicy: 'network-only' });
  }, [loadQuery, vars]);
  const screenContextState = useMemo(
    () => ({ queryReference, refresh, variables: vars }),
    [queryReference, vars, refresh]
  );

  if (!queryReference) {
    return <ComponentWrapper Component={skeleton ?? suspenseFallback} />;
  }

  return (
    <RelayScreenContext.Provider value={screenContextState}>
      <React.Suspense
        fallback={<ComponentWrapper Component={skeleton ?? suspenseFallback} />}
      >
        <RelayComponentWrapper
          Component={component}
          queryReference={queryReference}
          gqlQuery={gqlQuery}
          {...props}
        />
      </React.Suspense>
    </RelayScreenContext.Provider>
  );
}

export type RelayWrapperProps = Readonly<{
  [key: string]: any;
}>;

export type RelayNavigatorProps<T extends OperationType = OperationType> =
  Readonly<{
    screens: RouteDefinition<T>[];
  }>;

export default function withRelay<
  T extends OperationType = OperationType,
  TNavigator extends ElementType<any> = ElementType<any>
>(
  WrappedNavigator: TNavigator,
  routeDefList: RouteDefinition<T>[],
  suspenseFallback: React.ReactNode | JSX.Element | (() => JSX.Element)
) {
  const screens = routeDefList.map(({ query, component, ...rest }) => {
    return {
      ...rest,
      component: function RelayQueryScreen(props: RelayScreenWrapperProps<T>) {
        return (
          <RelayScreenWrapper {...props} query={query} component={component} />
        );
      },
    };
  });

  return function RelayContextWrapper(wrapperProps: any) {
    const contextValue = React.useMemo(() => ({ suspenseFallback }), []);
    return (
      <RelayNavigatorContext.Provider value={contextValue}>
        <WrappedNavigator {...wrapperProps} screens={screens} />
      </RelayNavigatorContext.Provider>
    );
  };
}
