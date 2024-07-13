import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { adaptNavigationTheme } from 'react-native-paper';

const { DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
});

export default DarkTheme;
