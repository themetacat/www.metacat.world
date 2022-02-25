export const convert = (data) => {
  if (typeof data !== 'object' || !data) return data;
  if (Array.isArray(data)) {
    return data.map((item) => convert(item));
  }

  const newObj = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const newKey = key.replace(/_([a-z])/g, (res) => res[1].toUpperCase());
      newObj[newKey] = convert(data[key]);
    }
  }

  return newObj;
};

export const formatNum = (value: number, noNeedFixed = true, fixed = 3) => {
  if (value === undefined || value === null) {
    return '--';
  }
  if (value === 0) {
    return 0;
  }
  if (value.toString().indexOf('.') < 0 || noNeedFixed) {
    return value.toLocaleString();
  }
  return value.toLocaleString(undefined, { minimumFractionDigits: fixed });
};
