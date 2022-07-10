import React, { useState } from 'react';

import cn from 'classnames';

import style from './index.module.css';

class Avater {
  logoUrl?: string;

  id?: string;

  isCreator?: string;

  address?: string;

  isBuildings?: string;

  fullUrl?: string;
}

interface Props {
  avaters?: Array<Avater>;
  onActive?: (x) => void;
  type?: 'buildings' | 'wearables';
}

export default function AvaterPopList({ avaters, onActive, type }: Props) {
  const all = avaters.slice(0, 7);
  all.push({
    logoUrl: '/images/v2/1.png',
    fullUrl: `https://www.metacat.world/${type === 'buildings' ? 'build/builders' : 'wearables'}`,
  });

  return (
    <div className="">
      {all.map((item, idx) => {
        return (
          <img
            onClick={() => {
              if (item.fullUrl) {
                window.open(item.fullUrl);
                return;
              }
              window.open(
                `https://www.metacat.world/topic/${
                  type === 'buildings' ? item.id : item.address
                }?type=${type}`,
              );
            }}
            className={cn(
              'float-left w-24 h-24 -mr-5 rounded-full cursor-pointer',
              idx === all.length - 1 ? 'float-none' : null,
              style.avater,
            )}
            key={idx}
            src={item.logoUrl}
          ></img>
        );
      })}
    </div>
  );
}
