/* eslint-disable no-unused-vars */
/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import { db } from '../../firebase/firebase';
import { Analisis } from '../Components/Analisis';
import { Circulo } from '../Components/Circulo';
import '../../App.css';
import { withAuthValue } from '../../context/context';

class EstadisticasClass extends Component {
  state = {
    data: [],
    dataEstadisitacaVisitas: {
      labels: ['', '', ''],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    },
    dataEstadisicasTienenWeb: {
      labels: ['', '', ''],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    },
    dataEstadisicasProductosSolicitados: {
      labels: ['', '', ''],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    },
    dataEstadisicasVenta: {
      labels: ['', '', ''],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    },
    dataEstadisicasTipoEmpresa: {
      labels: ['', '', ''],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    },
    visitasTotales: '0',
    totalMuestreoWeb: '0',
    totalProductosSolicitos: '0'
  };

  componentDidMount = async () => {
    const visitasNulas = [];
    const sistemaReservasCompetencia = [];
    const visitasConseguidas = [];
    const visitasStandbay = [];
    const visitasNoMucha = [];
    const tienenWeb = [];
    const noTienenWeb = [];
    const todoWebYReservas = [];
    const soloWeb = [];
    const reservas = [];
    const ventasMuyAltas = [];
    const ventasAltas = [];
    const ventasNormal = [];
    const ventasBaja = [];
    // let data = {};
    const userId = this.props.auth.user.uid;
    const dataSnapshot = await db
      .collection('visitas')
      .where('userId', '==', userId)
      .get();
    const data = dataSnapshot.docs.map(item => ({
      ...item.data(),
      docId: item.id
    }));
    console.log(data);
    const run = () => {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (data[key].tieneInteres === 'No') {
            const element = data[key];
            visitasNulas.push(element);
          }
          if (data[key].tieneInteres === 'Si') {
            const element = data[key];
            visitasConseguidas.push(element);
          }
          if (data[key].tieneInteres === 'No esta la persona que decide') {
            const element = data[key];
            visitasStandbay.push(element);
          }
          if (data[key].tieneInteres === 'No, pero quiere Info') {
            const element = data[key];
            visitasNoMucha.push(element);
          }
          if (data[key].tieneInteres === 'Ya tienen sistema de reservas') {
            const element = data[key];
            sistemaReservasCompetencia.push(element);
          }
          if (data[key].tienenWeb === 'Si') {
            const element = data[key];
            tienenWeb.push(element);
          }
          if (data[key].tienenWeb !== 'Si') {
            const element = data[key];
            noTienenWeb.push(element);
          }
          if (
            data[key].productoSolicitado ===
            'Web Corporativa + Sistema de Reservas'
          ) {
            const element = data[key];
            todoWebYReservas.push(element);
          }
          if (data[key].productoSolicitado === 'Web Corporativa') {
            const element = data[key];
            soloWeb.push(element);
          }
          if (data[key].productoSolicitado === 'Sistema de Reservas') {
            const element = data[key];
            reservas.push(element);
          }
          if (data[key].probVenta === 'Muy alta') {
            const element = data[key];
            ventasMuyAltas.push(element);
          }
          if (data[key].probVenta === 'Alta') {
            const element = data[key];
            ventasAltas.push(element);
          }
          if (data[key].probVenta === 'Normal') {
            const element = data[key];
            ventasNormal.push(element);
          }
          if (data[key].probVenta === 'Baja') {
            const element = data[key];
            ventasBaja.push(element);
          }
        }
      }

      const nulas = visitasNulas.length;
      const buenas = visitasConseguidas.length;
      const noPersona = visitasStandbay.length;
      const poco = visitasNoMucha.length;
      const competencia = sistemaReservasCompetencia.length;

      this.setState({
        visitasTotales: nulas + buenas + noPersona + poco + competencia
      });

      const web = tienenWeb.length;
      const noWeb = noTienenWeb.length;

