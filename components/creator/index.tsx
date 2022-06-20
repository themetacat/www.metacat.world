import React from 'react';
import cn from 'classnames';
import style from './index.module.css';

type Props = {
  onClick?;
  email?: string;
};

export default function Creator({ onClick, email }: Props) {
  console.log(email);
  return (
    <>
      <div className={style.container}>
        <div className={style.bg} onClick={onClick}></div>
        <div className={style.requestCard}>
          <div className={style.header}></div>
        </div>
      </div>
    </>
  );
}
