import React, { useCallback, useState, useEffect } from 'react';
import moment from 'moment';
import swal from 'sweetalert';
import Modal from 'react-modal';
import { db } from '../../firebase/firebase';
import { VisualizacionTrabajos } from '../Components/VisualizacionTrabajos';
import { useAuthValue } from '../../context/context';
import { Spinner } from '../../Spinner/Container/Spinner';
import ButtonClose from '../../Configuracion/Components/ButtonClose';
import { useCollection, useCollectionCallback } from '../../hooks';
import {
  getOptionsObj,
  getTimesObj,
  getTimesFormated,
  getTimesMinutes
} from '../../helpers/helpers';
import { COLLECTIONS } from '../../Constants/Constants';
import { VisualizacionFichaje } from '../../Fichar/Components/VisualizacionFichaje';
import { EstadisticaTrabajoDia } from '../../Fichar/Components/EstadisticaTrabajoDia';

const today = () => moment(moment().format('YYYY-MM-DD')).valueOf();
const ducationFormat = duration => {
  const time = moment.duration(duration);
  return `${time.hours()} horas y ${time.minutes()} minutos.`;
};
export function TrabajoRealizado() {
  const {
    user: {
      uid,
      email,
      data: { type, userAdmin }
    }
  } = useAuthValue();

  const [listaTrabajoSeleccionado, setListaTrabajoSeleccionado] = useState([]);
  const [loading, setloading] = useState(false);
  const [userFilter, setUserFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [trabajo, setTrabajo] = useState({});

  const [{ fechaFin, fechaInicio }, setFilter] = useState({
    fechaInicio: '',
    fechaFin: ''
  });
  const [{ clientFilter, project }, setClientFilter] = useState({
    clientFilter: '',
    project: ''
  });
  // console.log(fechaFin, fechaInicio);
  const handleChange = useCallback(({ target }) => {
    const { value, name } = target;

    const valueFormated = moment(value).valueOf();

    setFilter(state => ({ ...state, [name]: valueFormated }));
  }, []);

  const handleEditChange = useCallback(({ target }) => {
    const { value, name } = target;
    const valueFormated = moment(value).valueOf();
    setTrabajo(state => ({ ...state, [name]: valueFormated }));
  }, []);
  const deleteTrabajo = useCallback(async idTrabajo => {
    db.collection('fichajes')
      .doc(idTrabajo)
      .delete()
      .then(() => {
        swal('se borrado correctamente');
      });
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const userSanpshot = await db
        .collection('usersData')
        .where('userAdmin', '==', uid)
        .get();

      const dataUser = userSanpshot.docs.map(item => ({
        ...item.data(),
        id: item.id
      }));
      const currentUser = {
        name: 'Tu usuario',
        email,
        id: uid
      };
      setUsers([currentUser, ...dataUser]);
    } catch (error) {
      swal('Error', `Error; ${JSON.stringify(error)}`, 'error');
    }
  }, [uid, email]);

  const filterHandler = useCallback(({ target }) => {
    const { value } = target;
    setUserFilter(value);
  }, []);
  const hanldeClientFilter = useCallback(({ target }) => {
    const { value, name } = target;
    setClientFilter(state => ({ ...state, [name]: value }));
  }, []);
  useEffect(() => {
    const diaIncio = fechaInicio === '' ? 0 : fechaInicio;
    const diaFin = fechaFin === '' ? today() : fechaFin;
    setloading(true);
    let query;
    if (type !== 'admin') {
      query = db
        .collection('fichajes')
        .where('userId', '==', uid)
        .where('estado', '==', 'Terminado')
        .where('dia', '>=', diaIncio)
        .where('dia', '<=', diaFin);
    } else if (userFilter === '') {
      query = db
        .collection('fichajes')
        .where('userAdmin', '==', uid)
        .where('estado', '==', 'Terminado')
        .where('dia', '>=', diaIncio)
        .where('dia', '<=', diaFin);
    } else {
      query = db
        .collection('fichajes')
        .where('userId', '==', userFilter)
        .where('estado', '==', 'Terminado')
        .where('dia', '>=', diaIncio)
        .where('dia', '<=', diaFin);
    }
    const unsubscribe = query.onSnapshot(snapshot => {
      setloading(false);
      const fichajes = snapshot.docs.map(item => {
        const data = { ...item.data(), id: item.id };
        const comienzo = moment(data.comienzo).format('HH:mm');
        const parado = moment(data.parado).format('HH:mm');
        const duracion = ducationFormat(data.duracion);
        const dia = moment(data.dia).format('DD/MM/YYYY');
        return {
          ...data,
          comienzo: data.comienzo,
          comienzoNum: comienzo,
          parado: data.parado,
          paradoNum: parado,
          dia,
          duracion: data.duracion,
          duracionNum: duracion
        };
      });
      setListaTrabajoSeleccionado(fichajes);
    });
    fetchUsers();
    return () => unsubscribe();
  }, [fechaInicio, fechaFin, uid, type, userFilter, fetchUsers]);

  const formatedFin = moment(fechaFin).format('YYYY-MM-DD');
  const formatedInicio = moment(fechaInicio).format('YYYY-MM-DD');
  const formatedEditInicio = moment(trabajo.comienzoNum).format(
    'YYYY-MM-DDTHH:mm'
  );

  const formatedEditFin = moment(trabajo.paradoNum).format('YYYY-MM-DDTHH:mm');

  const totalTiempo = listaTrabajoSeleccionado.reduce(
    (num, item) => num + item.duracion,
    0
  );

  const tiempoTotalDia = ducationFormat(totalTiempo);

  const saveEditTrabajo = useCallback(async () => {
    const { id, paradoNum, comienzoNum } = trabajo;

    const trab = {
      parado: paradoNum,
      comienzo: comienzoNum,
      duracion: paradoNum - comienzoNum
    };
    setTrabajo({});
    setModalOpen(false);
    await db
      .collection('fichajes')
      .doc(id)
      .set(trab, { merge: true });
    swal('se guardado correctamente');
  }, [trabajo]);

  const userId = type === 'admin' ? uid : userAdmin;
  const [clientes, loadingClientes] = useCollection('clientes', [
    'userAdmin',
    '==',
    userId
  ]);
  const projects = clientes.find(item => item.id === clientFilter)?.projects;
  const listaTrabajo = listaTrabajoSeleccionado
    .filter(item => item.cliente === clientFilter || clientFilter === '')
    .filter(item => item.project === project || project === '');
  const [fichajesTypes, loadingFichajes] = useCollection(
    COLLECTIONS.fichajeTypes,
    [
      'userId',
      '==',
      userId
      // si el usuario no es admin retorna undefined y useColledtion no buscara los usuarios
    ]
  );
  const typesNames = getOptionsObj(fichajesTypes, 'name');
  const typesClientes = getOptionsObj(clientes, 'nombreNegocio');
  const typesProjects = getOptionsObj(
    projects?.map(i => ({ project: i })),
    'project'
  );
  // const typesProjects = projects?.reduce(
  //   (prev, item) => ({ ...prev, [item]: 0 }),
  //   { total: 0 }
  // );
  console.log(typesNames, typesClientes, typesProjects);
  const tiempoTotales = getTimesObj(
    listaTrabajoSeleccionado,
    typesNames,
    'actividad'
  );

  const tiempoTotalesClientes = getTimesObj(
    listaTrabajoSeleccionado,
    typesClientes,
    'clienteNombre'
  );
  const tiempoTotalesProject = getTimesObj(
    listaTrabajo,
    typesProjects,
    'project'
  );
  const tiempoTotalesMinutos = getTimesMinutes(tiempoTotales);
  const tiempoTotalesMinutosClientes = getTimesMinutes(tiempoTotalesClientes);
  const tiempoTotalesMinutosProjects = getTimesMinutes(tiempoTotalesProject);
  const tiempoTotalesFormated = getTimesFormated(tiempoTotales);
  const tiempoTotalesFormatedClientes = getTimesFormated(tiempoTotalesClientes);
  const tiempoTotalesFormatedProjects = getTimesFormated(tiempoTotalesProject);

  console.log('projects: ', tiempoTotalesProject);

  return (
    <>
      <Modal isOpen={modalOpen} appElement={document.getElementById('root')}>
        <ButtonClose onClick={() => setModalOpen(!modalOpen)} />
        <div className="row">
          <div className="col-10">
            <div className="row">
              <div className="col-6">
                <p>Inicio</p>
                <div className="form-group mr-3">
                  <input
                    type="datetime-local"
                    onChange={handleEditChange}
                    className="form-control"
                    name="comienzoNum"
                    value={formatedEditInicio}
                  />
                  {/* <small>Formato: YYYY/MM/DD hh:mm</small> */}
                </div>
              </div>
              <div className="col-6">
                <p>Finalizacion</p>
                <div className="form-group mr-3">
                  <input
                    type="datetime-local"
                    onChange={handleEditChange}
                    className="form-control"
                    name="paradoNum"
                    value={formatedEditFin}
                  />
                  {/* <small>Formato: YYYY/MM/DD hh:mm</small> */}
                </div>
              </div>
              <div className="col-12">
                <button
                  type="button"
                  onClick={saveEditTrabajo}
                  className="btn btn-primary"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <div className="card visualizacion">
        <div className="card-body">
          <h5 className="card-title">Escoje un rango de fechas</h5>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <input
                      type="date"
                      onChange={handleChange}
                      className="form-control"
                      name="fechaInicio"
                      value={formatedInicio}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <input
                      type="date"
                      onChange={handleChange}
                      className="form-control"
                      name="fechaFin"
                      value={formatedFin}
                    />
                  </div>
                </div>
              </div>
            </div>
            {type === 'admin' && (
              <div className="col-12 col-md-6">
                <select
                  className="custom-select"
                  name="userFilter"
                  onChange={filterHandler}
                  value={userFilter}
                >
                  <option value="">Todos los usuarios</option>
                  {users.map(({ name, id, email: optionEmail }) => (
                    <option key={id} value={id}>
                      {name} - {optionEmail}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <select
                className="custom-select"
                name="clientFilter"
                onChange={hanldeClientFilter}
                value={clientFilter}
              >
                <option value="">Todos los clientes</option>
                {clientes.map(({ nombreNegocio, id }) => (
                  <option key={id} value={id}>
                    {nombreNegocio}
                  </option>
                ))}
              </select>
            </div>
            {projects && (
              <div className="col-12 col-md-6">
                <select
                  className="custom-select"
                  name="project"
                  onChange={hanldeClientFilter}
                  value={project}
                >
                  <option value="">projectos</option>
                  {projects.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <VisualizacionTrabajos
            listaTrabajoSeleccionado={listaTrabajo}
            tiempoTotalDia={tiempoTotalDia}
            open={setModalOpen}
            setTrabajo={setTrabajo}
            deleteT={deleteTrabajo}
          />
          {!loadingClientes && !loadingFichajes && (
            <>
              <div>
                <EstadisticaTrabajoDia
                  mainTitle="Estadisticas por tipo"
                  tiempoTotalesFormated={tiempoTotalesFormated}
                  tiempoTotalesMinutos={tiempoTotalesMinutos}
                  title="Fichajes por tipos"
                />
                <EstadisticaTrabajoDia
                  mainTitle="Estadisticas por cliente"
                  tiempoTotalesFormated={tiempoTotalesFormatedClientes}
                  tiempoTotalesMinutos={tiempoTotalesMinutosClientes}
                  title="Fichajes por cliente"
                />
                {projects && (
                  <EstadisticaTrabajoDia
                    mainTitle="Estadisticas por projecto"
                    tiempoTotalesFormated={tiempoTotalesFormatedProjects}
                    tiempoTotalesMinutos={tiempoTotalesMinutosProjects}
                    title="Fichajes por proyecto"
                  />
                )}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
