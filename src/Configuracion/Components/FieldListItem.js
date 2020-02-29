import React, { useCallback } from 'react';
import swal from 'sweetalert';
import { db } from '../../firebase/firebase';

export default function FieldListItem({ data, i, edit }) {
  const { id, title, options } = data;
  const handleEdit = useCallback(() => {
    edit(id);
  }, [id, edit]);
  const handleDelete = useCallback(async () => {
    try {
      await db
        .collection('dynamicFields')
        .doc(id)
        .delete();
      swal('Campo eliminado');
    } catch (error) {
      swal('Error al eliminar campo', `Error: ${error}`, 'error');
    }
  }, [id]);
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
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={handleDelete}
        >
          <span>×</span>
        </button>
      </td>
    </tr>
  );
}
