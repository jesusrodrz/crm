import React from 'react';
import Vendedor from './Vendedor';

export default function VendedoresConatiner({ users }) {
  if (users.length > 0) {
    return users.map((item, i) => (
      <Vendedor key={item.uid} i={i + 1} data={item} />
    ));
  }
  return (
    <tr>
      <td colSpan="4">
        <div className="vendedores-cangardo">No se han encontrado usuarios</div>
      </td>
    </tr>
  );
}