      this.setState({ totalMuestreoWeb: web + noWeb });

      const webYReservas = todoWebYReservas.length;
      const soloWebUnica = soloWeb.length;
      const soloReservas = reservas.length;

      this.setState({
        totalProductosSolicitos: webYReservas + soloWebUnica + soloReservas
      });

      const top = ventasMuyAltas.length;
      const alt = ventasAltas.length;
      const norm = ventasNormal.length;
      const baja = ventasBaja.length;

      this.setState({
        dataEstadisitacaVisitas: {
          labels: [
            'Visitas Nulas',
            'Visitas Conseguidas',
            'No se sabe',
            'No, pero quiere Info',
            'Competencia Sistema de Reservas'
          ],
          datasets: [
            {
              data: [nulas, buenas, noPersona, poco, competencia],
              backgroundColor: [
                '#F0EDED',
                '#36A2EB',
                '#FFCE56',
                '#605C5A',
                '#EB0F13'
              ],
              hoverBackgroundColor: ['#DFC5C5', '#36A2EB', '#FFCE56', '#4B0607']
            }
          ]
        },
        dataEstadisicasTienenWeb: {
          labels: ['Si Tienen Web', 'No tienen Web'],
          datasets: [
            {
              data: [web, noWeb, 0],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }
          ]
        },
        dataEstadisicasProductosSolicitados: {
          labels: [
            'Sistema de Reservas',
            'Web Corporativa',
            'Web + Sistema de Reservas'
          ],
          datasets: [
            {
              data: [soloReservas, soloWebUnica, webYReservas],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }
          ]
        },
        dataEstadisicasVenta: {
          labels: ['Muy alta', 'Alta', 'Normal', 'Baja'],
          datasets: [
            {
              data: [top, alt, norm, baja],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }
          ]
        },

        dataEstadisicasTipoEmpresa: {
          labels: [
            'Academia',
            'Peluqueria',
            'Lavadero',
            'Taller',
            'Empresa Mantenimiento Industrial',
            'Clinica Dental',
            'Clinica Fisioterapeuta',
            'Clinica Psicologica',
            'Abogado',
            'Bicicletas',
            'Comida para llevar',
            'Empresa',
            'Restaurante',
            'Bar',
            'Clinica',
            'Autónomo pequeño'
          ],
          datasets: [
            {
              data: [3, 4, 0],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }
          ]
        }
      });
    };
    // run()
  };

  render() {
    const {
      dataEstadisitacaVisitas,
      dataEstadisicasTienenWeb,
      dataEstadisicasProductosSolicitados,
      dataEstadisicasTipoEmpresa,
      visitasTotales,
      totalMuestreoWeb,
      totalProductosSolicitos
    } = this.state;

    return (
      <>
        <div className="row">
          <div className="col-12 col-md-6">
            <Analisis
              tituloEstadistica="Total de visitas realizadas"
              dataEstadisitacaVisitas={dataEstadisitacaVisitas}
              totales={`Las visitas totales realizadas son ${visitasTotales}`}
            />
          </div>
          <div className="col-12 col-md-6">
            <Analisis
              tituloEstadistica="Análisis de clientes con web actualmente"
              dataEstadisitacaVisitas={dataEstadisicasTienenWeb}
              totales={`El total del análisis ${totalMuestreoWeb}`}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            <Analisis
              tituloEstadistica="Análisis de productos de interés"
              dataEstadisitacaVisitas={dataEstadisicasProductosSolicitados}
              totales={`Total productos solicitados ${totalProductosSolicitos}`}
            />
          </div>
          <div className="col-12 col-md-6">
            <Circulo
              tituloEstadistica="Análisis por tipo de empresa"
              dataEstadisitacaVisitas={dataEstadisicasTipoEmpresa}
            />
          </div>
        </div>
      </>
    );
  }
}
export const Estadisticas = withAuthValue(EstadisticasClass);
