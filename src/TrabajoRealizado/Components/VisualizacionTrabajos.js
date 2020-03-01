import React from 'react';

export const VisualizacionTrabajos = ({
  listaTrabajoSeleccionado,
  tiempoTotalDia
}) => {
  return (
    <div className="card visualizacion">
      <div className="card-body">
        <table className="table table-sm responsive">
          <thead className="thead-light">
            <tr>
              <th scope="col">Dia</th>
              <th scope="col">Actividad</th>
              <th scope="col">Hora de Comienzo</th>
              <th scope="col">Tiempo Total</th>
              <th scope="col">Hora de Finalizacion</th>
              <th scope="col">Mapa</th>
            </tr>
          </thead>
          <tbody>
            {listaTrabajoSeleccionado.map((fichaje, i) => {
              return (
                <tr key={i}>
                  <th scope="row">{fichaje.dia}</th>
                  <td>{fichaje.actividad}</td>
                  <td>{fichaje.comienzo}</td>
                  <td>{fichaje.duracion}</td>
                  <td>{fichaje.parado}</td>
                  <td>
                    <button className="btn btn-primary btn-sm">Mapa</button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <th scope="row">Totales</th>
              <td />
              <td />
              <td>{tiempoTotalDia}</td>
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
