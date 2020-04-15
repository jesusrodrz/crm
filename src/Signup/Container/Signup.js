import React, { Component } from 'react';
import './Login.css';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import { firebaseApp, db } from '../../firebase/firebase';

export class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      password2: '',
      inciarSesion: true,
      userAdmin: null,
      signed: false
    };
  }

  componentDidMount() {
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
    const userAdmin = searchParams.get('userAdmin');
    const type = searchParams.get('type');
    this.setState({ userAdmin, type });
  }

  handleChange = e => {
    const { target } = e;
    const { value } = target;
    const name = target.id;
    this.setState({
      [name]: value
    });
  };

  handleClick = async e => {
    const { email, password, password2, userAdmin, name, type } = this.state;
    if (password !== password2) {
      swal('Las contrasenas deben coincidir');
      return;
    }
    e.preventDefault();
    if (firebaseApp.auth().isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      try {
        // The client SDK will parse the code from the link for you.
        const { user } = await firebaseApp
          .auth()
          .signInWithEmailLink(email, window.location.href);
        if (user) {
          await user.delete();

          const {
            user: newUser
          } = await firebaseApp
            .auth()
            .createUserWithEmailAndPassword(email, password);
          const { email: email2 } = newUser;
          await db
            .collection('usersData')
            .doc(newUser.uid)
            .set({
              type,
              userAdmin,
              email: email2,
              name
            });

          this.setState({ signed: true });
        }
      } catch (error) {
        swal(
          'Error al registar el usuario',
          `Error: ${JSON.stringify(error)}`,
          'error'
        );
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      }
    }
  };

  render() {
    const { inciarSesion, signed } = this.state;

    return (
      <>
        {!signed ? (
          <div className="centrarLogin">
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="email"
                      className="form-control"
                      onChange={this.handleChange}
                      id="name"
                      placeholder="email@gmail.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Direccion de Email</label>
                    <br />
                    <small>El email debe ser el mismo que el del correo</small>
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
                    <label>Repite la Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      onChange={this.handleChange}
                      id="password2"
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
                </form>
                <div />
              </div>
            </div>
          </div>
        ) : (
          <Redirect to="/app" />
        )}
      </>
    );
  }
}
