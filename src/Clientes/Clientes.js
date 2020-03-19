import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';
import swal from 'sweetalert';
import ButtonClose from '../Configuracion/Components/ButtonClose';
import { db } from '../firebase/firebase';
import { useCollectionCallback } from '../hooks';
import { useAuthValue } from '../context/context';
import ClientsList from './Components/ClientsList';
import ClientForm from './Components/ClientForm';

const validate = form => {
  const { nombreNegocio, poblacion, codigoPostal } = form;
  if (!nombreNegocio || nombreNegocio === '') {
    swal('Ingresa el nombre de la empresa');
    return false;
  }
  if (!poblacion || poblacion === '') {
    swal('Ingresa la poblacion');
    return false;
  }
  if (!codigoPostal || codigoPostal === '') {
    swal('Ingresa el codigo postal');
    return false;
  }
  return true;
};

const deleteCliente = id => {
  db.collection('clientes')
    .doc(id)
    .delete()
    .then(() => {
      swal('Se ha eliminado correctamente');
    });
};
export default function Clientes() {
  const { user } = useAuthValue();
  const userId = user?.data.type === 'admin' ? user.uid : user?.data.userAdmin;
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({});
  const handleChange = useCallback(({ target }) => {
    const { value, id } = target;
    setForm(state => ({ ...state, [id]: value }));
  }, []);
  const close = useCallback(() => {
    setForm({});
    setModalOpen(false);
  }, []);

  const queryValue = useCallback(
    query => {
      if (userId) {
        return query.where('userAdmin', '==', userId);
      }
      return null;
    },
    [userId]
  );
  const [clientes] = useCollectionCallback('clientes', queryValue);
  const updateClient = useCallback(formValue => {
    const { id, ...updateForm } = formValue;
    db.collection('clientes')
      .doc(id)
      .set(updateForm, { merge: true })
      .then(() => {
        swal('Se ha guardado correctamente');
        close();
      })
      .catch(e => {
        swal('Error', `Error: ${JSON.stringify(e)}`, 'error');
        close();
      }, []);
  });
  const saveClient = useCallback((formValue, userId) => {
    db.collection('clientes')
      .add({ ...formValue, userAdmin: userId })
      .then(() => {
        swal('Se ha guardado correctamente');
      })
      .catch(e => {
        swal('Error', `Error: ${JSON.stringify(e)}`, 'error');
      });
  }, []);
  const submitClient = useCallback(() => {
    const isValid = validate(form);
    if (!isValid) {
      return;
    }
    if (form.id) {
      updateClient(form);
    } else {
      saveClient(form, userId);
    }
  }, [form]);
  const editClient = useCallback(
    i => {
      setModalOpen(true);
      setForm(clientes[i]);
    },
    [clientes]
  );
  // console.log(userId, userId);
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="card precios">
            <div className="card-body">
              <h5 className="card-title">Clientes</h5>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setModalOpen(true)}
              >
                Agregar clientes
              </button>
              <div className="mt-3">
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Poblacion</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ClientsList
                      data={clientes}
                      edit={editClient}
                      delete={deleteCliente}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div></div> */}
      <Modal isOpen={modalOpen} appElement={document.getElementById('root')}>
        <ButtonClose onClick={close} />
        <ClientForm
          submitClient={submitClient}
          form={form}
          handleChange={handleChange}
        />
      </Modal>
    </>
  );
}
