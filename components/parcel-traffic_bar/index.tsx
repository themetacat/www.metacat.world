import React from 'react';
import { Chart } from '@antv/g2';
import cn from 'classnames';

import ChartTitle from '../chart-title';
import Status from '../status';
import { formatNum } from '../../common/utils';
import SelecterTraffic from '../chart-select-traffic';

import style from './index.module.css';

type Props = {
  id?: string;
  dataHandlder?: (token: string, id: number, day_total: number) => any;
  defaultColor?: Array<number>;
  gradient?: boolean;
  className?: string;
  labelText?: string;
  limit?: number;
  barWidth?: number;
  token?: Promise<any>;
  textColor?;
};

export default function BaseBar({
  id,
  dataHandlder,
  defaultColor = [255, 224, 206],
  gradient = true,
  className,
  labelText,
  limit,
  barWidth = 35,
  textColor,
  token,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const chart = React.useRef(null);
  const [data, setData] = React.useState([]);
  const [showType, setShowType] = React.useState({ parcel_id: null, name: '' });
  const [selectType, setSelectType] = React.useState(false);
  const visible1 = React.useRef();

  const initChart = React.useCallback(
    (dt) => {
      const dom = document.getElementById(id);
      if (!dom) {
        return;
      }
      chart.current = new Chart({
        container: id,
        autoFit: true,
        height: 210,
      });
      if (limit && dt?.length > limit) {
        const l = dt.length;
        const da = l - limit;
        chart.current.data(dt.slice(da));
      } else {
        chart.current.data(dt);
      }
      chart.current.scale('value', {
        nice: true,
      });
      chart.current.tooltip({
        showCrosshairs: true,
        shared: true,
        crosshairs: {
          line: {
            style: {
              lineWidth: 0.5,
            },
          },
        },
        marker: {
          fill: `rgba(${defaultColor[0]}, ${defaultColor[1]}, ${defaultColor[2]}, 1)`,
        },
        customContent: (name, items) => {
          const container = document.createElement('div');
          container.className = 'g2-tooltip';
          const title = `<div class="g2-tooltip-title" style="margin-top: 12px;margin-bottom: 12px;' ">Date: <span style="color:#fff; margin-left:5px">${name}</span></div>`;
          let sum = 0;
          items.forEach((item) => {
            sum += item.value;
          });
          const staticItem = `<div style="color:#fff;margin-bottom:12px"><span style="color:#fff; font-size: 20px; font-weight:600;">${formatNum(
            sum,
          )}</span></div>`;
          container.innerHTML = title + staticItem;
          return container;
        },
        domStyles: {
          'g2-tooltip': {
            background: 'rgba(0,0,0,0.5)',
            color: '#ffffff',
            boxShadow: null,
          },
          'g2-tooltip-title': {
            color: 'rgba(153, 153, 153, 1)',
          },
          'g2-tooltip-list-item': {
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            color: 'rgba(153, 153, 153, 1)',
          },
          'g2-tooltip-value': {
            marginLeft: '5px',
          },
        },
      });

      chart.current.legend(false);

      // 设置横纵轴
      chart.current.axis('value', {
        grid: {
          line: {
            type: 'line',
            style: (x, y) => {
              if (y !== 0) {
                return {
                  lineDash: [5, 5],
                  lineWidth: 1,
                  stroke: 'rgba(255, 255, 255, 0.15)',
                };
              }
              return null;
            },
          },
        },
        label: {
          offsetX: barWidth / 2,
          formatter: (text) => {
            return formatNum(parseFloat(text));
          },
        },
      });
      chart.current.axis('time', {
        tickLine: null,
        line: {
          style: {
            lineWidth: 1,
            stroke: 'rgba(255, 255, 255, .15)',
          },
        },
        label: {
          style: { fill: 'rgba(255,255, 255, 0.85)' },
          offsetX: 25,
          offsetY: 0,
          rotate: 1,
        },
      });

      // 设置纵轴值
      chart.current.scale('value', {
        nice: true,
      });

      chart.current.scale('time', {
        type: 'cat',
        mask: 'YYYY.MM.DD',
      });

      chart.current
        .interval()
        .size(barWidth)
        .position('time*value')
        .color('value')
        .style({
          fill: gradient
            ? `l(270) 0:rgba(${defaultColor[0]}, ${defaultColor[1]}, ${defaultColor[2]}, 0.2) 1:rgba(${defaultColor[0]}, ${defaultColor[1]}, ${defaultColor[2]}, 1)`
            : `rgba(${defaultColor[0]}, ${defaultColor[1]}, ${defaultColor[2]}, 1)`,
        })
        .tooltip('time*value', (time, value) => {
          return {
            value: value * 1,
            time,
          };
        });

      chart.current.render();
    },
    [limit],
  );

  const requestData = React.useCallback(
    async (tok, i) => {
      setLoading(true);
      let result = null;
      try {
        const tk = await tok;
        const res = await dataHandlder(tk, i, 30);
        if (res.code === 100000 && res.data[0]) {
          setData(res.data);
          result = res.data;
        } else {
          setSelectType(true);
        }
        setLoading(false);
      } catch (ex) {
        setLoading(false);
        setError(true);
      }

      setLoading(false);
      if (result) {
        initChart(result);
      }
      return result;
    },
    [dataHandlder],
  );

  const onRetry = React.useCallback(() => {
    requestData(token, showType.parcel_id);
  }, [requestData]);

  const render = React.useMemo(() => {
    if (loading) {
      return <Status mini={true} status="loading" />;
    }
    if (data.length === 0) {
      return (
        <div className={style.totop}>
          <Status status="empty" />;
        </div>
      );
    }
    return <div id={id}></div>;
  }, [loading, error, onRetry, data]);

  // const update = React.useCallback((v) => {
  //   setShowType(data[v]);
  // }, []);

  const changeStatic = React.useCallback((val) => {
    if (val) {
      setShowType(val);
      requestData(token, val.parcel_id);
    }
    // if (data) {
    // update(val);
    // }
  }, []);

  const getSelect = React.useMemo(() => {
    if (!selectType) {
      return (
        <div
          className={cn('flex items-center', style.border)}
          style={{ color: 'rgba(255,255,255, 0.3)' }}
        >
          <SelecterTraffic
            showArrow={true}
            onClick={changeStatic}
            className={style.selecterLong}
            hasBorder={false}
            useRef={visible1}
            token={token}
          ></SelecterTraffic>
        </div>
      );
    }
  }, [data, visible1, changeStatic, selectType]);

  React.useEffect(() => {
    return () => {
      if (chart.current && data[0]) {
        chart.current.destroy();
      }
    };
  }, [requestData]);

  return (
    <div className={cn('w-full p-5', style.content, className)}>
      <div>
        <div className={cn('w-full flex justify-between item-center', style.header)}>
          <ChartTitle text={labelText}  color={textColor}></ChartTitle>
          <div className="flex items-center">{getSelect}</div>
        </div>
        {render}
      </div>
    </div>
  );
}
