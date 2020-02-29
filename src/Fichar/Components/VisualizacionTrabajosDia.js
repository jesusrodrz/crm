import React from 'react';

export const VisualizacionTrabajosDia = props => {
  const { listaTerminado } = props;
  const { tiempoTotalDia } = props;

  return (
    <div className="card visualizacion">
      <div className="card-body">
        <table className="table table-sm responsive">
          <thead className="thead-light">
            <tr>
              <th scope="col">Nº</th>
              <th scope="col">Actividad</th>
              <th scope="col">Hora de Comienzo</th>
              <th scope="col">Tiempo Total</th>
              <th scope="col">Hora de Finalizacion</th>
            </tr>
          </thead>
          <tbody>
            {listaTerminado.map((fichaje, i) => {
              return (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{fichaje.actividad}</td>
                  <td>{fichaje.comienzoFormated}</td>
                  <td>{fichaje.duracionFormated}</td>
                  <td>{fichaje.paradoFormated}</td>
                </tr>
              );
            })}
            <tr>
              <th scope="row">Totales</th>
              <td />
              <td />
              <td>{tiempoTotalDia}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
