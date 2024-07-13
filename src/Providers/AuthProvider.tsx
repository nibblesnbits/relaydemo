import React, { createContext, useContext, useEffect } from 'react';
import * as Keychain from 'react-native-keychain';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = React.PropsWithChildren<{
  LoginComponent: React.ComponentType<{}>;
}>;

export const AuthProvider = ({
  children,
  LoginComponent,
}: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5050/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
      if (response.ok && !data.message) {
        const result = await Keychain.setGenericPassword(
          username,
          data.tokenId
        );
        if (result) {
          setIsAuthenticated(true);
        } else {
          console.error('Token storage failed', result);
        }
      } else {
        console.error('Login request failed', data.message);
        throw new Error(data.message);
      }
    } catch (e) {
      console.error('Login failed', e);
      throw e;
    }
  };

  const logout = async () => {
    await Keychain.resetGenericPassword();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    Keychain.getGenericPassword().then((credentials) => {
      console.log(credentials);
      if (credentials) {
        setIsAuthenticated(true);
      }
    });
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        <LoginComponent />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
