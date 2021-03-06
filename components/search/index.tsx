import React, { useState, useEffect } from 'react';
import SearchInput from 'react-search-input';
import cn from 'classnames';
import style from './index.module.css';

type Props = {
  text?: string;
  onSearch?: (value) => void;
  type?: string;
};

export default function Search({ text, onSearch, type }: Props) {
  const [value, setValue] = useState(text);
  const [show, setShow] = useState(false);

  const clear = React.useCallback(() => {
    setValue('');
  }, [null]);

  const search = React.useCallback(() => {
    if (!show) {
      setShow(true);
    } else if (onSearch) {
      onSearch(value);
    }
  }, [show, value]);

  useEffect(() => {
    setValue(text);
  }, [text]);

  return (
    <div className={cn('flex w-auto items-center', type === 'z' ? style.z : '')}>
      <div className={cn('relative', show ? style.searchContainer : style.toggle)}>
        <SearchInput
          placeholder=" "
          value={value}
          onChange={(e) => {
            setValue(e);
          }}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              search();
            }
          }}
          className={cn(
            'relative search-input w-full h-full font-normal text-lg',
            style.search,
            type === 'z' ? style.font : null,
          )}
        ></SearchInput>
        {value ? (
          <img
            className={cn('absolute', style.close)}
            src="/images/close.png"
            onClick={clear}
          ></img>
        ) : null}
      </div>
      <div
        className={cn(
          'flex justify-center items-center font-medium text-lg',
          style.searchbtn,
          show ? style.active : '',
          type === 'z' ? style.font : null,
        )}
        onClick={search}
      >
        <img
          className={cn(style.searchIcon, type === 'z' ? style.lessen : null)}
          src="/images/search.png"
        ></img>
        Search
      </div>
    </div>
  );
}
