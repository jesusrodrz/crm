import React, { useCallback, useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaEllipsisH } from 'react-icons/fa';
import { MdPictureAsPdf } from 'react-icons/md';
import { useAuthValue } from '../../context/context';
import TrabajosPdf from './TrabajosPdf';

const mapUrl = fichaje => {
  const { lugarEmpezado, lugarTerminado } = fichaje;
  // eslint-disable-next-line max-len
  const url = `https://www.google.com/maps/dir/?api=1&origin=${lugarEmpezado.latitude},${lugarEmpezado.longitude}&destination=${lugarTerminado.latitude},${lugarTerminado.longitude}`;
  return url;
};

export const VisualizacionTrabajos = ({
  listaTrabajoSeleccionado,
  tiempoTotalDia,
  open,
  setTrabajo,
  deleteT
}) => {
  const { user } = useAuthValue();
  const isAdmin = user?.data?.type === 'admin';
  const [printing, setPrinting] = useState(false);
  const openModal = useCallback(
    i => {
      open(true);
      setTrabajo({ ...listaTrabajoSeleccionado[i] });
    },
    [open, listaTrabajoSeleccionado, setTrabajo]
  );
  const print = useCallback(() => {
    setPrinting(true);
  }, []);
  // const

  useEffect(() => {
    if (printing) {
      window.print();
      setPrinting(false);
    }
  }, [printing]);

  return printing ? (
    <TrabajosPdf data={listaTrabajoSeleccionado} tiempo={tiempoTotalDia} />
  ) : (
    // <div />
    <div className="card visualizacion">
      <div className="card-header d-flex align-items-center">
        <h3 className="mr-5">Trabajos</h3>
        <button
          type="button"
          className="btn btn-sm btn-primary no-print"
          onClick={print}
        >
          <MdPictureAsPdf />
        </button>
      </div>
      <div className="card-body">
        <table className="table table-sm responsive">
          <thead className="thead-light">
            <tr>
              <th scope="col">Dia</th>
              <th scope="col">Actividad</th>
              <th scope="col">cliente</th>
              <th scope="col">Hora de Comienzo</th>
              <th scope="col">Tiempo Total</th>
              <th scope="col">Hora de Finalizacion</th>
              <th scope="col">aciones</th>
            </tr>
          </thead>
          <tbody>
            {listaTrabajoSeleccionado.map((fichaje, i) => {
              return (
                <tr key={fichaje.id}>
                  <th scope="row">{fichaje.dia}</th>
                  <td>{fichaje.actividad}</td>
                  <td>
                    {fichaje.project !== ''
                      ? `${fichaje.clienteNombre} (${fichaje.project})`
                      : fichaje.clienteNombre}
                  </td>
                  <td>{fichaje.comienzoNum}</td>
                  <td>{fichaje.duracionNum}</td>
                  <td>{fichaje.paradoNum}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-info"
                        id="dropdown-basic"
                        size="sm"
                      >
                        <FaEllipsisH />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => deleteT(fichaje.id)}>
                          Borrar
                        </Dropdown.Item>
                        {isAdmin && (
                          <Dropdown.Item onClick={() => openModal(i)}>
                            Editar
                          </Dropdown.Item>
                        )}

                        <Dropdown.Divider />
                        <Dropdown.Item href={mapUrl(fichaje)} target="_blank">
                          ver mapa
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              );
            })}
            <tr>
              <th scope="row">Totales</th>
              <td />
              <td />
              <td>{tiempoTotalDia}</td>
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
