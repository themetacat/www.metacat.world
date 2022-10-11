import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

interface coords {
  x?: number;
  y?: number;
}

interface Props {
  id?: string;
  visible?: boolean;
  position?: coords;
}

export default function Popup({ visible = true, id, position }: Props) {
  const cls = cn(
    'bg-red-700 absolute flex justify-center items-center p-2 text-white truncate',
    style.base,
  );
  return id ? (
    <div
      className={cls}
      style={{ top: position.y, left: position.x, opacity: visible ? 1 : 0 }}
    >{`#${id}`}</div>
  ) : null;
}
