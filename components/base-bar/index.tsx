import React from 'react';
import { Chart } from '@antv/g2';

import BaseChart from '../base-chart';
import Status from '../status';

type Props = {
  id?: string;
  dataHandlder?: () => void;
  defaultColor?: Array<number>;
  gradient?: boolean;
  className?: string;
  labelText?: string;
  limit?: number;
};

export default function BaseBar({
  id,
  dataHandlder,
  defaultColor = [34, 118, 252],
  gradient = true,
  className,
  labelText,
  limit,
}: Props) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const initChart = React.useCallback(
    (monthly) => {
      const chart = new Chart({
        container: id,
        autoFit: true,
        height: 210,
      });
      if (limit && monthly.data?.length > limit) {
        const l = monthly.data.length;
        const d = l - limit;
        chart.data(monthly.data.slice(d));
      } else {
        chart.data(monthly.data);
      }
      chart.scale('value', {
        nice: true,
      });
      chart.tooltip({
        showMarkers: false,
        customContent: (name, items) => {
          const container = document.createElement('div');
          container.className = 'g2-tooltip';
          const title = `<div class="g2-tooltip-title" style="margin-top: 12px;margin-bottom: 12px;' ">Date: <span style="color:#fff; margin-left:5px">${name}</span></div>`;
          let sum = 0;
          items.forEach((item) => {
            sum += item.value;
          });
          const staticItem = `<div style="color:#fff;margin-bottom:12px"><span style="color:#fff; font-size: 20px; font-weight:700;">${sum}</span></div>`;
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

      chart.legend(false);

      // 设置横纵轴
      chart.axis('value', {
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
      chart.axis('time', {
        tickLine: null,
      });

      chart
        .interval()
        .position('time*value')
        .color('value')
        .style({
          fill: gradient
            ? `l(270) 0:rgba(${defaultColor[0]}, ${defaultColor[1]}, ${defaultColor[2]}, 0.2) 1:rgba(${defaultColor[0]}, ${defaultColor[1]}, ${defaultColor[2]}, 1)`
            : `rgba(${defaultColor[0]}, ${defaultColor[1]}, ${defaultColor[2]}, 1)`,
        })
        .tooltip('time*value*type', (time, value) => {
          return {
            value: value * 1,
            time,
          };
        });

      chart.render();
    },
    [limit],
  );

  const requestData = React.useCallback(async () => {
    setLoading(true);
    let result = null;
    try {
      const res = await dataHandlder();
      const { monthly } = res.data;
      result = monthly;
    } catch (ex) {
      setError(true);
    }
    setLoading(false);
    if (result) {
      initChart(result);
    }
    return result;
  }, [limit]);

  const onRetry = React.useCallback(() => {
    requestData();
  }, [limit]);

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
    requestData();
  }, [null]);

  return (
    <BaseChart labelText={labelText} className={className}>
      {render}
    </BaseChart>
  );
}
