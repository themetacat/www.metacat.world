import React, { ReactElement } from 'react';
import cn from 'classnames';
import * as echarts from 'echarts';

import style from './index.module.css';

import ChartSelecter from '../chart-select';
import ChartTitle from '../chart-title';
import Status from '../status';

type optionItem = {
  label?: string;
  value?: string;
};

type Props = {
  id?: string;
  options?: Array<optionItem>;
  labelText?: string;
  dataHandlder?;
  token: Promise<any>;
};

export default function PieChartZ({ id, options, labelText, dataHandlder, token }: Props) {
  const visible1 = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [showType, setShowType] = React.useState('day');
  const [dataSource, setDataSource] = React.useState({});
  const [data, setData] = React.useState(dataSource[showType]);
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
            parcel_id: item.parcel_id,
            percent: Math.round(item.percent * 100),
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
            radius: '50%',

            encode: {
              x: 'name', // 指定x轴对应的值
              y: 'parcel_id', // 指定y轴对应的值
            },
            label: {
              color: '#aaa',
              fontSize: 16,
              alignTo: 'labelLine',
              formatter: `#{@parcel_id}  {@name} - {@percent}%`,
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
      setLoading(true);
      let result = {};
      try {
        const tk = await tok;
        const res = await dataHandlder(tk);
        result = res.data;
        setDataSource(result);
        setData(result[showType]);
      } catch (ex) {
        setError(true);
      }
      setLoading(false);
      if (result) {
        initChart(result[showType]);
      }
      return result;
    },
    [showType],
  );
  const update = React.useCallback((v) => {
    setData(dataSource[v]);
  }, []);
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

    return <div id={id} className={style.totop}></div>;
  }, [loading, error, onRetry]);

  const getSelect = React.useMemo(() => {
    return (
      <div
        className={cn('flex items-center', style.border)}
        style={{ color: 'rgba(255,255,255, 0.3)' }}
      >
        <ChartSelecter
          options={options}
          showArrow={true}
          onClick={changeStatic}
          className={style.selecterLong}
          defaultLabel={options[0].value}
          hasBorder={false}
          useRef={visible1}
        ></ChartSelecter>
      </div>
    );
  }, []);

  React.useEffect(() => {
    requestData(token);
  }, [requestData]);

  return (
    <div>
      <div className={cn('w-full p-5', style.content)}>
        <div>
          <div className={cn('w-full flex justify-between item-center', style.header)}>
            <ChartTitle text={labelText}></ChartTitle>
            <div className="flex items-center">{getSelect}</div>
          </div>
          {render}
        </div>
      </div>
    </div>
  );
}
