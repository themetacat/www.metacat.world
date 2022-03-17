const OSS = require('ali-oss');

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
  if (value === undefined || value === null || (value === 0 && !noNeedFixed)) {
    return '--';
  }
  if (value.toString().indexOf('.') < 0 || noNeedFixed) {
    return value.toLocaleString();
  }
  return value.toLocaleString(undefined, { minimumFractionDigits: fixed });
};

export const getToken = (address, type) => {
  const accessToken = localStorage.getItem(`${address}_${type}`);
  return accessToken;
};

export const setToken = (address, type, value) => {
  const accessToken = localStorage.setItem(`${address}_${type}`, value);
  return accessToken;
};

export const removeToken = (address, type) => {
  const accessToken = localStorage.removeItem(`${address}_${type}`);
  return accessToken;
};

export const client = () => {
  // 后端提供数据
  return new OSS({
    region: 'oss-cn-hongkong',
    endpoint: 'oss-cn-hongkong.aliyuncs.com',
    stsToken: '',
    crossOriginIsolated: true,
    secure: true,
    accessKeyId: 'LTAI5tCXLNPjxpZkoDeAyDNL',
    accessKeySecret: '25qppPU9EUK5CVChJLTyBgnspL4mLk',
    bucket: 'metacat',
  });
};
