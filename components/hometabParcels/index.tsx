import React, { MouseEventHandler } from 'react';

import cn from 'classnames';

import style from './index.module.less';

type Props = {
  active?: boolean;
  icon?: string;
  label?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  isMini?: boolean;
};

export default function Tab({ icon, label, active, onClick, isMini = false }: Props) {
  const ac = isMini ? style.miniActive : style.active;
  const no = isMini ? style.miniNormal : style.normal;
  const st = active ? ac : no;
  return isMini ? (
    <div
      className={cn('flex justify-center items-center ', st, style.miniBase)}
      onClick={onClick}
    >
      {/* <div className={cn('flex justify-center items-center', style.miniCanHover)}> */}
        {icon ? (
          <div
            className={cn('bg-contain mr-2', style.miniTabIcon)}
            style={{ backgroundImage: `url('${icon}')` }}
          ></div>
        ) : null}
        <span className={style.name} >{label}</span>
    </div>
  ) : (
    <div
      className={cn('flex justify-center items-center ', st, style.base)}
      onClick={onClick}
    >
      <div className={cn('flex justify-center items-center', style.canHover)}>
        <div
          className={cn('bg-contain mr-2', style.tabIcon)}
          style={{ backgroundImage: `url('${icon}')` }}
        ></div>
        <div className={style.name}>{label}</div>
      </div>
    </div>
  );
}
