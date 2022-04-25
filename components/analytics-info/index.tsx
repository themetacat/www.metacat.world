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

  const requestData = React.useCallback(async () => {
    const res = await getWorldsStats();
    const result = convert(res.data);
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
            <th>
              <div>World</div>
            </th>
            <th>
              <div>Total Parcel Sales Volume</div>
            </th>
            <th>
              <div>Number Of Parcels Sold</div>
            </th>
            <th>
              <div>Total Parcel Supply</div>
            </th>
            <th>
              <div>Total Number Of Owners</div>
            </th>
            <th>
              <div>% Parcels Owned By Top 10 Whales</div>
            </th>
          </tr>
          {dataSource.map((item, idx) => {
            return (
              <tr key={idx} className={cn('text-base font-medium', style.info)}>
                <th className={cn('', style.cell, style.type)}>
                  <div>{item.name}</div>
                </th>
                <th className={cn('', style.cell)}>
                  <div className="justify-end">
                    {formatNum(item.totalParcelSales?.value, false)}
                    <span className="ml-3">
                      {item.totalParcelSales?.value ? item.totalParcelSales.symbol : ''}
                    </span>
                  </div>
                </th>
                <th className={cn('', style.cell)}>
                  <div className="justify-end">{formatNum(item.numberOfParcelSales, false)}</div>
                </th>
                <th className={cn('', style.cell)}>
                  <div className="justify-end">{formatNum(item.totalParcelSupply, false)}</div>
                </th>
                <th className={cn('', style.cell)}>
                  <div className="justify-end">{formatNum(item.totalLandOwner, false)}</div>
                </th>
                <th className={cn('', style.cell)}>
                  <div className="justify-end">
                    {formatNum(Math.round(item.total10Percent * 100), false)}%
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
