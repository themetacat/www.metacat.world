import React from 'react';
import cn from 'classnames';
import { v4 as uuid } from 'uuid';

import CoverImg from '../cover-img';
import ParcelsState from '../parcels-dcl-state';
import style from './index.module.css';

type Props = {
  parcel_id: string;
  name: string;
  coordinate: Array<string>;
  internal_type: string;
  land_total: number;
  cover_img_url: string;
  parcel_page_url: string;
  price: number;
  end_date: string;
  built_status: number;
  owner: unknown;
  onClick?
};

export default function Card({
  parcel_id,
  name,
  coordinate,
  internal_type,
  land_total,
  cover_img_url,
  parcel_page_url,
  price,
  end_date,
  built_status,
  owner,
  onClick
}: Props) {


  return (
    <div
      className={cn('text-white flex flex-col justify-center items-center p-5', style.card)}
      onClick={
        () => {
          onClick(
            {
              parcel_id,
              name,
              coordinate,
              internal_type,
              land_total,
              cover_img_url,
              parcel_page_url,
              price,
              end_date,
              built_status,
              owner
            }
          )
        }
      }
    >
      <div className={style.imgContanier}>
        <CoverImg
          className={style.img}
          img={cover_img_url}
          error="/images/default-cover.png"
        ></CoverImg>
      </div>
      <div className={cn('p-5 flex-1', style.content)}>
        <h2>{name}</h2>
        <div className={style.price}>{`${price} ETH/WEEK`}</div>
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
              {internal_type === 'land' ? 'Land' : null}
              {internal_type === 'estate' ? `Estate (${land_total} land)` : null}
            </div>
            <div className={cn(style.info_item)}>
              {built_status === 0 ? 'Not Built' : 'Built'}
            </div>
            <div className={cn(style.info_item)}>
              {end_date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
