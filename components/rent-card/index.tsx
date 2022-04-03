import React from 'react';
import cn from 'classnames';

import CoverImg from '../cover-img';
import style from './index.module.css';

type Props = {
  parcel_id: number;
  name: string;
  island: string;
  suburb: string;
  height: number;
  area: number;
  built_status: number;
  end_date: string;
  traffic: number;
  price: string;
  cover_img_url: string;
  onClick?;
};

export default function Card({
  parcel_id,
  name,
  island,
  suburb,
  height,
  area,
  built_status,
  end_date,
  traffic,
  price,
  cover_img_url,
  onClick,
}: Props) {
  return (
    <div
      className={cn('text-white flex flex-col justify-center items-center p-5', style.card)}
      onClick={() => {
        onClick({
          parcel_id,
          name,
          island,
          suburb,
          height,
          area,
          built_status,
          end_date,
          traffic,
          price,
          cover_img_url,
        });
      }}
    >
      <div className={style.imgContanier}>
        <CoverImg
          className={style.img}
          img={cover_img_url}
          error="/images/default-cover.png"
        ></CoverImg>
      </div>
      <div className={cn('p-5 flex-1', style.content)}>
        <h2>
          {`${island} `}
          <span>.</span>
          {` ${suburb}`}
        </h2>
        <div className={style.price}>{`${price} ETH/WEEK`}</div>
        <div className={style.detail}>
          <div className={cn('flex', style.coord)}>
            <img src="/images/icon/traffic.png" />
            <div>{`Month Traffic :  ${traffic}`}</div>
          </div>
          <div className={cn('flex', style.plot)}>
            <img src="/images/icon/dizhi.png" />
            <div>{`#${parcel_id} ${name}`}</div>
          </div>
          <div className={cn('flex', style.info)}>
            <img src="/images/icon/dikuai.png" />
            <div className={style.info_item}>{`${area}㎡`}</div>
            <div className={style.info_item}>{`${height}m High`}</div>
            <div className={style.info_item}>{built_status === 0 ? 'Not Built' : 'Built'}</div>
            <div className={style.info_item}>{end_date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
