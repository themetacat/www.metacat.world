import React from 'react';
import cn from 'classnames';

import { DataStorage } from 'babylonjs';

import { getWorldsAverageSale } from '../../service';

import ChartSelecter from '../chart-select';

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
  priceOptions?: Array<optionItem>;
  labelText?: string;
  textColor?;
};

export default function AnalyticsAverage({ options, priceOptions, labelText, textColor }: Props) {
  const [priceShowType, setPriceShowType] = React.useState(priceOptions[0].value);
  const [dataSource, setDataSource] = React.useState([]);
  const [arrdataSourceList, setArrDataSourceList] = React.useState(null);
  const [arrdataSourceValue, setArrDataSourceValue] = React.useState([]);
  const [arrdataSource, setArrDataSource] = React.useState([]);
  const [totaldataSource, setTotalDataSource] = React.useState([]);
  const [bgState, setBgState] = React.useState('');
  const [index, setIndex] = React.useState(null);
  const obj = {}

  const requestData = React.useCallback(async () => {
    const res: any = await getWorldsAverageSale();
    setDataSource(res.data.monthly.usd);
    setTotalDataSource(res.data.monthly.usd_percent);
    // res.data.monthly.usd.forEach(item => {
    //   if (!obj[item.name]) {
    //     obj[item.name] = {}
    //   }
    //   obj[item.name][item.time] = item.value;
    //   return obj;
    // })
    // res.data.monthly.usd_percent.forEach(item => {
    //   if (!obj[item.name]) {
    //     obj[item.name] = {}
    //   }
    //   obj[item.name].percent = item.value;
    //   return obj;
    // })
    if (priceShowType === 'USD') {
      // labelText==='Parcel Average Price(USD)'
      res.data.monthly.usd.forEach(item => {
        if (!obj[item.name]) {
          obj[item.name] = {}
          obj[item.name].time = {}
        }
        // obj[item.name][item.time] = item.value;
        obj[item.name].time[item.time] = item.value
        return obj;
      })
      res.data.monthly.usd_percent.forEach(item => {
        if (!obj[item.name]) {
          obj[item.name] = {}
        }
        obj[item.name].percent = item.value;
        return obj;
      })

    } else {
      // labelText==='Parcel Average Price(ETH)'
      res.data.monthly.eth.forEach(item => {
        if (!obj[item.name]) {
          obj[item.name] = {}
          obj[item.name].time = {}
        }
        // obj[item.name][item.time] = item.value;
        obj[item.name].time[item.time] = item.value
        return obj;
      })
      res.data.monthly.eth_percent.forEach(item => {
        if (!obj[item.name]) {
          obj[item.name] = {}
        }
        obj[item.name].percent = item.value;
        return obj;
      })
    }
    const arr = []
    // for (const name in obj) {
    //   arr.push({ [name]: obj[name] })
    // }
    Object.keys(obj).forEach(name => {
      const value = obj[name];
      if (value) {
        arr.push({ [name]: obj[name] })
      }
    });
    // setArrDataSource(obj)
    setArrDataSource(Object.keys(obj))
    setArrDataSourceList(obj)
    // console.log(obj);
    
    setArrDataSourceValue(Object.values(obj))
  }, [priceShowType]);

  const retObjValue =(val,idx,type)=>{
    // console.log(val);
    
    let newVal;
    if(val){
      if(type==='keys'){
        newVal = Object.keys(val)[idx];
    // console.log(newVal);
  }else{
        newVal = Object.values(val)[idx];
      }
    }else{
      newVal = ''
    }
    
    return newVal
  }

  React.useEffect(() => {
    requestData();
  }, [requestData, priceShowType]);

  const updata = React.useCallback(
    (st, pt) => {
      // initChart(data[st][pt], st);
    },
    []
    // [data],
  );

  const changeStatic = React.useCallback(
    (val) => {
      // setShowType(val);
      setPriceShowType(val)
      if (val) {
        updata(val, priceShowType);
      }
    },
    [priceShowType, updata],
  );

  const getSelect = React.useMemo(() => {
    return (
      <div
        className={cn('flex items-center', style.border)}
        style={{ color: 'rgba(255,255,255, 0.3)' }}
      >
        <ChartSelecter
          options={priceOptions}
          showArrow={true}
          onClick={changeStatic}
          className={style.selecterLong}
          defaultLabel={priceOptions[0].value}
          hasBorder={false}
          cl={style.bg}
        ></ChartSelecter>
      </div>
    );
  }
    // return null;
    , []);



  return (
    <>
      <ChartTitle text={labelText} className={style.tobottom} color={textColor}></ChartTitle>
      <table className={cn('w-full', style.tableHead)}>
        <tbody>
          <div className={style.getSelect}>{getSelect}</div>
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
              <div className={style.left}>World/sales（{priceShowType}）</div>
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
              {/* <div className={style.right}>{Object?.keys(arrdataSource).length === 0 ? null :
                arrdataSource && Object?.keys(arrdataSource["Otherside"]?.time)[0]
              }</div> */}
                <div className={style.right}>{arrdataSourceList?.length === 0 ? null :
        arrdataSourceList &&retObjValue(arrdataSourceList.Otherside?.time,0,'keys')
              }</div>
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
              {/* <div className={style.right}>{Object?.keys(arrdataSource).length === 0 ? null :
                arrdataSource && Object?.keys(arrdataSource["Otherside"]?.time)[1]
              }</div> */}
                <div className={style.right}>{arrdataSourceList?.length === 0 ? null :
                  arrdataSourceList &&retObjValue(arrdataSourceList.Otherside?.time,1,'keys')
                }</div>
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
          {arrdataSource?.map((item, idx) => {
            // console.log(Object.values(arrdataSource), 333);
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
                    <div className={cn(style.leftContext)}>
                      {/* {Object.keys(item).map((o) => {
                      return (<span>{o}</span>)
                    })} */}
                      {<span>{item}</span>}
                    </div>
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
                    <div className={cn('justify-end', style.right, style.leftContext)}>
                      {/* ${Object.keys(item).map((o) => {
                        return item[o]["2022.07"]
                      })} */}
                      {/* ${arrdataSource[item]["2022.08"]} */}
                      {/* <span style={{ marginRight: "0.75rem" }}>{formatNum(arrdataSource[item]["2022.08"], false)}</span>{priceShowType} */}
                      {
                        priceShowType === 'ETH' ?
                          <>
                            <span style={{ marginRight: "0.75rem", display: "inline-block" }}>
                            {(retObjValue(arrdataSourceValue[idx]?.time,0,'') as number)} </span>{priceShowType}
                          </> :
                          <>
                            <span style={{ marginRight: "0.75rem", display: "inline-block" }}>
                            {formatNum(retObjValue(arrdataSourceValue[idx]?.time,0,'') as number, false)}
                            </span>{priceShowType}


                            {/* ${Object.values(arrdataSource[item].time)[0]}{priceShowType} */}
                          </>
                      }

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
                    <div className={cn('justify-end', style.right, style.leftContext)}>
                      {
                        priceShowType === 'ETH' ?
                          <>
                            {/* <span style={{ marginRight: "0.75rem", display: "inline-block" }}>{arrdataSourceValue[item]?.time[1]}</span>{priceShowType} */}
                            <span style={{ marginRight: "0.75rem", display: "inline-block" }}>
                            {(retObjValue(arrdataSourceValue[idx]?.time,1,'') as number)} </span>{priceShowType}
                          </> :
                          <>
                            <span style={{ marginRight: "0.75rem", display: "inline-block" }}>
                            {formatNum(retObjValue(arrdataSourceValue[idx]?.time,1,'') as number, false)}
                            </span>{priceShowType}
                          </>
                      }

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
                      arrdataSourceList&&  arrdataSourceList[item]?.percent * 100 > 0 ? style.rightText : style.redTextCol,
                    )}
                    onMouseEnter={() => {
                      setBgState('whales');
                    }}
                    onMouseLeave={() => {
                      setIndex(null);
                    }}
                  >
                    <div className={cn('justify-end', style.right)}>
                      {/* {Object.keys(item).map((o) => {
                        return Math.round(item[o].percent* 100)
                      })}% */}
                      {(arrdataSourceList&&arrdataSourceList[item]?.percent * 100)?.toFixed(2)}%
                    </div>
                  </th>
                </tr>
              </>
            );

          })}

        </tbody>
      </table>
    </>
  );
}