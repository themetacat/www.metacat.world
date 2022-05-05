import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

type Props = {
  text?: string;
  className?: string;
  color?: string;
};

export default function ChartTitle({ text, className, color }: Props) {
  return (
    <div className={cn('flex items-center justify-start', className, style.chartTitle)}>
      <div className={cn(style.icon, color)}></div>
      <div className={cn(' text-white font-medium text-sm', style.title)}>{text}</div>
    </div>
  );
}
