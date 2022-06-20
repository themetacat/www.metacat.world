import React from 'react';
import cn from 'classnames';
import style from './index.module.css';

type Props = {
  onClick?;
};

export default function Creator({ onClick }: Props) {
  return (
    <>
      <div className={style.container}>
        <div className={style.bg} onClick={onClick}></div>
      </div>
    </>
  );
}
