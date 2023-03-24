import React from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import style from './index.module.css';

type Props = {
  author?: string;
  cover_img_url?: string;
  desc?: string;
  id?: number;
  link_url?: string;
  source?: string;
  time?: string;
  title?: string;
  className?: string;
};

dayjs.extend(utc);

export default function EventCard({
  author,
  cover_img_url,
  desc,
  id,
  link_url,
  source,
  time,
  title,
  className,
}: Props) {
  const jumpToDetail = React.useCallback(() => {
    window.open(link_url);
  }, [link_url]);

  const inTimeLine = React.useCallback(() => {
    // if (!activityTime) {
    //   return false;
    // }
    // const times = activityTime.split('--');
    // const start = times[0].trim();
    // const end = times[1].trim();
    // if (!start || !end) {
    //   return false;
    // }
    // const time1 = dayjs.utc(start);
    // const time2 = dayjs.utc(end);
    // const n = Date.now();
    // if (time1.valueOf() <= n && time2.valueOf() >= n) {
    //   return true;
    // }
    // return false;
    return false;
  }, []);
  const hasEntry = inTimeLine();
  return (
    <div className={cn('p-5 flex ', className, style.card)} onClick={jumpToDetail}>
     <img 
        className={cover_img_url ? style.cover2 : style.cover}
        src={cover_img_url || '/images/default.png'}
      />
      <div className={cn('flex-1 ', style.content)}>
        <div className={cn('flex h-auto justify-between items-center text-white')}>
          <div className={hasEntry ? 'w-11/12' : 'w-full'}>
            <div className={cn('text-xl font-semibold truncate', style.header)}>{title}</div>
            <div className={cn('flex', style.detail)}>
              <div className={style.time}>{time}</div>
              <div className={cn('mr-5 ml-5', style.source)}>{source}</div>
              <div className={style.author}>{author}</div>
            </div>
            <div className={style.desc}>{desc}</div>
          </div>
        </div>
        {/* <div className={cn('text-sm', style.description)}>{description}</div> */}
      </div>
    </div>
  );
}
