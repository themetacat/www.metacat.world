import React from 'react';
import cn from 'classnames';

import toast from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import style from './index.module.css';

type Props = {
  label?: string;
  placeholder?: string;
  onChangeHandler?: (evt) => void;
  onClearHandler?: () => void;
  value?: string;
  prefix?: string;
  classname?: string;
  require?: boolean;
  bold?: boolean;
  disable?: boolean;
  name?: string;
  onBlur?: (valu) => void;
  needSuffix?: boolean;
  suffixClickHandle?: () => void;
  suffixText?: string;
};

export default function MeteInput({
  placeholder,
  onChangeHandler,
  onClearHandler,
  value,
  classname,
  bold = false,
  disable = false,
  name,
  onBlur,
  needSuffix,
  suffixClickHandle,
  suffixText,
}: Props) {
  const [val, setVal] = React.useState(value || '');
  const [showClear, setShowClear] = React.useState(false);

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

  const suffixClick = React.useCallback(() => {
    if (suffixClickHandle) {
      suffixClickHandle();
    }
  }, [suffixClickHandle]);

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

  return (
    <div className={cn('text-base rounded-lg', classname, style.metainput)}>
      <div
        className={cn(
          'inline-flex items-center w-full h-full rounded-lg',
          style.inputContent,
          disable ? style.disableContent : null,
        )}
      >
        <input
          type="text"
          placeholder={placeholder}
          name={name}
          value={val}
          onChange={onChange}
          disabled={disable}
          autoComplete="off"
          onFocus={() => {
            if (val) {
              setShowClear(true);
            }
          }}
          onBlur={inputBlur}
          className={cn(
            ' text-sm',
            bold ? 'font-medium' : '',
            style.input,
            disable ? style.disable : null,
          )}
        ></input>
        <span className={cn('inline-flex items-center ml-5', style.icon)} onClick={clear}>
          <img
            className={cn('cursor-pointer', showClear ? 'inline-flex' : ' hidden', style.icon)}
            src="/images/close.png"
          ></img>
        </span>
        {needSuffix ? (
          <span
            className={cn(
              'inline-flex justify-center items-center m-3 pl-4 border-l border-mainDark02 border-solid text-white',
              disable ? style.disable : ' event-hand',
              style.suffix,
            )}
            onClick={suffixClick}
          >
            {suffixText}
          </span>
        ) : null}
      </div>
    </div>
  );
}
