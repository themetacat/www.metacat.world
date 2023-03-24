import React from 'react';
import cn from 'classnames';

import CoverImg from '../cover-img';

import style from './index.module.css';

type Props = {
  coverImgUrl?: string;
  cover_img?: string;
  name?: string;
  description?: string;
  type?: string;
  parcelPageUrl?: string;
  openseaUrl?: string;
  opensea_url?: string;
  detail_url?: string;
  hasTypeTag?: boolean;
  world?: string;
  coverImg: string;
  typeState?: string;
};

export default function Card({
  coverImgUrl,
  coverImg,
  cover_img,
  name,
  description,
  type,
  openseaUrl,
  opensea_url,
  detail_url,
  parcelPageUrl,
  hasTypeTag = true,
  world,
  typeState,
}: Props) {
  const jumpToOpenC = React.useCallback(

    // window.open( detail_url);
    (event) => {
      event.stopPropagation();
      // console.log(openseaUrl, "detail_url");
      window.open( opensea_url ||openseaUrl);
    },
    [openseaUrl],
  );
  const jumpToParcel = React.useCallback(() => {
    window.open(parcelPageUrl || detail_url);
    // window.open(openseaUrl); 

  }, [parcelPageUrl, detail_url]);

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
          img={coverImgUrl || coverImg ||cover_img}
          error="/images/default-cover.png"
        ></CoverImg>
        {
          typeState && <span className={style.typeIcon}>{type}</span>
        }
      </div>
      <div className={cn(' flex-1', style.content)}>
        <div className={cn('flex justify-between items-center', style.contnetHeader)}>
          <div className={cn("text-xl font-semibold truncate flex-1 mr-3", style.name)} title={name}>
            {name}
          </div>
          {openseaUrl ||opensea_url ? (
            <img src="/images/Nomal.png" className={style.icon} onClick={jumpToOpenC}></img>
          ) : null}

        </div>
        <div className={cn('text-xs my-3', style.description)}>{description}</div>
      </div>
    </div>
  );
}
