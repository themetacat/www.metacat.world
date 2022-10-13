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

  useEffect(() => {
    setValue(text);
  }, [text]);

  return (
    <div className={style.container}>
      <div><img src='/images/unnamed.png' className={style.imgBox}></img></div>
      <div className={style.content}>
        <div className={style.instron}>SuperDelicious</div>
        <div className={style.showDetail}>Activity time：2021/12/11/13:20 -- 2021/12/12/14:00</div>
        <div className={style.introduce}>Gallery of Kerb and DaisyCoco. Random nuggets of digital madness from our little studio in the middle of nowhere.</div>
        <div className={style.btnBox}>Entry</div>
      </div>
    </div>
  );
}
