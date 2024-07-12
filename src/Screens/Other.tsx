import React from 'react';
import { useFragment, graphql } from 'react-relay/hooks';
import { Text } from 'react-native';
import { RelayRoute } from '../Router/withRelay';
import type { OtherQuery } from './__generated__/OtherQuery.graphql';
import type { Other_name$key } from './__generated__/Other_name.graphql';

export const OtherQueryDef = graphql`
  query OtherQuery {
    viewer {
      ...Other_name
    }
  }
`;

type UserNameProps = { viewer: Other_name$key | null | undefined };

function UserName({ viewer }: UserNameProps) {
  const data = useFragment<Other_name$key>(
    graphql`
      fragment Other_name on User {
        id
      }
    `,
    viewer
  );
  return <Text>Your UserId is {data?.id ?? 'missing'}</Text>;
}

export default function Other(props: RelayRoute<OtherQuery>) {
  return <UserName viewer={props.data.viewer} />;
}

export const route = {
  name: 'Other',
  component: Other,
  gqlQuery: OtherQueryDef,
  query: require('./__generated__/OtherQuery.graphql.ts'),
  options: {
    headerShown: false,
  },
};
