import React from 'react';
import { Chart } from '@antv/g2';

import BaseChart from '../base-chart';
import Status from '../status';

import style from './index.module.css';

type Props = {
  id?: string;
  dataHandlder?: () => void;
  defaultColor?: Array<number>;
  gradient?: boolean;
  className?: string;
  labelText?: string;
  limit?: number;
};

const dd = [
  {
    time: '2019.09',
    value: 152,
    type: 'primary',
  },
  {
    time: '2019.10',
    value: 153,
    type: 'primary',
  },
  {
    time: '2019.11',
    value: 166,
    type: 'primary',
  },
  {
    time: '2019.12',
    value: 188,
    type: 'primary',
  },
  {
    time: '2020.01',
    value: 381,
    type: 'primary',
  },
  {
    time: '2020.02',
    value: 262,
    type: 'primary',
  },
  {
    time: '2020.03',
    value: 243,
    type: 'primary',
  },
  {
    time: '2020.04',
    value: 125,
    type: 'primary',
  },
  {
    time: '2020.05',
    value: 180,
    type: 'primary',
  },
  {
    time: '2020.06',
    value: 233,
    type: 'primary',
  },
  {
    time: '2020.07',
    value: 159,
    type: 'primary',
  },
  {
    time: '2020.08',
    value: 62,
    type: 'primary',
  },
  {
    time: '2020.09',
    value: 184,
    type: 'primary',
  },
  {
    time: '2020.10',
    value: 153,
    type: 'primary',
  },
  {
    time: '2020.11',
    value: 159,
    type: 'primary',
  },
  {
    time: '2020.12',
    value: 40,
    type: 'primary',
  },
  {
    time: '2021.01',
    value: 42,
    type: 'primary',
  },
  {
    time: '2021.02',
    value: 87,
    type: 'primary',
  },
  {
    time: '2021.03',
    value: 158,
    type: 'primary',
  },
  {
    time: '2021.04',
    value: 190,
    type: 'primary',
  },
  {
    time: '2021.05',
    value: 164,
    type: 'primary',
  },
  {
    time: '2021.06',
    value: 103,
    type: 'primary',
  },
  {
    time: '2021.07',
    value: 244,
    type: 'primary',
  },
  {
    time: '2021.08',
    value: 217,
    type: 'primary',
  },
  {
    time: '2021.09',
    value: 215,
    type: 'primary',
  },
  {
    time: '2021.10',
    value: 177,
    type: 'primary',
  },
  {
    time: '2021.11',
    value: 360,
    type: 'primary',
  },
  {
    time: '2021.12',
    value: 217,
    type: 'primary',
  },
  {
    time: '2022.01',
    value: 165,
    type: 'primary',
  },
  {
    time: '2022.02',
    value: 201,
    type: 'primary',
  },
  {
    time: '2019.09',
    value: 27,
    type: 'secondary',
  },
  {
    time: '2019.10',
    value: 21,
    type: 'secondary',
  },
  {
    time: '2019.11',
    value: 31,
    type: 'secondary',
  },
  {
    time: '2019.12',
    value: 97,
    type: 'secondary',
  },
  {
    time: '2020.01',
    value: 133,
    type: 'secondary',
  },
  {
    time: '2020.02',
    value: 140,
    type: 'secondary',
  },
  {
    time: '2020.03',
    value: 180,
    type: 'secondary',
  },
  {
    time: '2020.04',
    value: 114,
    type: 'secondary',
  },
  {
    time: '2020.05',
    value: 109,
    type: 'secondary',
  },
  {
    time: '2020.06',
    value: 158,
    type: 'secondary',
  },
  {
    time: '2020.07',
    value: 81,
    type: 'secondary',
  },
  {
    time: '2020.08',
    value: 66,
    type: 'secondary',
  },
  {
    time: '2020.09',
    value: 77,
    type: 'secondary',
  },
  {
    time: '2020.10',
    value: 172,
    type: 'secondary',
  },
  {
    time: '2020.11',
    value: 59,
    type: 'secondary',
  },
  {
    time: '2020.12',
    value: 43,
    type: 'secondary',
  },
  {
    time: '2021.01',
    value: 46,
    type: 'secondary',
  },
  {
    time: '2021.02',
    value: 97,
    type: 'secondary',
  },
  {
    time: '2021.03',
    value: 174,
    type: 'secondary',
  },
  {
    time: '2021.04',
    value: 147,
    type: 'secondary',
  },
  {
    time: '2021.05',
    value: 106,
    type: 'secondary',
  },
  {
    time: '2021.06',
    value: 99,
    type: 'secondary',
  },
  {
    time: '2021.07',
    value: 153,
    type: 'secondary',
  },
  {
    time: '2021.08',
    value: 225,
    type: 'secondary',
  },
  {
    time: '2021.09',
    value: 148,
    type: 'secondary',
  },
  {
    time: '2021.10',
    value: 133,
    type: 'secondary',
  },
  {
    time: '2021.11',
    value: 261,
    type: 'secondary',
  },
  {
    time: '2021.12',
    value: 230,
    type: 'secondary',
  },
  {
    time: '2022.01',
    value: 157,
    type: 'secondary',
  },
  {
    time: '2022.02',
    value: 94,
    type: 'secondary',
  },
];

export default function ChartLine({
  id,
  dataHandlder,
  defaultColor = [0, 0, 255],
  gradient = false,
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
