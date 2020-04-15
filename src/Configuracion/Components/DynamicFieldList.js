import React from 'react';
import FieldListItem from './FieldListItem';

export default function DynamicFieldList({ fields, edit, type }) {
  if (fields.length <= 0) {
    return (
      <tr>
        <td colSpan="4">
          <div className="vendedores-cangardo">No se han encontrado campos</div>
        </td>
      </tr>
    );
  }
  return fields.map((item, i) => (
    <FieldListItem
      key={item.id}
      data={item}
      i={i + 1}
      edit={edit}
      type={type}
    />
  ));
}
