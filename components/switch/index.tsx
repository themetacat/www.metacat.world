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
};
export default function Switch({ onActive, options }: Props) {
  const [active, setActive] = React.useState(options[0].value);

  const changeActive = React.useCallback(
    (acitveItem) => {
      setActive(acitveItem.value);
      if (onActive) {
        onActive(acitveItem.value);
      }
    },
    [options, onActive],
  );

  return (
    <div className="flex justify-center items-center mt-2">
      {options.map((item, idx) => {
        return (
          <div
            key={idx}
            className={cn(
              'flex justify-center items-center text-white',
              style.base,
              item.value === active ? style.active : '',
            )}
            onClick={() => {
              changeActive(item);
            }}
          >
            <div className={cn('flex justify-center items-center', style.canHover)}>
              <div
                className={cn('bg-contain mr-2', style.tabIcon)}
                style={{ backgroundImage: `url('${item.icon}')` }}
              ></div>
              <div>{item.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
