import React, { CSSProperties, HTMLAttributes, useEffect } from 'react';
import cn from 'classnames';

import CoverImg from '../cover-img';

import styles from './index.module.css';

interface Price {
    tez?: number;
    usd?: number;
  }
  
  interface traffic {
    month?: number;
    week?: number;
    all?: number;
  }
  
  interface timeRangeSale {
    tez?: string;
    usd?: number;
  }
  
  interface lastSale {
    date?: string;
    tez?: string;
    eth?: string;
    isPrimary?: number;
    usd?: number;
  }
  
  interface params {
    parcelId?: string;
    name?: string;
    coverImgUrl?: string;
    opensea_url?: string;
    parcel_page_url?: string;
    island?: string;
    suburb?: string;
    traffic?: traffic;
    lastPrice?: Price;
    last_sale_list?: Array<lastSale>;
    time_range_sale?: timeRangeSale;
  }
  
  interface Prop {
    options?: params;
    className?: string;
    style?: HTMLAttributes<CSSProperties>;
    trafficType?: string;
    mapType?: string;
    close?: () => void;
    isSomnium?: boolean;
    isOtherSide?: boolean;
  }


  export default function ParcelDeatil({
    options,
    className,
    style,
    close,
    trafficType,
    mapType,
    isSomnium = false,
    isOtherSide = true,
  }: Prop) {
    // const {parcelId, name, coverImgUrl, opensea_url, parcel_page_url, island, suburb, traffic, lastPrice } = detail;
    const jumpToOpenC = (event) => {
      event.stopPropagation();
      if (options) {
        window.open(options.opensea_url);
      }
    };
  
    const jumpToParcel = (event) => {
      event.stopPropagation();
      if (options) {
        window.open(options.parcel_page_url);
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
      if ((mapType === 'PRICE' && !op.time_range_sale) || (mapType === 'TRAFFIC' && !op.traffic)) {
        return '';
      }
      if (type === 'TOTAL') {
        return `Total Traffic：${op.traffic.all}`;
      }
  
      if (type === 'MONTHLY') {
        return `Monthly Traffic：${op.traffic.month}`;
      }
      const label = op.time_range_sale?.eth
        ? `${op.time_range_sale.eth} ETH(${op.time_range_sale.usd} USD)`
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
    // tez?: string;
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
          {isSomnium || isOtherSide ? (
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
            className={cn(styles.cover, isSomnium ? styles.somnium : '', 'object-contain')}
            img={options.coverImgUrl}
          />
          <div className="ml-2 w-full">
            <div className={cn('flex justify-between', isSomnium || isOtherSide ? styles.row : null)}>
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
            {options.last_sale_list ? (
              <div className={cn('mt-1 font-medium', styles.label)}>
                Last two sales：
                <ul className="list-none">{renderUl(options.last_sale_list)}</ul>
              </div>
            ) : (null
            //   <div className={cn('mt-1 font-medium', styles.label)}>
            //     {`Last Price：${options.lastPrice.tez.toFixed(
            //       1,
            //     )} TEZ (${options.lastPrice.usd.toFixed(0)} USD)`}
            //   </div>
            )}
          </div>
        </div>
      </div>
    ) : null;
  }