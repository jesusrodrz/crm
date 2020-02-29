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

    this.setState({
      nombreNegocio: visita.nombreNegocio,
      productoSolicitado: visita.productoSolicitado,
      nombreGerente: visita.nombreGerente,
      comentarios: visita.comentarios,
      proxAccion: visita.fechaProx,
      poblacion: visita.poblacion,
      codigoPostal: visita.codigoPostal,
      telefonoGerente: visita.telefonoGerente,
      emailGerente: visita.emailGerente,
      emailEnviado: visita.emailEnviado,
      tienenWeb: visita.tienenWeb,
      probVenta: visita.probVenta,
      tieneInteres: visita.tieneInteres,
      verVisitaCompleta: true
    });
  };

  handleModificar = event => {
    event.preventDefault();
    const {
      comentarios,
      proxAccion,
      probVenta,
      emailEnviado,
      tieneInteres,
      visitaId
    } = this.state;

    const fechaProx = Number(moment(proxAccion).format('x'));

    const modificacion = {
      comentarios,
      fechaProx,
      emailEnviado,
      tieneInteres,
      probVenta
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
    try {
      const { auth } = this.state;
      const {
        user: {
          uid,
          data: { userAdmin }
        }
      } = auth;
      const subscribeVisitas = db
        .collection('visitas')
        .where('userAdmin', '==', userAdmin)
        .where('userId', '==', uid)
        .onSnapshot(snapshot => {
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
      this.unsubscribes.push(subscribeVisitas);
    } catch (error) {
      this.showError(error);
    }
  };

  getDynamicFields = async () => {
    try {
      const { auth } = this.state;
      const {
        user: {
          data: { userAdmin }
        }
      } = auth;
      const fieldsSnapshot = await db
        .collection('dynamicFields')
        .where('userId', '==', userAdmin)
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

  showError = e => {
    swal('Error', `Erro: ${e}`, 'error');
  };

  componentDidMount = () => {
    this.subscribeVisitas();
    this.getDynamicFields();
  };

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
      borrandoVisita,
      auth
    } = this.state;
    const {
      user: {
        data: { userAdmin }
      }
    } = auth;
    const lista = busqueda ? search : data;
    return (
      <div className="col-12 col-md-11">
        <div className="row">
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
                <input
                  type="text"
                  onChange={this.handleSearch}
                  className="form-control precios"
                  id="search"
                  placeholder="Buscar..."
                />
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
          <div className="col-12 col-md-3">
            <TareaDia tareas={tareas} handleActuarDia={this.handleActuarDia} />
          </div>
        </div>
      </div>
    );
  }
}
export const GestionVisitas = withAuthValue(GestionVisitasClass);
