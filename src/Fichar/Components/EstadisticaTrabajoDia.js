import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

export class EstadisticaTrabajoDia extends Component {
  constructor(props) {
    super(props);
    const minutos = this.props.tiempoTotalesMinutos;
    // console.log(minutos);
    const labels = Object.keys(minutos);
    const dataset = labels.map(key => minutos[key]);
    console.log(labels, dataset);
    this.state = {
      data: [],
      tiempoTotalDia: this.props.tiempoTotalDia,
      totalesFormated: this.props.tiempoTotalesFormated,
      dataEstadisitacaVisitas: {
        labels: [...labels],
        datasets: [
          {
            data: [...dataset],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#EB0F13'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4B0607']
          }
        ]
      }
    };
  }

  render() {
    const {
      dataEstadisitacaVisitas,
      tiempoTotalDia,
      totalesFormated
    } = this.state;
    return (
      <div className="card activity">
        <div className="card-body">
          <h5 className="card-title">Tu trabajo de hoy</h5>
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
                text: 'Fichajes'
              }
            }}
          />
          <p className="totales">{totalesFormated.total}</p>
        </div>
      </div>
    );
  }
}
