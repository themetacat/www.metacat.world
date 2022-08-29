import React, { MouseEventHandler } from 'react';

import cn from 'classnames';
import style from './index.module.css';

type Props = {
  label?: string;
  state?: number;
  num?: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
  dataSource?;
};

export default ({ dataSource, label, state,num, onClick }: Props) => {
  const cls1 = state === 1 ? style.active : '';
  const cls2 = state === 1 ? style.active_span : '';
  let nums = 0;
  if (dataSource.length !== 0) {
    if (label === 'All') {
      nums = dataSource.filter(() => {
        return true;
      }).length;
    }
    if (label === 'For rent') {
      nums = dataSource.filter((item) => {
        return item.status === 'for_rent';
      }).length;
    }
    if (label === 'Leased') {
      nums = dataSource.filter((item) => {
        return item.status === 'leased';
      }).length;
    }
    if (label === 'Not for rent') {
      nums = dataSource.filter((item) => {
        return item.status === 'not_for_rent';
      }).length;
    }
  }

  return (
    <div className={cn(cls1, style.navItem)} key={label} onClick={onClick}>
      <div>
        <span className={style.lable}>{label}</span> <span className={cn(cls2, style.navItem_span)}>{nums}</span>
      </div>
    </div>
  );
};
