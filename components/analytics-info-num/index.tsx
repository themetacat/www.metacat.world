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
  const [arrdataSource, setArrDataSource] = React.useState(null);
  const [arrdataSourceList, setArrDataSourceList] = React.useState(null);
  const [arrdataSourceValue, setArrDataSourceValue] = React.useState([]);
  const [totaldataSource, setTotalDataSource] = React.useState([]);
  const [usdPercent, setUsdPercent] = React.useState([]);
  const [bgState, setBgState] = React.useState('');
  const [alldata, setalldata] = React.useState([]);
  const [index, setIndex] = React.useState(null);
  const [backNum, setBackNum] = React.useState(null);
  const obj = {}
  const Otherside = arrdataSource?.Otherside;
  // const OthersideVal = arrdataSourceValue?.Otherside;
  // React.useEffect(() => {
  //   getWorldsNum().then((data) => {
  //     setalldata(data);
  //   });
  // }, [])
  const requestData = React.useCallback(async () => {
    const res: any = await getWorldsNum();
    setDataSource(res.data.monthly.sales_data);
    setTotalDataSource(res.data.monthly.percent);
    res.data.monthly.sales_data.forEach(item => {
      if (!obj[item.name]) {
        obj[item.name] = {}
        obj[item.name].time = {}
      }
      // obj[item.name][item.time] = item.value;
      obj[item.name].time[item.time] = item.value
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
      if (value) {
        arr.push({ [name]: obj[name] })
      }
    });
    setArrDataSource(Object.keys(obj))
    setArrDataSourceList(obj)
    // console.log(obj);
    
    setArrDataSourceValue(Object.values(obj))
  }, [null]);

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
    // setBackNum('backNum');
  }, [null]);

  return (
    <>
      <ChartTitle text={labelText} className={style.tobottom} color={textColor} ></ChartTitle>
      <table className={cn('w-full', style.table)} >
        <tbody>
          <tr className={cn('text-base font-normal', style.title)}>
            <th
              className={cn(style.h1, style.bg, style.biaotou)}
              // onMouseOver={()=>{
              //   setBackNum('backNum');
              // }}
              onMouseEnter={() => {
                setBgState('world');
              }}
              onMouseLeave={() => {
                setIndex(null);
              }}
            >
              <div className={style.left}>World/sales</div>
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
              <div className={style.right}>
                <div className={style.right}>{arrdataSourceList?.length === 0 ? null :
                  arrdataSourceList &&retObjValue(arrdataSourceList.Otherside?.time,1,'keys')
                }</div>
              </div>
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
          //  console.log(arrdataSource,arrdataSource[0],2222);
            
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
                      {/* {Object.keys(item).map((o) => {
                        return item[o]["2022.07"]
                      })} */}
                      {/* {arrdataSource[item]["2022.08"]} */}
                      {/* {formatNum(arrdataSource[item]["2022.08"], false)} */}
                      {/* {Object.values(arrdataSource[item].time)[0]} */}
                      {formatNum(retObjValue(arrdataSourceValue[idx]?.time,0,'') as number, false)}
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
                      {/* {Object.keys(item).map((o) => {
                        return item[o]["2022.08"]
                      })} */}
                      {/* {arrdataSource[item]["2022.07"]} */}
                      {/* {formatNum(arrdataSource[item]["2022.07"], false)} */}
                      {/* {Object.values(arrdataSource[item].time)[1]} */}
                      {formatNum(retObjValue(arrdataSourceValue[idx]?.time,1,'') as number, false)}
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
                      arrdataSourceList&&  arrdataSourceList[item]?.percent* 100 > 0 ? style.rightText : style.redTextCol,
                    )}
                    onMouseEnter={() => {
                      setBgState('whales');
                      // if(Math.round(item[o].percent* 100)>0){

                      // }
                    }}
                    // onMouseOver={()=>{
                    //   setBackNum('backNum');
                    // }}
                    onMouseLeave={() => {
                      setIndex(null);
                    }}
                  >
                    <div className={cn('justify-end', style.right, style.leftContext,
                    )}
                    >
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