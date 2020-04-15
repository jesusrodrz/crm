import React, { Fragment } from 'react';

export default function DynamicFiledsView({ fields, selectedFields }) {
  const fieldToShow = fields.map(item => {
    const fieldInVisita = selectedFields.find(itemOp => itemOp.id === item.id);
    const newOpctions = item.options.map(opt => {
      const option = { ...opt };
      if (fieldInVisita) {
        if (fieldInVisita.values.includes(option.key)) {
          option.select = true;
        }
      }
      return option;
    });
    return { ...item, options: newOpctions };
  });
  return fieldToShow.map(({ id, title, options }) => (
    <Fragment key={id}>
      <p className="card-text option">
        <strong>{title}:</strong>
      </p>
      <ul>
        {options.map(({ key, name, select }) =>
          select ? <li key={key}>{name}</li> : null
        )}
      </ul>
    </Fragment>
  ));
}
