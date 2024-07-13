import React, { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useAuth } from './Providers/AuthProvider';
import { navigate } from './RootNavigation';

export default function Login() {
  const { login } = useAuth();

  const handleLogin = useCallback(() => {
    login('admin', 'admin')
      .then(() => {
        navigate('Home');
      })
      .catch((e) => {
        console.error('Login failed', e);
      });
  }, [login]);

  return (
    <>
      <Button onPress={handleLogin}>Login</Button>
    </>
  );
}
