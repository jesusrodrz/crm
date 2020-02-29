import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader';
import { AuthProvider } from './context/context';
import Rutas from './Router/Routes';
import 'bootstrap/dist/css/bootstrap.css';

const MainApp = () => {
  return (
    <AuthProvider>
      <Rutas />
    </AuthProvider>
  );
};
export default hot(module)(MainApp);
