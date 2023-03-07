import React from 'react';

import OSS from 'ali-oss';

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

export const getToken = (type: any) => {
  const accessToken = localStorage.getItem(`METACAT_${type}`);
  return accessToken;
};

export const setToken = (type: string, value: string) => {
  const accessToken = localStorage.setItem(`METACAT_${type}`, value);
  return accessToken;
};

export const removeToken = (type: string) => {
  const accessToken = localStorage.removeItem(`METACAT_${type}`);
  return accessToken;
};

// export const throttle = (fun, wait = 1000) => {
//   return function (...args) {
//     const now = !timer;
//     if (timer) {
//       timer = null
//     } else {
//       timer = window.setTimeout(function () {
//         timer = null;
//       }, wait);
//       if (now) {
//         fun.apply(this, args);
//       }
//     }
//   };
// };

export const client = () => {
  // 后端提供数据
  return new OSS({
    region: 'oss-cn-hongkong',
    endpoint: 'oss-cn-hongkong.aliyuncs.com',
    stsToken: '',
    // crossOriginIsolated: true,
    secure: true,
    accessKeyId: 'LTAI5tCXLNPjxpZkoDeAyDNL',
    accessKeySecret: '25qppPU9EUK5CVChJLTyBgnspL4mLk',
    bucket: 'metacat',
  });
};
