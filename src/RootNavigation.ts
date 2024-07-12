import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './Navigation.types';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: keyof RootStackParamList, params: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
