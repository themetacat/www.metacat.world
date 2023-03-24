import React, { ReactElement } from 'react';
import cn from 'classnames';

import style from './index.module.css';

type Props = {
  className?: string;
  children?: ReactElement;
  type?: boolean;
};

export default function BaseChart({ className, children, type = false }: Props) {
  return (
    <div className={cn('', className, type ? style.baseChart2 : style.baseChart)}>{children}</div>
  );
}
