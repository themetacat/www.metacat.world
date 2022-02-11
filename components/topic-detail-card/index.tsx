import React from 'react';
import cn from 'classnames';

import CoverImg from '../cover-img';

import style from './index.module.css';

type Props = {
  topicId?: string;
  name?: string;
  imgUrlList?: Array<string>;
};

export default function TopicDetailCard({ topicId, name, imgUrlList }: Props) {
  return (
    <a href={`/topic/${topicId}`} target="_blank">
      <div className={cn('relative', style.topicCard)}>
        {/* <div
          className={cn(
            'absolute top-2 right-2 flex justify-center items-center font-medium text-xs p-1',
            style.type,
          )}
        >
          {type}
        </div> */}
        <div className={cn('w-full flex flex-wrap')}>
          {imgUrlList.map((img, idx) => {
            return (
              <CoverImg className={cn('w-1/2 h-1/2', style.cover)} img={img} key={idx}></CoverImg>
            );
          })}
        </div>
        <div
          className={cn(
            'text-white flex-1 font-semibold w-full bottom-0 flex justify-between p-4 pb-6 text-lg items-center',
            style.footer,
          )}
        >
          <div className={cn('text-base font-semibold', style.description)}>{name}</div>
        </div>
      </div>
    </a>
  );
}
