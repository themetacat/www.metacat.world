import React, { useState, useEffect } from 'react';
import SearchInput from 'react-search-input';
import cn from 'classnames';
import style from './index.module.css';
import CoverImg from '../cover-img';

type Props = {
  text?: string;
  onClinkDetail?: (value) => void;
  type?: string;
  activity_time?;
  cover_img?;
  description?;
  event_detail_url?;
  event_parcel_url?;
  name?;
  status?;
};

export default function Search({ text, onClinkDetail, type,
  activity_time,
  cover_img,
  description,
  event_detail_url,
  event_parcel_url,
  name,
  status,
}: Props) {
  const [value, setValue] = useState(text);
  const [show, setShow] = useState(false);

  const detailInston = () => {
    window.open(event_detail_url)

  }

  useEffect(() => {
    setValue(text);
  }, [text]);

  return (
    <div className={style.container} onClick={detailInston}>
      {/* <img src={cover_img} className={style.imgBox}></img> */}
      <CoverImg
        className={style.imgBox}
        img={cover_img}
        error="/images/default-cover.png"
      ></CoverImg>
      <div className={style.content}>
        <div className={style.instron}><span>{name}</span></div>
        <div className={style.showDetail}>Activity time：{activity_time}</div>
        <div className={style.introduce}>
          <span>{description}</span>
        </div>
        <div className={style.btnBox} onClick={onClinkDetail}>Entry</div>
      </div>
    </div>
  );
}
