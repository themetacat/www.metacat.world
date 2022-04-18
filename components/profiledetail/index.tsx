import React from 'react';
import cn from 'classnames';
import { v4 as uuid } from 'uuid';
import style from './index.module.css';

import ChartTitle from '../chart-title';
import Status from '../status';

type Props = {
  label?: string;
  dataHandlder?: (token) => { data };
  token?: Promise<any>;
};

const d = [
  '2022.03.17',
  '2022.03.18',
  '2022.03.19',
  '2022.03.20',
  '2022.03.21',
  '2022.03.22',
  '2022.03.23',
  '2022.03.24',
  '2022.03.25',
  '2022.03.26',
  '2022.03.27',
  '2022.03.28',
  '2022.03.29',
  '2022.03.30',
  '2022.03.31',
  '2022.04.01',
  '2022.04.02',
  '2022.04.03',
  '2022.04.04',
  '2022.04.05',
  '2022.04.06',
  '2022.04.07',
  '2022.04.08',
  '2022.04.09',
  '2022.04.10',
  '2022.04.11',
  '2022.04.12',
  '2022.04.13',
  '2022.04.14',
  '2022.04.15',
];

const dd = [
  {
    parcel_id: 528,
    parcel_name: '',
    island: 'Origin City',
    suburb: 'Kitties',
    total_traffic: 1390,
    traffic_detail: [
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    ],
  },
  {
    parcel_id: 747,
    parcel_name: '',
    island: 'Origin City',
    suburb: 'Hiro',
    total_traffic: 1643,
    traffic_detail: [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
    ],
  },
  {
    parcel_id: 932,
    parcel_name: 'Metapurse HQ',
    island: 'Origin City',
    suburb: 'Frankfurt',
    total_traffic: 10557,
    traffic_detail: [
      1, 5, 2, 0, 3, 0, 0, 4, 3, 0, 0, 0, 0, 1, 0, 2, 0, 4, 1, 0, 0, 2, 0, 2, 2, 2, 0, 0, 1, 0,
    ],
  },
];

export default function ProfileDetail({ label, dataHandlder, token }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [datas, setDatas] = React.useState([]);

  const requestData = React.useCallback(async (tok) => {
    const tk = await tok;
    const result = await dataHandlder(tk);
    setData(result.data.date_list);
    setDatas(result.data.traffic_data_list);
  }, []);

  const onRetry = React.useCallback(() => {
    requestData(token);
  }, [requestData]);

  const render = React.useMemo(() => {
    if (loading) {
      return <Status mini={true} status="loading" />;
    }

    if (error) {
      return <Status mini={true} retry={onRetry} status="error" />;
    }

    return (
      <table className={cn(style.container)}>
        <tbody>
          <tr>
            <th className={cn(style.th1, style.title)}>
              <div>Parcel</div>
            </th>
            <th className={cn(style.th2, style.title)}>
              <div>lsland</div>
            </th>
            <th className={cn(style.th3, style.title)}>
              <div>Suburb</div>
            </th>
            <th className={cn(style.th4, style.title)}>
              <div>Total Traffic</div>
            </th>
            {data.map((item) => {
              return (
                <th key={item} className={style.title}>
                  <div>{item}</div>
                </th>
              );
            })}
          </tr>
          {datas.map((item) => {
            return (
              <tr key={uuid()}>
                <td className={style.item}>
                  <div>{`${item.parcel_id}${item.parcel_name ? ':' : ''} ${item.parcel_name}`}</div>
                </td>
                <th className={style.item}>
                  <div>{item.island}</div>
                </th>
                <td className={style.item}>
                  <div>{item.suburb}</div>
                </td>
                <td className={style.item}>
                  <div>{item.total_traffic}</div>
                </td>
                {item.traffic_detail.map((i) => {
                  return (
                    <td className={style.item}>
                      <div>{i}</div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }, [loading, error, onRetry, data, datas]);

  React.useEffect(() => {
    requestData(token);
  }, [requestData]);

  return (
    <div>
      <div className={cn('w-full p-5', style.content)}>
        <div>
          <div className={cn('w-full flex justify-between item-center', style.header)}>
            <ChartTitle text={label}></ChartTitle>
          </div>
          <div className={cn(style.ov, style.totop)}>{render}</div>
        </div>
      </div>
    </div>
  );
}
