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
  hasBorder?: boolean;
  trigger?: (x: boolean) => void;
  useRef?: React.Ref<any>;
}

export default function ChartSelecter({
  options,
  onClick,
  className,
  showArrow = false,
  defaultLabel = 'Daily',
  hasBorder = true,
  trigger,
  useRef,
}: Props) {
  const cls = cn(className);
  const [selectedOption, setSelectedOption] = React.useState(defaultLabel);
  const [show, setShow] = React.useState(false);

  const itemOnClick = React.useCallback(
    (x) => {
      setSelectedOption(x.label);
      setShow(false);
      if (trigger) {
        trigger(false);
      }
      if (onClick) {
        onClick(x.value);
      }
    },
    [onClick, trigger],
  );

  const changeShow = React.useCallback(() => {
    if (!showArrow) {
      return;
    }
    const s = !show;
    setShow(s);
    if (trigger) {
      trigger(s);
    }
  }, [show, trigger]);

  React.useImperativeHandle(useRef, () => {
    return {
      forceToClose: (newVal) => {
        setShow(false);
      },
    };
  });

  const close = React.useCallback(() => {
    if (show) {
      setShow(false);
    }
  }, [show]);

  React.useEffect(() => {
    // const s = options.find((x) => {
    //   return x.value === defaultLabel;
    // });
    // if (s) {
    //   setSelectedOption(s.label);
    // }
  }, [options, defaultLabel]);

  React.useEffect(() => {
    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    };
  }, [close]);

  return (
    <div className={cn(style.selectDiv, cls)}>
      <div
        className={cn(
          'flex justify-center items-center',
          style.selecter,
          hasBorder ? style.border : '',
        )}
        onClick={changeShow}
      >
        <div>{selectedOption}</div>
        {showArrow ? (
          <img
            className={cn('ml-1', style.frame)}
            src={`/images/${show ? 'Frame-up.png' : 'Frame-down.png'}`}
          />
        ) : null}
      </div>
      <ul className={cn('absolute list-none ml-5 right-0 mt-2', show ? '' : style.show)}>
        {options.map((x) => {
          return (
            <li
              className={cn('flex items-center', style.option)}
              key={x.value}
              onClick={(e) => {
                e.stopPropagation();
                itemOnClick(x);
              }}
            >
              <span className={selectedOption === x.label ? style.active : ''}>{x.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
/* eslint-enable */
