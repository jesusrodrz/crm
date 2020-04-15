/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import swal from 'sweetalert';
import moment from 'moment';
import { db } from '../../firebase/firebase';

const validate = ({ title, options }) => {
  const validations = [];
  let messages = '';
  if (title === '') {
    validations.push(false);
    messages += ' El titulo no puede estar vacio.';
  }
  if (options.length <= 0) {
    validations.push(false);
    messages += ' Debes agregar opciones.';
  } else {
    const optionsNames = options.map(({ name }) => name !== '');
    const valid = optionsNames.every(item => item);
    if (!valid) {
      validations.push(false);
      messages += ' las opciones no pueden estar vacias.';
    }
  }

  if (validations.length > 0) {
    return {
      isValid: false,
      messages
    };
  }
  return { isValid: true };
};
export default function DynamicField({ field, closeModal, user, type }) {
  const defaulField = field || {
    title: '',
    typeCampo: 'simple',
    available: true,
    required: true,
    date: null,
    options: []
  };
  const [loading, setLoading] = useState(false);
  const [campo, setCampo] = useState(defaulField);
  const handleOnChage = useCallback(({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setCampo(state => ({ ...state, [target.name]: value }));
  }, []);
  const handleAddOption = useCallback(() => {
    const option = { key: uuid(), name: '', active: true };
    const newOptions = [...campo.options];
    newOptions.push(option);
    setCampo(state => ({ ...state, options: newOptions }));
  }, [campo.options]);
  const handleRemoveOption = useCallback(
    id => {
      const newOptions = campo.options.filter(item => item.key !== id);
      setCampo(state => ({ ...state, options: newOptions }));
    },
    [campo.options]
  );
  const handleChangeOption = useCallback(
    (value, id) => {
      const newOptions = campo.options.map(item => {
        if (item.key === id) {
          return { ...item, name: value, active: true };
        }

        return { ...item, active: false };
      });
      setCampo(state => ({ ...state, options: newOptions }));
    },
    [campo.options]
  );
  const inputRef = useRef();
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [campo.options]);
  const saveField = useCallback(async () => {
    const valid = validate(campo);
    if (!valid.isValid) {
      swal('Error al guardar', `${valid.messages}`, 'error');
      return;
    }
    const docId = field ? field.id : uuid();
    let hasError = false;
    try {
      setLoading(true);
      const options = campo.options.map(({ name, key }) => ({ name, key }));
      const date = campo.date ? campo.date : moment().valueOf();
      const fieldSave = { ...campo, userId: user.uid, options, date };
      await db
        .collection(type)
        .doc(docId)
        .set(fieldSave);
    } catch (error) {
      hasError = true;
      swal('Error al guardar', `Error: ${JSON.stringify(error)}`, 'error');
    }

    setLoading(false);
    if (!hasError) {
      closeModal();
    }
  }, [campo, user, field, closeModal, type]);
  return (
    <div>
      <h2>{field ? 'Editar campo' : 'Agregar un campo nuevo'}</h2>
      <div className="form-group mb-4">
        <input
          className="form-control"
          name="title"
          type="text"
          placeholder="Titulo..."
          onChange={handleOnChage}
          value={campo.title}
        />
      </div>
      <div className="form-group mb-4">
        <h3>Tipo de campo</h3>
        <div className="custom-control custom-radio">
          <input
            type="radio"
            id="customRadio1"
            name="typeCampo"
            className="custom-control-input"
            value="multiple"
            onChange={handleOnChage}
            checked={campo.typeCampo === 'multiple'}
          />
          <label className="custom-control-label" htmlFor="customRadio1">
            Multiple seleccion
          </label>
        </div>
        <div className="custom-control custom-radio">
          <input
            type="radio"
            id="customRadio2"
            name="typeCampo"
            value="simple"
            className="custom-control-input"
            onChange={handleOnChage}
            checked={campo.typeCampo === 'simple'}
          />
          <label className="custom-control-label" htmlFor="customRadio2">
            Solo un elemeneto selecionable
          </label>
        </div>
      </div>
      <div className="custom-control custom-switch">
        <input
          type="checkbox"
          className="custom-control-input"
          id="customSwitch1"
          name="required"
          checked={campo.required}
          onChange={handleOnChage}
        />
        <label className="custom-control-label" htmlFor="customSwitch1">
          Requerido
        </label>
      </div>
      <div className="form-group mb-4" style={{ minHeight: '270px' }}>
        <h3>Opciones</h3>
        <ul>
          {campo.options.map(({ key, name, active }) => {
            const ref = active ? inputRef : null;
            return (
              <li key={key}>
                <div className="col-auto" style={{ position: 'relative' }}>
                  <input
                    type="text"
                    ref={ref}
                    suppressContentEditableWarning
                    className="form-control mb-2 form-control-sm"
                    style={{
                      display: 'inline-block',
                      width: 'auto',
                      minWidth: '160px'
                    }}
                    placeholder="Opcion..."
                    onChange={({ target }) =>
                      handleChangeOption(target.value, key)
                    }
                    value={name}
                  />

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm ml-2"
                    onClick={() => handleRemoveOption(key)}
                  >
                    <span>×</span>
                  </button>
                </div>
              </li>
            );
          })}
          <li>
            <div className="col-auto">
              <button
                className="btn btn-secondary btn-sm"
                type="button"
                onClick={handleAddOption}
              >
                +
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-primary btn-lg d-inline-flex align-items-center"
          type="button"
          onClick={saveField}
        >
          {!loading ? (
            'Guardar'
          ) : (
            <>
              <span>cargando... </span>
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
