import React, { useCallback } from 'react';
import swal from 'sweetalert';
import { db } from '../../firebase/firebase';

export default function FieldListItem({ data, i, edit, type }) {
  const { id, title, options, available } = data;
  const handleEdit = useCallback(() => {
    edit(id, type);
  }, [id, edit, type]);
  const handleAvailable = useCallback(
    async value => {
      try {
        await db
          .collection(type)
          .doc(id)
          .set({ available: value }, { merge: true });
        // .delete();
        swal(`Campo ${value ? 'Habilitado' : 'deshabilitado'}`);
      } catch (error) {
        swal('Error al eliminar campo', `Error: ${error}`, 'error');
      }
    },
    [id, type]
  );
  return (
    <tr>
      <td>{i}</td>
      <td>{title}</td>
      <td>{options.length}</td>
      <td>
        <button
          type="button"
          className="btn btn-sm btn-outline-info mr-3"
          onClick={handleEdit}
        >
          <span>Editar</span>
        </button>
        {available ? (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleAvailable(false)}
          >
            Eliminar
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-sm btn-outline-info"
            onClick={() => handleAvailable(true)}
          >
            Habilitar
          </button>
        )}
      </td>
    </tr>
  );
}
