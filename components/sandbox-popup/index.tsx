import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

type AtlasTile = {
  x: number;
  y: number;
  type: number;
  left?: number;
  top?: number;
  topLeft?: number;
  owner: string;
  name?: string;
  estate_id?: string;
  color?: string;
};

interface Props {
  x?: number;
  y?: number;
  visible?: boolean;
  tile?: AtlasTile;
  position?: string;
}

export default function Popup({ x, y, visible, tile, position }: Props) {
  const cls = cn(
    'bg-red-700 absolute flex justify-center items-center p-2 text-white truncate',
    style.base,
    style[position],
  );
  return (
    <div
      className={cls}
      style={{ top: y, left: x, opacity: visible ? 1 : 0 }}
    >{`Land：  (${tile.x},${tile.y})`}</div>
  );
}
