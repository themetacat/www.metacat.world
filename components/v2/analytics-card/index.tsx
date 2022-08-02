import React, { ReactElement } from 'react';
import cn from 'classnames';

import ViewMore from '../view-more';

import style from './index.module.css';

interface Props {
  title?: string;
  link?: string;
  children?: ReactElement|any;
  baseSize?: boolean;
  className?: string;
  backCls?: string;
}

export default function AnalyticsCard({
  title,
  link,
  children,
  baseSize = true,
  className,
  backCls,
}: Props) {
  const cls = style[backCls];
  
  const pageNew = React.useCallback(
    () => {
      console.log(title);
      if (title === "Floor Price") {
        window.open("https://www.metacat.world/analytics");
      }
    }, []
  )

  return (
    <div
      className={cn(
        'base-border rounded-2xl bg-black bg-opacity-90 overflow-hidden',
        baseSize ? style.base : style.big,
        cls,
        className,
      )}
      onClick={ pageNew }
    >
      <div className="flex justify-between items-center p-5 pt-8 border-solid border-b border-white border-opacity-30">
        <div className=" text-white text-base font-medium ">{title}</div>
        <ViewMore
          link={link}
          className=" text-xs font-normal" imgClass="w-2 h-2"></ViewMore>
      </div>
      {children}
    </div>
  );
}
