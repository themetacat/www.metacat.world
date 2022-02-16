/* eslint-disable no-console */
import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

interface item {
  value?: string;
  label?: string;
}

interface Props {
  options?: Array<item>;
  onClick?: (x) => void;
  className?: string;
  showArrow?: boolean;
  defaultLabel?: string;
}

export default function Selecter({
  options,
  onClick,
  className,
  showArrow = false,
  defaultLabel = 'MONTHLY',
}: Props) {
  const cls = cn(className);
  const [selectedOption, setSelectedOption] = React.useState(defaultLabel);
  const [show, setShow] = React.useState(false);

  const itemOnClick = React.useCallback(
    (x) => {
      setSelectedOption(x.label);
      setShow(false);
      onClick(x.value);
    },
    [null],
  );

  const changeShow = React.useCallback(() => {
    if (!showArrow) {
      return;
    }
    setShow(!show);
  }, [show]);

  React.useEffect(() => {
    const s = options.find((x) => {
      return x.value === defaultLabel;
    });
    if (s) {
      setSelectedOption(s.label);
    }
  }, [options, defaultLabel]);

  return (
    <div className={cn(style.selectDiv, cls)}>
      <div className={cn('flex justify-center items-center', style.selecter)} onClick={changeShow}>
        <div>{selectedOption}</div>
        {showArrow ? (
          <img
            className={cn('ml-2', style.frame)}
            src={`/images/${show ? 'Frame-up.png' : 'Frame-down.png'}`}
          />
        ) : null}
      </div>
      <ul className={cn('absolute list-none ml-5 right-0 mt-2', show ? '' : style.show)}>
        {options.map((x) => {
          return (
            <li
              className={cn(
                'flex justify-center items-center',
                style.option,
                selectedOption === x.label ? style.active : '',
              )}
              key={x.value}
              onClick={(e) => {
                itemOnClick(x);
              }}
            >
              {x.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
/* eslint-enable */
