import React, { Component } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { firebaseApp } from '../../firebase/firebase';

export class Login extends Component {
  state = {
    email: '',
    password: '',
    inciarSesion: true,
    loading: false
  };

  handleChange = e => {
    const { target } = e;
    const { value } = target;
    const name = target.id;
    this.setState({
      [name]: value
    });
  };

  handleClick = e => {
    const { email, password } = this.state;
    e.preventDefault();
    this.setState(state => ({ ...state, loading: true }));
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ inciarSesion: false, loading: false });
      })
      .catch(error => {
        const errorMessage = error.message;
        if (
          errorMessage ===
          'The password is invalid or the user does not have a password.'
        ) {
          alert(
            'has introducido una contraseña errónea o el usuario no tiene contraseña'
          );
        }
        if (error.message === 'The email address is badly formatted.') {
          alert('El email introducido esta erróneo');
        }
        this.setState(state => ({ ...state, loading: false }));
      });
  };

  render() {
    const { inciarSesion } = this.state;

    return (
      <div className="centrarLogin">
        <div className="card">
          <div className="card-body">
            <form>
              <div className="form-group">
                <label>Direccion de Email</label>
                <input
                  type="email"
                  className="form-control"
                  onChange={this.handleChange}
                  id="email"
                  placeholder="email@gmail.com"
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  onChange={this.handleChange}
                  id="password"
                  placeholder="Escribe tu contraseña"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.handleClick}
              >
                {inciarSesion ? 'Iniciar Sesion' : 'Cerrar Sesion'}
              </button>
              <br />
              <br />
              <p>
                ¿Perdiste tu contraseña?
                <Link className="btn btn-link" to="/recuperar">
                  Recuperar
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
