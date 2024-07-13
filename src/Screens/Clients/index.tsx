import React from 'react';
import { graphql } from 'react-relay/hooks';
import { RelayRoute, RouteDefinition } from '../../Router/withRelay';
import type { ClientsQuery } from './__generated__/ClientsQuery.graphql';
import ClientTable from './ClientTable';

export const ClientsQueryDef = graphql`
  query ClientsQuery {
    ...ClientTable_clients
  }
`;

type ClientsPageProps = Readonly<RelayRoute<ClientsQuery>>;

export default function ClientsPage({ data }: ClientsPageProps) {
  return <ClientTable query={data} />;
}

export const route: RouteDefinition<ClientsQuery> = {
  name: 'Clients',
  gqlQuery: ClientsQueryDef,
  component: ClientsPage,
  query: require('./__generated__/ClientsQuery.graphql.ts'),
};
