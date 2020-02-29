/* eslint-disable react/jsx-props-no-spreading */
import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
// Para usar el authContext en componetes funcionales
export const useAuthValue = () => {
  return useContext(AuthContext);
};

// Para usar el authContext en componentes de clase
export function withAuthValue(Component) {
  return function WrappedComponent(props) {
    const value = useAuthValue();
    return <Component {...props} auth={value} />;
  };
}
