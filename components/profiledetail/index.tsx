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
  const [bgState, setBgState] = React.useState('');
  const [index, setIndex] = React.useState(null);
  React.useEffect(() => {
    console.log(bgState);
  }, [bgState])


  const getgState = React.useCallback(() => {
    setBgState('ccc');
    
  }, [bgState]);
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
            <th className={cn(style.th1, style.title,style.firstHead)}
            onMouseEnter={() => {
              setBgState('Parcel');
            }}
            onMouseLeave={() => {
              setIndex(null);
            }}
            >
              <div className={cn('flex justify-center items-center')}>Parcel</div>
            </th>
            <th className={cn(style.th2, style.title, bgState === 'lsland' ? style.hoverBg : null)}
            // onMouseEnter={() => {
            //   setBgState('lsland');
            // }}
            // onMouseLeave={() => {
            //   setIndex(null);
            // }}
            >
              <div className={cn('flex justify-center items-center')}>lsland</div>
            </th>
            <th className={cn(style.th3, style.title, bgState === 'Suburb' ? style.hoverBg : null)}
            // onMouseEnter={() => {
            //   setBgState('Suburb');
            // }}
            // onMouseLeave={() => {
            //   setIndex(null);
            // }}
            >
              <div className={cn('flex justify-center items-center')}>Suburb</div>
            </th>
            <th className={cn(style.th4, style.title, bgState === 'TotalTraffic' ? style.hoverBg : null)}
            // onMouseEnter={() => {
            //   setBgState('TotalTraffic');
            // }}
            // onMouseLeave={() => {
            //   setIndex(null);
            // }}
            >
              <div className={cn('flex justify-center items-center')}>Total Traffic</div>
            </th>
            {data.map((item, idx) => {
              return (
                //   <tr
                //   key={idx}
                //   className={cn('text-base font-medium', style.info)}
                //   onMouseOver={() => {
                //     setIndex(idx);
                //   }}
                //   onMouseOut={() => {
                //     setIndex(null);
                //   }}
                // >
                <th key={item} className={cn(style.title,bgState === 'Parcel' ? style.hoverBg : null,  index === idx ? style.hoverBg : null)} 
                  onMouseEnter={() => {
                    setBgState('Parcel');
                  }}
                  onMouseLeave={() => {
                    setBgState(null);
                    setIndex(null);
                  }}
                >
                  <div>{item}</div>
                </th>
                // </tr>
              );
            })}
          </tr>
          {datas.map((item, idx) => {
            return (
              <tr key={uuid()}>
                <th className={cn(style.item, bgState === 'Parcel' ? style.hoverBg : null,  index === idx ? style.hoverBg : null,)}
                  onMouseEnter={() => {
                    setBgState('Parcel');
                  }}
                  onMouseLeave={() => {
                    setBgState(null);
                    setIndex(null);
                  }}
                >
                  <div className={cn('flex justify-center items-center')}>{`${item.parcel_id}${item.parcel_name ? ':' : ''} ${item.parcel_name}`}</div>
                </th>
                <th className={style.item}>
                  <div className={cn('flex justify-center items-center')}>{item.island}</div>
                </th>
                <td className={style.item}>
                  <div className={cn('flex justify-center items-center')}>{item.suburb}</div>
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
