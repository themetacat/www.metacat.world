import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

type Props = {
  text?;
  iconImgLight?;
  className?: string;
  color?: string;
  Hyperlink?: (x) => void;
};

export default function ChartTitle({ text, Hyperlink, className,iconImgLight, color }: Props) {

  return (
   <div className={cn('flex items-center justify-start', className, style.chartTitle)} >
      <div className={cn(style.icon, color)}></div>
      <div className={cn(' text-white font-medium text-sm',iconImgLight===true?style.title1: style.title,style.tits)} onClick={Hyperlink}>{text}</div>
    </div>
  );
}
