import React from 'react';
import { Chart } from '@antv/g2';
import cn from 'classnames';

import ChartTitle from '../chart-title';
import Status from '../status';
import IconLabel from '../icon-label';
import ChartSelecter from '../chart-select';

import style from './index.module.css';
import { convert, formatNum } from '../../common/utils';

type Props = {
  id?: string;
  labelText?: string;
  dataHandlder?;
  legend1?;
  legend2?;
  limit?;
  textColor?;
};

const keyTypes = ['ETH', 'MREI'];

export default function MiniLine({ id, labelText, dataHandlder, legend1, legend2, limit,textColor }: Props) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [dataSource, setDataSource] = React.useState(null);
  const chart = React.useRef(null);

  const initChart = React.useCallback(
    (data) => {
      const d1 = data[keyTypes[0]].map((item) => ({ ...item, name: 'ETH' }));
      const d2 = data.MetaIndex.map((item) => ({ ...item, name: 'MREI' }));
      const dom = document.getElementById(id);
      if (!dom) {
        return;
      }
      chart.current = new Chart({
        container: id,
        autoFit: true,
        height: 330,
      });
      chart.current.data([...d1, ...d2].reverse());
      chart.current.scale('time', {
        range: [0.01, 0.99],
        type: 'cat',
        mask: 'YYYY.MM.DD',
      });

      chart.current.scale('value', {
        nice: true,
      });
      chart.current.tooltip({
        // showMarkers: false,
        showCrosshairs: true,
        shared: true,
        crosshairs: {
          line: {
            style: {
              lineWidth: 0.5,
            },
          },
        },
        customContent: (name, items) => {
          const container = document.createElement('div');
          container.className = 'g2-tooltip';
          const title = `<div class="g2-tooltip-title" style="margin-top: 12px;margin-bottom: 12px;' ">Date: <span style="color:#fff; margin-left:5px">${name}</span></div>`;
          const result = {
            ETH: null,
            MREI: null,
          };
          if (items.length <= 0) {
            return;
          }
          items.forEach((item, index) => {
            result[keyTypes[index]] = item;
          });

          const staticItem = `
            <div style="color:#fff;margin-bottom:12px">
              <span style="color:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${
            legend1.color[2]
          }, 1); font-size: 20px; font-weight:700;">
              ${formatNum(result[keyTypes[0]]?.value)}
              <span style="font-size: 12px;color:#fff;font-weight:400;">USD</span>
              </span>
            </div>
            <div style="color:#fff;margin-bottom:12px">
              <span style="color:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${
            legend2.color[2]
          }, 1); font-size: 20px; font-weight:700;">
              ${formatNum(result[keyTypes[1]]?.value)}
              <span style="font-size: 12px;color:#fff;font-weight:400;">USD</span>
              </span>
            </div>`;

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
              return {
                lineDash: [5, 5],
                lineWidth: 1,
                stroke: 'rgba(255, 255, 255, 0.15)',
              };
            },
          },
        },
        label: {
          formatter: (text, item, index) => {
            return formatNum(parseFloat(text));
          },
        },
      });
      chart.current.axis('time', {
        grid: {
          line: {
            type: 'line',
            style: (x, y) => {
              return {
                lineDash: [5, 5],
                lineWidth: 1,
                stroke: 'rgba(255, 255, 255, 0.15)',
              };
            },
          },
        },
        label: {
          style: { fill: 'rgba(255,255, 255, 0.85)' },
          // offset: 25,
          offsetX: 25,
          offsetY: 0,
          rotate: 1,
        },
      });

      chart.current
        .area()
        .shape('smooth')
        .position('time*value')
        .color('name')
        .style({
          fields: ['name'],
          callback: (tVal) => {
            if (tVal === keyTypes[0]) {
              return {
                fill: `l(270) 0:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 0.2) 1:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 1)`,
              };
            }
            return {
              fill: `l(270) 0:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 0.2) 1:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 1)`,
            };
          },
        })
        .tooltip('time*value', (time, value, name) => {
          return {
            value,
            time,
            name,
          };
        });

      chart.current
        .line()
        .shape('smooth')
        .position('time*value')
        .size(2)
        .tooltip(false)
        .color('name', (tVal) => {
          if (tVal === 'ETH') {
            return `rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 1)`;
          }
          if (tVal === 'MREI') {
            return `rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 1)`;
          }
        });
      chart.current.render();
    },
    [limit],
  );

  const requestData = React.useCallback(async () => {
    setLoading(true);
    let result = null;
    try {
      if (!result) {
        const res = await dataHandlder();
        result = convert(res.data);
        setDataSource(result);
      }
    } catch (ex) {
      setError(true);
    }
    setLoading(false);
    if (result) {
      initChart(result);
    }
    return result;
  }, [dataHandlder]);

  const getLenged = React.useMemo(() => {
    return (
      <>
        <IconLabel
          text={legend1.label}
          color={`rgb(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]})`}
          className="mr-5"
        ></IconLabel>
        <IconLabel
          text={legend2.label}
          color={`rgb(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]})`}
        ></IconLabel>
      </>
    );
  }, [legend1, legend2]);

  const onRetry = React.useCallback(() => {
    requestData();
  }, [requestData]);

  const render = React.useMemo(() => {
    if (loading) {
      return (
        <div className={style.mt}>
          <Status mini={true} status="loading" />;
        </div>
      );
    }

    if (error) {
      return <Status mini={true} retry={onRetry} status="error" />;
    }

    return <div id={id}></div>;
  }, [loading, error, onRetry]);

  React.useEffect(() => {
    requestData();
    // init();
    // return () => {
    //   if (chart.current) {
    //     chart.current.destroy();
    //   }
    // }
  }, [requestData]);
  return (
    <div className={style.container}>
      <div className={cn('w-full flex justify-between item-center', style.header)}>
        <ChartTitle text={labelText}  color={textColor}></ChartTitle>
        <div className="flex items-center">{getLenged}</div>
      </div>
      {render}
    </div>
  );
}
