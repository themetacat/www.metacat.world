import React from 'react';
import cn from 'classnames';
import { Chart } from '@antv/g2';

import ChartTitle from '../chart-title';

import Status from '../status';
import IconLabel from '../icon-label';
import ChartSelecter from '../chart-select';

import { formatNum } from '../../common/utils';

import style from './index.module.css';

type optionItem = {
  label?: string;
  value?: string;
};

type Props = {
  id?: string;
  dataHandler?: () => any;
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

  const transfromData = React.useCallback(
    (data, type, lim) => {
      const result = [];
      if (lim && data.length > lim) {
        const l = data.length;
        const d = l - lim * 2;
        const last = data.slice(d);
        last.forEach((element) => {
          result.push({
            ...element,
            staticT: type,
          });
        });
        return result;
      }
      data.forEach((element) => {
        result.push({
          ...element,
          staticT: type,
        });
      });
      return result;
    },
    [null],
  );

  const initChart = React.useCallback(
    (data) => {
      const dom = document.getElementById(id);
      if (!dom) {
        return;
      }
      chart.current = new Chart({
        container: id,
        autoFit: true,
        height: 210,
      });
      // 设置弹窗
      chart.current.tooltip({
        shared: true,
        showCrosshairs: true,
        customContent: (name, items) => {
          const container = document.createElement('div');
          container.className = 'g2-tooltip';
          const title = `<div class="g2-tooltip-title" style="margin-top: 12px;margin-bottom: 12px;' ">Date: <span style="color:#fff; margin-left:5px">${name}</span></div>`;
          let sum = 0;
          let listItem = '';
          let type = '';
          items.forEach((item) => {
            listItem += `
          <li class="g2-tooltip-list-item" data-index={index}>
            <span class="g2-tooltip-name">${item.type}</span>
            :
            <span class="g2-tooltip-value" style="color:${item.color}">
              <span>${formatNum(item.value)}</span>
              <span ${isEth ? 'style="margin-left:5px"' : ''}>${
              isEth ? item.staticT.toLocaleUpperCase() : ''
            }</span>
            </span>
          </li>`;
            sum += item.value * 1000;
            type = item.staticT;
          });
          const staticItem = `<div style="color:#fff;"><span style="color:#fff; font-size: 20px; font-weight:700">${formatNum(
            sum / 1000,
          )}</span><span ${isEth ? 'style="margin-left:5px"' : ''}>${
            isEth ? type.toLocaleUpperCase() : ''
          }</span><span style="margin-left:5px">Total</span></div>`;
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
        },
      });

      // 设置纵轴值
      chart.current.scale('value', {
        nice: true,
      });

      chart.current.scale('time', {
        mask: 'YYYY.MM.DD',
      });

      // 数据处理
      if (data) {
        // if (limit && data[staticType].data?.length > limit) {
        //   const l = data[staticType].data.length;
        //   const d = l - limit * 2;
        //   chart.current.data(data[staticType].data.slice(d));
        // } else {
        //   chart.current.data(data[staticType].data);
        // }
        chart.current.data(transfromData(data[staticType].data, staticType, limit));
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
          .tooltip('time*value*type*staticT', (time, value, type, staticT) => {
            let s = type;
            if (type) {
              const temp = type;
              s = temp.charAt(0).toUpperCase() + temp.slice(1);
            }
            return {
              value: value * 1,
              type: s,
              time,
              color:
                type === 'primary'
                  ? `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`
                  : `rgb(${color2[0]}, ${color2[1]}, ${color2[2]})`,
              staticT,
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
    return () => {
      if (chart.current) {
        chart.current.destroy();
      }
    };
  }, [null]);

  const changeStatic = React.useCallback(
    (val) => {
      setStaticType(val);
      if (chart.current && dataSource) {
        // if (limit && dataSource[val].data?.length > limit) {
        //   const l = dataSource[val].data.length;
        //   const d = l - limit * 2;
        //   chart.current.changeData(dataSource[val].data.slice(d));
        // } else {
        //   chart.current.changeData(dataSource[val].data);
        // }

        chart.current.changeData(transfromData(dataSource[val].data, val, limit));
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
      <ChartSelecter
        options={options}
        showArrow={true}
        onClick={changeStatic}
        defaultLabel={options[0].value}
      ></ChartSelecter>
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
    <div className={cn('w-full p-5', style.content, className)}>
      <div>
        <div className={cn('w-full flex justify-between item-center', style.header)}>
          <ChartTitle text={labelText}></ChartTitle>
          <div className="flex items-center">
            <div className="flex items-center mr-7">{getLenged}</div>
            {getSelect}
          </div>
        </div>
        {render}
      </div>
    </div>
  );
}
