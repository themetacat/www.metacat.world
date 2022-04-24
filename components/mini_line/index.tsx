import React from 'react';
import { Chart } from '@antv/g2';
import cn from 'classnames';
import style from './index.module.css';

type Props = {
  id?: string;
  labelText?: string;
  legend1?;
  legend2?;
};

export default function MiniLine({ id, labelText, legend1, legend2 }: Props) {
  return (
    <div className={style.container}>
      <div className={cn('w-full flex justify-between item-center', style.header)}>
        {/* <ChartTitle text={labelText}></ChartTitle> */}
        {/* <div className="flex items-center">{getSelect}</div> */}
      </div>
      {/* {rander} */}
    </div>
  );
}
