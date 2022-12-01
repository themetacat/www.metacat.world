import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

type Props = {
  text?;
  className?: string;
  color?: string;
  Hyperlink?: (x) => void;
};

export default function ChartTitle({ text, Hyperlink, className, color }: Props) {

  return (
    <a onClick={() => { Hyperlink }}><div className={cn('flex items-center justify-start', className, style.chartTitle)} >
      <div className={cn(style.icon, color)}></div>
      <div className={cn(' text-white font-medium text-sm', style.title)} onClick={Hyperlink}>{text}</div>
    </div>
    </a>
  );
}
