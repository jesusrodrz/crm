import React from 'react';

export default function ClientForm({ handleChange, submitClient, form }) {
  return (
    <form className="m-4">
      <div className="card precios">
        <div className="card-body">
          <h5 className="card-title">Datos Principales</h5>
          <label>Nombre de la Empresa</label>
          <input
            onChange={handleChange}
            type="text"
            className="form-control"
            id="nombreNegocio"
            placeholder="Escribe el nombre de la empresa"
            value={form.nombreNegocio}
            required
          />
          <label>Poblacion</label>
          <input
            onChange={handleChange}
            type="text"
            value={form.poblacion}
            className="form-control"
            id="poblacion"
            placeholder="Poblacion"
          />
          <label>Codigo Postal</label>
          <input
            onChange={handleChange}
            type="zipCode"
            className="form-control"
            id="codigoPostal"
            placeholder="46000"
            value={form.codigoPostal}
          />
        </div>
      </div>
      <div className="card precios">
        <div className="card-body">
          <h5 className="card-title">Datos del Posible Cliente</h5>
          <div className="form-group">
            <label>Nombre del Gerente</label>
            <input
              onChange={handleChange}
              type="text"
              className="form-control"
              id="nombreGerente"
              placeholder="Nombre Gerente"
              value={form.nombreGerente}
            />
          </div>
          <div className="form-group">
            <label>Télefono de Contacto</label>
            <input
              onChange={handleChange}
              type="text"
              className="form-control"
              id="telefonoGerente"
              placeholder="Teléfono"
              value={form.telefonoGerente}
            />
          </div>
          <div className="form-group">
            <label>Correo Eléctrónico</label>
            <input
              onChange={handleChange}
              type="text"
              className="form-control"
              id="emailGerente"
              placeholder="gerente@gerente.com"
              value={form.emailGerente}
            />
          </div>
        </div>
      </div>
      <div className="card precios">
        <div className="card-body">
          <h5 className="card-title">Datos de Conatacto</h5>
          <div className="form-group">
            <label>Nombre del Gerente</label>
            <input
              onChange={handleChange}
              type="text"
              className="form-control"
              id="nombreContacto"
              placeholder="Nombre de contacto"
              value={form.nombreContacto}
            />
          </div>
          <div className="form-group">
            <label>Télefono de Contacto</label>
            <input
              onChange={handleChange}
              type="text"
              className="form-control"
              id="telefonoContacto"
              placeholder="Teléfono"
              value={form.telefonoContacto}
            />
          </div>
          <div className="form-group">
            <label>Correo Eléctrónico</label>
            <input
              onChange={handleChange}
              type="text"
              className="form-control"
              id="emailContacto"
              placeholder="Email contacto"
              value={form.emailContacto}
            />
          </div>
        </div>
      </div>
      <div className="card precios">
        <div className="card-body">
          <div className="form-group">
            <label>Comentarios</label>
            <textarea
              onChange={handleChange}
              className="form-control"
              id="comentarios"
              rows="3"
              value={form.comentarios}
            />
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={submitClient}
        className="btn btn-success botonSuccess"
      >
        Guardar
      </button>
    </form>
  );
}
