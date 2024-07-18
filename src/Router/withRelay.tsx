import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import {
  EntryPoint,
  EntryPointComponent,
  EntryPointContainer,
  EntryPointProps,
  JSResourceReference,
  type PreloadedQuery,
  useEntryPointLoader,
  usePreloadedQuery,
  useQueryLoader,
  useRelayEnvironment,
} from 'react-relay';
import type { GraphQLTaggedNode, OperationType } from 'relay-runtime';
import { TaggedUnion } from 'type-fest';

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

export type RouteDefinition<
  TEntryPointComponent,
  TOperationType extends OperationType
> = {
  query: TOperationType;
  gqlQuery: GraphQLTaggedNode;
  getComponent: () => JSResourceReference<TEntryPointComponent>;
  skeleton?: React.ReactNode | JSX.Element | (() => JSX.Element);
};

type RelayScreenWrapperProps<
  TEntryPointProps extends {},
  TOperationType extends OperationType
> = {
  query: GraphQLTaggedNode;
  skeleton?: React.ReactNode | JSX.Element | (() => JSX.Element);
  entryPoint: EntryPoint<TOperationType, TEntryPointProps>;
};

export function useRelayEnvironmentProvider() {
  const environment = useRelayEnvironment();
  return useMemo(() => ({ getEnvironment: () => environment }), [environment]);
}

function RelayScreenWrapper<TEntryPoint, TOperationType extends OperationType>({
  fetchPolicy,
  query,
  skeleton,
  component,
  queryVars,
  gqlQuery,
  ...props
}: RelayScreenWrapperProps<TEntryPoint, TOperationType>) {
  const { suspenseFallback } = useRelayNavigatorContext();
  const [queryReference, loadQuery, disposeQuery] =
    useEntryPointLoader<TEntryPoint>(query);

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

function EntryPointWrapper<
  TPreloadedQueries extends Record<string, OperationType>,
  TNestedEntryPoints extends Record<string, EntryPoint<any, any> | undefined>,
  TRuntimeProps extends {} = {},
  TExtraProps extends {} | null = {}
>(): EntryPointComponent<
  TPreloadedQueries,
  TNestedEntryPoints,
  TRuntimeProps,
  TExtraProps
> {
  return function EntryPointComponentWrapper(
    props: EntryPointProps<
      TPreloadedQueries,
      TNestedEntryPoints,
      TRuntimeProps,
      TExtraProps
    >
  ) {
    return <RelayScreenWrapper {...props} />;
  };
}

type Tagged = TaggedUnion<
  'query',
  Record<string, RouteDefinition<OperationType>>
>;

export default function withRelay<TRoutes extends RouteDefinition<OperationType>[]>(
  routeDefList: TRoutes,
  WrappedNavigator: EntryPointComponent<
    Record<string, TRoutes[number]['query']>,
    {}
  >,
  suspenseFallback: React.ReactNode | JSX.Element | (() => JSX.Element)
) {
  const screens = Object.entries(routeDefList).map(
    ([name, { resource, skeleton, gqlQuery, ...rest }]) => {
      return {
        ...rest,
        component: function RelayEntryPointScreen(
          props: RelayScreenWrapperProps
        ) {
          const entryPoint = useMemo(
            () =>
              ({
                root: resource,
                getPreloadProps(vars) {
                  return {
                    queries: {
                      [name]: gqlQuery,
                    },
                  };
                },
              } as EntryPoint<Record<string, TRoutes[number]['query']>, {}>),
            []
          );
          const provider = useRelayEnvironmentProvider();
          const [entryPointReference, loadEntryPoint, dispose] =
            useEntryPointLoader<typeof entryPoint>(provider, entryPoint);

          useEffect(() => {
            loadEntryPoint({});
          }, [loadEntryPoint]);
          useEffect(() => () => dispose(), [dispose]);

          if (!entryPointReference) {
            return skeleton ?? suspenseFallback;
          }

          return (
            <EntryPointContainer
              entryPointReference={entryPointReference}
              props={props}
            />
          );
        },
      };
    }
  );

  return function RelayContextWrapper(wrapperProps: any) {
    return (
      <RelayNavigatorContext.Provider value={{ suspenseFallback }}>
        <WrappedNavigator {...wrapperProps} screens={screens} />
      </RelayNavigatorContext.Provider>
    );
  };
}

export function createRouteForComponent<
  T extends OperationType,
  TComponent extends React.ComponentType<any>
>(
  name: string,
  component: TComponent,
  gqlQuery: GraphQLTaggedNode,
  query: T
): RouteDefinition<T> {
  return {
    name,
    component,
    gqlQuery,
    getComponent: () => component,
    query,
  };
}
