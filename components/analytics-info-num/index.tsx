import React from 'react';
import cn from 'classnames';

import { DataStorage } from 'babylonjs';

import { getWorldsNum } from '../../service';

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
  textColor?;
};

export default function AnalyticsAverage({ options, labelText, textColor }: Props) {
  const [dataSource, setDataSource] = React.useState([]);
  const [arrdataSource, setArrDataSource] = React.useState([]);
  const [totaldataSource, setTotalDataSource] = React.useState([]);
  const [usdPercent, setUsdPercent] = React.useState([]);
  const [bgState, setBgState] = React.useState('');
  const [alldata, setalldata] = React.useState([]);
  const [index, setIndex] = React.useState(null);
  const obj = {}
  React.useEffect(() => {
    getWorldsNum().then((data) => {
      setalldata(data);
    });
  }, [])
  const requestData = React.useCallback(async () => {
    const res: any = await getWorldsNum();
    setDataSource(res.data.monthly.sales_data);
    setTotalDataSource(res.data.monthly.percent);
    res.data.monthly.sales_data.forEach(item => {
      if (!obj[item.name]) {
        obj[item.name] = {}
      }
      obj[item.name][item.time] = item.value;
      return obj;
    })
    res.data.monthly.percent.forEach(item => {
      if (!obj[item.name]) {
        obj[item.name] = {}
      }
      obj[item.name].percent = item.value;
      return obj;
    })
    const arr = []

    // for (const name in obj) {
    //   arr.push({ [name]: obj[name] })
    // }
    Object.keys(obj).forEach(name => {
      const value = obj[name];
       if(value){
        arr.push({ [name]: obj[name] })
       }	
     });
    setArrDataSource(arr)

  }, [null]);

  React.useEffect(() => {
    requestData();
  }, [null]);

  return (
    <>
      <ChartTitle text={labelText} className={style.tobottom} color={textColor}></ChartTitle>
      <table className={cn('w-full', style.table)}>
        <tbody>
          <tr className={cn('text-base font-normal', style.title)}>
            <th
              className={cn(style.h1, style.bg, style.biaotou)}
              onMouseEnter={() => {
                setBgState('world');
              }}
              onMouseLeave={() => {
                setIndex(null);
              }}
            >
              <div className={style.left}>World/sales（USD）</div>
            </th>
            <th
              className={cn(style.h2, style.bg, style.biaotou)}
              onMouseEnter={() => {
                setBgState('sales');
              }}
              onMouseLeave={() => {
                setIndex(null);
              }}
            >
            <div className={style.right}>2022.07</div>
            </th>
            <th
              className={cn(style.h3, style.bg, style.biaotou)}
              onMouseEnter={() => {
                setBgState('sold');
              }}
              onMouseLeave={() => {
                setIndex(null);
              }}
            >
              <div className={style.right}>2022.08</div>
            </th>
            <th
              className={cn(style.h3, style.bg, style.biaotou)}
              onMouseEnter={() => {
                setBgState('sold');
              }}
              onMouseLeave={() => {
                setIndex(null);
              }}
            >
              <div className={style.right}>% of Change</div>
            </th>
            {/* <th
              className={cn(style.h3, style.bg, style.biaotou)}
              onMouseEnter={() => {
                setBgState('supply');
              }}
              onMouseLeave={() => {
                setIndex(null);
              }}
            >
              <div className={style.right}>% of Total sales in 202207</div>
            </th> */}
          </tr>
          {arrdataSource.map((item, idx) => {
            return (
              <>
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
                    <div className={cn(style.leftContext, style.font1)}>
                    {/* {formatNum(item.totalLandOwner, false)} */}
                      {Object.keys(item).map((o) => {
                      return (<span>{o}</span>)
                    })}</div>
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
                    <div className={cn('justify-end',style.right, style.leftContext)}>
                      {Object.keys(item).map((o) => {
                        return item[o]["2022.07"]
                      })}
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
                    <div className={cn('justify-end',style.right, style.leftContext)}>
                      {Object.keys(item).map((o) => {
                        return item[o]["2022.08"]
                      })}
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
                  <div className={cn('justify-end',style.right, style.leftContext)}>
                  {Object.keys(item).map((o) => {
                        return Math.round(item[o].percent* 100)
                      })}
                  </div>
                </th>
                  </tr>
              </>
            );

          })}
          {/* {totaldataSource.map((item, idx) => {
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
                    {Math.round(item.value * 100)}%
                  </div>
                </th>
              </tr>
            );
          })} */}
        </tbody>
      </table>
    </>
  );
}
