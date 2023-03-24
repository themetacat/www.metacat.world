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

type legend = {
  label?: string;
  color?: Array<number>;
};

type Props = {
  id?: string;
  dataHandler?: () => any;
  legend1?: legend;
  legend2?: legend;
  gradient?: boolean;
  className?: string;
  options?: Array<optionItem>;
  isEth?: boolean;
  labelText?: string;
  showMarkerType?: string;
  limit?: number;
  barWidth?: number;
  keyTypes?: Array<string>;
  token?: string;
  tabState?: string;
  optionsPrice?: Array<optionItem>;
  textColor?;
  iconImgLight?;
};

export default function StackBar({
  id,
  dataHandler,
  legend1 = { label: 'Primary', color: [95, 213, 236] },
  legend2 = { label: 'Secondary', color: [255, 207, 95] },
  gradient = true,
  className,
  options,
  isEth = false,
  iconImgLight,
  labelText,
  showMarkerType,
  limit,
  barWidth = 25,
  keyTypes = ['primary', 'secondary'],
  token,
  tabState,
  optionsPrice,
  textColor,
}: Props) {
  const [staticType, setStaticType] = React.useState(options[0].value);
  const [priceType, setPriceType] = React.useState(optionsPrice[0].value);
  const [tab_state, set_tab_state] = React.useState(tabState);
  const [dataSource, setDataSource] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const chart = React.useRef(null);

  const transfromData = React.useCallback(
    (data, type, priceT) => {
      const result = [];
      if (limit) {
        const l = data.length;
        const d = l - limit * 2;
        let last = [];
        if (type === 'quarterly') {
          last = data.slice(d);
        } else {
          last = data.slice(limit);
        }
        last.forEach((element) => {
          result.push({
            ...element,
            staticT: type,
            priceStaticT: priceT,
          });
        });
        return result;
      }

      data.forEach((element) => {
        result.push({
          ...element,
          staticT: type,
          priceStaticT: priceT,
        });
      });
      return result;
    },
    [limit],
  );

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
          chart.current.data(
            transfromData(
              data[options[0].value].data[optionsPrice[0].value],
              options[0].value,
              optionsPrice[0].value,
            ),
          );
        } else {
          chart.current.data(
            transfromData(data[staticType].data[priceType], staticType, priceType),
          );
        }
      }
      // 设置弹窗
      chart.current.tooltip({
        shared: true,
        showCrosshairs: true,
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
          let sum = 0;
          let listItem = '';
          let type = '';
          items.forEach((item) => {
            listItem += `
          <li class="g2-tooltip-list-item" data-index={index}>
            
          </li>`;
            sum += item.value * 1000;
            type = item.data.priceStaticT;
          });
          const staticItem = `<div style="color:#fff;"><span style="color:#fff; font-size: 20px; font-weight:700">${formatNum(
            sum / 1000,
          )}</span><span ${isEth ? 'style="margin-left:5px"' : ''}>${
            isEth ? type.toLocaleUpperCase() : ''
          }</span><span style="margin-left:5px"></span></div>`;
          container.innerHTML = title + staticItem + listItem;
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
                  stroke: iconImgLight===true?'rgba(0, 0, 0, 0.15)':'rgba(255, 255, 255, 0.15)',
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
            stroke: iconImgLight===true?'rgba(0, 0, 0, 0.15)':'rgba(255, 255, 255, 0.15)',
          },
        },
        label: {
          style: { fill:iconImgLight===true?'#000': 'rgba(255,255, 255, 0.85)' },
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

      // 数据处理
      if (data) {
        // chart.current.data(transfromData(data[staticType].data, staticType, limit));
        chart.current
          .interval()
          .position('time*value')
          .size(barWidth)
          .color('type')
          .style({
            fields: ['type'],
            callback: (tVal) => {
              if (tVal === keyTypes[0]) {
                return {
                  fill: gradient
                    ? `l(270) 0:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 0.2) 1:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 1)`
                    : `rgb(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]})`,
                };
              }
              return {
                fill: gradient
                  ? `l(270) 0:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 0.2) 1:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 1)`
                  : `rgb(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]})`,
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
                type === keyTypes[0]
                  ? `rgb(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]})`
                  : `rgb(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]})`,
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
    [staticType, limit, id, options, priceType],
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
      initChart(result, tabState, tab_state);
    }
    return result;
  }, [dataHandler]);

  const onRetry = React.useCallback(() => {
    requestData();
  }, [requestData]);

  // const updateData = React.useCallback(
  //   (staticT) => {
  //     if (chart.current && dataSource) {
  //       chart.current.changeData(transfromData(dataSource[staticT].data, staticT));
  //     }
  //   },
  //   [dataSource, staticType, limit],
  // );
  const updateData = React.useCallback(
    (staticT, priceT) => {
      if (chart.current && dataSource) {
        chart.current.changeData(transfromData(dataSource[staticT].data[priceT], staticT, priceT));
      }
    },
    [dataSource, staticType, priceType, limit],
  );

  const changeStatic = React.useCallback(
    (val) => {
      setStaticType(val);
      if (chart.current && dataSource) {
        updateData(val, priceType);
      }
    },
    [dataSource, limit, priceType, updateData],
  );

  const changePriceStatic = React.useCallback(
    (val) => {
      setPriceType(val);
      if (chart.current && dataSource) {
        updateData(staticType, val);
      }
    },
    [dataSource, staticType, limit, updateData],
  );

  const init = React.useCallback(() => {
    changeStatic(options[0].value);
    setStaticType(options[0].value);
    set_tab_state(tabState);
    initChart(dataSource, tabState, tab_state);
  }, [tabState]);

  React.useEffect(() => {
    requestData();
    init();
    return () => {
      if (chart.current) {
        chart.current.destroy();
      }
    };
  }, [requestData, init]);

  const getLenged = React.useMemo(() => {
    if (showMarkerType !== 'sandbox') {
      return (
        <>
          <IconLabel
          iconImgLight={iconImgLight}
            text={legend1.label}
            color={`rgb(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]})`}
            className="mr-5"
          ></IconLabel>
          <IconLabel
             iconImgLight={iconImgLight}
            text={legend2.label}
            color={`rgb(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]})`}
          ></IconLabel>
        </>
      );
    }
    return null;
  }, [legend1, legend2]);

  const getSelect = React.useMemo(() => {
    return (
      <div
        className={cn('flex items-center', style.border)}
        style={{ color: 'rgba(255,255,255, 0.3)' }}
      >
        <ChartSelecter
           iconImgLight={iconImgLight}
          options={options}
          showArrow={true}
          onClick={changeStatic}
          className={style.selecterLong}
          defaultLabel={options[0].value}
          hasBorder={false}
        ></ChartSelecter>
        丨
        <ChartSelecter
           iconImgLight={iconImgLight}
          hasBorder={false}
          options={optionsPrice}
          showArrow={true}
          onClick={changePriceStatic}
          defaultLabel={optionsPrice[0].value}
        ></ChartSelecter>
      </div>
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
    <div className={cn('w-full p-5', iconImgLight===true?style.content1:style.content, className)}>
      <div>
        <div className={cn('w-full flex justify-between item-center', style.header)}>
          <ChartTitle iconImgLight={iconImgLight} text={labelText} color={textColor}></ChartTitle>
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
