import React from 'react';

import style from './index.module.css';

interface Props {
  status?: string;
  type?: boolean;
  value?: string;
}
export default function Status({ status, type = false, value }: Props) {
  if (status === 'error' && type) {
    return (
      <div className={style.error}>
        <img src="/images/lose.png" />
        <p>{value}</p>
      </div>
    );
  }
  if (status === 'succeed' && type) {
    return (
      <div className={style.succeed}>
        <img src="/images/succeed.png" />
        {value}
      </div>
    );
  }
  return null;
}
