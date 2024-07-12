declare module 'babel-plugin-relay/macro' {
  export { graphql as default } from 'react-relay';
}

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { Icon } from 'react-native-vector-icons/Icon';
  export default Icon;
}

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}
