import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export const Analisis = props => {
  const { dataEstadisitacaVisitas, tituloEstadistica, totales } = props;
  return (
    <div className="card activity">
      <div className="card-body">
        <h5 className="card-title">{tituloEstadistica}</h5>
        <Doughnut data={dataEstadisitacaVisitas} />
        <p className="totales">{totales}</p>
      </div>
    </div>
  );
};
