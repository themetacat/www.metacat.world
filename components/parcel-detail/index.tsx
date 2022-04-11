import React, { CSSProperties, HTMLAttributes, useEffect } from 'react';
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
  eth?: string;
  usd?: number;
}

interface lastSale {
  date?: string;
  eth?: string;
  isPrimary?: number;
  usd?: number;
}

interface params {
  parcelId?: string;
  name?: string;
  coverImgUrl?: string;
  openseaUrl?: string;
  parcelPageUrl?: string;
  island?: string;
  suburb?: string;
  traffic?: traffic;
  lastPrice?: Price;
  lastSaleList?: Array<lastSale>;
  timeRangeSale?: timeRangeSale;
}

interface Prop {
  options?: params;
  className?: string;
  style?: HTMLAttributes<CSSProperties>;
  trafficType?: string;
  mapType?: string;
  close?: () => void;
  isSomnium?: boolean;
}

// parcel_id	int	parcel_id（地块id）
// name	string	地块名称
// cover_img_url	string	地块封面图
// opensea_url	string	地块对应的opensea链接
// parcel_page_url	string	地块对应的 cryptovoxels 页面链接
// island	string	地块所属的岛名
// suburb	string	地块所属的街区名
// traffic.week	int	地块最近7天流量
// traffic.month	int	地块最近30天流量
// traffic.all	int	地块总流量
// last_price.eth	float	地块最后一次交易金额对应的eth
// last_price.usd	int	地块最后一次交易金额对应的usd

export default function ParcelDeatil({
  options,
  className,
  style,
  close,
  trafficType,
  mapType,
  isSomnium = false,
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
    if ((mapType === 'PRICE' && !op.timeRangeSale) || (mapType === 'TRAFFIC' && !op.traffic)) {
      return '';
    }
    if (type === 'TOTAL') {
      return `Total Traffic：${op.traffic.all}`;
    }

    if (type === 'MONTHLY') {
      return `Monthly Traffic：${op.traffic.month}`;
    }
    const label = op.timeRangeSale?.eth
      ? `${op.timeRangeSale.eth} ETH(${op.timeRangeSale.usd} USD)`
      : '';
    if (type === 'ALL') {
      return `All-Time Sales：${label}`;
    }

    if (type === 'MONTH') {
      return `Monthly Sales：${label}`;
    }

    if (type === 'QUARTER') {
      return `Quarterly Sales：${label}`;
    }

    if (type === 'YEAR') {
      return `Yearly Sales：${label}`;
    }

    return `Week Traffic：${op.traffic.week}`;
  };

  // date?: string;
  // eth?: string;
  // isPromary?: number;
  // usd?: number;
  const renderUl = React.useCallback(
    (list: Array<lastSale>) => {
      if (list) {
        return (
          <>
            {list.map((ite, idx) => {
              return (
                <li key={idx} className={cn('', styles.sales)}>
                  {`${ite.date} ${ite.isPrimary > 0 ? '(primary sales) /' : ''}`}{' '}
                  <span className="text-white">{`${ite.eth} ETH(${ite.usd} USD)`}</span>
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
      className={cn(className, styles.popup, mapType === 'PRICE' ? '' : styles.widthlimit)}
      style={style}
      onClick={jumpToParcel}
    >
      <div className={cn('flex justify-between items-center', styles.titleContainer)}>
        {isSomnium ? (
          <div className={cn('truncate w-full', styles.title)}></div>
        ) : (
          <div
            className={cn('truncate w-full', styles.title)}
            title={`${options.island}>${options.suburb}>${options.name}`}
          >{`${options.island}>${options.suburb}>${options.name}`}</div>
        )}
        <img className={styles.close} src="/images/close-pop.png" onClick={closePop}></img>
      </div>
      <div className="flex justify-start items-start mt-2">
        <CoverImg
          className={cn(styles.cover, isSomnium ? styles.somnium : '')}
          img={options.coverImgUrl}
        />
        <div className="ml-2 w-full">
          <div className={cn('flex justify-between', isSomnium ? styles.row : null)}>
            <span
              className={cn('text-white font-semibold text-base truncate', styles.name)}
              title={options.name}
            >
              {options.name}
            </span>
            <img src="/images/Nomal.png" className={styles.icon} onClick={jumpToOpenC}></img>
          </div>
          <div className={cn('mt-1 font-medium', styles.label)}>
            {getLabel(trafficType, options)}
          </div>
          {options.lastSaleList ? (
            <div className={cn('mt-1 font-medium', styles.label)}>
              Last two sales：
              <ul className="list-none">{renderUl(options.lastSaleList)}</ul>
            </div>
          ) : (
            <div className={cn('mt-1 font-medium', styles.label)}>
              {`Last Price：${options.lastPrice.eth.toFixed(
                1,
              )} ETH (${options.lastPrice.usd.toFixed(0)} USD)`}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}
