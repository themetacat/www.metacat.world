import React, { ReactElement } from 'react';
import cn from 'classnames';

import ChartTitle from '../chart-title';

import style from './index.module.css';

type Props = {
  className?: string;
  labelText?: string;
  children?: ReactElement;
  selectChild?: ReactElement;
  lenged?: ReactElement;
};

export default function BaseChart({ className, labelText, selectChild, children, lenged }: Props) {
  return (
    <div className={cn('', className, style.baseChart)}>
      <div className={cn('w-full p-5', style.content)}>
        <div className={cn('w-full flex justify-between item-center', style.header)}>
          <ChartTitle text={labelText}></ChartTitle>
          <div className="flex items-center">
            <div className="flex items-center mr-7">{lenged}</div>
            {selectChild}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
