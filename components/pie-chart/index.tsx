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
  dataHandlder: (token) => void;
};

const d = {
  day: [
    {
      parcel_id: 2808,
      name: 'Pranksyland',
      percent: 0.38,
    },
    {
      parcel_id: 747,
      name: '',
      percent: 0.12,
    },
    {
      parcel_id: 932,
      name: 'Metapurse HQ',
      percent: 0.12,
    },
    {
      parcel_id: 2954,
      name: '',
      percent: 0.12,
    },
    {
      parcel_id: 2987,
      name: '',
      percent: 0.12,
    },
    {
      parcel_id: 2999,
      name: '',
      percent: 0.12,
    },
    {
      parcel_id: 0,
      name: 'Other',
      percent: 0,
    },
  ],
  week: [
    {
      parcel_id: 932,
      name: 'Metapurse HQ',
      percent: 0.17,
    },
    {
      parcel_id: 2808,
      name: 'Pranksyland',
      percent: 0.1,
    },
    {
      parcel_id: 2873,
      name: '',
      percent: 0.07,
    },
    {
      parcel_id: 3024,
      name: '',
      percent: 0.07,
    },
    {
      parcel_id: 2152,
      name: 'Pranksyland',
      percent: 0.05,
    },
    {
      parcel_id: 747,
      name: '',
      percent: 0.05,
    },
    {
      parcel_id: 0,
      name: 'Other',
      percent: 0.49,
    },
  ],
  month: [
    {
      parcel_id: 932,
      name: 'Metapurse HQ',
      percent: 0.14,
    },
    {
      parcel_id: 2883,
      name: '',
      percent: 0.05,
    },
    {
      parcel_id: 3005,
      name: '',
      percent: 0.04,
    },
    {
      parcel_id: 3019,
      name: '',
      percent: 0.04,
    },
    {
      parcel_id: 3024,
      name: '',
      percent: 0.04,
    },
    {
      parcel_id: 1847,
      name: '',
      percent: 0.04,
    },
    {
      parcel_id: 0,
      name: 'Other',
      percent: 0.66,
    },
  ],
};

export default function PieChartZ({ id, options, labelText }: Props) {
  const visible1 = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [showType, setShowType] = React.useState('day');
  const [dataSource, setDataSource] = React.useState(d);
  const [data, setData] = React.useState(d[showType]);
  const chart = React.useRef(null);
  const initChart = React.useCallback(
    (dd) => {
      const chartDom = document.getElementById(id)!;
      const myChart = echarts.init(chartDom);
      const chartData = dd.map((item) => {
        return {
          name: item.name,
          parcel_id: item.parcel_id,
          percent: Math.round(item.percent * 100),
        };
      });
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
      myChart.setOption(chart.current);
    },
    [data],
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
    // requestData();
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
    initChart(data);
  }, [initChart, update]);

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
