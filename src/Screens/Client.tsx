import React from 'react';
import { useFragment, graphql } from 'react-relay/hooks';
import { Text } from 'react-native-paper';
import { RelayRoute } from '../Router/withRelay';
import type { ClientQuery } from './__generated__/ClientQuery.graphql';
import type { Client_name$key } from './__generated__/Client_name.graphql';

export const ClientQueryDef = graphql`
  query ClientQuery($id: ID!) {
    client(id: $id) {
      ...Client_name
    }
  }
`;

type ClientNameProps = { client: Client_name$key | null | undefined };

function ClientName({ client }: ClientNameProps) {
  const data = useFragment<Client_name$key>(
    graphql`
      fragment Client_name on Client {
        name
      }
    `,
    client
  );
  return <Text variant="displayLarge">{data?.name ?? 'No Client Found'}</Text>;
}

export default function Client(props: RelayRoute<ClientQuery>) {
  return (
    <>
      <ClientName client={props.data.client} />
    </>
  );
}

export const route = {
  name: 'Client',
  component: Client,
  gqlQuery: ClientQueryDef,
  query: require('./__generated__/ClientQuery.graphql.ts'),
  options: {
    headerShown: false,
  },
};
