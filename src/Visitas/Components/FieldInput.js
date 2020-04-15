/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback } from 'react';

export default function FieldInput({ data, handleOnChange }) {
  const { title, options, typeCampo, id, required } = data;
  const heading = (
    <h6>
      {title} {required && '(Requerido)'}
    </h6>
  );
  const handleChange = useCallback(
    e => {
      if (!handleOnChange) {
        return;
      }
      const { value, checked } = e.target;
      handleOnChange(e, { value, id, typeCampo, checked });
    },
    [id, handleOnChange, typeCampo]
  );
  if (typeCampo === 'multiple') {
    return (
      <div className="mb-2">
        {heading}
        {options.map(({ key, name }) => {
          return (
            <div className="custom-control custom-checkbox" key={key}>
              <input
                type="checkbox"
                className="custom-control-input"
                id={key}
                onChange={handleChange}
                value={key}
              />
              <label className="custom-control-label" htmlFor={key}>
                {name}
              </label>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="mb-2">
      {heading}
      <select className="custom-select" onChange={handleChange}>
        <option>--selecionar--</option>
        {options.map(({ key, name }) => {
          return (
            <option key={key} value={key}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
