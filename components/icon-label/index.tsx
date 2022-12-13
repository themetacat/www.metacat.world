import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

type Props = {
  text?: string;
  color?: string;
  className?: string;
  singleClick?;
};

export default function IconLabel({ text, color = '#5FD5EC', singleClick,className }: Props) {

  return (
    <div
      onClick={singleClick}
      className={cn(
        ' flex justify-center items-center text-xs font-normal',
        className,
        style.iconlabel,
      )}

    >
      <div className={cn('mr-1', style.dot)} style={{ backgroundColor: color }}></div>
      <div className={style.text}>{text}</div>
    </div>
  );
}
