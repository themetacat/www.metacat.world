import React from 'react';

import cn from 'classnames';

import style from './index.module.css';

type optionItem = {
  label?: string;
  value?: string;
  icon?: string;
};

type Props = {
  onActive?: (x) => void;
  options?: Array<optionItem>;
  defaultValue?: string;
  id?: string;
  className?;
  fixedS?;
};

export default function SimpleSwicth({ options, onActive, className }: Props) {
  const first = 'rounded-l-lg';
  const last = 'rounded-r-lg';

  const [active, setActive] = React.useState(0);
  const clickHandler = React.useCallback(
    (item, idx) => {
      setActive(idx);
      if (onActive) {
        onActive(item);
      }
    },
    [onActive],
  );

  return (
    <div
      className={cn(
        'text-black text-xs  font-medium flex justify-center items-center',
        style.border,
      )}
    >
      {options.map((item, idx) => {
        return (
          <div
            className={cn(
              'flex justify-center  items-center bg-gradient-to-r from-mainDark to-mainLight event-hand',
              idx === 0 ? first : null,
              idx === options.length - 1 ? last : null,
              style.swicthbtn,
            )}
            onClick={() => {
              clickHandler(item, idx);
            }}
            key={idx}
          >
            <div
              className={cn(
                'w-full h-full flex justify-center items-center',
                idx === 0 ? first : null,
                idx === options.length - 1 ? last : null,
                active === idx ? 'bg-opacity-0 text-black' : 'bg-black bg-opacity-60 text-mainDark',
              )}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
