import React from 'react';
import { useFragment, graphql } from 'react-relay/hooks';
import { Text } from 'react-native-paper';
import { RelayRoute } from '../Router/withRelay';
import type { HomeQuery } from './__generated__/HomeQuery.graphql';
import type { Home_name$key } from './__generated__/Home_name.graphql';
// import { Link } from '@react-navigation/native';

export const HomeQueryDef = graphql`
  query HomeQuery {
    viewer {
      ...Home_name
    }
  }
`;

type UserNameProps = { viewer: Home_name$key | null | undefined };

function UserName({ viewer }: UserNameProps) {
  console.log('UserName');
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
  console.log('Home', props);
  return (
    <>
      <UserName viewer={props.data.viewer} />
      {/* <Link to={{ screen: 'Other', params: { id: '' } }}>Go to Other</Link> */}
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
