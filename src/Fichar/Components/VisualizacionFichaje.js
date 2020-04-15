import React from 'react';

export function VisualizacionFichaje({ fichajesSinParar, handleClickParar }) {
  return (
    <div className="card visualizacion">
      <div className="card-body">
        <table className="table table-sm responsive">
          <thead className="thead-light">
            <tr>
              <th scope="col">Nº</th>
              <th scope="col">Actividad</th>
              <th scope="col">Cliente</th>
              <th scope="col">Hora de Comienzo</th>
              <th scope="col">Tiempo</th>
              <th scope="col">Estado</th>
              <th scope="col">Parar</th>
            </tr>
          </thead>
          <tbody>
            {fichajesSinParar.map((fichaje, i) => {
              return (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{fichaje.actividad}</td>
                  <td>
                    {fichaje.project !== ''
                      ? `${fichaje.clienteNombre} (${fichaje.project})`
                      : fichaje.clienteNombre}
                  </td>
                  <td>{fichaje.comienzoFormated}</td>
                  <td>{fichaje.duracionFormated}</td>
                  <td>{fichaje.estado}</td>
                  <td>
                    <button
                      type="button"
                      id={i}
                      onClick={() => handleClickParar(fichaje.id)}
                      className="btn btn-sm btn-primary"
                    >
                      Parar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
