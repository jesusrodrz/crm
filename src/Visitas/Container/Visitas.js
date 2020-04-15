/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import swal from 'sweetalert';
import moment from 'moment';
import { db } from '../../firebase/firebase';
import { FileUpload } from '../../FileUpload/Container/FileUpload';
import { withAuthValue } from '../../context/context';
import FieldInput from '../Components/FieldInput';
import {
  orderFields,
  dynamicFieldsValues,
  validadeDynamicFields,
  formatDynamicFieldValues
} from '../../helpers/helpers';

class VisitasClass extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;

    const { auth } = this.props;
    this.state = {
      nombreGerente: '',
      telefonoGerente: '',
      emailGerente: '',
      comentarios: '',
      proxAccion: '',
      probVenta: 'Muy Alta',
      nombreNegocio: '',
      poblacion: '',
      codigoPostal: '',
      listaImagenes: [],
      fields: [],
      fieldsValues: [],
      cargandoImagenes: false,
      cliente: 'default',
      clientes: [],
      saving: false,
      auth
    };
  }

  componentDidMount() {
    this.fetchFields();
    this.fetchClientes();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleChange = e => {
    const { target } = e;
    const { value } = target;
    const name = target.id;
    this.setState({
      [name]: value
    });
  };

  handleClientChange = ({ target }) => {
    // console.log(e);
    const { value } = target;
    const { clientes } = this.state;
    const cliente = clientes.find(item => item.id === value);
    const clienteToSet =
      value !== 'default'
        ? cliente
        : {
            nombreGerente: '',
            telefonoGerente: '',
            emailGerente: '',
            nombreNegocio: '',
            poblacion: '',
            codigoPostal: ''
          };
    this.setState(state => ({ ...state, cliente: value, ...clienteToSet }));
  };

  handleChangeDynamicFields = (e, valueData) => {
    const { fieldsValues } = this.state;
    const fields = dynamicFieldsValues(fieldsValues, valueData);
    console.log(fields);
    this.setState(state => ({
      ...state,
      fieldsValues: fields
    }));
  };

  fetchFields = async () => {
    const { auth } = this.state;
    // console.log(auth);
    const {
      user: {
        data: { type, userAdmin },
        uid
      }
    } = auth;
    const id = type === 'admin' ? uid : userAdmin;
    const dataSnapshot = await db
      .collection('dynamicFields')
      .where('userId', '==', id)
      .where('available', '==', true)
      .get();
    const fields = dataSnapshot.docs.map(item => ({
      ...item.data(),
      id: item.id
    }));

    if (this.mounted) {
      this.setState(state => ({ ...state, fields: orderFields(fields) }));
    }
  };

  setCargandoImagenes = state => {
    this.setState({ cargandoImagenes: state });
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
      nombreNegocio: '--selecionar--'
    };
    this.setState({ clientes: [defaultCliente, ...clientes] });
  };

  submitInformation = e => {
    const {
      nombreGerente,
      telefonoGerente,
      emailGerente,
      comentarios,
      proxAccion,
      probVenta,
      nombreNegocio,
      poblacion,
      listaImagenes,
      cargandoImagenes,
      codigoPostal
    } = this.state;

    const imagenes = listaImagenes.length > 0 ? listaImagenes : '';

    const fechaProx = moment(proxAccion).valueOf();
    const diaHoy = moment().valueOf();

    e.preventDefault();
    const {
      auth: { user },
      fieldsValues,
      fields
    } = this.state;
    const valid = validadeDynamicFields(fields, fieldsValues);

    if (codigoPostal === '') {
      swal('Por favor rellena el codigo postal');
    } else if (probVenta === '') {
      swal('Por favor rellena la probabilidad de Venta');
    } else if (poblacion === '') {
      swal('Por favor rellena la poblacion');
    } else if (nombreNegocio === '') {
      swal('Por favor rellena el nombre del Negocio');
    } else if (!valid) {
      swal('Por favor rellena los campos de la visita que son requeridos');
    } else if (cargandoImagenes) {
      swal('Espera a que las imagenes se guarden...');
    } else {
      // const formatValues = fieldsValues.reduce(
      //   (currentArray, { id, value }) => {
      //     const exists = currentArray.find(el => el.id === id);
      //     if (!exists) {
      //       currentArray.push({ values: [value], id });
      //       return currentArray;
      //     }
      //     exists.values.push(value);
      //     return currentArray;
      //   },
      //   []
      // );
      const formatValues = formatDynamicFieldValues(fieldsValues);
      const {
        uid,
        data: { type, userAdmin }
      } = user;
      const visita = {
        diaVisita: diaHoy,
        fechaProx,
        nombreGerente,
        telefonoGerente,
        emailGerente,
        comentarios,
        probVenta,
        nombreNegocio,
        poblacion,
        codigoPostal,
        emailEnviado: 'No',
        listaImagenesTarjeta: imagenes,
        userId: uid,
        userAdmin: type === 'admin' ? uid : userAdmin,
        fields: formatValues
      };

      // console.log(visita);
      this.setState({ saving: true });
      db.collection('visitas')
        .add(visita)
        .then(ref => {
          this.setState({ saving: false });
          swal({
            text: 'La Visita se ha añadido correctamente',
            timer: 900
          });
        })
        .catch(error => {
          swal(
            'Error al agregar la visita',
            `Error: ${JSON.stringify(error)}`,
            'error'
          );
          this.setState({ saving: false });
        });
    }
  };

  validadeFields = () => {
    const { fields, fieldsValues } = this.state;
    const requeredFields = fields.filter(item => item.required);
    const requeredFieldsHasValues = requeredFields.map(({ id }) => {
      const hasValue = fieldsValues.find(item => item.id === id);
      if (hasValue) {
        return true;
      }
      return false;
    });
    const valid = requeredFieldsHasValues.every(item => item);
    return valid;
  };

  render() {
    const {
      fields,
      clientes,
      cliente,
      poblacion,
      nombreNegocio,
      codigoPostal,
      emailGerente,
      nombreGerente,
      telefonoGerente,
      saving
    } = this.state;
    return (
      <form>
        <div className="card precios">
          <div className="card-body">
            <div className="form-group">
              <label>Cliente</label>
              <select
                onChange={this.handleClientChange}
                className="form-control"
                id="actividad"
                value={cliente}
              >
                {clientes.map(({ nombreNegocio: nombre, id }) => {
                  return (
                    <option key={id} value={id}>
                      {nombre}
                    </option>
                  );
                })}
              </select>
            </div>
            <h5 className="card-title">Datos Principales</h5>
            <label>Nombre de la Empresa</label>
            <input
              onChange={this.handleChange}
              type="text"
              className="form-control"
              id="nombreNegocio"
              placeholder="Escribe el nombre de la empresa"
              required
              value={nombreNegocio}
            />
            <label>Poblacion</label>
            <input
              onChange={this.handleChange}
              value={poblacion}
              type="text"
              className="form-control"
              id="poblacion"
              placeholder="Poblacion"
            />
            <label>Codigo Postal</label>
            <input
              onChange={this.handleChange}
              type="zipCode"
              className="form-control"
              id="codigoPostal"
              placeholder="46000"
              value={codigoPostal}
            />
          </div>
        </div>
        <div className="card precios">
          <div className="card-body">
            <h5 className="card-title">Datos de la visita</h5>
            <div>
              {fields.map(item => (
                <FieldInput
                  key={item.id}
                  data={item}
                  handleOnChange={this.handleChangeDynamicFields}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="card precios">
          <div className="card-body">
            <h5 className="card-title">Datos del Posible Cliente</h5>
            <div className="form-group">
              <label>Nombre del Gerente</label>
              <input
                onChange={this.handleChange}
                type="text"
                className="form-control"
                id="nombreGerente"
                placeholder="Nombre Gerente"
                value={nombreGerente}
              />
            </div>
            <div className="form-group">
              <label>Télefono de Contacto</label>
              <input
                onChange={this.handleChange}
                type="text"
                className="form-control"
                id="telefonoGerente"
                placeholder="Teléfono"
                value={telefonoGerente}
              />
            </div>
            <div className="form-group">
              <label>Correo Eléctrónico</label>
              <input
                onChange={this.handleChange}
                type="text"
                className="form-control"
                id="emailGerente"
                placeholder="gerente@gerente.com"
                value={emailGerente}
              />
            </div>
          </div>
        </div>

        <div className="card precios">
          <div className="card-body">
            <h5 className="card-title">Acciones Comerciales Próximas</h5>
            <div className="form-group">
              <label>Proxima Accion</label>
              <input
                onChange={this.handleChange}
                type="date"
                className="form-control"
                id="proxAccion"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Comentarios</label>
              <textarea
                onChange={this.handleChange}
                className="form-control"
                id="comentarios"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Posibilidades reales de contratación</label>
              <select
                onChange={this.handleChange}
                className="form-control"
                id="probVenta"
              >
                <option>Muy alta</option>
                <option>Alta</option>
                <option>Normal</option>
                <option>Baja</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card precios">
          <div className="card-body">
            <h5 className="card-title">Añade la tarjeta de Visita</h5>
            <div className="form-group">
              <FileUpload
                listaImagenes={this.state.listaImagenes}
                setCargando={this.setCargandoImagenes}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          onClick={this.submitInformation}
          className="btn btn-success botonSuccess"
          disabled={saving}
        >
          {!saving ? (
            'Enviar'
          ) : (
            <>
              <span>Enviando...</span>
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </>
          )}
        </button>
      </form>
    );
  }
}
export const Visitas = withAuthValue(VisitasClass);
// export const VisitasWithAuhtValue = withAuthValue(VisitasClass);
