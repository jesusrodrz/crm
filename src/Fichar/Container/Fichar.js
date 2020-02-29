import React, { Component } from 'react';
import moment from 'moment';
import swal from 'sweetalert';
import { db } from '../../firebase/firebase';
import { VisualizacionFichaje } from '../Components/VisualizacionFichaje';
import { VisualizacionTrabajosDia } from '../Components/VisualizacionTrabajosDia';
import { EstadisticaTrabajoDia } from '../Components/EstadisticaTrabajoDia';
import { Spinner } from '../../Spinner/Container/Spinner';
import { withAuthValue } from '../../context/context';

class FicharClass extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
    this.state = {
      auth: this.props.auth,
      actividad: 'Oficina',
      cargandoTrabajos: false,
      cargandoTerminados: false,
      listaTrabajo: [],
      listaTerminado: []
    };
  }

  componentDidMount = () => {
    this.subscribeTrabajos();
    this.subscribeTrabajosTerminados();
  };

  componentWillUnmount() {
    this.subscriptions.forEach(subs => {
      subs();
    });
  }

  handleClickParar = e => {
    // e.preventDefault();
    const { listaTrabajo } = this.state;
    const currentTrabajo = listaTrabajo.find(item => item.id === e);

    const terminado = Number(moment().format('x'));
    const duracion = terminado - currentTrabajo.comienzo;
    window.navigator.geolocation.getCurrentPosition(success => {
      const trabajo = {
        parado: terminado,
        duracion,
        estado: 'Terminado',
        lugarTerminado: {
          longitude: success.coords.longitude,
          latitude: success.coords.latitude
        }
      };
      db.collection('fichajes')
        .doc(e)
        .set(trabajo, { merge: true })
        .then(() => {
          swal('El trabajo se ha Parado correctamente');
        })
        .catch(error => {
          this.showError(error);
        });
    });
  };

  submitInformation = e => {
    e.preventDefault();
    const { listaTrabajo, auth } = this.state;
    if (listaTrabajo.length !== 0) {
      swal('Ya tienes un trabajo en marcha, primero finaliza tu trabajo');
      return;
    }
    const {
      user: { uid }
    } = auth;
    const comienzo = Number(moment().format('x'));
    const dia = moment(moment().format('YYYY/MM/DD')).valueOf();
    // const sam = moment(1582933115163).format('HH:mm');
    window.navigator.geolocation.getCurrentPosition(success => {
      const { actividad } = this.state;
      const trabajo = {
        userId: uid,
        dia,
        actividad,
        comienzo,
        parado: 0,
        duracion: 0,
        estado: 'Trabajando',
        lugarEmpezado: {
          longitude: success.coords.longitude,
          latitude: success.coords.latitude
        }
      };
      db.collection('fichajes')
        .add(trabajo)
        .then(() => {
          swal('Trabajo añadido correctamemnte');
        })
        .catch(e => {
          this.showError(e);
        });
    });
  };

  showError = e => {
    swal('Error', `Error: ${JSON.stringify(e)}`, 'error');
  };

  handleChange = e => {
    const { target } = e;
    const { value } = target;
    const name = target.id;
    this.setState({
      [name]: value
    });
  };

  subscribeTrabajos = () => {
    const { auth } = this.state;
    const {
      user: { uid }
    } = auth;
    this.setState({ cargandoTrabajos: true });
    const dia = moment(moment().format('YYYY/MM/DD')).valueOf();
    const subscribe = db
      .collection('fichajes')
      .where('userId', '==', uid)
      .where('estado', '==', 'Trabajando')
      .where('dia', '<=', dia)
      // .where('dia', '>=', dia)
      .onSnapshot(snapshot => {
        const trabajos = snapshot.docs.map(doc => {
          const data = {
            ...doc.data()
          };
          const comienzoFormated = moment(data.comienzo).format('HH:mm');
          const timeDiference = moment().valueOf() - data.comienzo; // hora actual menos hora de comienzo
          const timeObject = moment.duration(timeDiference);
          const duracionFormated = `${timeObject.hours()} horas y ${timeObject.minutes()} minutos.`;
          return { ...data, id: doc.id, comienzoFormated, duracionFormated };
        });
        this.setState({ listaTrabajo: trabajos, cargandoTrabajos: false });
      });
    this.subscriptions.push(subscribe);
  };

  subscribeTrabajosTerminados = () => {
    const { auth } = this.state;
    const {
      user: { uid }
    } = auth;
    const dia = moment(moment().format('YYYY/MM/DD')).valueOf();
    this.setState({ cargandoTerminados: true });
    const subscribe = db
      .collection('fichajes')
      .where('userId', '==', uid)
      .where('estado', '==', 'Terminado')
      .where('dia', '>=', dia)
      .onSnapshot(snapshot => {
        const trabajos = snapshot.docs.map(doc => {
          const data = {
            ...doc.data()
          };
          const comienzoFormated = moment(data.comienzo).format('HH:mm');
          const paradoFormated = moment(data.parado).format('HH:mm');
          const timeDiference = moment().valueOf() - data.comienzo; // hora actual menos hora de comienzo
          const timeObject = moment.duration(timeDiference);
          const duracionFormated = `${timeObject.hours()} horas y ${timeObject.minutes()} minutos.`;
          return {
            ...data,
            id: doc.id,
            comienzoFormated,
            duracionFormated,
            paradoFormated
          };
        });
        this.setState({ listaTerminado: trabajos, cargandoTerminados: false });
      });
    this.subscriptions.push(subscribe);
  };

  render() {
    const {
      listaTrabajo,
      cargandoTerminados,
      cargandoTrabajos,
      listaTerminado
    } = this.state;
    const loading = cargandoTrabajos || cargandoTerminados;
    const tiempoTotales = listaTerminado.reduce(
      (time, item) => {
        const { duracion } = item;
        const key = item.actividad;
        const total = time.total + duracion;
        const actividad = time[key] + duracion;
        return { ...time, total, [key]: actividad };
      },
      {
        Oficina: 0,
        Venta: 0,
        Formacion: 0,
        Programar: 0,
        total: 0
      }
    );
    const tiempoTotalesMinutos = Object.keys(tiempoTotales).reduce(
      (time, key) => {
        const value = tiempoTotales[key];
        const timeObject = moment.duration(value);
        const formatedValue = Math.round(timeObject.asMinutes());
        return { ...time, [key]: formatedValue };
      },
      {}
    );
    const tiempoTotalesFormated = Object.keys(tiempoTotales).reduce(
      (time, key) => {
        const value = tiempoTotales[key];
        const timeObject = moment.duration(value);
        const formatedValue = `${timeObject.hours()} horas y ${timeObject.minutes()} minutos.`;
        return { ...time, [key]: formatedValue };
      },
      {}
    );
    const tiempoTotalDia = tiempoTotalesFormated.total;
    const tiempoFormacion = tiempoTotalesFormated.Formacion;
    const tiempoOficina = tiempoTotalesFormated.Oficina;
    const tiempoVentas = tiempoTotalesFormated.Venta;
    const tiempoProgramacion = tiempoTotalesFormated.Programar;

    const tiempoVentasEstadistica = tiempoTotalesMinutos.Venta;
    const tiempoFormacionEstadistica = tiempoTotalesMinutos.Formacion;
    const tiempoOficinaEstadistica = tiempoTotalesMinutos.Oficina;
    const tiempoProgramacionEstadistica = tiempoTotalesMinutos.Programar;
    return (
      <>
        <div className="form-group">
          <label>Actividad</label>
          <select
            onChange={this.handleChange}
            className="form-control"
            id="actividad"
          >
            <option>Oficina</option>
            <option>Venta</option>
            <option>Formacion</option>
            <option>Programar</option>
          </select>
        </div>
        <button
          type="submit"
          onClick={this.submitInformation}
          className="btn btn-success"
        >
          Fichar
        </button>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            <VisualizacionFichaje
              usuario="Carlos Raez"
              fichajesSinParar={listaTrabajo}
              handleClickParar={this.handleClickParar}
            />
            <VisualizacionTrabajosDia
              usuario="Carlos Raez"
              listaTerminado={listaTerminado}
              handleClickParar={this.handleClickParar}
              tiempoTotalDia={tiempoTotalDia}
            />
            <EstadisticaTrabajoDia
              tiempoProgramacionEstadistica={tiempoProgramacionEstadistica}
              tiempoOficinaEstadistica={tiempoOficinaEstadistica}
              tiempoFormacionEstadistica={tiempoFormacionEstadistica}
              listaTerminado={listaTerminado}
              tiempoTotalDia={tiempoTotalDia}
              tiempoFormacion={tiempoFormacion}
              tiempoOficina={tiempoOficina}
              tiempoProgramacion={tiempoProgramacion}
              tiempoVentas={tiempoVentas}
              tiempoVentasEstadistica={tiempoVentasEstadistica}
            />
          </div>
        )}
      </>
    );
  }
}
export const Fichar = withAuthValue(FicharClass);
