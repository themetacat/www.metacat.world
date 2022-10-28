import React, { useState, useEffect } from 'react';
import SearchInput from 'react-search-input';
import cn from 'classnames';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
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

dayjs.extend(utc);

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

  const inTimeLine = React.useCallback(() => {
    if (!activity_time) {
      return false;
    }
    const times = activity_time.split('--');
    const start = times[0].trim();
    const end = times[1].trim();
    if (!start || !end) {
      return false;
    }
    const time1 = dayjs.utc(start);
    const time2 = dayjs.utc(end);
    const n = Date.now();
    if (time1.valueOf() <= n && time2.valueOf() >= n) {
      return true;
    }
    return false;
  }, [activity_time]);
  const hasEntry = inTimeLine();



  return (
    <div className={style.container} onClick={detailInston}>
      {/* <img src={cover_img} className={style.imgBox}></img> */}
      {/* onClick={hasEntry === false ? null : detailInston} */}
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
        {/* {
          hasEntry ? <div className={style.btnBox} onClick={onClinkDetail}>Entry</div> :
            <div className={style.btnBoxOver}>Over</div>
        } */}
        <div className={cn('', status === 'Entry' ? style.btnBox : style.btnBoxOver)} onClick={onClinkDetail}>{status}</div>
      </div>
    </div>
  );
}
