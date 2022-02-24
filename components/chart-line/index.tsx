import React from 'react';
import { Chart } from '@antv/g2';
import cn from 'classnames';

import ChartTitle from '../chart-title';
import Status from '../status';
import IconLabel from '../icon-label';
import ChartSelecter from '../chart-select';

import style from './index.module.css';
import { convert } from '../../common/utils';

type optionItem = {
  label?: string;
  value?: string;
};

type Props = {
  id?: string;
  dataHandlder?: () => any;
  color1?: Array<number>;
  color2?: Array<number>;
  className?: string;
  labelText?: string;
  limit?: number;
  options?: Array<optionItem>;
  priceOptions?: Array<optionItem>;
};

export default function ChartLine({
  id,
  dataHandlder,
  color1 = [95, 213, 236],
  color2 = [255, 207, 95],
  labelText,
  limit,
  options,
  priceOptions,
  className,
}: Props) {
  const [staticType, setStaticType] = React.useState(options[0].value);
  const [priceStaticType, setPriceStaticType] = React.useState(priceOptions[0].value);
  const [dataSource, setDataSource] = React.useState(null);
  const chart = React.useRef(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const transfromData = React.useCallback(
    (data, type, priceType) => {
      const result = [];
      if (limit) {
        const l = data.length;
        const d = l - limit * 2;
        const last = data.slice(d);
        last.forEach((element) => {
          result.push({
            ...element,
            staticT: type,
            priceStaticT: priceType,
          });
        });
        return result;
      }
      data.forEach((element) => {
        result.push({
          ...element,
          staticT: type,
          priceStaticT: priceType,
        });
      });
      return result;
    },
    [limit],
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

      chart.current.data(
        transfromData(data[staticType].data[priceStaticType], staticType, priceStaticType),
      );
      chart.current.scale('time', {
        range: [0, 1],
      });

      chart.current.scale('valueAvg', {
        nice: true,
      });
      chart.current.tooltip({
        // showMarkers: false,
        showCrosshairs: true,
        shared: true,
        customContent: (name, items) => {
          const container = document.createElement('div');
          container.className = 'g2-tooltip';
          const title = `<div class="g2-tooltip-title" style="margin-top: 12px;margin-bottom: 12px;' ">Date: <span style="color:#fff; margin-left:5px">${name}</span></div>`;
          const result = {
            primary: null,
            secondary: null,
          };
          if (items.length <= 0) {
            return;
          }
          items.forEach((item) => {
            result[item.type] = item;
          });
          const staticItem = `
            <div style="color:#fff;margin-bottom:12px">
              <span style="color:rgba(${color1[0]}, ${color1[1]}, ${
            color1[2]
          }, 1); font-size: 20px; font-weight:700;">
              ${result.primary?.valueAvg}
              <span style="font-size: 12px;color:#fff;font-weight:400;">${result.primary.priceStaticT.toLocaleUpperCase()} Avg</span>
              </span>
            </div>
            <div style="color:#fff;margin-bottom:12px">
              <span style="color:rgba(${color2[0]}, ${color2[1]}, ${
            color2[2]
          }, 1); font-size: 20px; font-weight:700;">
              ${result.secondary?.valueAvg}
              <span style="font-size: 12px;color:#fff;font-weight:400;">${result.secondary.priceStaticT.toLocaleUpperCase()} Avg</span>
              </span>
            </div>`;
          const priceDetail = `
          <div style="color:#fff;margin-bottom:12px">
            <span style="color:#999999;">
            Lowest:
              <span style="color:#fff;">
                <span style="margin:0px 5px; color:rgba(${color1[0]}, ${color1[1]}, ${
            color1[2]
          }, 1);">${result.primary?.valueMin}</span>
                /
                <span style="margin:0px 5px; color:rgba(${color2[0]}, ${color2[1]}, ${
            color2[2]
          }, 1);">${result.secondary?.valueMin}</span>
                <span>${result.secondary.priceStaticT.toLocaleUpperCase()}</span>
              </span>
            </span>
          </div>
          <div style="color:#fff;margin-bottom:12px">
            <span style="color:#999999;">
            Highest:
              <span style="color:#fff;">
                <span style="margin:0px 5px; color:rgba(${color1[0]}, ${color1[1]}, ${
            color1[2]
          }, 1);">${result.primary?.valueMax}</span>
                /
                <span style="margin:0px 5px; color:rgba(${color2[0]}, ${color2[1]}, ${
            color2[2]
          }, 1);">${result.secondary?.valueMax}</span>
                <span>${result.secondary.priceStaticT.toLocaleUpperCase()}</span>
              </span>
            </span>
          </div>
          `;
          container.innerHTML = title + staticItem + priceDetail;
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
      chart.current.axis('valueAvg', {
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

      chart.current
        .area()
        .position('time*valueAvg')
        .color('type')
        .style({
          fields: ['type'],
          callback: (tVal) => {
            if (tVal === 'primary') {
              return {
                fill: `l(270) 0:rgba(${color1[0]}, ${color1[1]}, ${color1[2]}, 0.2) 1:rgba(${color1[0]}, ${color1[1]}, ${color1[2]}, 1)`,
              };
            }
            return {
              fill: `l(270) 0:rgba(${color2[0]}, ${color2[1]}, ${color2[2]}, 0.2) 0:rgba(${color2[0]}, ${color2[1]}, ${color2[2]}, 1)`,
            };
          },
        })
        .tooltip(
          'time*valueAvg*type*valueMax*valueMin*staticT*priceStaticT',
          (time, valueAvg, type, valueMax, valueMin, staticT, priceStaticT) => {
            return {
              valueAvg,
              time,
              type,
              valueMax,
              valueMin,
              staticT,
              priceStaticT,
            };
          },
        );

      chart.current
        .line()
        .position('time*valueAvg')
        .size(2)
        .tooltip(false)
        .color('type', [
          `rgba(${color1[0]}, ${color1[1]}, ${color1[2]}, 1)`,
          `rgba(${color2[0]}, ${color2[1]}, ${color2[2]}, 1)`,
        ]);
      chart.current.render();
    },
    [staticType, priceStaticType, limit],
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
  }, [staticType, priceStaticType, limit]);

  const onRetry = React.useCallback(() => {
    requestData();
  }, [null]);

  const render = React.useMemo(() => {
    if (loading) {
      return <Status mini={true} status="loading" />;
    }

    if (error) {
      return <Status mini={true} retry={onRetry} status="error" />;
    }

    return <div id={id}></div>;
  }, [loading, error, onRetry]);

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

  const updateData = React.useCallback(
    (staticT, priceStaticT) => {
      if (chart.current && dataSource) {
        // if (limit && dataSource[staticT].data[priceStaticT]?.length > limit) {
        //   const l = dataSource[staticT].data[priceStaticT].length;
        //   const d = l - limit * 2;
        //   const data = dataSource[staticT].data[priceStaticT].slice(d);
        //   data.forEach((element) => {
        //     element.staticType = staticType;
        //     element.priceStaticType = priceStaticType;
        //   });
        //   chart.current.changeData(data);
        // } else {
        //   dataSource[staticT].data[priceStaticT].forEach((element) => {
        //     element.staticType = staticType;
        //     element.priceStaticType = priceStaticType;
        //   });
        //   chart.current.changeData(dataSource[staticT].data[priceStaticT]);
        // }
        chart.current.changeData(
          transfromData(dataSource[staticT].data[priceStaticT], staticT, priceStaticT),
        );
      }
    },
    [dataSource, staticType, priceStaticType, limit],
  );

  const changeStatic = React.useCallback(
    (val) => {
      setStaticType(val);
      if (chart.current && dataSource) {
        updateData(val, priceStaticType);
      }
    },
    [dataSource, limit, priceStaticType, updateData],
  );

  const changePriceStatic = React.useCallback(
    (val) => {
      setPriceStaticType(val);
      if (chart.current && dataSource) {
        updateData(staticType, val);
      }
    },
    [dataSource, staticType, limit, updateData],
  );

  const getSelect = React.useMemo(() => {
    return (
      <div className={cn('flex items-center', style.border)}>
        <ChartSelecter
          options={options}
          showArrow={true}
          onClick={changeStatic}
          defaultLabel={options[0].value}
          hasBorder={false}
        ></ChartSelecter>
        <span style={{ color: 'rgba(255,255,255, 0.3)' }}>|</span>
        <ChartSelecter
          options={priceOptions}
          showArrow={true}
          onClick={changePriceStatic}
          defaultLabel={priceOptions[0].value}
          hasBorder={false}
        ></ChartSelecter>
      </div>
    );
  }, [options, changeStatic]);

  React.useEffect(() => {
    requestData();
    return () => {
      if (chart.current) {
        chart.current.destroy();
      }
    };
  }, [null]);

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
