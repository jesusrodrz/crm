import React from 'react';

const deletUser = uid => {};
export default function Vendedor({ data, i }) {
  const { name, email, uid, type } = data;
  return (
    <tr>
      <th scope="row">{i}</th>
      <td>{name}</td>
      <td>{email}</td>
      <td>{type}</td>
      <td>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => deletUser(uid)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}
