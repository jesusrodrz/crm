import React from 'react';
import Activity from '../Components/Activities';
import presupuestos from '../../Images/calculator.jpg';
import ventas from '../../Images/sell.jpg';
import estadisticas from '../../Images/estadisticas.jpg';
import trabajo from '../../Images/trabajo.jpg';
import tiempos from '../../Images/tiempos.jpg';
import { HeaderNav } from '../../Header/Container/HeaderNav';
import '../../App.css';

const CardsVendedor = () => (
  <>
    <div className="row">
      <div className="col-12 col-md-4">
        <Activity
          image={ventas}
          titleActivity="Haz Visita."
          descriptionActivity="Aquí vas a apuntar de forma rápida las visitas que estas realizando"
          buttonActivity="Visita"
          direction="./Visitas"
        />
      </div>
      <div className="col-12 col-md-4">
        <Activity
          image={presupuestos}
          titleActivity="Gestion de Visitas"
          descriptionActivity="Recuerda todo el trabajo realizado y además haz un buen seguimiento"
          buttonActivity="Gestiona"
          direction="./gestion"
        />
      </div>
      <div className="col-12 col-md-4">
        <Activity
          image={estadisticas}
          titleActivity="Estadísticas"
          descriptionActivity="Analiza las visitas que estas realizando para analizar lo que consigues"
          buttonActivity="Analizar"
          direction="/estadisticas"
        />
      </div>
    </div>
    <div className="row">
      <div className="col-12 col-md-4">
        <Activity
          image={trabajo}
          titleActivity="Fichar"
          descriptionActivity="Ficha tu trabajo"
          buttonActivity="Fichar"
          direction="/fichar"
        />
      </div>
      <div className="col-12 col-md-4">
        <Activity
          image={tiempos}
          titleActivity="Ver Trabajo"
          descriptionActivity="Visualiza el trabajo realizado"
          buttonActivity="Ver"
          direction="/trabajorealizado"
        />
      </div>
    </div>
  </>
);
const CardsAdmin = () => (
  <>
    <div className="row">
      <div className="col-12 col-md-4">
        <Activity
          image={ventas}
          titleActivity="Configuración"
          descriptionActivity="Configuraciones Generales"
          buttonActivity="Configuración"
          direction="./configuracion"
        />
      </div>
      <div className="col-12 col-md-4">
        <Activity
          image={presupuestos}
          titleActivity="Administrar Vendedores"
          descriptionActivity="Agrega, modficia o eliminia vendedores."
          buttonActivity="Vendedores"
          direction="./vendedores"
        />
      </div>
      <div className="col-12 col-md-4">
        <Activity
          image={estadisticas}
          titleActivity="Estadísticas"
          descriptionActivity="Analiza las visitas que estas realizando para analizar lo que consigues"
          buttonActivity="Analizar"
          direction="/estadisticas"
        />
      </div>
    </div>
  </>
);
export function Dashboard({ userType }) {
  return (
    <div>
      <HeaderNav userName="Carlos Raez" />
      <div className="container">
        {userType === 'vendedor' && <CardsVendedor />}
        {userType === 'admin' && <CardsAdmin />}
      </div>
    </div>
  );
}
