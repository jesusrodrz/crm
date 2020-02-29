import React from 'react';
import { firebaseApp } from '../../firebase/firebase';
import swal from 'sweetalert';

export function HeaderNav({ userName }) {
  const handleClickCloseSesion = e => {
    firebaseApp
      .auth()
      .signOut()
      .then(function() {
        swal({
          text: 'El usuario se ha desconectado correctamente.',
          timer: 900
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  return (
    <nav className="navbar navbar-dark headerNav">
      <span className="user">{userName}</span>
      <button
        onClick={handleClickCloseSesion}
        className="btn btn-sm btn-outline-danger"
        type="button"
      >
        Cerrar Sesion
      </button>
    </nav>
  );
}
