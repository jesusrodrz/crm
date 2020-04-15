import moment from 'moment';

export function orderFields(fields) {
  const orderedFields = [...fields].sort((a, b) => {
    if (a.typeCampo === 'simple' && b.typeCampo === 'multiple') {
      return -1;
    }
    if (b.typeCampo === 'simple' && a.typeCampo === 'multiple') {
      return 1;
    }

    return 0;
  });
  return orderedFields;
}

export function dynamicFieldsValues(fieldsValues, valueData) {
  const { id, checked, value } = valueData;
  const newFieldsValues = [...fieldsValues, valueData].filter(
    ({ typeCampo, ...item }, i) => {
      // console.log(i, checked);
      if (typeCampo === 'simple' && item.value !== value && id === item.id) {
        return false;
      }
      if (typeCampo === 'multiple' && id === item.id) {
        if (item.value === value && !checked) {
          return false;
        }
        // return false;
      }
      return true;
    }
  );
  return newFieldsValues;
}
export function validadeDynamicFields(fields, fieldsValues) {
  const requeredFields = fields.filter(item => item.required);
  const requeredFieldsHasValues = requeredFields.map(({ id, options }) => {
    const hasValue = fieldsValues.find(item => item.id === id);
    const matchOption = options.find(item => item.key === hasValue?.value);
    // console.log(matchOption);
    if (hasValue && matchOption) {
      return true;
    }
    return false;
  });
  const valid = requeredFieldsHasValues.every(item => item);
  return valid;
}

export function formatDynamicFieldValues(fieldsValues) {
  return fieldsValues.reduce((currentArray, { id, value }) => {
    const exists = currentArray.find(el => el.id === id);
    if (!exists) {
      currentArray.push({ values: [value], id });
      return currentArray;
    }
    exists.values.push(value);
    return currentArray;
  }, []);
}

export function getOptionsObj(types, key) {
  return types?.reduce(
    (obj, item) => {
      return { ...obj, [item[key]]: 0 };
    },
    { total: 0 }
  );
}
export function getTimesObj(list, types, value) {
  return list.reduce(
    (time, item) => {
      const key = item[value];
      const { duracion } = item;
      if (value === 'project') {
        // console.log(value, time, time.total);
      }
      const total = time.total + duracion;
      const type = (time[key] ? time[key] : 0) + duracion;
      return { ...time, total, [key]: type };
    },
    { ...types }
  );
}
export function getTimesMinutes(tiempoTotales) {
  return Object.keys(tiempoTotales).reduce((time, key) => {
    const value = tiempoTotales[key];
    const timeObject = moment.duration(value);
    const formatedValue = Math.round(timeObject.asMinutes());
    return { ...time, [key]: formatedValue };
  }, {});
}
export function getDutationFormated(duration) {
  const timeObject = moment.duration(duration);
  return `${timeObject.hours()} horas, ${timeObject.minutes()} minutos y ${timeObject.seconds()} segundos.`;
}
export function getTimesFormated(tiempoTotales) {
  return Object.keys(tiempoTotales).reduce((time, key) => {
    const value = tiempoTotales[key];
    const formatedValue = getDutationFormated(value);
    return { ...time, [key]: formatedValue };
  }, {});
}

export function randomOrder(a, b) {
  return 0.5 - Math.random();
}
