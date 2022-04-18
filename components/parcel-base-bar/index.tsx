import React from 'react';
import { Chart } from '@antv/g2';
import cn from 'classnames';

import ChartTitle from '../chart-title';
import Status from '../status';
import { formatNum } from '../../common/utils';

import { req_cv_parcel_traffic } from '../../service/z_api';

import style from './index.module.css';

type Props = {
  id?: string;
  dataHandlder?: (token: string) => any;
  defaultColor?: Array<number>;
  gradient?: boolean;
  className?: string;
  labelText?: string;
  limit?: number;
  barWidth?: number;
  token?: Promise<any>;
};

const d = [
  {
    time: '2022.04.14',
    value: 8,
  },
  {
    time: '2022.04.13',
    value: 6,
  },
  {
    time: '2022.04.12',
    value: 7,
  },
  {
    time: '2022.04.11',
    value: 2,
  },
  {
    time: '2022.04.10',
    value: 5,
  },
  {
    time: '2022.04.09',
    value: 12,
  },
  {
    time: '2022.04.08',
    value: 1,
  },
  {
    time: '2022.04.07',
    value: 12,
  },
  {
    time: '2022.04.06',
    value: 3,
  },
  {
    time: '2022.04.05',
    value: 7,
  },
  {
    time: '2022.04.04',
    value: 7,
  },
  {
    time: '2022.04.03',
    value: 16,
  },
  {
    time: '2022.04.02',
    value: 26,
  },
  {
    time: '2022.04.01',
    value: 11,
  },
  {
    time: '2022.03.31',
    value: 7,
  },
];

export default function BaseBar({
  id,
  dataHandlder,
  defaultColor = [34, 118, 252],
  gradient = true,
  className,
  labelText,
  limit,
  barWidth = 45,
  token,
}: Props) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const chart = React.useRef(null);
  const [data, setData] = React.useState(d);

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
    async (tok) => {
      setLoading(true);
      const result = null;
      try {
        const tk = await tok;
        const res = await req_cv_parcel_traffic(tk.trim());
      } catch (ex) {
        setError(true);
      }
      setLoading(false);
      // if (result) {
      // initChart(result);
      initChart(d);
      // }
      // return result;
    },
    [dataHandlder],
  );

  const onRetry = React.useCallback(() => {
    requestData(token);
  }, [requestData]);

  const render = React.useMemo(() => {
    if (loading) {
      return <Status mini={true} status="loading" />;
    }

    if (error) {
      return <Status mini={true} retry={onRetry} status="error" />;
    }

    return <div id={id}></div>;
  }, [loading, error, onRetry]);

  React.useEffect(() => {
    requestData(token);
    return () => {
      if (chart.current) {
        chart.current.destroy();
      }
    };
  }, [requestData]);

  return (
    <div className={cn('w-full p-5', style.content, className)}>
      <div>
        <div className={cn('w-full flex justify-between item-center', style.header)}>
          <ChartTitle text={labelText}></ChartTitle>
          <div className="flex items-center">
            <div className="flex items-center mr-7"></div>
          </div>
        </div>
        {render}
      </div>
    </div>
  );
}
