import React, { Component } from 'react';
import moment from 'moment';
import swal from 'sweetalert';
import { db } from '../../firebase/firebase';
import { VisualizacionFichaje } from '../Components/VisualizacionFichaje';
import { VisualizacionTrabajosDia } from '../Components/VisualizacionTrabajosDia';
import { EstadisticaTrabajoDia } from '../Components/EstadisticaTrabajoDia';
import { Spinner } from '../../Spinner/Container/Spinner';
import { withAuthValue } from '../../context/context';
import {
  getOptionsObj,
  getTimesObj,
  getTimesMinutes,
  getDutationFormated,
  getTimesFormated
} from '../../helpers/helpers';

class FicharClass extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
    this.mounted = false;
    const { auth } = this.props;
    this.state = {
      auth,
      actividad: '',
      project: 'Sin proyecto',
      cliente: 'default',
      cargandoTrabajos: false,
      cargandoTerminados: false,
      clientes: [],
      listaTrabajo: [],
      fichajesTypes: [],
      listaTerminado: []
    };
  }

  componentDidMount = () => {
    this.mounted = true;
    this.subscribeTrabajos();
    this.subscribeTrabajosTerminados();
    this.fetchFichajesTypes();
    this.fetchClientes();
    // this.updateDurationTrabajos();
  };

  componentWillUnmount() {
    this.mounted = false;
    this.subscriptions.forEach(subs => {
      subs();
    });
  }

  handleClickParar = e => {
    // e.preventDefault();
    const { listaTrabajo } = this.state;
    const currentTrabajo = listaTrabajo.find(item => item.id === e);

    const terminado = moment().valueOf();
    const terminadoString = moment(terminado).format('YYYY/MM/DD HH:mm');
    const duracion = terminado - currentTrabajo.comienzo;
    const time = moment.duration(duracion);
    const duracionString = `h: ${time.hours()}, m: ${time.minutes()}, s: ${time.seconds()}`;
    window.navigator.geolocation.getCurrentPosition(success => {
      const trabajo = {
        parado: terminado,
        terminadoString,
        duracionString,
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
    if (listaTrabajo.length > 0) {
      swal('Ya tienes un trabajo en marcha, primero finaliza tu trabajo');
      return;
    }
    const {
      user: {
        uid,
        data: { type, userAdmin }
      }
    } = auth;
    const comienzo = moment().valueOf();
    const dia = moment(moment().format('YYYY/MM/DD')).valueOf();
    const diaString = moment(dia).format('YYYY/MM/DD HH:mm');
    const comienzoString = moment().format('YYYY/MM/DD HH:mm');
    // const sam = moment(1582933115163).format('HH:mm');
    window.navigator.geolocation.getCurrentPosition(success => {
      const { actividad, cliente, clientes, project } = this.state;
      const clienteNombre = clientes.find(item => item.id === cliente)
        .nombreNegocio;

      const trabajo = {
        userId: uid,
        userAdmin: type === 'admin' ? uid : userAdmin,
        dia,
        diaString,
        actividad,
        comienzoString,
        comienzo,
        parado: 0,
        duracion: 0,
        estado: 'Trabajando',
        clienteNombre,
        cliente,
        project,
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
    let subscribeUpdate = true;
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

          const duracionFormated = getDutationFormated(timeDiference);
          return { ...data, id: doc.id, comienzoFormated, duracionFormated };
        });
        if (subscribeUpdate) {
          subscribeUpdate = false;
          this.updateDurationTrabajos();
        }
        this.setState({ listaTrabajo: trabajos, cargandoTrabajos: false });
      });
    this.subscriptions.push(subscribe);
  };

  fetchFichajesTypes = () => {
    const { auth } = this.state;
    const {
      user: {
        uid,
        data: { type, userAdmin }
      }
    } = auth;
    const id = type === 'admin' ? uid : userAdmin;
    db.collection('fichajeTypes')
      .where('userId', '==', id)
      .where('available', '==', true)
      .get()
      .then(snapshot => {
        if (!this.mounted) {
          return;
        }
        const data = snapshot.docs.map(item => {
          return { ...item.data(), id: item.id };
        });
        this.setState({ fichajesTypes: data, actividad: data[0].name });
      });
  };

  fetchClientes = async () => {
    const { auth } = this.state;
    const {
      user: {
        uid,
        data: { type, userAdmin }
      }
    } = auth;
    const id = type === 'admin' ? uid : userAdmin;

    const snapshot = await db
      .collection('clientes')
      .where('userAdmin', '==', id)
      .get();

    const clientes = snapshot.docs.map(item => {
      return { ...item.data(), id: item.id };
    });
    if (!this.mounted) {
      return;
    }
    const defaultCliente = {
      id: 'default',
      nombreNegocio: 'Sin cliente'
    };
    this.setState({ clientes: [defaultCliente, ...clientes] });
  };

  updateDurationTrabajos = () => {
    const intervalID = setInterval(() => {
      const { listaTrabajo } = this.state;
      const trabajos = listaTrabajo.map(item => {
        const timeDiference = moment().valueOf() - item.comienzo;
        const duracionFormated = getDutationFormated(timeDiference);
        return { ...item, duracionFormated };
      });
      this.setState({ listaTrabajo: trabajos });
    }, 50000);
    this.subscriptions.push(() => {
      clearInterval(intervalID);
    });
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
        this.setState({ cargandoTerminados: true });
        const trabajos = snapshot.docs.map(doc => {
          const data = {
            ...doc.data()
          };
          const comienzoFormated = moment(data.comienzo).format('HH:mm:ss');
          const paradoFormated = moment(data.parado).format('HH:mm:ss');
          const timeDiference = data.parado - data.comienzo; // hora actual menos hora de comienzo
          const duracionFormated = getDutationFormated(timeDiference);
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
      listaTerminado,
      actividad,
      fichajesTypes,
      clientes,
      cliente,
      project
    } = this.state;

    const loading = cargandoTrabajos || cargandoTerminados;

    const typesNames = getOptionsObj(fichajesTypes, 'name');
    const typesClientes = getOptionsObj(clientes, 'nombreNegocio');

    const tiempoTotales = getTimesObj(listaTerminado, typesNames, 'actividad');
    const tiempoTotalesClientes = getTimesObj(
      listaTerminado,
      typesClientes,
      'clienteNombre'
    );

    const tiempoTotalesMinutos = getTimesMinutes(tiempoTotales);
    const tiempoTotalesMinutosClientes = getTimesMinutes(tiempoTotalesClientes);

    const tiempoTotalesFormated = getTimesFormated(tiempoTotales);
    const tiempoTotalesFormatedClientes = getTimesFormated(
      tiempoTotalesClientes
    );
    const tiempoTotalDia = tiempoTotalesFormated.total;
    const projects = clientes.find(item => item.id === cliente)?.projects;
    console.log('hola: ', listaTerminado);
    return (
      <>
        <div className="card precios">
          <div className="card-body">
            <div className="form-group">
              <label>Actividad</label>
              <select
                onChange={this.handleChange}
                className="form-control"
                id="actividad"
                value={actividad}
              >
                {fichajesTypes.map(({ name, key }) => {
                  return (
                    <option key={key} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-group">
              <label>Cliente</label>
              <select
                onChange={this.handleChange}
                className="form-control"
                id="cliente"
                value={cliente}
              >
                {clientes.map(({ nombreNegocio, id }) => {
                  return (
                    <option key={id} value={id}>
                      {nombreNegocio}
                    </option>
                  );
                })}
              </select>
            </div>
            {projects && (
              <div className="form-group">
                <label>Proyecto</label>
                <select
                  onChange={this.handleChange}
                  className="form-control"
                  id="project"
                  value={project}
                >
                  <option value="Sin Proyecto">Sin Proyecto</option>
                  {projects.map(item => {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <button
              type="submit"
              onClick={this.submitInformation}
              className="btn btn-success"
            >
              Fichar
            </button>
          </div>
        </div>
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
              tiempoTotalesFormated={tiempoTotalesFormated}
              tiempoTotalesMinutos={tiempoTotalesMinutos}
              title="Fichajes por tipos"
            />
            <EstadisticaTrabajoDia
              tiempoTotalesFormated={tiempoTotalesFormatedClientes}
              tiempoTotalesMinutos={tiempoTotalesMinutosClientes}
              title="Fichajes por cliente"
            />
          </div>
        )}
      </>
    );
  }
}
export const Fichar = withAuthValue(FicharClass);
