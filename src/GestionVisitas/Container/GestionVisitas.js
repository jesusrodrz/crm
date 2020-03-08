/* eslint-disable no-restricted-globals */
import React, { Component } from 'react';
import swal from 'sweetalert';
import moment from 'moment';
import { db } from '../../firebase/firebase';
import { Visita } from '../Components/Visita';
import { TareaDia } from '../Components/TareaDia';
import '../../App.css';
import { Spinner } from '../../Spinner/Container/Spinner';
import { withAuthValue } from '../../context/context';

class GestionVisitasClass extends Component {
  constructor(props) {
    super(props);
    const { auth } = this.props;
    this.unsubscribes = [];
    this.state = {
      auth,
      data: [],
      nombreNegocio: '',
      productoSolicitado: '',
      comentarios: '',
      proxAccion: '',
      nombreGerente: '',
      emailGerente: '',
      telefonoGerente: '',
      tienenWeb: '',
      probVenta: '',
      poblacion: '',
      codigoPostal: '',
      userFilter: 'false',
      verVisitaCompleta: false,
      cargando: true,
      search: [],
      emailEnviado: '',
      busqueda: false,
      tieneInteres: '',
      tareas: [],
      visitaId: '',
      listaImagenes: [],
      visitaFields: [],
      dynamicFields: [],
      users: [],
      guardandoVisita: false,
      borrandoVisita: false
    };
  }

  handleListaVisitas = () => {
    this.setState({ verVisitaCompleta: false });
  };

  handleChange = e => {
    const { target } = e;
    const { value } = target;
    const name = target.id;

    this.setState({
      [name]: value
    });
  };

  handleSearch = e => {
    const { target } = e;
    const { value } = target;
    const { data } = this.state;
    const search = data.filter(visita => {
      const busqueda = value.toLowerCase();
      const data = `${visita.nombreNegocio.toLowerCase()} ${visita.probVenta.toLowerCase()} ${
        visita.fechaProx
      } ${visita.poblacion.toLowerCase()} `;

      return data.includes(busqueda);
    });

    this.setState({
      search,
      busqueda: true
    });
  };

  hanldeActuarInformacion = event => {
    const i = event.target.id;
    const { data, busqueda, search } = this.state;
    const visita = busqueda ? search[i] : data[i];

    this.setVista(visita);
  };

  setVista = visita => {
    this.setState({
      visitaId: visita.id,
      nombreNegocio: visita.nombreNegocio,
      productoSolicitado: visita.productoSolicitado,
      nombreGerente: visita.nombreGerente,
      comentarios: visita.comentarios,
      proxAccion: visita.fechaProx,
      telefonoGerente: visita.telefonoGerente,
      emailGerente: visita.emailGerente,
      emailEnviado: visita.emailEnviado,
      tienenWeb: visita.tienenWeb,
      tieneInteres: visita.tieneInteres,
      probVenta: visita.probVenta,
      poblacion: visita.poblacion,
      codigoPostal: visita.codigoPostal,
      listaImagenes: visita.listaImagenesTarjeta,
      visitaFields: visita.fields,

      verVisitaCompleta: true
    });
  };

  handleActuarDia = event => {
    const i = event.target.id;
    const { tareas } = this.state;
    const visita = tareas[i];
    console.log(tareas, event.target, visita);
    this.setVista(visita);
  };

  handleModificar = event => {
    event.preventDefault();
    const {
      comentarios,
      proxAccion,
      probVenta,
      emailEnviado,
      tieneInteres,
      nombreGerente,
      emailGerente,
      visitaId,
      poblacion,
      codigoPostal,
      telefonoGerente
    } = this.state;

    const fechaProx = Number(moment(proxAccion).format('x'));

    const modificacion = {
      comentarios,
      fechaProx,
      emailEnviado,
      tieneInteres,
      nombreGerente,
      emailGerente,
      probVenta,
      codigoPostal,
      poblacion,
      telefonoGerente
    };
    const parsedModificacion = Object.keys(modificacion).reduce(
      (current, key) => {
        if (modificacion[key] !== undefined) {
          current[key] = modificacion[key];
        }
        return current;
      },
      {}
    );
    console.log(modificacion, parsedModificacion);
    db.collection('visitas')
      .doc(visitaId)
      .set(parsedModificacion, { merge: true })
      .then(() => {
        this.setState({ verVisitaCompleta: false, guardandoVisita: false });
        swal('Se ha modificado correctamente');
      })
      .catch(e => {
        this.showError(e);
      });

    this.setState({ guardandoVisita: true });
    // this.componentDidMount();
  };

