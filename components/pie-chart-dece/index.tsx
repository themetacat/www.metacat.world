import React, { ReactElement } from 'react';
import cn from 'classnames';
import * as echarts from 'echarts';

import style from './index.module.css';

import ChartSelecter from '../chart-select';
import ChartTitle from '../chart-title';
import Status from '../status';

import { convert, getToken, setToken } from '../../common/utils';

type optionItem = {
  label?: string;
  value?: string;
};

type Props = {
  id?: string;
  options?: Array<optionItem>;
  labelText?: string;
  dataHandlder?;
  textColor?;
  token: Promise<any>;

};

export default function PieChartDece({ id, options, labelText, dataHandlder, token,  textColor, }: Props) {
  const visible1 = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [showType, setShowType] = React.useState('day');
  const [dataSource, setDataSource] = React.useState({});
  const [data, setData] = React.useState([]);
  const chart = React.useRef(null);
  const initChart = React.useCallback(
    (dd) => {
      const chartDom = document.getElementById(id)!;
      const myChart = echarts.init(chartDom);
      let chartData = null;
      if (dd) {
        chartData = dd.map((item) => {
          return {
            name: item.name,
            // parcel_id: item.parcel_id,
            percent: Math.round(item.value * 100),
          };
        });
      }
      chart.current = {
        dataset: {
          dimensions: ['name', 'parcel_id', 'percent'],
          source: chartData,
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            // radius: '50%',
            radius: ['25%', '50%'],
            hoverAnimated: true,
            encode: {
              x: 'name', // 指定x轴对应的值
              y: 'parcel_id', // 指定y轴对应的值
            },

            emphasis: {
              labelLine: {
                lineStyle: {
                  width: 3,
                },
              },
              itemStyle: {
                borderWidth: 1,
                borderColor: '#000',
                fontSize: 20,
              },
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold',
                color: {},
              },
            },
            label: {
              color: '#aaa',
              fontSize: 16,
              alignTo: 'labelLine',
              formatter: `#{@parcel_id}  {@name} - {@percent}%`,
            },
            itemStyle: {
              // 此配置
              normal: {
                borderWidth: 0.5,
                borderColor: '#000',
                color: (tval) => {
                  if (tval.dataIndex === 0) {
                    return `#00E7AF`;
                  }
                  if (tval.dataIndex === 1) {
                    return `#00EE98`;
                  }
                  if (tval.dataIndex === 2) {
                    return `#00CF85`;
                  }
                  if (tval.dataIndex === 3) {
                    return `#00B977`;
                  }
                  if (tval.dataIndex === 4) {
                    return `#B8FFEE`;
                  }
                  if (tval.dataIndex === 5) {
                    return `#76FFDE`;
                  }
                  if (tval.dataIndex === 6) {
                    return `#28FFCB`;
                  }
                },
              },
            },
          },
        ],
      };
      if (myChart) {
        myChart.setOption(chart.current);
      }
    },
    [data],
  );
  const requestData = React.useCallback(
    async (tok) => {
      console.log(dataHandlder,'dataHandlder',tok);
      console.log(dataHandlder(tok),showType);
      
      setLoading(true);
      let result = {};
      try {
        const tk = await tok;
        const res = await dataHandlder(tk);
        result = res.data;


        // if (result[showType]) {
        //   setDataSource(result);
        //   setData(result[showType]);
        // }



        if (result[showType]) {
          setDataSource(result);
          if(showType==='day'&&res.data.day.length === 0){
            setShowType('week')
            const res = await dataHandlder(tk);
            result = res.data;
            setData(result['week']);
          }else if(showType==='week'&&res.data.month.length === 0){
            setShowType('month')
            setData(result[showType]);
          }else if(showType==='month'){
            setData(result[showType]);
          }
        }
        setLoading(false);
      } catch (ex) {
        setLoading(false);
        setError(true);
      }
      if (result) {
        initChart(result[showType]);
      }
      return result;
    },
    [showType],
  );
  const update = React.useCallback(
    (v) => {
      setData(dataSource[v]);
    },
    [dataSource],
  );
  const changeStatic = React.useCallback(
    (val) => {
      setShowType(val);
      if (dataSource) {
        update(val);
      }
    },
    [update],
  );
  const onRetry = React.useCallback(() => {
    requestData(token);
  }, []);
  const render = React.useMemo(() => {
    if (loading) {
      return <Status mini={true} status="loading" />;
    }
    if (error) {
      return <Status mini={true} retry={onRetry} status="error" />;
    }

    if (data.length === 0) {
      return (
        <div>
          <Status status="empty" />;
        </div>
      );
    }
    return <div id={id} className={style.totop}></div>;
  }, [loading, error, onRetry, data]);

  const getSelect = React.useMemo(() => {
    if (data.length !== 0) {
      return (
        <div
          className={cn('flex items-center', style.border)}
          style={{ color: 'rgba(255,255,255, 0.3)',borderRadius:"4px" }}
        >
          <ChartSelecter
            options={options}
            showArrow={true}
            onClick={changeStatic}
            className={style.selecterLong}
            defaultLabel={showType}
            hasBorder={false}
            useRef={visible1}
            cl={style.bg}
          ></ChartSelecter>
        </div>
      );
    }
    return null;
  }, [data,showType]);

  React.useEffect(() => {
    const accessToken = getToken('atk');
    console.log(accessToken,55655);
    
  // console.log(accessToken,
  //   getParcelList2(accessToken))
  requestData(accessToken);
}, [requestData,token]);

  return (
    <div>
      <div className={cn('w-full p-5', style.content)} style={{ borderRadius:"8px" }}>
        <div>
          <div className={cn('w-full flex justify-between item-center', style.header)}>
            <ChartTitle text={labelText}  color={textColor}></ChartTitle>
            <div className="flex items-center">{getSelect}</div>
          </div>
          <div className={cn(data.length === 0 ? style.tobottom : null)}>{render}</div>
        </div>
      </div>
    </div>
  );
}
