import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

type Props = {
  text?: string;
  className?: string;
};

export default function ChartTitle({ text, className }: Props) {
  return (
    <div className={cn('flex items-center justify-start', className, style.chartTitle)}>
      <div className={style.icon}></div>
      <div className={cn(' text-white font-medium text-sm', style.title)}>{text}</div>
    </div>
  );
}