  handleRemove = event => {
    event.preventDefault();
    const { visitaId } = this.state;
    db.collection('visitas')
      .doc(visitaId)
      .delete()
      .then(() => {
        this.setState({ verVisitaCompleta: false, borrandoVisita: false });
        swal('Se ha borrado correctamente');
      })
      .catch(e => {
        this.showError(e);
      });
    this.setState({ borrandoVisita: true });
  };

  subscribeVisitas = async () => {
    if (this.unsubscribeVisitas) this.unsubscribeVisitas();
    try {
      const { auth, userFilter } = this.state;
      const {
        user: {
          uid,
          data: { userAdmin, type }
        }
      } = auth;
      let query;
      if (type === 'vendedor') {
        query = db
          .collection('visitas')
          .where('userAdmin', '==', userAdmin)
          .where('userId', '==', uid);
      } else if (userFilter === 'false') {
        query = db.collection('visitas').where('userAdmin', '==', uid);
      } else {
        query = db
          .collection('visitas')
          .where('userAdmin', '==', uid)
          .where('userId', '==', userFilter);
      }
      const subscribeVisitas = query.onSnapshot(snapshot => {
        const visitas = snapshot.docs.map((item, i) => {
          const data = { ...item.data(), id: item.id };
          const formatedProxAccion = isNaN(data.fechaProx)
            ? 'No tiene'
            : moment(data.fechaProx).format('DD/MM/YYYY');
          return {
            ...data,
            fechaProx: formatedProxAccion
          };
        });

        const accionesDia = visitas.filter((item, i) => {
          const hoy = moment().format('DD/MM/YYYY');
          const visitaProx = item.fechaProx;
          return visitaProx === hoy;
        });
        this.setState({
          data: visitas,
          cargando: false,
          tareas: accionesDia
        });
      });
      this.unsubscribeVisitas = subscribeVisitas;
    } catch (error) {
      this.showError(error);
    }
  };

  getDynamicFields = async () => {
    try {
      const { auth } = this.state;
      const {
        user: {
          uid,
          data: { userAdmin, type }
        }
      } = auth;
      const fieldsSnapshot = await db
        .collection('dynamicFields')
        .where('userId', '==', type === 'admin' ? uid : userAdmin)
        .get();
      const fields = fieldsSnapshot.docs.map(item => ({
        ...item.data(),
        id: item.id
      }));
      this.setState({ dynamicFields: fields });
    } catch (error) {
      this.showError(error);
    }
  };

  fetchUsers = async () => {
    const { auth } = this.state;
    const {
      user: { email, uid }
    } = auth;
    const usersSnapshot = await db
      .collection('usersData')
      .where('userAdmin', '==', uid)
      .get();
    const users = usersSnapshot.docs.map(user => ({
      ...user.data(),
      id: user.id
    }));
    this.setState({
      users: [{ name: 'Tu usuario', email, id: uid }, ...users]
    });
  };

  showError = e => {
    swal('Error', `Erro: ${e}`, 'error');
  };

  filterHandler = ({ target }) => {
    const { value } = target;
    this.setState({ userFilter: value });
  };

  componentDidMount = () => {
    const { auth } = this.state;
    const {
      user: {
        data: { type }
      }
    } = auth;
    this.subscribeVisitas();
    this.getDynamicFields();
    if (type === 'admin') {
      this.fetchUsers();
    }
  };

