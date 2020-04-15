import React from 'react';

export default function ClientsList({ data, edit, delete: deleteClient }) {
  return (
    <>
      {data.map((item, i) => (
        <tr key={item.id}>
          <td>{i + 1}</td>
          <td>{item.nombreNegocio}</td>
          <td>{item.poblacion}</td>
          <td>
            <button
              type="button"
              className="btn  btn-outline-info btn-sm"
              onClick={() => edit(i)}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm ml-2"
              onClick={() => deleteClient(item.id)}
            >
              <span>×</span>
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
