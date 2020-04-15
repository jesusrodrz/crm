import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { MdPictureAsPdf } from 'react-icons/md';
import { usePrint } from '../../hooks';
import Printable from '../../shared';

export function EstadisticaTrabajoDia({
  tiempoTotalesMinutos: minutos,
  title,
  tiempoTotalesFormated: totalesFormated,
  mainTitle
}) {
  const labels = Object.keys(minutos);
  const dataset = labels.map(key => minutos[key]);
  const main = mainTitle || 'Tu trabajo de hoy';
  const dataEstadisitacaVisitas = {
    labels: [...labels],
    datasets: [
      {
        data: [...dataset],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#EB0F13'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4B0607']
      }
    ]
  };
  const [printing, print] = usePrint();
  return (
    <div className="card activity">
      <div className="card-header d-flex align-items-center">
        <h3 className="mr-5">{main}</h3>
        {/* <button
          type="button"
          className="btn btn-sm btn-primary no-print"
          onClick={print}
        >
          <MdPictureAsPdf />
        </button> */}
      </div>
      <div className="card-body">
        {Object.keys(totalesFormated).map(key => {
          if (key === 'total') {
            return null;
          }
          return (
            <p key={key}>
              <strong>{key}:</strong> {totalesFormated[key]}
            </p>
          );
        })}
        <Bar
          data={dataEstadisitacaVisitas}
          options={{
            title: {
              display: true,
              text: title
            }
          }}
        />
        <p className="totales">{totalesFormated.total}</p>
      </div>
    </div>
    // <Printable print={printing}>
    // </Printable>
  );
}