  componentDidUpdate(props, prevState) {
    // console.log(prevState);
    // console.log(prevState, o);
    const { userFilter } = this.state;
    const { userFilter: prevUserFilter } = prevState;
    // console.log(prevUserFilter, userFilter);
    if (prevUserFilter !== userFilter) {
      this.subscribeVisitas();
    }
  }

  componentWillUnmount = () => {
    // console.log('unmount');
    this.unsubscribes.forEach(unsubscribe => unsubscribe());
  };

  render() {
    const {
      search,
      nombreNegocio,
      productoSolicitado,
      proxAccion,
      comentarios,
      probVenta,
      nombreGerente,
      emailGerente,
      telefonoGerente,
      tienenWeb,
      tieneInteres,
      verVisitaCompleta,
      data,
      busqueda,
      cargando,
      tareas,
      poblacion,
      codigoPostal,
      listaImagenes,
      visitaFields,
      dynamicFields,
      guardandoVisita,
      userFilter,
      borrandoVisita,
      auth,
      users
    } = this.state;
    const {
      user: {
        data: { userAdmin, type }
      }
    } = auth;
    const lista = busqueda ? search : data;
    return (
      <div className="col-12 col-md-12">
        <div className="row">
          <div className="col-12 col-md-3 order-md-12">
            <TareaDia tareas={tareas} handleActuarDia={this.handleActuarDia} />
          </div>
          <div className="col-12 col-md-9">
            {verVisitaCompleta ? (
              <Visita
                nombreNegocio={nombreNegocio}
                productoSolicitado={productoSolicitado}
                proxAccion={proxAccion}
                comentarios={comentarios}
                nombreGerente={nombreGerente}
                emailGerente={emailGerente}
                poblacion={poblacion}
                codigoPostal={codigoPostal}
                telefonoGerente={telefonoGerente}
                handleChange={this.handleChange}
                probVenta={probVenta}
                tienenWeb={tienenWeb}
                modificar={this.handleModificar}
                remove={this.handleRemove}
                handleListaVisitas={this.handleListaVisitas}
                tieneInteres={tieneInteres}
                listaImagenes={listaImagenes}
                visitaFields={visitaFields}
                userId={userAdmin}
                fields={dynamicFields}
                loading={guardandoVisita}
                borrando={borrandoVisita}
              />
            ) : (
              <div>
                {type === 'admin' ? (
                  <div className="row precios mb-3">
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        onChange={this.handleSearch}
                        className="form-control"
                        id="search"
                        placeholder="Buscar..."
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <select
                        className="custom-select"
                        name="userFilter"
                        onChange={this.filterHandler}
                        value={userFilter}
                      >
                        <option value="false">Todos los usuarios</option>
                        {users.map(({ name, id, email }) => (
                          <option key={id} value={id}>
                            {name} - {email}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    onChange={this.handleSearch}
                    className="form-control precios"
                    id="search"
                    placeholder="Buscar..."
                  />
                )}

                {cargando ? (
                  <Spinner />
                ) : (
                  <table className="table table-sm table-responsive">
                    <thead>
                      <tr>
                        <th scope="col">Nº</th>
                        <th scope="col">Negocio</th>
                        <th scope="col">Población</th>
                        <th scope="col">Código Postal</th>
                        <th scope="col">Próxima Acción</th>
                        <th scope="col">Probabilidad</th>
                        <th scope="col">Mail</th>
                        <th scope="col">Actuar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lista.map((visita, i) => {
                        return (
                          <tr key={i}>
                            <th scope="row">{i + 1}</th>
                            <td>{visita.nombreNegocio}</td>
                            <td>{visita.poblacion}</td>
                            <td>{visita.codigoPostal}</td>
                            <td>{visita.fechaProx}</td>
                            <td>{visita.probVenta}</td>
                            <td>{visita.emailEnviado}</td>
                            <td>
                              <button
                                type="button"
                                onClick={this.hanldeActuarInformacion}
                                id={i}
                                className="btn btn-info btn-sm"
                              >
                                Actuar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export const GestionVisitas = withAuthValue(GestionVisitasClass);
