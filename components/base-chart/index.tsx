import React, { ReactElement } from 'react';
import cn from 'classnames';

import style from './index.module.css';

type Props = {
  className?: string;
  children?: ReactElement;
};

export default function BaseChart({ className, children }: Props) {
  return <div className={cn('', className, style.baseChart)}>{children}</div>;
}
