import React, { MouseEventHandler } from 'react';

import cn from 'classnames';

import style from './index.module.css';

type Props = {
  label?: string;
  count?: string;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function SecondTab({ label, count,active, onClick }: Props) {
  const cls = active ? style.active : style.normal;
  return (
    <div className={cn(style.tab, cls)} onClick={onClick}>
      <div className={style.canHover}>{label}</div>
      <div className={style.numCont}>{count}</div>
    </div>
  );
}
