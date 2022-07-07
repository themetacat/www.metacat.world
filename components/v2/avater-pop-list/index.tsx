import React from 'react';

import cn from 'classnames';

import style from './index.module.css';

class Avater {
  icon?: string;

  label?: string;

  link?: string;
}

interface Props {
  avaters?: Array<Avater>;
  onActive?: (x) => void;
}

export default function AvaterPopList({ avaters, onActive }: Props) {
  return (
    <div className="">
      {avaters.map((item, idx) => {
        return (
          <img
            className={cn(
              'float-left w-24 h-24 -mr-3 rounded-full',
              idx === avaters.length - 1 ? 'float-none' : null,
              style.avater,
            )}
            key={idx}
            src={item.icon}
          ></img>
        );
      })}
    </div>
  );
}
