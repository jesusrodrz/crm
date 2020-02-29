import React from 'react';
import { Redirect } from 'react-router-dom';
import { Login } from './Login/Container/Login';
import { Spinner } from './Spinner/Container/Spinner';

export const App = ({ login, user }) => {
  if (user) {
    return <Redirect to="/app" />;
  }
  return <main>{login ? <Login /> : <Spinner />}</main>;
};
