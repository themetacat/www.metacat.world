import React from 'react';
import cn from 'classnames';
import { v4 as uuid } from 'uuid';
import style from './index.module.css';

import ChartTitle from '../chart-title';
import Status from '../status';

type Props = {
  label?: string;
  dataHandlder?;
  token?: Promise<any>;
};

export default function ProfileDetail({ label, dataHandlder, token }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [datas, setDatas] = React.useState([]);

  const requestData = React.useCallback(async (tok) => {
    setLoading(true);
    try {
      const tk = await tok;
      const result = await dataHandlder(tk);
      if (result.data.date_list) {
        setData(result.data.date_list);
        setDatas(result.data.traffic_data_list);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError(true);
    }
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
    if (datas.length === 0) {
      return (
        <div>
          <Status status="empty" />;
        </div>
      );
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
                  <div className={cn('flex justify-center items-center')}>{item.total_traffic}</div>
                </td>
                {item.traffic_detail.map((i) => {
                  return (
                    <td className={style.item} key={uuid()}>
                      <div className={cn('flex justify-center items-center')}>{i}</div>
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
          <div
            className={cn(
              datas.length !== 0 ? style.totop : style.tobottom,
              datas.length !== 0 ? style.ov : null,
            )}
          >
            {render}
          </div>
        </div>
      </div>
    </div>
  );
}
