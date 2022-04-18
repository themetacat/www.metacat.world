import React from 'react';
import { Chart } from '@antv/g2';
import cn from 'classnames';

import ChartTitle from '../chart-title';
import Status from '../status';
import IconLabel from '../icon-label';
import ChartSelecter from '../chart-select';

import style from './index.module.css';
import { convert, formatNum } from '../../common/utils';

type optionItem = {
  label?: string;
  value?: string;
};

type legend = {
  label?: string;
  color?: Array<number>;
};

type Props = {
  id?: string;
  dataHandlder?: () => any;
  legend1?: legend;
  legend2?: legend;
  className?: string;
  labelText?: string;
  limit?: number;
  options?: Array<optionItem>;
  priceOptions?: Array<optionItem>;
  keyTypes?: Array<string>;
  simpleTooltip?: boolean;
  tabState?: string;
};

export default function ChartLineToolTipSimple({
  id,
  dataHandlder,
  legend1 = { label: 'Primary', color: [95, 213, 236] },
  legend2 = { label: 'Secondary', color: [255, 207, 95] },
  labelText,
  limit,
  options,
  priceOptions,
  className,
  keyTypes = ['primary', 'secondary'],
  tabState,
}: Props) {
  const [staticType, setStaticType] = React.useState(options[0].value);
  const [dataSource, setDataSource] = React.useState(null);
  const [tab_state, set_tab_state] = React.useState(tabState);
  const chart = React.useRef(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const transfromData = React.useCallback(
    (data, type) => {
      const result = [];
      if (limit) {
        const l = data.length;
        const d = l - limit;
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
    [limit],
  );

  const simpleToolTip = (name, items) => {
    const container = document.createElement('div');
    container.className = 'g2-tooltip';
    const title = `<div class="g2-tooltip-title" style="margin-top: 12px;margin-bottom: 12px;' ">Date: <span style="color:#fff; margin-left:5px">${name}</span></div>`;
    const result = {};
    if (items.length <= 0) {
      return;
    }
    items.forEach((item) => {
      result[item.type] = item.value;
    });

    const staticItem = `
    <div style="color:#fff;margin-bottom:12px">
      <span style="font-size: 12px;color:#999999;font-weight:400;">Land:</span>
      <span style="margin:0px 5px; color:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${
      legend1.color[2]
    }, 1); font-size: 18px; font-weight:700;">
        ${formatNum(result[keyTypes[0]])}
        </span>
    </div>
    `;
    container.innerHTML = title + staticItem;
    return container;
  };

  const initChart = React.useCallback(
    (data, t1, t2) => {
      const dom = document.getElementById(id);
      if (!dom) {
        return;
      }
      chart.current = new Chart({
        container: id,
        autoFit: true,
        height: 210,
      });
      if (data) {
        if (t1 !== t2) {
          chart.current.data(transfromData(data[options[0].value].data, options[0].value));
        } else {
          chart.current.data(transfromData(data[staticType].data, staticType));
        }
      }
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
        customContent: simpleToolTip,
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
          // offset: 25,
          offsetX: 25,
          offsetY: 0,
          rotate: 1,
        },
      });

      chart.current
        .area()
        .position('time*value')
        .color('type')
        .style({
          fields: ['type'],
          callback: (tVal) => {
            if (tVal === keyTypes[0]) {
              return {
                fill: `l(270) 0:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 0.2) 1:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 1)`,
              };
            }
          },
        })
        .tooltip('time*value*type*staticT', (time, value, type, staticT) => {
          return {
            value,
            time,
            type,
            staticT,
          };
        });

      chart.current
        .line()
        .position('time*value')
        .size(2)
        .tooltip(false)
        .color('type', [`rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 1)`]);
      chart.current.render();
    },
    [staticType, limit],
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
      initChart(result, tabState, tab_state);
    }
    return result;
  }, [dataHandlder]);

  const onRetry = React.useCallback(() => {
    requestData();
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

  const updateData = React.useCallback(
    (staticT) => {
      if (chart.current && dataSource) {
        chart.current.changeData(transfromData(dataSource[staticT].data, staticT));
      }
    },
    [dataSource, staticType, limit],
  );

  const changeStatic = React.useCallback(
    (val) => {
      setStaticType(val);
      if (chart.current && dataSource) {
        updateData(val);
      }
    },
    [dataSource, limit, updateData],
  );

  const init = React.useCallback(() => {
    changeStatic(options[0].value);
    setStaticType(options[0].value);
    set_tab_state(tabState);
    initChart(dataSource, tabState, tab_state);
  }, [tabState]);

  const getSelect = React.useMemo(() => {
    return (
      <ChartSelecter
        options={options}
        showArrow={true}
        onClick={changeStatic}
        className={style.selecterLong}
        defaultLabel={options[0].value}
      ></ChartSelecter>
    );
  }, [options, changeStatic]);

  React.useEffect(() => {
    requestData();
    init();
    return () => {
      if (chart.current) {
        chart.current.destroy();
      }
    };
  }, [requestData, init]);

  return (
    <div className={cn('w-full p-5', style.content, className)}>
      <div>
        <div className={cn('w-full flex justify-between item-center', style.header)}>
          <ChartTitle text={labelText}></ChartTitle>
          <div className="flex items-center">{getSelect}</div>
        </div>
        {render}
      </div>
    </div>
  );
}
