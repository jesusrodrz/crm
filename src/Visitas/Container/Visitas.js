/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import swal from 'sweetalert';
import moment from 'moment';
import { db } from '../../firebase/firebase';
import { FileUpload } from '../../FileUpload/Container/FileUpload';
import { withAuthValue } from '../../context/context';
import FieldInput from '../Components/FieldInput';

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
      auth
    };
  }

  componentDidMount() {
    this.fetchFields();
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

  handleChangeDynamicFields = (e, valueData) => {
    // console.log(e);
    const { fieldsValues } = this.state;
    const { id, checked, value } = valueData;

    const newFieldsValues = [...fieldsValues, valueData].filter(
      ({ typeCampo, ...item }, i) => {
        // console.log(i, checked);
        if (typeCampo === 'simple' && item.value !== value && id === item.id) {
          return false;
        }
        if (typeCampo === 'multiple' && id === item.id) {
          if (item.value === value && !checked) {
            return false;
          }
          // return false;
        }
        return true;
      }
    );
    // console.log(newFieldsValues);
    this.setState(state => ({ ...state, fieldsValues: newFieldsValues }));
    // this.validadeFields
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
      .get();
    const fields = dataSnapshot.docs.map(item => ({
      ...item.data(),
      id: item.id
    }));
    const orderedFields = [...fields].sort((a, b) => {
      if (a.typeCampo === 'simple' && b.typeCampo === 'multiple') {
        return -1;
      }
      if (b.typeCampo === 'simple' && a.typeCampo === 'multiple') {
        return 1;
      }

      return 0;
    });
    if (this.mounted) {
      this.setState(state => ({ ...state, fields: orderedFields }));
    }
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
      codigoPostal
    } = this.state;

    const imagenes = listaImagenes.length > 0 ? listaImagenes : '';

    const fechaProx = moment(proxAccion).valueOf();
    const diaHoy = moment().valueOf();

    e.preventDefault();
    const valid = this.validadeFields();
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
    } else {
      const { user } = this.state.auth;
      const { fieldsValues } = this.state;
      const formatValues = fieldsValues.reduce(
        (currentArray, { id, value }) => {
          const exists = currentArray.find(el => el.id === id);
          if (!exists) {
            currentArray.push({ values: [value], id });
            return currentArray;
          }
          exists.values.push(value);
          return currentArray;
        },
        []
      );
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
      db.collection('visitas')
        .add(visita)
        .then(ref => {
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
    const { fields } = this.state;
    return (
      <form>
        <div className="card precios">
          <div className="card-body">
            <h5 className="card-title">Datos Principales</h5>
            <label>Nombre de la Empresa</label>
            <input
              onChange={this.handleChange}
              type="text"
              className="form-control"
              id="nombreNegocio"
              placeholder="Escribe el nombre de la empresa"
              required
            />
            <label>Poblacion</label>
            <input
              onChange={this.handleChange}
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
              <FileUpload listaImagenes={this.state.listaImagenes} />
            </div>
          </div>
        </div>
        <button
          type="submit"
          onClick={this.submitInformation}
          className="btn btn-success botonSuccess"
        >
          Enviar
        </button>
      </form>
    );
  }
}
export const Visitas = withAuthValue(VisitasClass);
// export const VisitasWithAuhtValue = withAuthValue(VisitasClass);
