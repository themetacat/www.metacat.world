import React from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import style from './index.module.css';

type Props = {
  author?: string;
  desc?: string;
  cover_img_url?: string;
  link_url?: string;
  source: string;
  time: string;
  title: string;
  activityTime?: string;
  eventDetailUrl?: string;
  eventParcelUrl?: string;
  className?: string;
};

dayjs.extend(utc);

export default function LearnCard({
  author,
  desc,
  cover_img_url,
  time,
  link_url,
  title,
  activityTime,
  source,
  eventDetailUrl,
  eventParcelUrl,
  className,
}: Props) {
  const jumpToParcel = React.useCallback(
    (event) => {
      event.stopPropagation();
      window.open(eventParcelUrl);
    },
    [eventParcelUrl],
  );

  const jumpToDetail = React.useCallback(() => {
    window.open(link_url);
  }, [link_url]);

  const inTimeLine = React.useCallback(() => {
    if (!activityTime) {
      return false;
    }
    const times = activityTime.split('--');
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
  }, [activityTime]);
  const hasEntry = inTimeLine();
  return (
    <div className={cn('p-5 flex', className, style.card)} onClick={jumpToDetail}>
      <img className={style.cover} src={cover_img_url || '/images/default.png'} />
      <div className={cn('flex-1 ', style.content)}>
        <div className={cn('flex h-auto justify-between items-center text-white')}>
          <div className={hasEntry ? 'w-11/12' : 'w-full'}>
            <div className={cn('text-xl font-semibold truncate', style.header)}>{title}</div>
            <div className={cn('flex',)}>
              {time ? <div className={cn('text-base', style.time)}>{time}</div> : null}
              <div className={cn('text-base', style.company)}>{source}</div>
              <div className={cn('text-base', style.name)}>{author}</div>
            </div>
          </div>
          {/* {hasEntry ? (
            <div
              className={cn('text-sm flex justify-center items-center', style.btn)}
              onClick={jumpToParcel}
            >
              2222222222233333333
            </div>
          ) : null} */}
        </div>
        <div className={cn('text-sm', style.description)}>{desc}</div>
      </div>
    </div>
  );
}
