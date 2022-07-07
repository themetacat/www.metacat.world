import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import style from './index.module.css';

type Props = {
  options?;
  className?: string;
  location?: string;
  widthType?: string;
};

export default function TwoNavigation({
  options,
  className,
  location,
  widthType = 'short',
}: Props) {
  return (
    <div className={cn(' rounded', style.base, location, style[widthType])}>
      {options.map((item, index) => {
        return (
          <div
            key={index}
            className={cn(
              'flex justify-start items-center',
              style.item,
              className,
              index === 0 ? ' rounded-t' : null,
              index === options.length - 1 ? ' rounded-b' : null,
            )}
          >
            {item.icon ? (
              <img className={cn(' rounded-xl w-6 h-6 mr-2', style.border)} src={item.icon}></img>
            ) : null}
            <Link href={item.link}>{item.label}</Link>
          </div>
        );
      })}
    </div>
  );
}
