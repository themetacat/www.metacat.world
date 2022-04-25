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
};

export default function Annular({ id, labelText, dataHandlder, options, priceOptions }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [data, setData] = React.useState({});
  const [showData, setShowData] = React.useState([]);
  const [showType, setShowType] = React.useState(options[0].value);
  const [priceShowType, setPriceShowType] = React.useState(priceOptions[0].value);
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
              color: '#aaa',
              fontSize: 12,
              alignTo: 'labelLine',
              formatter: ` {@name} - {@value}%`,
            },
          },
        ],
      };
      myChart.resize({
        width: 600,
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
      initChart(result.data[showType][priceShowType]);
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
      return <Status mini={true} status="loading" />;
    }

    if (error) {
      return <Status mini={true} retry={onRetry} status="error" />;
    }

    return <div id={id} className={style.totop}></div>;
  }, [loading, error, onRetry]);

  const updata = React.useCallback(
    (st, pt) => {
      setShowData(data[st][pt]);
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

  const changePriceStatic = React.useCallback(
    (val) => {
      setPriceShowType(val);
      if (val) {
        updata(showType, val);
      }
    },
    [showType, updata],
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
          ></ChartSelecter>
          丨
          <ChartSelecter
            options={priceOptions}
            showArrow={true}
            onClick={changePriceStatic}
            defaultLabel={priceOptions[0].value}
            hasBorder={false}
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
