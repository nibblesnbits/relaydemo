import type { ParamListBase } from '@react-navigation/native';

export type RootStackParamList = ParamListBase & {
  Home: undefined;
  Other: { id: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
