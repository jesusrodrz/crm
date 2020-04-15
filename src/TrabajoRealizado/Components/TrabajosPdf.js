import React from 'react';
import PdfPortal from './PdfPortal';

export default function TrabajosPdf({ data, tiempo }) {
  return (
    <PdfPortal>
      <div className="m-5">
        <h2>Trabajos realizados</h2>
        <table className="table table-sm responsive">
          <thead className="thead-light">
            <tr>
              <th scope="col">Dia</th>
              <th scope="col">Actividad</th>
              <th scope="col">cliente</th>
              <th scope="col">Hora de Comienzo</th>
              <th scope="col">Tiempo Total</th>
              <th scope="col">Hora de Finalizacion</th>
            </tr>
          </thead>
          <tbody>
            {data.map((fichaje, i) => {
              return (
                <tr key={i}>
                  <th scope="row">{fichaje.dia}</th>
                  <td>{fichaje.actividad}</td>
                  <td>
                    {fichaje.project !== ''
                      ? `${fichaje.clienteNombre} (${fichaje.project})`
                      : fichaje.clienteNombre}
                  </td>
                  <td>{fichaje.comienzo}</td>
                  <td>{fichaje.duracion}</td>
                  <td>{fichaje.parado}</td>
                </tr>
              );
            })}
            <tr>
              <th scope="row">Totales</th>
              <td />
              <td />
              <td>{tiempo}</td>
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </PdfPortal>
  );
}
