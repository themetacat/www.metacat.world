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
  active?: number;
}

export default function Legend({ title, options, className, active }: Props) {
  return (
    <div className={cn('flex flex-col justify-around items-center', style.legend, className)}>
      <div className="text-xs font-normal text-white flex items-center">{title}</div>
      <ul className="w-full list-none">
        {options &&
          options.map((option, idx) => {
            return (
              <li
                className={cn(
                  'w-full text-xs font-normal flex items-center',
                  style.labelLi,
                  active === idx ? style.active : null,
                )}
                key={`${option.label}${option.color}`}
              >
                <div
                  style={{ backgroundColor: option.color }}
                  className={cn(
                    'mr-2',
                    style.legendColor,
                    active === idx ? style.activeIcon : null,
                  )}
                ></div>
                {option.label}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
