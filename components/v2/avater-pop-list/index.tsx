import React from 'react';

import cn from 'classnames';

import style from './index.module.css';

class Avater {
  logoUrl?: string;

  id?: string;

  isCreator?: string;

  address?: string;

  isBuildings?: string;
}

interface Props {
  avaters?: Array<Avater>;
  onActive?: (x) => void;
  type?: 'buildings' | 'wearables';
}

export default function AvaterPopList({ avaters, onActive, type }: Props) {
  return (
    <div className="">
      {avaters.map((item, idx) => {
        return (
          <img
            onClick={() => {
              window.open(
                `https://www.metacat.world/topic/${
                  type === 'buildings' ? item.id : item.address
                }?type=${type}`,
              );
            }}
            className={cn(
              'float-left w-24 h-24 -mr-3 rounded-full',
              idx === avaters.length - 1 ? 'float-none' : null,
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
