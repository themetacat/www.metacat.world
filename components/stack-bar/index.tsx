import React from 'react';
import cn from 'classnames';
import { Chart } from '@antv/g2';

import BaseChart from '../base-chart';

import Status from '../status';
import IconLabel from '../icon-label';
import ChartSelecter from '../chart-select';

import style from './index.module.css';

type optionItem = {
  label?: string;
  value?: string;
};

type Props = {
  id?: string;
  dataHandler?: () => void;
  color1?: Array<number>;
  color2?: Array<number>;
  gradient?: boolean;
  className?: string;
  options?: Array<optionItem>;
  isEth?: boolean;
  labelText?: string;
  limit?: number;
};

export default function StackBar({
  id,
  dataHandler,
  color1 = [95, 213, 236],
  color2 = [255, 207, 95],
  gradient = true,
  className,
  options,
  isEth = false,
  labelText,
  limit,
}: Props) {
  const [staticType, setStaticType] = React.useState(options[0].value);
  const [dataSource, setDataSource] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const chart = React.useRef(null);

  const initChart = React.useCallback(
    (data) => {
      chart.current = new Chart({
        container: id,
        autoFit: true,
        height: 210,
      });
      // 设置弹窗
      chart.current.tooltip({
        shared: true,
        showMarkers: false,
        customContent: (name, items) => {
          const container = document.createElement('div');
          container.className = 'g2-tooltip';
          const title = `<div class="g2-tooltip-title" style="margin-top: 12px;margin-bottom: 12px;' ">Date: <span style="color:#fff; margin-left:5px">${name}</span></div>`;
          let sum = 0;
          let listItem = '';
          items.forEach((item) => {
            listItem += `
          <li class="g2-tooltip-list-item" data-index={index}>
            <span class="g2-tooltip-name">${item.type}</span>
            :
            <span class="g2-tooltip-value" style="color:${item.color}">
              <span>${item.value}</span>
              <span ${isEth ? 'style="margin-left:5px"' : ''}>${isEth ? staticType : ''}</span>
            </span>
          </li>`;
            sum += item.value;
          });
          const staticItem = `<div style="color:#fff;"><span style="color:#fff; font-size: 20px; font-weight:700">${sum}</span><span ${
            isEth ? 'style="margin-left:5px"' : ''
          }>${isEth ? staticType : ''}</span><span style="margin-left:5px">Total</span></div>`;
          container.innerHTML = title + staticItem + listItem;
          return container;
        },

        domStyles: {
          'g2-tooltip': {
            background: 'rgba(0,0,0,0.9)',
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

      // 设置图例
      chart.current.legend(false);

      // 设置横纵轴
      chart.current.axis('value', {
        grid: {
          line: {
            type: 'line',
            style: {
              lineDash: [5, 5],
              lineWidth: 0.2,
              fill: 'rgba(255, 255, 255, 0.15)',
            },
          },
        },
      });
      chart.current.axis('time', {
        tickLine: null,
      });

      // 设置纵轴值
      chart.current.scale('value', {
        nice: true,
      });

      // 数据处理
      if (data) {
        if (limit && data[staticType].data?.length > limit) {
          const l = data[staticType].data.length;
          const d = l - limit * 2;
          chart.current.data(data[staticType].data.slice(d));
        } else {
          chart.current.data(data[staticType].data);
        }
        chart.current
          .interval()
          .position('time*value')
          .color('type')
          .style({
            fields: ['type'],
            callback: (tVal) => {
              if (tVal === 'primary') {
                return {
                  fill: gradient
                    ? `l(270) 0:rgba(${color1[0]}, ${color1[1]}, ${color1[2]}, 0.2) 1:rgba(${color1[0]}, ${color1[1]}, ${color1[2]}, 1)`
                    : `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`,
                };
              }
              return {
                fill: gradient
                  ? `l(270) 0:rgba(${color2[0]}, ${color2[1]}, ${color2[2]}, 0.2) 1:rgba(${color2[0]}, ${color2[1]}, ${color2[2]}, 1)`
                  : `rgb(${color2[0]}, ${color2[1]}, ${color2[2]})`,
              };
            },
          })
          .tooltip('time*value*type', (time, value, type) => {
            let s = type;
            if (type) {
              const temp = type;
              s = temp.charAt(0).toUpperCase() + temp.slice(1);
            }
            return {
              value,
              type: s,
              time,
              color:
                type === 'primary'
                  ? `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`
                  : `rgb(${color2[0]}, ${color2[1]}, ${color2[2]})`,
            };
          })
          .adjust({
            type: 'stack',
            reverseOrder: false,
          });
        chart.current.render();
      }
    },
    [staticType, limit],
  );

  const requestData = React.useCallback(async () => {
    setLoading(true);
    let result = null;
    try {
      const res = await dataHandler();
      result = res.data;
      setDataSource(result);
    } catch (ex) {
      setError(true);
    }
    setLoading(false);
    if (result) {
      initChart(result);
    }
    return result;
  }, [staticType, limit]);

  const onRetry = React.useCallback(() => {
    requestData();
  }, [staticType, limit]);

  React.useEffect(() => {
    requestData();
  }, [null]);

  const changeStatic = React.useCallback(
    (val) => {
      setStaticType(val);
      if (chart.current && dataSource) {
        if (limit && dataSource[val].data?.length > limit) {
          const l = dataSource[val].data.length;
          const d = l - limit * 2;
          chart.current.changeData(dataSource[val].data.slice(d));
        } else {
          chart.current.changeData(dataSource[val].data);
        }
      }
    },
    [dataSource, limit],
  );

  const getLenged = React.useMemo(() => {
    return (
      <>
        <IconLabel
          text="Primary"
          color={`rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`}
          className="mr-5"
        ></IconLabel>
        <IconLabel
          text="Secondary"
          color={`rgb(${color2[0]}, ${color2[1]}, ${color2[2]})`}
        ></IconLabel>
      </>
    );
  }, [color1, color2]);

  const getSelect = React.useMemo(() => {
    return (
      <ChartSelecter options={options} showArrow={true} onClick={changeStatic}></ChartSelecter>
    );
  }, [options, changeStatic]);

  const render = React.useMemo(() => {
    if (loading) {
      return <Status mini={true} status="loading" />;
    }

    if (error) {
      return <Status retry={onRetry} mini={true} status="error" />;
    }

    return <div id={id}></div>;
  }, [loading, error, onRetry]);

  return (
    <BaseChart
      labelText={labelText}
      lenged={getLenged}
      selectChild={getSelect}
      className={className}
    >
      {render}
    </BaseChart>
  );
}
