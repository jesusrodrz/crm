import React, { Component } from 'react';
import swal from 'sweetalert';
import { firebaseApp } from '../../firebase/firebase';

export class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listaImagenes: this.props.listaImagenes,
      contratoSrc: '',
      nombreTarjeta: '',
      setCargando: this.props.setCargando
    };
  }

  handleChange = e => {
    if (e.target.files[0]) {
      const imagen = e.target.files[0];
      this.handleUpload(imagen);
    }
  };

  handleRemoveFoto = e => {
    const storageRef = firebaseApp.storage().ref(`/tarjetas`);
    e.preventDefault();
    const { listaImagenes } = this.state;
    const { target } = e;
    const { id } = target;
    const nuevaLista = listaImagenes.filter((imagen, index) => {
      return index !== parseInt(id);
    });
    this.setState({
      listaImagenes: nuevaLista
    });
    const elementoBorrar = listaImagenes[parseInt(id)].nombreContrato;

    const borrarFile = storageRef.child(elementoBorrar);

    borrarFile
      .delete()
      .then(function() {
        swal('Se ha borrado el archivo correctamente');
      })
      .catch(function(error) {
        swal('Ohh ha ocurrido un error');
      });
  };

  handleUpload = imagen => {
    const storageRef = firebaseApp.storage().ref(`/targetas/${imagen.name}`);
    const tarea = storageRef.put(imagen);
    this.state.setCargando(true);

    tarea.on(
      'state_changed',
      snapshot => {
        const porcentaje =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const fileName = snapshot.ref.name;
        this.setState({
          uploadValue: porcentaje,
          nombreTarjeta: fileName
        });
      },
      error => {
        swal('Ha habido un error, intenta subir la imagen mas tarde');
      },
      () => {
        tarea.snapshot.ref.getDownloadURL().then(downloadURL => {
          this.setState({
            imagenSrc: downloadURL
          });
          const tarjeta = {
            nombreTarjeta: this.state.nombreTarjeta,
            direccion: this.state.imagenSrc
          };

          const { listaImagenes } = this.state;
          listaImagenes.push(tarjeta);

          this.setState({
            listaImagenes
          });
        });
        this.state.setCargando(false);
        swal('El archivo se ha subido perfectamente');
      }
    );
  };

  render() {
    const { listaImagenes } = this.state;

    return (
      <div>
        <div className="form-group">
          <label>Subir Tarjeta</label>
          <input
            type="file"
            onChange={this.handleChange}
            className="form-control-file"
          />
        </div>
        <div className="row">
          {listaImagenes.map((imagen, i) => {
            return (
              <div className="col-12 col-md-3">
                <div className="card" key={imagen.nombreTarjeta}>
                  <img
                    src={imagen.direccion}
                    alt={imagen.nombreTarjeta}
                    className="img-thumbnail"
                  />
                  <button
                    id={i}
                    className="btn btn-danger"
                    onClick={this.handleRemoveFoto}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
