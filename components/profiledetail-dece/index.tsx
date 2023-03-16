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
  textColor?;
};

export default function ProfileDetailDece({ label, dataHandlder, token, textColor, }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [datas, setDatas] = React.useState([]);
  const [totalVisits, settotalVisits] = React.useState([]);

  const requestData = React.useCallback(async (tok) => {
    setLoading(true);
    try {
      const tk = await tok;
      const result = await dataHandlder(tk);
      if (result.data[0].daily_visits) {
        setData(result.data[0].name);
        setDatas(result.data[0].daily_visits);
        settotalVisits(result.data[0].total_visits);
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
            <th className={cn(style.th1, style.title,style.firstHead,)}>
            <div className={cn('flex justify-center items-center',style.parcel)}>Parcel</div>
            </th>
            {/* <th className={cn(style.th2, style.title)}>
              <div>lsland</div>
            </th>
            <th className={cn(style.th3, style.title)}>
              <div>Suburb</div>
            </th> */}
            <th className={cn(style.th4, style.title)}>
            <div className={cn('flex justify-center items-center',style.parcel)}>Total Traffic</div>
            </th>

            {datas.map((item) => {
              return (
                <>
                  <th className={cn(style.th4, style.title)}>
                    <div className={cn('flex justify-center items-center',style.parcel,)}>{item.time}</div>
                  </th>

                  {/* <td className={style.item}>
                    <div className={cn('flex justify-center items-center')}>{item.value}</div>
                  </td> */}
                </>
              );
            })}

          </tr>
          {/* <tr>
            <td className={style.item}>
              <div className={cn('flex justify-center items-center')}>{data}</div>
            </td>
            <td className={style.item}>
              <div className={cn('flex justify-center items-center')}>{totalVisits}</div>
            </td>
          </tr> */}
          <tr key={uuid()}>

            <td className={cn(style.item,style.firstHead)}>
              <div className={cn(' justify-center items-center',style.parcel_name)}>{data}</div>
            </td>
            <td className={style.item}>
              <div className={cn(' justify-center items-center',style.parcel_name)}>{totalVisits}</div>
            </td>
            {datas.map((item) => {
              return (
                <>
                  <td className={style.item} key={uuid()}>
                    <div className={cn(' justify-center items-center',style.parcel_name)}>{item.value}</div>
                  </td>
                </>
              );
            })}
          </tr>

        </tbody>
      </table>
    );
  }, [loading, error, onRetry, data, datas]);

  React.useEffect(() => {
    requestData(token);
  }, [requestData]);

  return (
    <div>
      <div className={cn('w-full p-5', style.content)} style={{ borderRadius: "8px" }}>
        <div>
          <div className={cn('w-full flex justify-between item-center', style.header)}>
            <ChartTitle text={label} color={textColor}></ChartTitle>
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
