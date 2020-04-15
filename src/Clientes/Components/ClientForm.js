import React, { useCallback, useState } from 'react';

export default function ClientForm({
  handleChange,
  submitClient,
  form,
  setForm
}) {
  const { projects, nombreNegocio, poblacion, codigoPostal } = form;
  const [project, setProject] = useState('');
  const handleProject = useCallback(({ target }) => {
    const { value } = target;
    setProject(value);
  }, []);
  const addProject = useCallback(() => {
    setProject(value => {
      setForm(state => {
        const list = state.projects || [];
        list.push(value);
        return { ...state, projects: list };
      });
      return '';
    });
  }, [setForm]);
  const deleteProject = useCallback(
    index => {
      setForm(state => {
        const list = state.projects || [];
        const filteredList = list.filter((item, i) => index !== i);
        return { ...state, projects: filteredList };
      });
    },
    [setForm]
  );
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
            value={nombreNegocio}
            required
          />
          <label>Poblacion</label>
          <input
            onChange={handleChange}
            type="text"
            value={poblacion}
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
            value={codigoPostal}
          />
        </div>
      </div>
      <div className="card precios">
        <div className="card-body">
          <h5 className="card-title">Datos Cliente</h5>
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
          <h5 className="card-title">Datos de Contacto</h5>
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
          <h5 className="card-title">Proyectos</h5>
          <ul>
            {projects &&
              projects.map((item, i) => {
                return (
                  <li>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">{item}</div>
                      </div>
                      <div className="col-6">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm ml-2"
                          onClick={() => deleteProject(i)}
                        >
                          <span>×</span>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            <li>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Proyecto"
                      onChange={handleProject}
                      value={project}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm ml-2"
                    onClick={addProject}
                  >
                    <span>+</span>
                  </button>
                </div>
              </div>
            </li>
          </ul>
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
