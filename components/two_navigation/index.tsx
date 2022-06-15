import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import style from './index.module.css';

type Props = {
  options?;
  className?: string;
  location?: string;
};

export default function TwoNavigation({ options, className, location }: Props) {
  return (
    <div className={cn(location)}>
      {options.map((item, index) => {
        return (
          <div key={index} className={cn(style.item, className)}>
            <Link href={item.link}>{item.label}</Link>
          </div>
        );
      })}
    </div>
  );
}
