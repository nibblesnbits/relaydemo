import React from 'react';
import { useLinkProps } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

type LinkButtonProps = {
  to: any;
  action?: Readonly<{
    type: string;
    payload?: object;
    source?: string;
    target?: string;
  }>;
  label: string;
};

const LinkButton = ({ to, action, label, ...rest }: LinkButtonProps) => {
  const { onPress, ...props } = useLinkProps({ to, action });

  return (
    <TouchableOpacity onPress={onPress} {...props} {...rest}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

export default LinkButton;
