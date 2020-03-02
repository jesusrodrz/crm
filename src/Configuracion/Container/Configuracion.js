import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';
import ButtonClose from '../Components/ButtonClose';
import DynamicField from '../Components/DynamicField';
import { useAuth, useCollection } from '../../hooks';
import { Spinner } from '../../Spinner/Container/Spinner';
import DynamicFieldList from '../Components/DynamicFieldList';
import FichajesTypesList from '../Components/FichajesTypesList';

export default function Configuracion() {
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const [field, setField] = useState(null);
  const [fields, loadingFields] = useCollection('dynamicFields', [
    'userId',
    '==',
    user.uid
  ]);
  const [
    fichajeTypes,
    loadingFichajeTypes,
    setFichajesTypes
  ] = useCollection('fichajeTypes', ['userId', '==', user.uid]);
  const editField = useCallback(
    id => {
      const current = fields.find(item => item.id === id);
      setField(current);
      setModalOpen(true);
    },
    [fields]
  );
  const addField = useCallback(() => {
    setField(null);
    setModalOpen(true);
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
                    <DynamicFieldList fields={fields} edit={editField} />
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
                onClick={addField}
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
        <ButtonClose onClick={() => setModalOpen(!modalOpen)} />
        <DynamicField
          closeModal={() => setModalOpen(!modalOpen)}
          user={user}
          field={field}
        />
      </Modal>
    </>
  );
}
