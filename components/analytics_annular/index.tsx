import React from 'react';
import * as echarts from 'echarts';
import cn from 'classnames';
import style from './index.module.css';

import ChartTitle from '../chart-title';
import Status from '../status';
import ChartSelecter from '../chart-select';

type optionItem = {
  label?: string;
  value?: string;
};
type Props = {
  id?: string;
  labelText?: string;
  dataHandlder?;
  options?: Array<optionItem>;
  priceOptions?: Array<optionItem>;
  legend1?;
  legend2?;
  legend3?;
  legend4?;
  legend5?;
  legend6?;
};

export default function Annular({
  id,
  labelText,
  dataHandlder,
  options,
  priceOptions,
  legend1,
  legend2,
  legend3,
  legend4,
  legend5,
  legend6,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [data, setData] = React.useState({});
  const [showData, setShowData] = React.useState([]);
  const [showType, setShowType] = React.useState(options[0].value);
  const [priceShowType, setPriceShowType] = React.useState(priceOptions[0].value);
  const chart = React.useRef(null);

  const initChart = React.useCallback(
    (dd, st) => {
      const chartDom = document.getElementById(id)!;
      const myChart = echarts.init(chartDom);
      let chartData = null;
      if (dd) {
        chartData = dd.map((item) => {
          return {
            name: item.name,
            value: Math.round(item.value * 100),
          };
        });
      }
      chart.current = {
        dataset: {
          source: chartData,
          dimensions: ['name', 'value'],
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            encode: {
              x: 'name', // 指定x轴对应的值
            },
            label: {
              color: '#ccc',
              fontSize: 12,
              alignTo: 'labelLine',
              formatter: ` {@name} - {@value}%`,
            },
            emphasis: {
              itemStyle: {
                borderWidth: 1,
                borderColor: '#fff',
                fontSize: 20,
              },
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold',
                color: {},
              },
              labelLine: {
                lineStyle: {
                  width: 3,
                },
              },
            },
            itemStyle: {
              normal: {
                color: (tVal) => {
                  if (tVal.data.name === 'The Sandbox') {
                    return `rgba(24, 147, 247,1)`;
                  }
                  if (tVal.data.name === 'NFT Worlds') {
                    return `rgba(132, 193, 14,1)`;
                  }
                  if (tVal.data.name === 'Decentraland') {
                    return `rgba(255, 107, 84,1)`;
                  }
                  if (tVal.data.name === 'Worldwide Webb') {
                    return `rgba(229, 68, 155,1)`;
                  }
                  if (tVal.data.name === 'Voxels') {
                    return `rgba(244, 210, 191,1)`;
                  }
                  if (tVal.data.name === 'Somnium Space') {
                    return `rgba(250, 216, 23,1)`;
                  }
                  if (tVal.data.name === 'Otherside') {
                    return `rgba(255, 248, 187,1)`;
                  }
                },
                borderWidth: 0.5,
                borderColor: '#fff',
              },
            },
          },
        ],
      };
      myChart.resize({
        width: 660,
        height: 350,
      });
      if (myChart) {
        myChart.setOption(chart.current);
      }
    },
    [showData],
  );

  const requestData = React.useCallback(async () => {
    setLoading(true);
    const result = await dataHandlder();

    if (result.code === 100000 && result.data) {
      setLoading(false);
      setData(result.data);
      setShowData(result.data[showType][priceShowType]);
      initChart(result.data[showType][priceShowType], showType);
    } else {
      setLoading(false);
      setError(true);
    }
  }, [showType, priceShowType]);

  const onRetry = React.useCallback(() => {
    requestData();
  }, [requestData]);

  const rander = React.useMemo(() => {
    if (loading) {
      return (
        <nav className={style.mt}>
          <Status mini={true} status="loading" />
        </nav>
      );
    }

    if (error) {
      return <Status mini={true} retry={onRetry} status="error" />;
    }

    return (
      <div id={id} className={cn(style.totop, showType === 'all_time' ? style.ml : style.mr)}></div>
    );
  }, [loading, error, onRetry, showType]);

  const updata = React.useCallback(
    (st, pt) => {
      initChart(data[st][pt], st);
    },
    [data],
  );

  const changeStatic = React.useCallback(
    (val) => {
      setShowType(val);
      if (val) {
        updata(val, priceShowType);
      }
    },
    [priceShowType, updata],
  );

  const getSelect = React.useMemo(() => {
    if (showData.length !== 0) {
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
            cl={style.bg}
          ></ChartSelecter>
        </div>
      );
    }
    return null;
  }, [showData]);

  React.useEffect(() => {
    requestData();
  }, [requestData]);

  return (
    <div className={style.container}>
      <div className={cn('w-full flex justify-between item-center', style.header)}>
        <ChartTitle text={labelText}></ChartTitle>
        <div className="flex items-center">{getSelect}</div>
      </div>
      {rander}
    </div>
  );
}
