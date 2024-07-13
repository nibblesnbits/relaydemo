import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import GraphQLApiError from './GraphQLApiError';
import NetworkError from './NetworkError';
import type { ExecuteFunction } from 'relay-runtime';
import * as Keychain from 'react-native-keychain';

// @ts-ignore
const fetchQuery: ExecuteFunction = async (operation, variables) => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (!credentials) {
      return {
        data: { errors: [{ message: 'unauthorized' }] },
      };
    }
    const response = await fetch('http://localhost:5900/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${credentials.password}`,
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    });
    if (response.status === 401) {
      return {
        data: { errors: [{ message: 'unauthorized' }] },
      };
    }
    const json = await response.json();
    if (json.errors) {
      console.error('GraphQL Error:', json.errors);
      throw new GraphQLApiError(json.errors);
    }
    return json;
  } catch (err) {
    console.error('Fetch Error:', err);
    if (err instanceof GraphQLApiError) {
      throw err;
    }
    throw new NetworkError("We can't reach the internet!");
  }
};

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default environment;
