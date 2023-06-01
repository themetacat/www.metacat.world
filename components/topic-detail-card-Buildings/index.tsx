import React from 'react';
import cn from 'classnames';

import CoverImg from '../cover-img';

import style from './index.module.css';

type Props = {
  topicId?: string;
  name?: string;
  imgUrlList?: Array<string>;
  coverImg?: string;
  detailUrl?: string;
};

export default function TopicDetailCardBuildings({ topicId, name, imgUrlList, coverImg, detailUrl }: Props) {
  return (
    <a
      onClick={() => {
        if (topicId) {
          window.open(`/topic/${topicId}`);
        } else {
          window.open(detailUrl);
        }
      }}
       target="_blank" 
       rel="noreferrer,noopener"
    >
      <div className={cn('relative', style.topicCard)} >
        {/* <div
          className={cn(
            'absolute top-2 right-2 flex justify-center items-center font-medium text-xs p-1',
            style.type,
          )}
        >
          {type}
        </div> */}
        <div className={cn('w-full flex flex-wrap')}>
          {imgUrlList && imgUrlList.length !== 0 ? (
            imgUrlList.map((img, idx) => {
              return (
                <img
                  className={cn('w-1/2 h-1/2', style.cover)}
                  // className={style.cover}
                  style={{width:"50%",height:"145px"}}
                  src={img}
                  onError={() => {
                    this.src = '/images/logo.png';
                  }}
                  key={idx}
                ></img>
              );
            })
          ) : (
            <img className={style.oneImg} src={coverImg} />
          )}
        </div>
        {/* <div
          className={cn(
            'text-white flex-1 font-semibold w-full bottom-0 flex justify-between items-start',
            style.footer,
          )}
        > */}
          <div className={cn('text-base font-semibold',style.footer, style.description)}>{name}</div>
        {/* </div> */}
      </div>
    </a>
  );
}
