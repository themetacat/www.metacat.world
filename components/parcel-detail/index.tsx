import React, { CSSProperties, HTMLAttributes } from 'react';
import cn from 'classnames';

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
}

interface Prop {
  options?: params;
  className?: string;
  style?: HTMLAttributes<CSSProperties>;
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

export default function ParcelDeatil({ options, className, style }: Prop) {
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

  return options ? (
    <div className={cn(className, styles.popup)} style={style} onClick={jumpToParcel}>
      <div>{`${options.island}>${options.suburb}>${options.name}`}</div>
      <div className="flex justify-start items-center mt-2">
        <img className={styles.cover} src={options.coverImgUrl} />
        <div className="ml-2 w-full">
          <div className="flex justify-between">
            <span className="text-white font-semibold text-base">{options.name}</span>
            <img src="/images/Nomal.png" className={styles.icon} onClick={jumpToOpenC}></img>
          </div>
          <div className="mt-1">{`Week Traffic：${options.traffic.week}`}</div>
          <div className="mt-1">
            {`Last Price：${options.lastPrice.eth.toFixed(1)}E (${options.lastPrice.usd.toFixed(
              0,
            )} U)`}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
