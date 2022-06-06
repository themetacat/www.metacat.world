import React from 'react';
import cn from 'classnames';

import { getWorldsStats } from '../../service';

import { convert, formatNum } from '../../common/utils';
import style from './index.module.css';
import ChartTitle from '../chart-title';

type optionItem = {
  label?: string;
  value?: string;
  icon?: string;
};
type Props = {
  options?: Array<optionItem>;
  labelText?: string;
};

export default function AnalyticsInfo({ options, labelText }: Props) {
  const [dataSource, setDataSource] = React.useState([]);
  const [bgState, setBgState] = React.useState('');
  const [index, setIndex] = React.useState(null);
  const requestData = React.useCallback(async () => {
    const res = await getWorldsStats();
    const result = convert(res.data);
    console.log(result.data);
    setDataSource(result);
  }, [null]);

  React.useEffect(() => {
    requestData();
  }, [null]);

  return (
    <>
      <ChartTitle text={labelText} className={style.tobottom}></ChartTitle>
      <table className={cn('w-full', style.table)}>
        <tbody>
          <tr className={cn('text-base font-normal', style.title)}>
            <th className={cn(style.h1, style.bg, style.biaotou)}>
              <div className={style.left}>World</div>
            </th>
            <th className={cn(style.h2, style.bg, style.biaotou)}>
              <div className={style.right}>Total Parcel Sales Volume</div>
            </th>
            <th className={cn(style.h3, style.bg, style.biaotou)}>
              <div className={style.right}>Number Of Parcels Sold</div>
            </th>
            <th className={cn(style.h3, style.bg, style.biaotou)}>
              <div className={style.right}>Total Parcel Supply</div>
            </th>
            <th className={cn(style.h3, style.bg, style.biaotou)}>
              <div className={style.right}>Total Number Of Owners</div>
            </th>
            <th className={cn(style.h4, style.bg, style.biaotou)}>
              <div className={style.right}>% Parcels Owned By Top 10 Whales</div>
            </th>
          </tr>
          {dataSource.map((item, idx) => {
            return (
              <tr
                key={idx}
                className={cn('text-base font-medium', style.info)}
                onMouseOver={() => {
                  setIndex(idx);
                }}
                onMouseOut={() => {
                  setIndex(null);
                }}
              >
                <th
                  className={cn(
                    '',
                    style.cell,
                    style.type,
                    style.h1,
                    style.bg2,
                    index === idx ? style.hoverBg : null,
                    bgState === 'world' ? style.hoverBg : null,
                  )}
                  onMouseEnter={() => {
                    setBgState('world');
                  }}
                  onMouseLeave={() => {
                    setIndex(null);
                  }}
                >
                  <div className={cn(style.left, style.font1)}>{item.name}</div>
                </th>
                <th
                  className={cn(
                    '',
                    style.cell,
                    style.h2,
                    style.bg2,
                    index === idx ? style.hoverBg : null,
                    bgState === 'sales' ? style.hoverBg : null,
                  )}
                  onMouseEnter={() => {
                    setBgState('sales');
                  }}
                  onMouseLeave={() => {
                    setIndex(null);
                  }}
                >
                  <div className={cn('justify-end', style.right, style.font2)}>
                    {formatNum(item.totalParcelSales?.value, false)}
                    <span className="ml-3">
                      {item.totalParcelSales?.value ? item.totalParcelSales.symbol : ''}
                    </span>
                  </div>
                </th>
                <th
                  className={cn(
                    '',
                    style.cell,
                    style.h3,
                    style.bg2,
                    index === idx ? style.hoverBg : null,
                    bgState === 'sold' ? style.hoverBg : null,
                  )}
                  onMouseEnter={() => {
                    setBgState('sold');
                  }}
                  onMouseLeave={() => {
                    setIndex(null);
                  }}
                >
                  <div className={cn('justify-end', style.right, style.font3)}>
                    {formatNum(item.numberOfParcelSales, false)}
                  </div>
                </th>
                <th
                  className={cn(
                    '',
                    style.cell,
                    style.h3,
                    style.bg2,
                    index === idx ? style.hoverBg : null,
                    bgState === 'supply' ? style.hoverBg : null,
                  )}
                  onMouseEnter={() => {
                    setBgState('supply');
                  }}
                  onMouseLeave={() => {
                    setIndex(null);
                  }}
                >
                  <div className={cn('justify-end', style.right, style.font3)}>
                    {formatNum(item.totalParcelSupply, false)}
                  </div>
                </th>
                <th
                  className={cn(
                    '',
                    style.cell,
                    style.h3,
                    style.bg2,
                    index === idx ? style.hoverBg : null,
                    bgState === 'owners' ? style.hoverBg : null,
                  )}
                  onMouseEnter={() => {
                    setBgState('owners');
                  }}
                  onMouseLeave={() => {
                    setIndex(null);
                  }}
                >
                  <div className={cn('justify-end', style.right, style.font3)}>
                    {formatNum(item.totalLandOwner, false)}
                  </div>
                </th>
                <th
                  className={cn(
                    '',
                    style.cell,
                    style.h3,
                    style.bg2,
                    index === idx ? style.hoverBg : null,
                    bgState === 'whales' ? style.hoverBg : null,
                  )}
                  onMouseEnter={() => {
                    setBgState('whales');
                  }}
                  onMouseLeave={() => {
                    setIndex(null);
                  }}
                >
                  <div className={cn('justify-end', style.right, style.font3)}>
                    {Math.round(item.total10Percent * 100)}%
                  </div>
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
