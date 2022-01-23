import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

interface item {
  color?: string;
  label?: string;
}

interface Props {
  title?: string;
  options?: Array<item>;
  className?: string;
}

export default function Legend({ title, options, className }: Props) {
  return (
    <div className={cn('flex flex-col justify-around items-center', style.legend, className)}>
      <div className="text-xs font-normal text-white flex items-center">{title}</div>
      <ul className="w-full list-none">
        {options &&
          options.map((option) => {
            return (
              <li
                className={cn('w-full text-xs font-normal flex items-center', style.labelLi)}
                key={`${option.label}${option.color}`}
              >
                <div
                  style={{ backgroundColor: option.color }}
                  className={cn('mr-2', style.legendColor)}
                ></div>
                {option.label}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
