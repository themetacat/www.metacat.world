import React from 'react';
import cn from 'classnames';

import CoverImg from '../cover-img';
import ParcelsState from '../parcels-state';
import style from './index.module.css';

type Props = {
  area?: number;
  coverImgUrl?: string;
  description?: string;
  endDate?: string;
  high?: number;
  isBuilt?: string;
  island: string;
  name?: string;
  openseaUrl?: string;
  parcelId?: number;
  parcelPageUrl?: string;
  price?: number;
  status?: string;
  suburb?: string;
  traffic?: number;
  type?: string;
};

export default function Card({
  area,
  coverImgUrl,
  description,
  endDate,
  high,
  isBuilt,
  island,
  name,
  openseaUrl,
  parcelId,
  parcelPageUrl,
  price,
  status,
  suburb,
  traffic,
  type,
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
        <CoverImg
          className={style.img}
          img={coverImgUrl}
          error="/images/default-cover.png"
        ></CoverImg>
      </div>
      <div className={cn('p-5 flex-1', style.content)}>
        <h2>
          {`${island} `}
          <span>.</span>
          {` ${suburb}`}
        </h2>
        <ParcelsState status={status} price={price} />
        <div className={style.detail}>
          <div className={cn('flex', style.coord)}>
            <img src="/images/icon/traffic.png" />
            <div>{`Month Traffic :  ${traffic}`}</div>
          </div>
          <div className={cn('flex', style.plot)}>
            <img src="/images/icon/dizhi.png" />
            <div>{`#  ${parcelId}:MetaCat`}</div>
          </div>
          <div className={cn('flex', style.info)}>
            <img src="/images/icon/dikuai.png" />
            <div className={style.info_item}>{`${area}㎡`}</div>
            <div className={style.info_item}>{`${high}m High`}</div>
            <div className={style.info_item}>{isBuilt === 'no' ? 'Not Built' : 'Built'}</div>
            <div className={style.info_item}>{endDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
