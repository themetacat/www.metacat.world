import React from 'react';
import { Chart } from '@antv/g2';
import cn from 'classnames';

import Status from '../../status';
import { formatNum } from '../../../common/utils';
import AnalyticsCard from '../analytics-card';
import SimpleSwicth from '../simple-switch';
import ChartSelecter from '../chart-select';

import style from './index.module.css';

type Props = {
  id?: string;
  dataHandlder?: () => any;
  defaultColor?: Array<number>;
  defaultColor2?: Array<number>;
  gradient?: boolean;
  className?: string;
  labelText?: string;
  limit?: number;
  barWidth?: number;
  textColor?;
  limitHeight?: number;
  onSwicth?: (x) => void;
};
const switchs = [
  {
    label: 'Voxels',
    value: 'cv',
  },
  {
    label: 'Decentraland',
    value: 'dcl',
  },
];

export default function BaseBar({
  id,
  dataHandlder,
  defaultColor = [194, 157, 135],
  defaultColor2 = [255, 107, 84],
  gradient = true,
  className,
  labelText,
  limit,
  barWidth = 35,
  textColor,
  limitHeight = 230,
  onSwicth,
}: Props) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const chart = React.useRef(null);
  const [staticType, setStaticType] = React.useState(switchs[0].value || 'cv');
  const [orgData, setOrginData] = React.useState(null);
  const barColor = React.useRef(defaultColor);

  const initChart = React.useCallback(
    (monthly) => {
      const dom = document.getElementById(id);
      if (!dom) {
        return;
      }
      chart.current = new Chart({
        container: id,
        autoFit: true,
        height: 210,
      });
      if (limit && monthly?.length > limit) {
        const l = monthly.length;
        const d = l - limit;
        const x = monthly.slice(d);
        const cvArr = x.cv.map((n) => {
          return {
            ...n,
            type: 'cv',
          };
        });
        const dclArr = x.dcl.map((n) => {
          return {
            ...n,
            type: 'dcl',
          };
        });
        chart.current.data({ cv: cvArr, dcl: dclArr });
      } else {
        chart.current.data(monthly);
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
            borderRadius: '8px',
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
          formatter: (text, item, index) => {
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
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
          mask: 'YYYY.MM.DD',
        },
      });

      chart.current
        .interval()
        .size(barWidth)
        .position('time*value')
        .color('value')
        .style({
          fields: ['type'],
          callback: (tVal) => {
            const c = tVal === 'cv' ? defaultColor : defaultColor2;
            return {
              fill: gradient
                ? `l(270) 0:rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.2) 1:rgba(${c[0]}, ${c[1]}, ${c[2]}, 1)`
                : `rgba(${c[0]}, ${c[1]}, ${c[2]}, 1)`,
            };
          },
        })
        .tooltip('time*value*type', (time, value, type) => {
          return {
            value: value * 1,
            time,
            type,
          };
        });

      chart.current.render();
    },
    [limit],
  );

  const requestData = React.useCallback(async () => {
    setLoading(true);
    let result = null;
    try {
      const res = await dataHandlder();
      const { data } = res;
      const n = data.cv.map((x) => {
        return {
          ...x,
          type: 'cv',
        };
      });
      const m = data.dcl.map((x) => {
        return {
          ...x,
          type: 'dcl',
        };
      });
      const a = {
        cv: n,
        dcl: m,
      };
      setOrginData(a);
      result = a.cv;
    } catch (ex) {
      setError(true);
    }
    setLoading(false);
    if (result) {
      initChart(result);
    }
    return result;
  }, [dataHandlder]);

  const onRetry = React.useCallback(() => {
    requestData();
  }, [requestData]);

  const changeType = React.useCallback(
    (item) => {
      setStaticType(item.value);
      // barColor.current = item.value === 'cv'? [194, 157, 135]:[255, 107, 84];
      chart.current.changeData(orgData[item.value]);
    },
    [orgData],
  );

  const render = React.useMemo(() => {
    if (loading) {
      return (
        <div className={'w-full h-full flex justify-center items-center'}>
          <Status mini={true} status="loading" />;
        </div>
      );
    }

    if (error) {
      return <Status mini={true} retry={onRetry} status="error" />;
    }

    return <div id={id} className="w-full" style={{ height: limitHeight }}></div>;
  }, [loading, error, onRetry]);

  const getSelect = React.useMemo(() => {
    // if (showData.length !== 0) {
    return (
      <div className={cn('flex items-center rounded text-white text-opacity-30', style.border)}>
        <ChartSelecter
          options={[
            {
              label: 'Week',
              value: 'week',
            },
          ]}
          showArrow={false}
          // className={style.selecterLong}
          defaultLabel={'week'}
          hasBorder={true}
        ></ChartSelecter>
      </div>
    );
    // }
    // return null;
  }, []);

  React.useEffect(() => {
    requestData();
    return () => {
      if (chart.current) {
        chart.current.destroy();
      }
    };
  }, [requestData]);

  return (
    <AnalyticsCard
      title={labelText}
      link={`http://www.metacat.world/analytics?type=${
        staticType === 'cv' ? 'cryptovoxels' : 'decentraland'
      }`}
      baseSize={false}
      backCls="cover4"
    >
      <>
        <div className=" relative flex justify-center items-center mt-5">
          <SimpleSwicth options={switchs} onActive={changeType}></SimpleSwicth>
          <div className="flex items-center absolute right-0 mr-4">{getSelect}</div>
        </div>
        <div className={cn('w-full p-5', style.content)}>{render}</div>
      </>
    </AnalyticsCard>
  );
}
