import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';
import ButtonClose from '../Components/ButtonClose';
import DynamicField from '../Components/DynamicField';
import { useCollection, useCollectionCallback } from '../../hooks';
import { Spinner } from '../../Spinner/Container/Spinner';
import DynamicFieldList from '../Components/DynamicFieldList';
import FichajesTypesList from '../Components/FichajesTypesList';
import { useAuthValue } from '../../context/context';
import { COLLECTIONS } from '../../Constants/Constants';

export default function Configuracion() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(COLLECTIONS.dynamicFields);
  const { user } = useAuthValue();
  const [field, setField] = useState(null);
  const dynamicFieldsQuery = useCallback(
    query =>
      query.where('userId', '==', user.uid).where('available', '==', true),
    [user.uid]
  );

  const [fields, loadingFields] = useCollectionCallback(
    COLLECTIONS.dynamicFields,
    dynamicFieldsQuery
  );
  const [fieldsAnalisis, loadingFieldsAnalisis] = useCollectionCallback(
    COLLECTIONS.dynamicFieldsAnalisis,
    dynamicFieldsQuery
  );

  const [
    fichajeTypes,
    loadingFichajeTypes,
    setFichajesTypes
  ] = useCollectionCallback('fichajeTypes', dynamicFieldsQuery);
  // const
  const editField = useCallback(
    (id, type) => {
      const list =
        type === COLLECTIONS.dynamicFieldsAnalisis ? fieldsAnalisis : fields;
      const current = list.find(item => item.id === id);
      setSelectedType(type);
      setField(current);
      setModalOpen(true);
    },
    [fields, fieldsAnalisis]
  );
  const addField = useCallback(type => {
    setSelectedType(type);
    setField(null);
    setModalOpen(true);
  }, []);
  const close = useCallback(() => {
    setField(null);
    setModalOpen(false);
    setSelectedType('');
  }, []);
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="card precios">
            <div className="card-body">
              <h3>Configura las visitas</h3>
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Titulo</th>
                    <th scope="col">Opciones</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {!loadingFields ? (
                    <DynamicFieldList
                      fields={fields}
                      edit={editField}
                      type={COLLECTIONS.dynamicFields}
                    />
                  ) : (
                    <tr>
                      <td colSpan="4">
                        <div className="vendedores-cangardo">
                          Cargando campos...
                          <Spinner />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addField(COLLECTIONS.dynamicFields)}
              >
                Agregar campo
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card precios">
            <div className="card-body">
              <h3>Configura los analisis</h3>
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Titulo</th>
                    <th scope="col">Opciones</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {!loadingFieldsAnalisis ? (
                    <DynamicFieldList
                      fields={fieldsAnalisis}
                      edit={editField}
                      type={COLLECTIONS.dynamicFieldsAnalisis}
                    />
                  ) : (
                    <tr>
                      <td colSpan="4">
                        <div className="vendedores-cangardo">
                          Cargando campos...
                          <Spinner />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addField(COLLECTIONS.dynamicFieldsAnalisis)}
              >
                Agregar campo
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card precios">
            <div className="card-body">
              <h3>Configura los tipos de fichaje</h3>
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {!loadingFichajeTypes ? (
                    <FichajesTypesList
                      data={fichajeTypes}
                      setFichajes={setFichajesTypes}
                    />
                  ) : (
                    <tr>
                      <td colSpan="4">
                        <div className="vendedores-cangardo">
                          Cargando...
                          <Spinner />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modalOpen} appElement={document.getElementById('root')}>
        <ButtonClose onClick={close} />
        <DynamicField
          closeModal={close}
          user={user}
          field={field}
          type={selectedType}
        />
      </Modal>
    </>
  );
}
