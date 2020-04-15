import React, { useCallback, useState } from 'react';
import swal from 'sweetalert';
import moment from 'moment';
import Modal from 'react-modal';
import FieldInput from '../Visitas/Components/FieldInput';
import { useAuthValue } from '../context/context';
import { useCollection, useCollectionCallback } from '../hooks';
import { USERS_TYPES, COLLECTIONS } from '../Constants/Constants';
import {
  orderFields,
  dynamicFieldsValues,
  validadeDynamicFields,
  formatDynamicFieldValues
} from '../helpers/helpers';
import { db } from '../firebase/firebase';
import ButtonClose from '../Configuracion/Components/ButtonClose';
import DynamicFiledsView from '../Configuracion/Components/DynamicFiledsView';

const Loader = () => (
  <div
    className="spinner-grow"
    style={{ width: '3rem', height: '3rem' }}
    role="status"
  >
    <span className="sr-only">Loading...</span>
  </div>
);
export default function Analizar() {
  const [fieldValues, setFieldValues] = useState([]);
  const [{ selectedFields, open }, setViewData] = useState({
    open: false,
    selectedFields: {}
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [userFilter, setUserFilter] = useState('');
  const { user } = useAuthValue();
  const userType = user?.data?.type;
  const { email: emailUser, uid } = user;
  const userId =
    USERS_TYPES.admin === userType ? user.uid : user.data.userAdmin;
  const userAmindId = userType === 'admin' ? user.uid : user?.data?.userAdmin;
  const filedsQuery = useCallback(
    query => {
      return query.where('userId', '==', userId).where('available', '==', true);
    },
    [userId]
  );
  const [fields, loadingFields] = useCollectionCallback(
    COLLECTIONS.dynamicFieldsAnalisis,
    filedsQuery
  );
  const newFileds = orderFields(fields);
  const handleChangeDynamicFields = useCallback((e, valueData) => {
    setFieldValues(state => dynamicFieldsValues(state, valueData));
  }, []);
  const [users] = useCollection('usersData', [
    'userAdmin',
    '==',
    userType === 'admin' && userAmindId
    // si el usuario no es admin retorna undefined y useColledtion no buscara los usuarios
  ]);
  const usersNew = [
    { name: 'tu usuario', email: emailUser, id: uid },
    ...users
  ];
  const submitData = useCallback(() => {
    const isValid = validadeDynamicFields(fields, fieldValues);
    if (!isValid) {
      swal('Por favor rellena los campos de la visita que son requeridos');
      return;
    }
    const {
      uid: userUid,
      data: { type, userAdmin: adminId }
    } = user;
    const userAdmin = type === USERS_TYPES.admin ? userUid : adminId;
    const formatValues = formatDynamicFieldValues(fieldValues);
    setLoadingSubmit(true);
    db.collection('analizar')
      .add({
        fields: formatValues,
        userAdmin,
        userId: userUid,
        diaVisita: moment().valueOf()
      })
      .then(() => {
        swal('Se ha guardado correctamente');
        setLoadingSubmit(false);
        // setFieldValues([]);
      })
      .catch(() => {
        swal('No se pudo guardar');
        setLoadingSubmit(false);
      });
  }, [fields, fieldValues, user]);
  const handleFilterChange = useCallback(({ target }) => {
    const { value } = target;
    setUserFilter(value);
  }, []);

  const analisisQuery = useCallback(
    query => {
      const newQuery = query.where('userAdmin', '==', userAmindId);

      if (userFilter !== '') {
        return query.where('userId', '==', userFilter);
      }
      if (userType !== USERS_TYPES.admin) {
        return query.where('userId', '==', uid);
      }
      return newQuery;
    },
    [userFilter, userAmindId, uid]
  );
  const [data, log] = useCollectionCallback('analizar', analisisQuery);
  const deleteElemet = useCallback(id => {
    db.collection('analizar')
      .doc(id)
      .delete()
      .then(() => {
        swal('se ha borrado');
      });
  }, []);
  const setViewField = useCallback(fieldData => {
    setViewData({
      open: true,
      selectedFields: fieldData
    });
  }, []);
  const closeModal = useCallback(() => {
    setViewData({
      open: false,
      selectedFields: []
    });
  }, []);

  console.log(fields, fieldValues);
  return (
    <>
      <div className="card precios">
        <div className="card-body">
          <h5 className="card-title">Analizar</h5>
          {!loadingFields ? (
            <>
              <div className="mb-3">
                {newFileds.map(item => (
                  <FieldInput
                    key={item.id}
                    data={item}
                    handleOnChange={handleChangeDynamicFields}
                  />
                ))}
              </div>
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={submitData}
                disabled={loadingSubmit}
              >
                {!loadingSubmit ? (
                  'Annalizar'
                ) : (
                  <>
                    <span>Guardando...</span>
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                )}
              </button>
            </>
          ) : (
            <Loader />
          )}
        </div>
      </div>
      <div className="card precios">
        <div className="card-body">
          <h5 className="card-title">Datos</h5>
          <div className="row">
            {userType === 'admin' && (
              <div className="col-md-6">
                <div className="form-group row">
                  <label className="col-2 col-form-label">Usuario</label>
                  <div className="col-10">
                    <select
                      className="custom-select"
                      name="userFilter"
                      onChange={handleFilterChange}
                      value={userFilter}
                    >
                      <option value="">Todos los usuarios</option>
                      {usersNew.map(({ name, id, email }) => (
                        <option key={id} value={id}>
                          {name} - {email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-12">
              {log ? (
                <Loader />
              ) : (
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">aciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, i) => (
                      <tr key={item.id}>
                        <td>{i + 1}</td>
                        <td>
                          {moment(Number(item.diaVisita)).format(
                            'DD/MM/YYYY HH:mm'
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-info btn-sm mr-3"
                            type="button"
                            onClick={() => setViewField(item.fields)}
                          >
                            ver
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            type="button"
                            onClick={() => deleteElemet(item.id)}
                          >
                            x
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={open} appElement={document.getElementById('root')}>
        <ButtonClose onClick={closeModal} />
        <DynamicFiledsView fields={fields} selectedFields={selectedFields} />
      </Modal>
    </>
  );
}
