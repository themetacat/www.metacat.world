import React from 'react';
import cn from 'classnames';
import Link from 'next/link';

import CoverImg from '../cover-img';

import style from './index.module.css';

type Props = {
  topicId?: number;
  name?: string;
  type?: string;
  imgUrlList?: Array<string>;
};

export default function TopicCard({ topicId, name, type, imgUrlList }: Props) {
  return (
    <Link href={`/topic/${topicId}`}>
      <div className={cn('relative', style.topicCard)}>
        <div
          className={cn(
            'absolute top-2 right-2 flex justify-center items-center font-medium text-xs p-1',
            style.type,
          )}
        >
          {type}
        </div>
        <div className="w-full h-full flex flex-wrap">
          {imgUrlList.map((img, idx) => {
            return <CoverImg className="w-1/2 h-1/2" img={img} key={idx}></CoverImg>;
          })}
        </div>
        <div
          className={cn(
            'absolute text-white font-semibold w-full bottom-0 flex justify-between px-4 text-lg items-center',
            style.footer,
          )}
        >
          <div>{name}</div>
        </div>
      </div>
    </Link>
  );
}
