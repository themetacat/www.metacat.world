import React from 'react';
import cn from 'classnames';

import toast from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import style from './index.module.css';

type Props = {
  label?: string;
  onChangeHandler?: (evt) => void;
  onClearHandler?: () => void;
  value?: string;
  prefix?: string;
  classname?: string;
  require?: boolean;
  requirePrefix?: boolean;
  disable?: boolean;
  onBlur?: (valu) => void;
  data?;
  onClick?;
  platform?: string;
};

export default function MeteSelectBuilding({
  label,
  onChangeHandler,
  onClearHandler,
  value,
  prefix,
  classname,
  require = false,
  requirePrefix = true,
  disable = false,
  data,
  onBlur,
  onClick,
  platform,
}: Props) {
  const [val, setVal] = React.useState(value || '');
  const [showClear, setShowClear] = React.useState(false);
  const [arrowsState, setArrowsState] = React.useState(false);
  const onChange = React.useCallback(
    (dom) => {
      const temp = dom.target.value;
      setShowClear(false);
      if (temp !== null && temp !== '') {
        setShowClear(true);
      }
      if (onChangeHandler) {
        onChangeHandler(temp);
      } else {
        setVal(temp);
      }
    },
    [onChangeHandler, setShowClear],
  );

  const iconClick = React.useCallback(
    (evt) => {
      toast.success('copied!', {
        duration: 2000,
        style: {
          background: 'rgba(0, 208, 236, 1)',
          color: 'black',
        },
      });
    },
    [null],
  );

  const rander = React.useMemo(() => {
    if (platform) {
      return <>{platform}</>;
    }
    return <>{'请选择'}</>;
  }, [platform]);

  const clear = React.useCallback(() => {
    setVal('');
    setShowClear(false);
    if (onClearHandler) {
      onClearHandler();
    }
    if (onChangeHandler) {
      onChangeHandler('');
    }
  }, [onClearHandler]);

  const inputBlur = React.useCallback(() => {
    setShowClear(false);
    if (onBlur) {
      onBlur(val);
    }
  }, [onBlur, val]);

  React.useEffect(() => {
    if (val !== value) {
      setVal(value);
    }
  }, [val, value]);
  // var box1 = document.getElementById('box1');
  //     box1.onmouseover=function(){
  //       setArrowsState(arrowsState);
  //     }
  return (
    <div className={cn('text-base relative', classname, style.metainput)}>
      {label ? (
        <div className="mb-2">
          {require && requirePrefix && <span className={cn('mr-1', style.require)}>*</span>}
          {label}
          {require && !requirePrefix && <span className={cn('ml-1', style.require)}>*</span>}
        </div>
      ) : null}
      <div
        className={cn(
          'inline-flex items-center w-full h-full',
          style.inputContent,
          disable ? style.disableContent : null,
        )}
      >
        {prefix ? (
          <span className=" inline-flex items-center mr-5">
            <img className={style.icon} src={prefix}></img>
          </span>
        ) : null}
        <div
          onClick={() => {
            setArrowsState(!arrowsState);
            // setArrowsState(true);
          }}
          style={{ width: "415px" }}
          onMouseLeave={() => {
            setTimeout(() => {
              setArrowsState(false);
            }, 4000);
          }}
        >
          {rander}
        </div>
      </div>
      <img
        src={`/images/${!arrowsState ? 'Frame-down.png' : 'Frame-up.png'}`}
        className={style.arrows}
        onClick={() => {
          setArrowsState(!arrowsState);
          // setArrowsState(true);
        }}
        onMouseLeave={() => {
          setTimeout(() => {
            setArrowsState(false);
          }, 4000);
        }}
      />
      <ul className={cn(style.list, !arrowsState ? style.dn : null)}
       onMouseEnter={() => {
        setTimeout(() => {
          setArrowsState(false);
        }, 20000000);
      }}
      >
        {data.map((i, index) => {
          return (
            <li
              key={index}
              value={i}
              onClick={() => {
                onClick(i);
                setArrowsState(false);
              }}
              className={platform === i ? style.co : null}
            >
              {i}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
