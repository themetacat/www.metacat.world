import React from 'react';
import cn from 'classnames';
import { v4 as uuid } from 'uuid';

import CoverImg from '../cover-img';
import ParcelsState from '../parcels-dcl-state';
import style from './index.module.css';

type Props = {
  parcelId: string;
  name: string;
  description: string;
  coordinate: Array<string>;
  type: string;
  internalType: string;
  landTotal: number;
  coverImgUrl: string;
  openseaUrl: string;
  parcelPageUrl: string;
  price: number;
  status: string;
  endDate: string;
  isBuilt: string;
  parcelsIds?;
  state?;
  onClick?;
  selectedIds?;
};

export default function Card({
  parcelId,
  name,
  description,
  coordinate,
  type,
  internalType,
  landTotal,
  coverImgUrl,
  openseaUrl,
  parcelPageUrl,
  price,
  status,
  endDate,
  isBuilt,
  parcelsIds,
  state,
  onClick,
  selectedIds,
}: Props) {
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
        <h2>{name}</h2>
        {/* <ParcelsState status={status} price={price} id={parcelId} is_state={state} /> */}
        <div className={style.detail}>
          <div className={cn('flex', style.plot)}>
            <img src="/images/icon/dizhi.png" />
            {coordinate
              ? coordinate.map((item, i) => {
                  if (i <= 2) {
                    return (
                      <div className={i === 2 ? null : style.coord} key={uuid()}>
                        {item}
                      </div>
                    );
                  }
                  return (
                    <span className={style.shenglue} key={uuid()}>
                      ...
                    </span>
                  );
                })
              : null}
          </div>
          <div className={cn('flex', style.info)}>
            <img src="/images/icon/dikuai.png" />
            <div className={style.info_item}>
              {internalType === 'land' ? 'Land' : null}
              {internalType === 'estate' ? `Estate (${landTotal} Land)` : null}
            </div>
            {status === 'not_for_rent' ? null : (
              <div className={cn(style.info_item, status === 'not_for_rent' ? style.dn : null)}>
                {isBuilt === 'no' ? 'Not Built' : 'Built'}
              </div>
            )}
            {status === 'not_for_rent' ? null : (
              <div className={cn(style.info_item, status === 'not_for_rent' ? style.dn : null)}>
                {endDate}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
