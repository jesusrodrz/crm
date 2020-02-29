import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

export class EstadisticaTrabajoDia extends Component {
  state = {
    data: [],
    tiempoFormacion: this.props.tiempoFormacion,
    tiempoVentas: this.props.tiempoVentas,
    tiempoOficina: this.props.tiempoOficina,
    tiempoProgramacion: this.props.tiempoProgramacion,
    tiempoTotalDia: this.props.tiempoTotalDia,
    dataEstadisitacaVisitas: {
      labels: ['Ventas', 'Oficina', 'Programacion', 'Formacion'],
      datasets: [
        {
          data: [
            this.props.tiempoVentasEstadistica,
            this.props.tiempoOficinaEstadistica,
            this.props.tiempoProgramacionEstadistica,
            this.props.tiempoFormacionEstadistica
          ],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#EB0F13'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4B0607']
        }
      ]
    }
  };

  render() {
    const {
      dataEstadisitacaVisitas,
      tiempoTotalDia,
      tiempoFormacion,
      tiempoProgramacion,
      tiempoVentas,
      tiempoOficina
    } = this.state;
    return (
      <div className="card activity">
        <div className="card-body">
          <h5 className="card-title">Tu trabajo de hoy</h5>
          <p>
            <strong>Oficina:</strong> {tiempoOficina}
          </p>
          <p>
            <strong>Ventas:</strong> {tiempoVentas}
          </p>
          <p>
            <strong>Programación:</strong> {tiempoProgramacion}
          </p>
          <p>
            <strong>Formación:</strong> {tiempoFormacion}
          </p>
          <Bar data={dataEstadisitacaVisitas} />
          <p className="totales">{tiempoTotalDia}</p>
        </div>
      </div>
    );
  }
}
