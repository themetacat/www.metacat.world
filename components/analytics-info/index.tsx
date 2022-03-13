import React from 'react';
import cn from 'classnames';

import { getWorldsStats } from '../../service';

import { convert, formatNum } from '../../common/utils';

import style from './index.module.css';

export default function AnalyticsInfo() {
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
    <table className={cn('w-full', style.table)}>
      <tbody>
        <tr className={cn('text-base font-normal', style.title)}>
          <th>
            <div>WORLD</div>
          </th>
          <th>
            <div>TOTAL PARCEL SALES VOLUME</div>
          </th>
          <th>
            <div>NUMBER OF PARCEL SOLD</div>
          </th>
          <th>
            <div>TOTAL PARCEL SUPPLY</div>
          </th>
          <th>
            <div>TOTAL NUMBER OF LANDLORDS</div>
          </th>
          <th>
            <div>TOTAL TRAFFIC</div>
          </th>
        </tr>
        {dataSource.map((item, idx) => {
          return (
            <tr key={idx} className={cn('text-base font-medium', style.info)}>
              <th className={cn('', style.cell, style.type)}>
                <div>{item.name}</div>
              </th>
              <th className={cn('', style.cell)}>
                <div>
                  {formatNum(item.totalParcelSales?.value, false)}
                  <span className="ml-3">
                    {item.totalParcelSales?.value ? item.totalParcelSales.symbol : ''}
                  </span>
                </div>
              </th>
              <th className={cn('', style.cell)}>
                <div>{formatNum(item.numberOfParcelSales, false)}</div>
              </th>
              <th className={cn('', style.cell)}>
                <div>{formatNum(item.totalParcelSupply, false)}</div>
              </th>
              <th className={cn('', style.cell)}>
                <div>{formatNum(item.totalLandOwner, false)}</div>
              </th>
              <th className={cn('', style.cell)}>
                <div>{formatNum(item.totalTraffic, false)}</div>
              </th>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
