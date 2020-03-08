/* eslint-disable no-restricted-globals */
import React, { Fragment } from 'react';
import './visita.css';

export const Visita = props => {
  const {
    nombreNegocio,
    handleChange,
    nombreGerente,
    emailGerente,
    telefonoGerente,
    modificar,
    remove,
    handleListaVisitas,
    proxAccion,
    poblacion,
    codigoPostal,
    comentarios,
    tieneInteres,
    listaImagenes,
    fields,
    visitaFields,
    borrando,
    loading
  } = props;
  const fieldToShow = fields.map(item => {
    const fieldInVisita = visitaFields.find(itemOp => itemOp.id === item.id);
    const newOpctions = item.options.map(opt => {
      const option = { ...opt };
      if (fieldInVisita) {
        if (fieldInVisita.values.includes(option.key)) {
          option.select = true;
        }
      }
      return option;
    });
    return { ...item, options: newOpctions };
  });
  return (
    <div className="card activity card-visista">
      <div className="row">
        {listaImagenes === ''
          ? null
          : listaImagenes.map((image, i) => {
              return (
                <div className="col-12 col-md-6 precios" key={i}>
                  <img
                    src={image.direccion}
                    alt={image.nombreTarjeta}
                    className="img-thumbnail"
                  />
                </div>
              );
            })}
      </div>
      <div className="card-body">
        <h5 className="card-title">{nombreNegocio}</h5>
        <div className="row">
          <div className="col-12 col-md-6">
            <p className="card-text">
              <strong>Nombre Gerente:</strong>{' '}
              <input
                onChange={handleChange}
                type="text"
                className="form-control form-control-sm form-control-inline"
                id="nombreGerente"
                value={nombreGerente}
                // rows="3"
              />
            </p>
            <p className="card-text">
              <strong>Email:</strong>{' '}
              <input
                onChange={handleChange}
                type="text"
                className="form-control form-control-sm form-control-inline"
                id="emailGerente"
                value={emailGerente}
                // rows="3"
              />
            </p>
            <p className="card-text">
              <strong>Teléfono:</strong>{' '}
              <input
                onChange={handleChange}
                type="text"
                className="form-control form-control-sm form-control-inline"
                id="telefonoGerente"
                value={telefonoGerente}
                // rows="3"
              />
            </p>
            <p className="card-text">
              <strong>Poblacion:</strong>{' '}
              <input
                onChange={handleChange}
                type="text"
                className="form-control form-control-sm form-control-inline"
                id="poblacion"
                value={poblacion}
                // rows="3"
              />
            </p>
            <p className="card-text">
              <strong>Codigo Postal:</strong>{' '}
              <input
                onChange={handleChange}
                type="text"
                className="form-control form-control-sm form-control-inline"
                id="codigoPostal"
                value={codigoPostal}
                // rows="3"
              />
            </p>
          </div>
          <div className="col-12 col-md-6">
            <p>
              <strong>Acción Última:</strong>
            </p>
            <p>fecha: {proxAccion}</p>
            <p>Acción: {comentarios}</p>
            {fieldToShow.map(({ id, title, options }) => (
              <Fragment key={id}>
                <p className="card-text option">
                  <strong>{title}:</strong>
                </p>
                <ul>
                  {options.map(({ key, name, select }) =>
                    select ? <li key={key}>{name}</li> : null
                  )}
                </ul>
              </Fragment>
            ))}
          </div>
        </div>
        <br />
        <br />
        <label>Próxima Acción</label>
        <input
          onChange={handleChange}
          type="date"
          className="form-control"
          id="proxAccion"
          rows="3"
        />
        <div className="form-group">
          <label>Comentarios</label>
          <textarea
            onChange={handleChange}
            className="form-control"
            defaultValue={comentarios}
            id="comentarios"
            rows="3"
          />
        </div>
        <div className="form-group">
          <label>Posibilidades reales de contratación</label>
          <select
            onChange={handleChange}
            className="form-control"
            id="probVenta"
          >
            <option>Muy alta</option>
            <option>Alta</option>
            <option>Normal</option>
            <option>Baja</option>
          </select>
        </div>
        <label>¿Tienen Interés? Actualmente: {tieneInteres}</label>
        <select
          onChange={handleChange}
          className="form-control"
          id="tieneInteres"
        >
          <option> </option>
          <option>Si</option>
          <option>No</option>
          <option>No esta la persona que decide</option>
          <option>No, pero quiere Info</option>
        </select>
        <div className="form-check">
          <input
            onChange={handleChange}
            className="form-check-input"
            type="checkbox"
            id="emailEnviado"
            value="Si"
          />
          <label className="form-check-label"> Email ya enviado </label>
        </div>
        <div onChange={handleChange} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="emailEnviado"
            value="No"
          />
          <label className="form-check-label"> No, hay que enviarlo</label>
        </div>
        <div className="enviarInfo">
          <p>
            <button
              type="button"
              onClick={handleListaVisitas}
              className="btn btn-light btn-back-visita"
            >
              Volver
            </button>
          </p>
          <button type="button" onClick={modificar} className="btn btn-success">
            {loading ? (
              <div>
                Modificando{' '}
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              'Modificar'
            )}
          </button>
          <button
            type="button"
            onClick={remove}
            className="btn btn-danger buttonBack"
          >
            {borrando ? (
              <div>
                Borrando...{' '}
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              'Borrar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
