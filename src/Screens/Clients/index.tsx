import React from 'react';
import { graphql } from 'react-relay/hooks';
import { RelayRoute } from '../../Router/withRelay';
import type { ClientsQuery } from './__generated__/ClientsQuery.graphql';
import ClientTable from './ClientTable';
import { RelayScreenRouteDefinition } from '../../RootNavigation';

export const ClientsQueryDef = graphql`
  query ClientsQuery {
    ...ClientTable_clients
  }
`;

type ClientsPageProps = Readonly<RelayRoute<ClientsQuery>>;

export default function ClientsPage({ data }: ClientsPageProps) {
  return <ClientTable fragmentRef={data} />;
}

export const route: RelayScreenRouteDefinition<ClientsQuery> = {
  name: 'Clients',
  gqlQuery: ClientsQueryDef,
  component: ClientsPage,
  query: require('./__generated__/ClientsQuery.graphql.ts'),
  initialParams: {
    cursor: null,
    count: 10,
  },
};
