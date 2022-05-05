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
  tabState?: string;
  textColor?;
};

export default function ChartLine({
  id,
  dataHandlder,
  legend1 = { label: 'Primary', color: [194, 157, 135] },
  legend2 = { label: 'Secondary', color: [130, 137, 195] },
  labelText,
  limit,
  options,
  priceOptions,
  className,
  keyTypes = ['primary', 'secondary'],
  tabState,
  textColor,
}: Props) {
  const [staticType, setStaticType] = React.useState(options[0].value);
  const [priceStaticType, setPriceStaticType] = React.useState(priceOptions[0].value);
  const [dataSource, setDataSource] = React.useState(null);
  const chart = React.useRef(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const visible1 = React.useRef();
  const visible2 = React.useRef();
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
        range: [0.01, 0.99],
        type: 'cat',
        mask: 'YYYY.MM.DD',
      });

      chart.current.scale('valueAvg', {
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
              <span style="color:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${
            legend1.color[2]
          }, 1); font-size: 20px; font-weight:700;">
              ${formatNum(result[keyTypes[0]]?.valueAvg)}
              <span style="font-size: 12px;color:#fff;font-weight:400;">${result[
                keyTypes[0]
              ].priceStaticT.toLocaleUpperCase()} Avg</span>
              </span>
            </div>
            <div style="color:#fff;margin-bottom:12px">
              <span style="color:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${
            legend2.color[2]
          }, 1); font-size: 20px; font-weight:700;">
              ${formatNum(result[keyTypes[1]]?.valueAvg)}
              <span style="font-size: 12px;color:#fff;font-weight:400;">${result[
                keyTypes[1]
              ].priceStaticT.toLocaleUpperCase()} Avg</span>
              </span>
            </div>`;
          const priceDetail = `
          <div style="color:#fff;margin-bottom:12px">
            <span style="color:#999999;">
            Lowest:
              <span style="color:#fff;">
                <span style="margin:0px 5px; color:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${
            legend1.color[2]
          }, 1);">${formatNum(result[keyTypes[0]]?.valueMin)}</span>
                /
                <span style="margin:0px 5px; color:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${
            legend2.color[2]
          }, 1);">${formatNum(result[keyTypes[1]]?.valueMin)}</span>
                <span>${result[keyTypes[1]].priceStaticT.toLocaleUpperCase()}</span>
              </span>
            </span>
          </div>
          <div style="color:#fff;margin-bottom:12px">
            <span style="color:#999999;">
            Highest:
              <span style="color:#fff;">
                <span style="margin:0px 5px; color:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${
            legend1.color[2]
          }, 1);">${formatNum(result[keyTypes[0]]?.valueMax)}</span>
                /
                <span style="margin:0px 5px; color:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${
            legend2.color[2]
          }, 1);">${formatNum(result[keyTypes[1]]?.valueMax)}</span>
                <span>${result[keyTypes[1]].priceStaticT.toLocaleUpperCase()}</span>
              </span>
            </span>
          </div>
          `;
          container.innerHTML = title + staticItem + priceDetail;
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
      chart.current.axis('valueAvg', {
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
        .position('time*valueAvg')
        .color('type')
        .style({
          fields: ['type'],
          callback: (tVal) => {
            if (tVal === keyTypes[0]) {
              return {
                fill: `l(270) 0:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 0.2) 1:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 1)`,
              };
            }
            return {
              fill: `l(270) 0:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 0.2) 1:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 1)`,
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
          `rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 1)`,
          `rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 1)`,
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

  const updateData = React.useCallback(
    (staticT, priceStaticT) => {
      if (chart.current && dataSource) {
        chart.current.changeData(
          transfromData(dataSource[staticT].data[priceStaticT], staticT, priceStaticT),
        );
      }
    },
    [dataSource, staticType, priceStaticType, limit],
  );
  const init = React.useCallback(() => {
    setStaticType(options[0].value);
    setPriceStaticType(priceOptions[0].value);
    updateData(options[0].value, priceOptions[0].value);
  }, [tabState]);
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
      <div
        className={cn('flex items-center', style.border)}
        style={{ color: 'rgba(255,255,255, 0.3)' }}
      >
        <ChartSelecter
          options={options}
          showArrow={true}
          onClick={changeStatic}
          className={style.selecterLong}
          defaultLabel={options[0].value}
          hasBorder={false}
          useRef={visible1}
          trigger={(show) => {
            if (visible2.current) {
              (visible2.current as any).forceToClose();
            }
          }}
        ></ChartSelecter>
        丨
        <ChartSelecter
          options={priceOptions}
          showArrow={true}
          onClick={changePriceStatic}
          defaultLabel={priceOptions[0].value}
          hasBorder={false}
          useRef={visible2}
          trigger={(show) => {
            if (visible1.current) {
              (visible1.current as any).forceToClose();
            }
          }}
        ></ChartSelecter>
      </div>
    );
  }, [options, visible1, visible2, changeStatic]);

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
          <ChartTitle text={labelText} color={textColor}></ChartTitle>
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
