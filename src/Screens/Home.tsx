import React from 'react';
import { useFragment, graphql } from 'react-relay/hooks';
import { Text } from 'react-native-paper';
import { RelayRoute } from '../Router/withRelay';
import type { HomeQuery } from './__generated__/HomeQuery.graphql';
import type { Home_name$key } from './__generated__/Home_name.graphql';
import LinkButton from '../Components/LinkButton';

export const HomeQueryDef = graphql`
  query HomeQuery {
    viewer {
      ...Home_name
    }
  }
`;

type UserNameProps = { viewer: Home_name$key | null | undefined };

function UserName({ viewer }: UserNameProps) {
  const data = useFragment<Home_name$key>(
    graphql`
      fragment Home_name on User {
        id
      }
    `,
    viewer
  );
  return (
    <Text variant="displayLarge">Your UserId is {data?.id ?? 'missing'}</Text>
  );
}

export default function Home(props: RelayRoute<HomeQuery>) {
  return (
    <>
      <UserName viewer={props.data.viewer} />
      <LinkButton to="/Clients" label="Go to Client List" />
    </>
  );
}

export const route = {
  name: 'Home',
  component: Home,
  gqlQuery: HomeQueryDef,
  query: require('./__generated__/HomeQuery.graphql.ts'),
  options: {
    headerShown: false,
  },
};
