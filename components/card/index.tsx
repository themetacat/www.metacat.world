import React from 'react';
import cn from 'classnames';

import CoverImg from '../cover-img';

import style from './index.module.css';

type Props = {
  coverImgUrl?: string;
  name?: string;
  description?: string;
  type?: string;
  parcelPageUrl?: string;
  openseaUrl?: string;
  hasTypeTag?: boolean;
};

export default function Card({
  coverImgUrl,
  name,
  description,
  type,
  openseaUrl,
  parcelPageUrl,
  hasTypeTag = true,
}: Props) {
  const jumpToOpenC = React.useCallback(
    (event) => {
      event.stopPropagation();
      window.open(openseaUrl);
    },
    [openseaUrl],
  );

  const jumpToParcel = React.useCallback(() => {
    window.open(parcelPageUrl);
  }, [parcelPageUrl]);

  return (
    <div
      className={cn('text-white flex flex-col justify-center items-center p-5', style.card)}
      onClick={jumpToParcel}
    >
      <div className={style.imgContanier}>
        {hasTypeTag && type ? (
          <div className={cn('flex items-center justify-center text-sm font-medium', style.tag)}>
            {type}
          </div>
        ) : null}
        <CoverImg
          className={style.img}
          img={coverImgUrl}
          error="/images/default-cover.png"
        ></CoverImg>
      </div>
      <div className={cn('p-5 flex-1', style.content)}>
        <div className={cn('flex justify-between items-center', style.contnetHeader)}>
          <div className="text-xl font-semibold truncate flex-1 mr-3" title={name}>
            {name}
          </div>
          <img src="/images/Nomal.png" className={style.icon} onClick={jumpToOpenC}></img>
        </div>
        <div className={cn('text-xs my-3', style.description)}>{description}</div>
      </div>
    </div>
  );
}
