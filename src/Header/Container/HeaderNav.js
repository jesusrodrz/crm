import React from 'react';
import swal from 'sweetalert';
import { TiThMenu } from 'react-icons/ti';
import { IoMdClose } from 'react-icons/io';
import { firebaseApp } from '../../firebase/firebase';

export function HeaderNav({ userName, togleMenu, show, noMenu }) {
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
        className="btn btn-sm btn-light btn-header-bar"
        type="button"
      >
        Cerrar Sesion
      </button>
      {noMenu || (
        <button
          onClick={togleMenu}
          className="btn btn-sm btn-light d-md-none btn-hearder-menu"
          type="button"
        >
          {show ? <IoMdClose /> : <TiThMenu />}
        </button>
      )}
    </nav>
  );
}
