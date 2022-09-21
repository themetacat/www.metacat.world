import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

type Props = {
  text?: string;
  className?: string;
  color?: string;
  imgBox?;
  toLink?;
};
const toLinkImh = ()=>{
  window.open('https://landworks.xyz/')
}

export default function ChartTitle2({ text, imgBox,toLink,className, color }: Props) {
  return (
    <div className={cn('flex items-center justify-start', className, style.chartTitle)}>
      <div className={cn(style.icon, color)}></div>
      <div className={cn(' text-white font-medium text-sm', style.title)}>
        {text}   
      <span onClick={toLinkImh}><span className={cn('', style.imgBox)}><img src={imgBox}></img></span></span>
      <span className={cn('',)}>)</span>
      </div>
   
    </div>
  );
}
