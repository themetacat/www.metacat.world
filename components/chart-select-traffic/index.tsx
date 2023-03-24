/* eslint-disable no-console */
import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

import { req_cv_parcel_id_list } from '../../service/z_api';

interface Props {
  onClick?: (x) => void;
  className?: string;
  showArrow?: boolean;
  hasBorder?: boolean;
  trigger?: (x: boolean) => void;
  useRef?: React.Ref<any>;
  token: Promise<any>;
}

export default function ChartSelecter({
  onClick,
  className,
  showArrow = false,
  hasBorder = true,
  trigger,
  useRef,
  token,
}: Props) {
  const cls = cn(className);
  const [selectList, setSelectList] = React.useState([{ parcel_id: null, name: '' }]);
  const [selectedOption, setSelectedOption] = React.useState({ parcel_id: 0, name: '' });
  const [show, setShow] = React.useState(false);

  const itemOnClick = React.useCallback(
    (x) => {
      setSelectedOption(x);
      setShow(false);
      if (trigger) {
        trigger(false);
      }
      if (onClick) {
        onClick(x);
      }
    },
    [onClick, trigger],
  );
  const requestData = React.useCallback(async () => {
    const tk = await token;
    const result = await req_cv_parcel_id_list(tk);
    if (result.data[0]) {
      setSelectList(result.data);
      setSelectedOption(result.data[0]);
    }
    onClick(result.data[0]);
  }, [onClick, token]);

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
    requestData();

    // const s = options.find((x) => {
    //   return x.value === defaultLabel;
    // });
    // if (s) {
    // setSelectedOption(s.label);
    // }
  }, [requestData]);

  const rander = React.useMemo(() => {
    return selectList.map((x) => {
      return (
        <li
          className={cn('flex justify-center items-center', style.option)}
          key={x.parcel_id}
          onClick={(e) => {
            e.stopPropagation();
            itemOnClick(x);
          }}
        >
          <span
            className={selectedOption.parcel_id === x.parcel_id ? style.active : style.hd}
          >{`#${x.parcel_id} ${x.name}`}</span>
        </li>
      );
    });
  }, [selectList, selectedOption]);

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
        <div className={style.select}>
          {selectedOption ? `#${selectedOption.parcel_id} ${selectedOption.name}` : null}
        </div>
        {showArrow ? (
          <img
            className={cn('ml-1', style.frame)}
            src={`/images/${show ? 'Frame-up.png' : 'Frame-down.png'}`}
          />
        ) : null}
      </div>
      <ul className={cn('absolute list-none ml-5 right-0 mt-2', show ? style.ov : style.show)}>
        {rander}
      </ul>
    </div>
  );
}
/* eslint-enable */
