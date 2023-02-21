import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import style from './index.module.css';

type Props = {
  options?;
  iconImgLight?;
  className?: string;
  location?: string;
};

export default function TwoNav({ options,iconImgLight, className, location }: Props) {
  return (
    <div className={cn(location)}>
      {options.map((item, index) => {
        return (
          <Link href={item.link}>
            <div key={index} className={cn(iconImgLight===true?style.itemTotal:style.item, className)} style={{ display: 'flex' }}>
              <img
                src={item.icon}
                style={{
                  width: '25px',
                  height: '25px',
                  marginRight:"8px",
                  lineHeight: '30px',
                  borderRadius: '50%',
                  marginTop: '12px',
                  border:"0.3px solid rgba(255,255,255,0.3)",
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
