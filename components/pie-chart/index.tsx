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
  textColor?;
  token: Promise<any>;

};

export default function PieChartZ({ id, options, labelText, dataHandlder, token, textColor, }: Props) {
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
      const myChart = echarts?.init(chartDom);
      // const myChart = null;
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
            // radius: '50%',
            radius: ['30%', '55%'],
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
                borderWidth: 0.5,
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
              color: '#00C5F0;',
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
                    return `#00D0EC`;
                  }
                  if (tval.dataIndex === 1) {
                    return `#00C5F0`;
                  }
                  if (tval.dataIndex === 2) {
                    return `#00B6DE`;
                  }
                  if (tval.dataIndex === 3) {
                    return `#00A2C6`;
                  }
                  if (tval.dataIndex === 4) {
                    return `#BBF7FF`;
                  }
                  if (tval.dataIndex === 5) {
                    return `#79EFFF`;
                  }
                  if (tval.dataIndex === 6) {
                    return `#21E4FF`;
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
      setLoading(true);
      let result = {};
      try {
        const tk = await tok;
        const res = await dataHandlder(tk);
        result = res.data;
        if (result[showType]) {
          setDataSource(result);
          setData(result[showType]);
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
          style={{ color: 'rgba(255,255,255, 0.3)', borderRadius: "4px" }}
        >
          <ChartSelecter
            options={options}
            showArrow={true}
            onClick={changeStatic}
            className={style.selecterLong}
            defaultLabel={options[0].value}
            hasBorder={false}
            useRef={visible1}
            cl={style.bg}
          ></ChartSelecter>
        </div>
      );
    }
    return null;
  }, [data]);

  React.useEffect(() => {
    requestData(token);
  }, [requestData]);
  React.useEffect(() => {

  }, [id]);

  return (
    <div>
      <div className={cn('w-full p-5', style.content)} style={{ borderRadius: "4px" }}>
        <div>
          <div className={cn('w-full flex justify-between item-center', style.header)}>
            <ChartTitle text={labelText} color={textColor}></ChartTitle>
            <div className="flex items-center">{getSelect}</div>
          </div>
          <div className={cn(data.length === 0 ? style.tobottom : null)}>{render}</div>
        </div>
      </div>
    </div>
  );
}
