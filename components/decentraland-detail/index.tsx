import React, { CSSProperties, HTMLAttributes, LegacyRef, useEffect } from 'react';
import cn from 'classnames';

import CoverImg from '../cover-img';

import styles from './index.module.css';

interface Price {
  eth?: number;
  usd?: number;
}

interface traffic {
  month?: number;
  week?: number;
  all?: number;
}

interface timeRangeSale {
  mana?: string;
  usd?: number;
}

interface lastSale {
  date?: string;
  mana?: string;
  isPrimary?: number;
  usd?: number;
}

interface params {
  landId?: string;
  estateId?: string;
  name?: string;
  description?: string;
  coverImgUrl?: string;
  openseaUrl?: string;
  parcelPageUrl?: string;
  lastSaleList?: Array<lastSale>;
  timeRangeSale?: timeRangeSale;
}

interface Prop {
  options?: params;
  className?: string;
  style?: HTMLAttributes<CSSProperties>;
  trafficType?: string;
  mapType?: string;
  x?: number;
  y?: number;
  close?: () => void;
  showRef?: boolean;
}

// "land_id": "115792089237316195423570985008687907802227629627499794519951392893147897921560",
//     "estate_id": 0,
//     "name": "Fashion District Parcel (2)",
//     "description": "Great Location",
//     "cover_img_url": "https://api.decentraland.org/v2/parcels/-150/24/map.png",
//     "opensea_url": "https://opensea.io/assets/0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d/115792089237316195423570985008687907802227629627499794519951392893147897921560",
//     "parcel_page_url": "https://market.decentraland.org/contracts/0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d/tokens/115792089237316195423570985008687907802227629627499794519951392893147897921560",
// traffic.week	int	地块最近7天流量
// traffic.month	int	地块最近30天流量
// traffic.all	int	地块总流量
// last_price.eth	float	地块最后一次交易金额对应的eth
// last_price.usd	int	地块最后一次交易金额对应的usd

export default function DecentralandDeatil({
  options,
  className,
  style,
  close,
  trafficType,
  mapType,
  x,
  y,
  showRef = false,
}: Prop) {
  // const {parcelId, name, coverImgUrl, openseaUrl, parcelPageUrl, island, suburb, traffic, lastPrice } = detail;
  const jumpToOpenC = (event) => {
    event.stopPropagation();
    if (options) {
      window.open(options.openseaUrl);
    }
  };

  const jumpToParcel = (event) => {
    event.stopPropagation();
    if (options) {
      window.open(options.parcelPageUrl);
    }
  };

  const closePop = React.useCallback(
    (event) => {
      event.stopPropagation();
      close();
    },
    [null],
  );

  const getLabel = (type, op) => {
    let preffix = 'Week Traffic：';
    let label = '';
    if ((mapType === 'price' && !op.timeRangeSale) || (mapType === 'traffic' && !op.traffic)) {
      return '';
    }
    if (type === 'total') {
      preffix = 'Total Traffic：';
      label = op.traffic.all;
    }

    if (type === 'monthly') {
      preffix = 'Monthly Traffic：';
      label = op.traffic.month;
    }
    const condition = op.timeRangeSale?.mana
      ? `${op.timeRangeSale.mana}MANA(${op.timeRangeSale.usd}U)`
      : '';
    if (type === 'all') {
      preffix = 'All-Time Sales：';
      label = condition;
    }

    if (type === 'month') {
      preffix = 'Monthly Sales：';
      label = condition;
    }

    if (type === 'quarter') {
      preffix = 'Quarterly Sales：';
      label = condition;
    }

    if (type === 'year') {
      preffix = 'Yearly Sales：';
      label = condition;
    }

    if (label === 'WEEK') {
      label = op.traffic.week;
    }

    return (
      <>
        <span className="text-white">{preffix}</span>
        <span>{label}</span>
      </>
    );
  };

  // date?: string;
  // mana?: string;
  // isPromary?: number;
  // usd?: number;
  const renderUl = React.useCallback(
    (list: Array<lastSale>) => {
      if (list && list.length > 0) {
        return (
          <>
            {list.map((ite, idx) => {
              return (
                <li key={idx} className={cn('', styles.sales)}>
                  {`${ite.date} ${ite.isPrimary > 0 ? '(primary sales) /' : ''}`}{' '}
                  <span className="text-white">{`${ite.mana}MANA(${ite.usd}U)`}</span>
                </li>
              );
            })}
          </>
        );
      }
      return <li className={cn('', styles.sales)}>NO DATA</li>;
    },
    [null],
  );

  return options ? (
    <div
      className={cn(className, styles.popup, mapType === 'price' ? '' : styles.widthlimit)}
      style={{ top: y, left: x, display: showRef ? 'block' : 'hidden' }}
      onClick={jumpToParcel}
    >
      <div className={cn('flex justify-between items-center', styles.titleContainer)}>
        <div className={cn('truncate w-full', styles.title)}></div>
        <img className={styles.close} src="/images/close-pop.png" onClick={closePop}></img>
      </div>
      <div className="flex justify-start items-start mt-0">
        <CoverImg className={styles.cover} img={options.coverImgUrl} />
        <div className="ml-2 w-full">
          <div className={cn('flex justify-between', styles.row)}>
            <span
              className={cn('text-white font-semibold text-base truncate', styles.name)}
              title={options.name}
            >
              {options.name}
            </span>
            <img src="/images/Nomal.png" className={styles.icon} onClick={jumpToOpenC}></img>
          </div>
          <div className={cn('mt-1 font-medium', styles.label)}>
            <div className={cn('truncate', styles.description)}>{options.description}</div>
            <div className="flex justify-between items-center">
              {getLabel(trafficType, options)}
            </div>
          </div>
        </div>
      </div>
      <div className={cn('mt-1 font-medium', styles.label)}>
        Last two sales：
        <ul className="list-none">{renderUl(options.lastSaleList)}</ul>
      </div>
    </div>
  ) : null;
}
