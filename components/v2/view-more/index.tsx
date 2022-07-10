import React from 'react';
import cn from 'classnames';

import Link from 'next/link';

import style from './index.module.css';

interface Props {
  link?: string;
  className?: string;
  imgClass?: string;
}

export default function ViewMore({
  link,
  className = ' text-sm font-normal',
  imgClass = 'w-3 h-3',
}: Props) {
  return (
    <div
      onClick={() => {
        if (link) {
          window.open(link);
        }
      }}
      className={cn(' flex items-center event-hand', style.base, className)}
    >
      View More
      <img className={cn('ml-2 ', imgClass)} src="/images/carousel-right.png"></img>
    </div>
  );
}
