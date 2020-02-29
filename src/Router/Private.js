/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function validate({ routeType, userType }) {
  if (typeof routeType === 'object') {
    return routeType.includes(userType);
  }
  if (typeof routeType === 'string') {
    return routeType === userType;
  }
  return true;
}
function PrivateRoute({
  children,
  authenticated,
  routeType,
  userType,
  ...rest
}) {
  const validation = authenticated && validate({ routeType, userType });

  return (
    <Route
      {...rest}
      render={({ location }) =>
        validation ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
export default PrivateRoute;
