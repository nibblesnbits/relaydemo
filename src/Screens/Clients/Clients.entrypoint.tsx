import { type EntryPoint } from 'react-relay/hooks';
import ClientTable from './ClientTable';
import JSResource from '../../JSResourceShim';
import { ClientsQueryDef } from '.';

const ClientTableEntryPoint: EntryPoint<typeof ClientTable> = {
  getPreloadProps(vars: any) {
    return {
      queries: {
        clientsQuery: {
          parameters: ClientsQueryDef,
          variables: vars,
        },
      },
    };
  },
  root: JSResource('ClientTable', () => require('./ClientTable').default),
};

export default ClientTableEntryPoint;
