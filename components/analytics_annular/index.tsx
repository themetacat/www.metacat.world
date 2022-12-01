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
  legend7?,
  legend8?,
  legend9?,
  textColor?,
  HyperlinkJump?,
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
  legend7,
  legend8,
  legend9,
  textColor,
  HyperlinkJump,
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
            type: 'pie',
            radius: ['40%', '70%'],
            encode: {
              x: 'name', // 指定x轴对应的值
            },
            label: {
              color: '#ccc',
              fontSize: 12,
              formatter: ` {@name} - {@value}%`,
            },
            emphasis: {
              itemStyle: {
                borderWidth: 1,
                borderColor: '#000',
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
                    return `rgba(119, 152, 238)`;
                  }
                  if (tVal.data.name === 'NFT Worlds') {
                    return `rgba(175, 234, 101)`;
                  }
                  if (tVal.data.name === 'Decentraland') {
                    return `rgba(240, 117, 97)`;
                  }
                  if (tVal.data.name === 'Worldwide Webb') {
                    return `rgba(245, 120, 157)`;
                  }
                  if (tVal.data.name === 'Voxels') {
                    return `rgba(244, 210, 191,1)`;
                  }
                  if (tVal.data.name === 'Somnium Space') {
                    return `rgba(240, 201, 124)`;
                  }
                  if (tVal.data.name === 'Otherside') {
                    return `rgba(255, 248, 187)`;
                  }
                  if (tVal.data.name === 'Netvrk') {
                    return `rgba(196, 148, 254,1)`;
                  }
                },
                borderWidth: 0.5,
                borderColor: '#000',
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
        <ChartTitle Hyperlink={HyperlinkJump} text={labelText}  color={textColor}></ChartTitle>
        <div className="flex items-center">{getSelect}</div>
      </div>
      {rander}
    </div>
  );
}
