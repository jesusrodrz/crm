import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { App } from '../App';
import PrivateRoute from './Private';
import { GestionVisitas } from '../GestionVisitas/Container/GestionVisitas';
import { Visitas } from '../Visitas/Container/Visitas';
import { Estadisticas } from '../Estadisticas/Container/Estadisticas';
import { Dashboard } from '../Dashboard/Container/Dashboard';
import { Fichar } from '../Fichar/Container/Fichar';
import { TrabajoRealizado } from '../TrabajoRealizado/Container/TrabajoRealizado';
import { useAuthValue } from '../context/context';
import Layout from '../layout/Layout';
import { Signup } from '../Signup/Container/Signup';
import Vendedores from '../Vendedores/Container/Vendedores';
import { Spinner } from '../Spinner/Container/Spinner';
import Configuracion from '../Configuracion/Container/Configuracion';
import Recuperar from '../Recuperar';
import Clientes from '../Clientes/Clientes';
import Analizar from '../Analizar/Analizar';

const RutasApp = () => {
  const { authenticated, login, user, loading } = useAuthValue();
  const type = user?.data?.type;
  if (loading) {
    return (
      <main>
        <Spinner />
      </main>
    );
  }
  return (
    <Router>
      <div>
        <Switch>
          <PrivateRoute
            exact
            path="/visitas"
            authenticated={authenticated}
            routeType={['vendedor', 'admin']}
            userType={type}
          >
            <Layout>
              <Visitas />
            </Layout>
          </PrivateRoute>
          <PrivateRoute
            exact
            path="/estadisticas"
            authenticated={authenticated}
            routeType={['vendedor', 'admin', 'trabajador']}
            userType={type}
          >
            <Layout>
              <Estadisticas />
            </Layout>
          </PrivateRoute>
          <PrivateRoute
            exact
            path="/gestion"
            authenticated={authenticated}
            routeType={['vendedor', 'admin']}
            userType={type}
          >
            <Layout>
              <GestionVisitas />
            </Layout>
          </PrivateRoute>
          <PrivateRoute
            exact
            path="/fichar"
            authenticated={authenticated}
            routeType={['vendedor', 'admin', 'trabajador']}
            userType={type}
          >
            <Layout>
              <Fichar />
            </Layout>
          </PrivateRoute>
          <PrivateRoute
            exact
            path="/trabajo-realizado"
            authenticated={authenticated}
            routeType={['vendedor', 'admin', 'trabajador']}
            userType={type}
          >
            <Layout>
              <TrabajoRealizado />
            </Layout>
          </PrivateRoute>
          <PrivateRoute
            exact
            path="/vendedores"
            authenticated={authenticated}
            routeType={['admin']}
            userType={type}
          >
            <Layout>
              <Vendedores />
            </Layout>
          </PrivateRoute>
          <PrivateRoute
            exact
            path="/configuracion"
            authenticated={authenticated}
            routeType={['admin']}
            userType={type}
          >
            <Layout>
              <Configuracion />
            </Layout>
          </PrivateRoute>
          <PrivateRoute
            exact
            path="/clientes"
            authenticated={authenticated}
            routeType={['admin', 'vendedor']}
            userType={type}
          >
            <Layout>
              <Clientes />
            </Layout>
          </PrivateRoute>
          <PrivateRoute
            exact
            path="/analizar"
            authenticated={authenticated}
            routeType={['admin', 'vendedor', 'trabajador']}
            userType={type}
          >
            <Layout>
              <Analizar />
            </Layout>
          </PrivateRoute>
          <PrivateRoute
            exact
            path="/app"
            authenticated={authenticated}
            userType={type}
          >
            <Dashboard userType={type} />
          </PrivateRoute>
          <Route exact path="/">
            <App login={login} user={user} />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/recuperar">
            <Recuperar />
          </Route>
          <Route>
            <main>no encontrado</main>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default RutasApp;
