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
  parcelsIds?;
  state?;
  onClick?;
  selectedIds?;
};

export default function Card({
  area,
  coverImgUrl,
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
  parcelsIds,
  state,
  onClick,
  selectedIds,
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

  React.useEffect(() => {
    console.log('');
  }, [parcelsIds, selectedIds]);

  const tag1 = () => {
    if (selectedIds.findIndex((item) => item === parcelId) === -1) {
      return (
        <div>
          <img src="/images/Group2.png" className={style.changeImg} />
        </div>
      );
    }
    return (
      <div>
        <img src="/images/Group1.png" className={style.changeImg} />
      </div>
    );
  };
  const tag2 = () => {
    if (parcelsIds.findIndex((item) => item === parcelId) !== -1) {
      return tag1();
    }
    return <div className={style.shade}></div>;
  };
  const tag3 = () => {
    return state ? tag2() : <div></div>;
  };
  return (
    <div
      className={cn('text-white flex flex-col justify-center items-center p-5', style.card)}
      onClick={
        state
          ? () => {
              onClick(parcelId, parcelsIds, state);
            }
          : jumpToParcel
      }
    >
      {tag3()}

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
        <ParcelsState status={status} price={price} id={parcelId} is_state={state} />
        <div className={style.detail}>
          <div className={cn('flex', style.coord)}>
            <img src="/images/icon/traffic.png" />
            <div>{`Month Traffic :  ${traffic}`}</div>
          </div>
          <div className={cn('flex', style.plot)}>
            <img src="/images/icon/dizhi.png" />
            <div>{`#${parcelId} ${name}`}</div>
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
