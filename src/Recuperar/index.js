import React, { useState, useCallback } from 'react';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { firebaseApp } from '../firebase/firebase';

export default function Recuperar() {
  const [email, setEmail] = useState('');

  const handleChange = useCallback(({ target }) => {
    const { value } = target;
    setEmail(value);
  }, []);
  // console.log(email);
  const handleSubmit = useCallback(userEmail => {
    firebaseApp
      .auth()
      .sendPasswordResetEmail(userEmail)
      .then(() => {
        swal('Correo de recuperacion enviado');
      })
      .catch(e => {
        swal(
          'Error',
          `Correo no encontrado, puede que hayas escrito mal el email o que tu usuario haya sido borrado`,
          'error'
        );
      });
  }, []);
  return (
    <div className="centrarLogin">
      <div className="card">
        <div className="card-body">
          <form>
            <div className="form-group">
              <label>Ingresa el tu email</label>
              <input
                type="email"
                className="form-control"
                onChange={handleChange}
                value={email}
                id="name"
                placeholder="Email"
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleSubmit(email)}
              // onClick={this.handleClick}
            >
              Recuperar
            </button>
            <Link className="btn btn-link" to="/">
              Regresar
            </Link>
          </form>
          <div />
        </div>
      </div>
    </div>
  );
}
