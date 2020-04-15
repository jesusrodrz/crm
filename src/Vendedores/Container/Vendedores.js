import React, { useState, useCallback, useRef } from 'react';
import swal from 'sweetalert';
import {
  actionUserWithEmailLinkSettings as defaultSettings,
  firebaseApp
} from '../../firebase/firebase';
import './vendedores.css';
import { useAuth, useUsers } from '../../hooks';
import { Spinner } from '../../Spinner/Container/Spinner';
import VendedoresConatiner from '../Components/VendedoresConatiner';

const registerUserWithEmailLink = async (newUserEmail, type) => {
  const [exists] = await firebaseApp
    .auth()
    .fetchProvidersForEmail(newUserEmail);
  if (exists) {
    swal('Error', `El email ya esta registrado`, 'error');
    return;
  }
  const user = firebaseApp.auth().currentUser;
  const settings = {
    ...defaultSettings,
    url: `${defaultSettings.url}?userAdmin=${user.uid}&type=${type}`
  };
  firebaseApp
    .auth()
    .sendSignInLinkToEmail(newUserEmail, settings)
    .then(() => {
      swal({
        text:
          'Email para que usurario se registre ha sido enviado exitosamente',
        timer: 1500
      });
    })
    .catch(e => {
      console.log(e);
      swal(
        'Error al enviar el email al nuevo usuario',
        `Error: ${JSON.stringify(e)}`,
        'error'
      );
    });
};
export default function Vendedores() {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [userType, setUserType] = useState('vendedor');
  const inputRef = useRef();
  const handleChange = useCallback(({ target }) => {
    const { value } = target;
    setNewUserEmail(value);
  }, []);
  const handleTypeChange = useCallback(({ target }) => {
    const { value } = target;
    setUserType(value);
  }, []);
  const handleClick = useCallback(() => {
    const input = inputRef.current;
    if (!input.matches(':valid')) {
      if (newUserEmail === '') {
        swal('Email invalido', `El campo no puede estar vacio`, 'error');
      } else {
        swal(
          'Email invalido',
          `${newUserEmail}  no corresponde con un formato de email valido`,
          'error'
        );
      }
    }
    registerUserWithEmailLink(newUserEmail, userType);
  }, [newUserEmail, inputRef, userType]);
  const { user } = useAuth();
  const { users, loading } = useUsers(user.uid);
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="card precios">
            <div className="card-body">
              <h2>Administra los Empleados</h2>
              <form>
                <div className="form-row">
                  <div className="col-12 col-md-4 mb-3">
                    <input
                      className="form-control add-vendedor__input"
                      type="email"
                      ref={inputRef}
                      value={newUserEmail}
                      onChange={handleChange}
                      placeholder="Ingresa el correo del vendedor"
                      required
                    />
                  </div>
                  <div className="col-12 col-md-4 mb-3">
                    <select
                      className="form-control mr-2"
                      onChange={handleTypeChange}
                    >
                      <option>vendedor</option>
                      <option>trabajador</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-4 mb-3">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleClick}
                    >
                      Agregar usuario
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card precios">
            <div className="card-body">
              <div className="table-ov">
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Email</th>
                      <th scope="col">tipo</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading ? (
                      <VendedoresConatiner users={users} />
                    ) : (
                      <tr>
                        <td colSpan="4">
                          <div className="vendedores-cangardo">
                            Cargando usuarios...
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
      </div>
    </>
  );
}
