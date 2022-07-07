import React from 'react';
import cn from 'classnames';

import HeatMapTag from '../heatmap-tag';

import style from './index.module.css';

class tag {
  icon?: string;

  label?: string;

  link?: string;

  onActive?: (x) => void;
}

interface Props {
  tags?: Array<tag>;
  label?: string;
  className?: string;
  onActive?: (x) => void;
}

export default function HeatMapCard({ tags, label, className, onActive }: Props) {
  return (
    <div
      className={cn(' text-white bg-white bg-opacity-10 p-7 rounded-2xl', style.card, className)}
    >
      <div className=" text-base font-bold mb-6 flex justify-start items-center">
        <span className=" w-2 h-2 rounded-lg mr-2 bg-mainDark"></span>
        {label}
      </div>
      <div className="flex flex-wrap">
        {tags.map((item) => {
          return (
            <HeatMapTag
              icon={item.icon}
              label={item.label}
              key={item.label}
              link={item.link}
              onActive={onActive}
              className={' mr-2 mb-3'}
            ></HeatMapTag>
          );
        })}
      </div>
    </div>
  );
}
