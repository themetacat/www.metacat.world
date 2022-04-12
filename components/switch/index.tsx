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
};
export default function Switch({ onActive, options, defaultValue }: Props) {
  const [active, setActive] = React.useState(defaultValue || options[0].value);

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
    <div className={cn('flex justify-center items-center mt-2', style.container)}>
      {options.map((item, idx) => {
        return (
          <div
            key={idx}
            className={cn(
              'text-white',
              style.base,
              item.value === active ? style.active : '',
              item.value === 'sandbox' ? style.p1 : null,
              item.value === 'nftworlds' ? style.p2 : null,
              item.value === 'decentraland' ? style.p3 : null,
              item.value === 'cryptovoxels' ? style.p3 : null,
              item.value === 'worldwidewebb' ? style.p4 : null,
              item.value === 'somniumspace' ? style.p5 : null,
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
              <div className={style.n}>{item.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
