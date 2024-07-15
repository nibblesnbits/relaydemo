import type { ParamListBase } from '@react-navigation/native';

export type RootStackParamList = ParamListBase & {
  Home: undefined;
  Clients: undefined;
  Client: { id: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
