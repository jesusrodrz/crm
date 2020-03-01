import React, { useState, useCallback } from 'react';
import moment from 'moment';
import { Analisis } from '../Components/Analisis';
import { useCollection, useCollectionByRef } from '../../hooks';
import { Spinner } from '../../Spinner/Container/Spinner';
import { useAuthValue } from '../../context/context';

const today = moment().valueOf();
export function Estadisticas() {
  const { user } = useAuthValue();
  const userType = user?.data?.type;
  const { email: emailUser, uid } = user;
  const userAmindId = userType === 'admin' ? user.uid : user?.data?.userAdmin;
  const [{ minDate, maxDate, userFilter }, setFilterState] = useState({
    minDate: '',
    maxDate: today,
    userFilter: false
  });
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
  const handleFilterChange = useCallback(({ target }) => {
    const { value, name, type } = target;
    const formatedValue =
      type === 'date' ? Number(moment(value).format('x')) : value;
    setFilterState(state => ({ ...state, [name]: formatedValue }));
  }, []);
  const visitasRef = [
    'visitas',
    {
      where: [
        ['userAdmin', '==', userAmindId],
        ['diaVisita', '>=', minDate || 0],
        ['diaVisita', '<=', maxDate],
        userType === 'admin' && userFilter && userFilter !== 'false'
          ? ['userId', '==', userFilter]
          : undefined,
        userType === 'vendedor' ? ['userId', '==', user.uid] : null
      ]
    }
  ];

  const [campos, loadingC] = useCollection('dynamicFields', [
    'userId',
    '==',
    userAmindId
  ]);
  const [visitas, loadingV] = useCollectionByRef(...visitasRef);
  const datosVisitas = campos.map(item => {
    const { id } = item;
    const data = visitas.reduce((currentData, visita) => {
      visita.fields.forEach(element => {
        if (id === element.id) {
          currentData = currentData.concat(element.values);
        }
      });
      return currentData;
    }, []);
    const newOption = item.options.map(opt => {
      let count = 0;
      data.forEach(el => {
        if (el === opt.key) {
          count++;
        }
      });
      return { ...opt, count };
    });
    return { ...item, options: newOption };
  });
  // YYY-MM-DD input date format
  const loading = loadingC || loadingV;
  const formatedMinDate = moment(minDate).format('YYYY-MM-DD');
  const formatedMaxDate = moment(maxDate).format('YYYY-MM-DD');
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="card precios">
            <div className="card-body">
              <h2 className="card-title">Filtar Visitas</h2>
              <div className="form-row">
                <div className="col-md-6 mb-3">
                  <div className="form-group row">
                    <label className="col-2 col-form-label">Desde</label>
                    <div className="col-10">
                      <input
                        name="minDate"
                        className="form-control"
                        type="date"
                        value={formatedMinDate}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-2 col-form-label">Hasta</label>
                    <div className="col-10">
                      <input
                        name="maxDate"
                        className="form-control"
                        type="date"
                        value={formatedMaxDate}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>
                </div>
                {userType === 'admin' && (
                  <div className="col-md-6 mb-3">
                    <div className="form-group row">
                      <label className="col-2 col-form-label">Usuario</label>
                      <div className="col-10">
                        <select
                          className="custom-select"
                          name="userFilter"
                          value={userFilter}
                          onChange={handleFilterChange}
                        >
                          <option value="false">Todos los usuarios</option>
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
              <div className="row">{loading && <Spinner />}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {datosVisitas.length > 0
          ? datosVisitas.map(dato => {
              const { id, title, options } = dato;
              const labels = [];
              const dataCount = [];
              options.forEach(({ name, count }) => {
                labels.push(name);
                dataCount.push(count);
              });
              const count = options.reduce((current, item) => {
                return current + item.count;
              }, 0);
              const chartData = {
                labels,
                datasets: [
                  {
                    data: dataCount,
                    backgroundColor: [
                      '#F0EDED',
                      '#36A2EB',
                      '#FFCE56',
                      '#605C5A',
                      '#EB0F13'
                    ],
                    hoverBackgroundColor: [
                      '#DFC5C5',
                      '#36A2EB',
                      '#FFCE56',
                      '#4B0607'
                    ]
                  }
                ]
              };
              return (
                <div className="col-12 col-md-6" key={id}>
                  <Analisis
                    tituloEstadistica={`Total de ${title}`}
                    dataEstadisitacaVisitas={chartData}
                    totales={`Total: ${count}`}
                  />
                </div>
              );
            })
          : !loading && (
              <div className="col-12">
                <div className="card precios">
                  <div className="card-body">
                    <h5 className="card-title">No hay visitas que mostrar</h5>
                  </div>
                </div>
              </div>
            )}
      </div>
    </>
  );
}

// const [visitas, loadingV] = useCollection('visitas', [
//   'userAdmin',
//   '==',
//   userAmindId
// ]);
