import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import style from './index.module.css';

type Props = {
  options?;
  className?: string;
  location?: string;
};

export default function TwoNav({ options, className, location }: Props) {
  return (
    <div className={cn(location)}>
      {options.map((item, index) => {
        return (
          <Link href={item.link}>
            <div key={index} className={cn(style.item, className)} style={{ display: 'flex' }}>
              <img
                src={item.icon}
                style={{
                  width: '30px',
                  height: '30px',
                  lineHeight: '30px',
                  borderRadius: '50%',
                  marginTop: '12px',
                }}
              ></img>
              <Link href={item.link}>{item.label}</Link>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
