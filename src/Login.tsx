import React, { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useAuth } from './Providers/AuthProvider';
import { navigate } from './RootNavigation';

export default function Login() {
  const { login } = useAuth();

  const handleLogin = useCallback(async () => {
    await login('admin', 'admin');
    navigate('Home');
  }, [login]);

  return (
    <>
      <Button onPress={handleLogin}>Login</Button>
    </>
  );
}
