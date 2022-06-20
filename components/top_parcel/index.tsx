import React from 'react';
import { formatNum } from '../../common/utils';
import CoverImg from '../cover-img';
import style from './index.module.css';

type Props = {
  mapType?: string;
  staticType?: string;
  bought_price_eth?: number;
  bought_price_usd?: number;
  bought_time?: string;
  cover_img?: string;
  name?: string;
  parcel_id?: string;
  traffic?: string;
  idx?: number;
  opensea_url?: string;
  parcel_url?: string;
};

export default function TopParcel({
  mapType,
  staticType,
  bought_price_eth,
  bought_price_usd,
  bought_time,
  cover_img,
  name,
  parcel_id,
  traffic,
  idx,
  opensea_url,
  parcel_url,
}: Props) {
  return (
    <div
      className={style.container}
      onClick={() => {
        window.open(parcel_url);
      }}
    >
      <div className={style.imgContainer}>
        <div className={style.desc}>{idx + 1}</div>
        <CoverImg
          className={style.img}
          img={cover_img}
          error="/images/default-cover.png"
        ></CoverImg>
      </div>
      <div className={style.detail}>
        <div className={style.name}>{name}</div>
        <div className={mapType.toLocaleUpperCase() === 'PRICE' ? style.parcelId : style.traffic}>
          Parcel ID: {parcel_id}
        </div>
        {mapType.toLocaleUpperCase() === 'PRICE' ? (
          <>
            <div className={style.info}>Sale price:</div>
            <div className={style.info}>
              {bought_time} / {bought_price_eth} ETH({formatNum(bought_price_usd)} USD)
            </div>
          </>
        ) : (
          <div className={style.info}>
            {staticType === 'WEEKLY' ? 'Week ' : null}
            {staticType === 'MONTHLY' ? 'Month ' : null}
            {staticType === 'TOTAL' ? 'Total ' : null}
            Traffic: {traffic}
          </div>
        )}
      </div>
      {opensea_url ? (
        <img
          src="/images/Nomal.png"
          className={style.icon}
          onClick={() => {
            window.open(opensea_url);
          }}
        />
      ) : null}
    </div>
  );
}
