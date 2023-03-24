import React from 'react';
import cn from 'classnames';

import CoverImg from '../cover-img';

import style from './index.module.css';

type Props = {
  coverImg?: string;
  name?: string;
  description?: string;
  type?: string;
  detailUrl?: string;
  openseaUrl?: string;
  hasTypeTag?: boolean;
  world?: string;
  typeState?: string;
};

export default function Card({
  coverImg,
  name,
  description,
  type,
  openseaUrl,
  detailUrl,
  hasTypeTag = true,
  world,
  typeState
}: Props) {
  const jumpToOpenC = React.useCallback(
    (event) => {
      event.stopPropagation();
      window.open(openseaUrl);
    },
    [openseaUrl],
  );
  const jumpToParcel = React.useCallback(() => {
    window.open(detailUrl);
  }, [detailUrl]);

  return (
    <div
      className={cn('text-white flex flex-col justify-center items-center p-5', style.card)}
      onClick={jumpToParcel}
    >
      <div className={style.imgContanier}>
        {world ? (
          <div className={cn('flex items-center justify-center text-sm font-medium', style.tag)}>
            {world}
          </div>
        ) : null}
        <CoverImg
          className={style.img}
          img={coverImg}
          error="/images/default-cover.png"
        ></CoverImg>
        {
          typeState && <span className={style.typeIcon}>{typeState}</span>
        }
      </div>
      <div className={cn('p-5 flex-1', style.content)}>
        <div className={cn('flex justify-between items-center', style.contnetHeader)}>
          <div className={cn("text-xl font-semibold truncate flex-1 mr-3", style.name)} title={name}>
            {name}
          </div>
          {openseaUrl ? (
            <img src="/images/Nomal.png" className={style.icon} onClick={jumpToOpenC}></img>
          ) : null}

        </div>
        {/* <div className={cn('text-xs my-3', style.description)}>{description}</div> */}
      </div>
    </div>
  );
}
