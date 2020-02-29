import React, { useCallback, useState, useEffect } from 'react';
import moment from 'moment';
import { db } from '../../firebase/firebase';
import { VisualizacionTrabajos } from '../Components/VisualizacionTrabajos';
import { useAuthValue } from '../../context/context';
import { Spinner } from '../../Spinner/Container/Spinner';

const today = () => moment(moment().format('YYYY-MM-DD')).valueOf();
const ducationFormat = duration => {
  const time = moment.duration(duration);
  return `${time.hours()} horas y ${time.minutes()} minutos.`;
};
export function TrabajoRealizado() {
  const {
    user: { uid }
  } = useAuthValue();
  const [listaTrabajoSeleccionado, setListaTrabajoSeleccionado] = useState([]);
  const [loading, setloading] = useState(false);
  // const
  const [{ fechaFin, fechaInicio }, setFilter] = useState({
    fechaInicio: '',
    fechaFin: ''
  });
  const handleChange = useCallback(({ target }) => {
    const { value, name } = target;
    const valueFormated = moment(value).valueOf();
    setFilter(state => ({ ...state, [name]: valueFormated }));
  }, []);
  const handleVerInofrmacion = useCallback(
    e => {
      if (e) e.preventDefault();
      const diaIncio = fechaInicio === '' ? 0 : fechaInicio;
      const diaFin = fechaFin === '' ? today() : fechaInicio;
      setloading(true);
      db.collection('fichajes')
        .where('userId', '==', uid)
        .where('dia', '>=', diaIncio)
        .where('dia', '<=', diaFin)
        .get()
        .then(value => {
          setloading(false);
          const fichajes = value.docs.map(item => {
            const data = { ...item.data(), id: item.id };
            const comienzo = moment(data.comienzo).format('HH:mm');
            const parado = moment(data.parado).format('HH:mm');
            const duracion = ducationFormat(data.duracion);
            const dia = moment(data.dia).format('DD/MM/YYYY');
            return {
              ...data,
              comienzo,
              parado,
              dia,
              duracion,
              duracionNum: data.duracion
            };
          });
          setListaTrabajoSeleccionado(fichajes);
        });
    },
    [fechaInicio, fechaFin, uid]
  );
  useEffect(() => {
    handleVerInofrmacion();
  }, [handleVerInofrmacion]);
  const formatedFin = moment(fechaFin).format('YYYY-MM-DD');
  const formatedInicio = moment(fechaInicio).format('YYYY-MM-DD');
  const totalTiempo = listaTrabajoSeleccionado.reduce(
    (num, item) => num + item.duracionNum,
    0
  );
  // console.log(totalTiempo);
  const tiempoTotalDia = ducationFormat(totalTiempo);
  return (
    <>
      <div className="card visualizacion">
        <div className="card-body">
          <h5 className="card-title">Escoje un rango de fechas</h5>
          <div className="row">
            <div className="col-12 col-md-6">
              <form className="form-inline">
                <div className="form-group mr-3">
                  <input
                    type="date"
                    onChange={handleChange}
                    className="form-control"
                    name="fechaInicio"
                    value={formatedInicio}
                  />
                </div>
                <div className="form-group mr-3">
                  <input
                    type="date"
                    onChange={handleChange}
                    className="form-control"
                    name="fechaFin"
                    value={formatedFin}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerInofrmacion}
                  className="btn btn-primary"
                >
                  Enviar
                </button>
              </form>
            </div>
            <div className="col-12 col-md-6" />
          </div>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <VisualizacionTrabajos
          listaTrabajoSeleccionado={listaTrabajoSeleccionado}
          tiempoTotalDia={tiempoTotalDia}
        />
      )}
    </>
  );
}
