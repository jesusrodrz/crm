import React, { useCallback, useState, useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import swal from 'sweetalert';
import { db } from '../../firebase/firebase';
import { useAuthValue } from '../../context/context';

export default function FichajesTypesList({ data, setFichajes }) {
  const {
    user: { uid }
  } = useAuthValue();
  const { length } = data;
  const [fichaje, setFichaje] = useState({});
  const [isFichajeSet, setIsFichajeSet] = useState(false);
  const [saving, setSaving] = useState(false);

  const addFichaje = useCallback(() => {
    setIsFichajeSet(true);
    setFichaje({
      name: '',
      key: uuid()
    });
  }, []);

  const removeFichaje = useCallback(() => {
    setIsFichajeSet(false);
    setFichaje({});
  }, []);
  const editFichaje = useCallback(
    i => {
      removeFichaje();
      const newData = [...data];
      const newFichaje = { ...newData[i], edit: true };
      newData[i] = newFichaje;
      console.log(newFichaje);
      setFichajes(newData);
      setFichaje(newFichaje);
    },
    [data, setFichajes, removeFichaje]
  );
  const handleChange = useCallback(({ target }) => {
    const { value } = target;
    setFichaje(state => ({ ...state, name: value }));
  }, []);
  const guardarFichaje = useCallback(async () => {
    try {
      setSaving(true);
      const fichajeToSave = fichaje.edit ? { name: fichaje.name } : fichaje;
      await db
        .collection('fichajeTypes')
        .doc(fichaje.key)
        .set({ ...fichajeToSave, userId: uid }, { merge: true });
      swal('se ha guardado correctamente');
      removeFichaje();
      setSaving(false);
    } catch (error) {
      swal('Error', `Error: ${JSON.stringify(error)}`, 'error');
      setSaving(false);
    }
  }, [fichaje, uid, removeFichaje]);
  const inputRef = useRef();
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFichajeSet]);
  const deleteFichaje = useCallback(
    async i => {
      const { edit, id } = data[i];
      // console.log('ok', data[i]);
      if (edit) {
        const newData = data.map(item => ({ ...item, edit: false }));
        setFichajes(newData);
      } else {
        try {
          await db
            .collection('fichajeTypes')
            .doc(id)
            .delete();
          swal('Se ha borrado');
        } catch (error) {
          swal('Error', `Error: ${JSON.stringify(error)}`, 'error');
        }
      }
      setFichaje({});
    },
    [data, setFichajes]
  );
  return (
    <>
      {data.map(({ name, id, edit }, i) => (
        <tr key={id}>
          <td>{i + 1}</td>
          <td>
            {!edit ? (
              name
            ) : (
              <input
                type="text"
                value={fichaje.name}
                ref={inputRef}
                className="form-control"
                onChange={handleChange}
              />
            )}
          </td>
          <td>
            {!edit ? (
              <button
                type="button"
                className="btn  btn-outline-info btn-sm"
                onClick={() => editFichaje(i)}
              >
                Editar
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={guardarFichaje}
              >
                {saving ? 'Guardando...2' : 'Guardar'}
              </button>
            )}

            <button
              type="button"
              className="btn btn-outline-danger btn-sm ml-2"
              onClick={() => deleteFichaje(i)}
            >
              <span>×</span>
            </button>
          </td>
        </tr>
      ))}
      <tr key={uuid()}>
        {isFichajeSet ? (
          <>
            <td>{length + 1}</td>
            <td>
              <input
                type="text"
                value={fichaje.name}
                ref={inputRef}
                className="form-control"
                onChange={handleChange}
              />
            </td>
            <td>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={guardarFichaje}
              >
                {saving ? 'Guardando...1' : 'Guardar'}
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm ml-2"
                onClick={removeFichaje}
              >
                <span>×</span>
              </button>
            </td>
          </>
        ) : (
          <>
            <td />
            <td>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addFichaje}
              >
                Agregar fichaje
              </button>
            </td>
            <td />
          </>
        )}
      </tr>
    </>
  );
}
