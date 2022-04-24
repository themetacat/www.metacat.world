import React from 'react';
import { Chart } from '@antv/g2';
import cn from 'classnames';
import style from './index.module.css';

import ChartTitle from '../chart-title';
import Status from '../status';
import IconLabel from '../icon-label';
import ChartSelecter from '../chart-select';

import { convert, formatNum } from '../../common/utils';

type Props = {
  id?: string;
  labelText?: string;
  dataHandlder?;
  legend1?;
  legend2?;
  legend3?;
  legend4?;
  legend5?;
  legend6?;
  options?;
  priceOptions?;
  limit?: number;
};
/**
 * The Sandbox
NFT Worlds
Decentraland
Worldwide Webb
Cryptovoxels
Somnium Spance
 */

const keyTypes = [
  'thesandbox',
  'nftworlds',
  'decentraland',
  'worldwidewebb',
  'cryptovoxels',
  'somniumspance',
];

const showKeyTypes = [
  'The Sandbox',
  'NFT Worlds',
  'Decentraland',
  'Worldwide Webb',
  'Cryptovoxels',
  'Somnium Spance',
];

export default function AllLine({
  id,
  labelText,
  dataHandlder,
  legend1,
  legend2,
  legend3,
  legend4,
  legend5,
  legend6,
  options,
  priceOptions,
  limit,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [dataSource, setDataSource] = React.useState(null);
  const [showType, setShowType] = React.useState(options[0].value);
  const [priceShowType, setPriceShowType] = React.useState(priceOptions[0].value);
  const chart = React.useRef(null);

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
      const dom = document.getElementById('allline1');
      if (!dom) {
        return;
      }
      chart.current = new Chart({
        container: 'allline1',
        autoFit: true,
        height: 400,
      });
      console.log(data);
      chart.current.data(transfromData(data[showType][priceShowType], showType, priceShowType));
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
            thesandbox: null,
            nftworlds: null,
            decentraland: null,
            worldwidewebb: null,
            cryptovoxels: null,
            somniumspance: null,
          };
          if (items.length <= 0) {
            return;
          }
          items.forEach((item, index) => {
            result[keyTypes[index]] = item;
          });

          const staticItem = `
              <div style="color:#fff;margin-bottom:12px">
                <span style="color:#999999;">
                ${showKeyTypes[0]}:
                  <span style="color:#fff;">
                    <span style="margin:0px 5px; color:rgba(${legend1.color[0]}, ${
            legend1.color[1]
          }, ${legend1.color[2]}, 1);">${formatNum(result[keyTypes[0]]?.value)}</span>
                    <span>${result[keyTypes[1]].priceStaticT.toLocaleUpperCase()}</span>
                  </span>
                </span>
              </div>

              <div style="color:#fff;margin-bottom:12px">
                <span style="color:#999999;">
                ${showKeyTypes[1]}:
                  <span style="color:#fff;">
                    <span style="margin:0px 5px; color:rgba(${legend2.color[0]}, ${
            legend2.color[1]
          }, ${legend2.color[2]}, 1);">${formatNum(result[keyTypes[1]]?.value)}</span>
                    <span>${result[keyTypes[1]].priceStaticT.toLocaleUpperCase()}</span>
                  </span>
                </span>
              </div>

              <div style="color:#fff;margin-bottom:12px">
              <span style="color:#999999;">
              ${showKeyTypes[2]}:
                <span style="color:#fff;">
                  <span style="margin:0px 5px; color:rgba(${legend3.color[0]}, ${
            legend3.color[1]
          }, ${legend3.color[2]}, 1);">${formatNum(result[keyTypes[2]]?.value)}</span>
                  <span>${result[keyTypes[1]].priceStaticT.toLocaleUpperCase()}</span>
                </span>
              </span>
            </div>

            <div style="color:#fff;margin-bottom:12px">
            <span style="color:#999999;">
            ${showKeyTypes[3]}:
              <span style="color:#fff;">
                <span style="margin:0px 5px; color:rgba(${legend4.color[0]}, ${legend4.color[1]}, ${
            legend4.color[2]
          }, 1);">${formatNum(result[keyTypes[3]]?.value)}</span>
                <span>${result[keyTypes[1]].priceStaticT.toLocaleUpperCase()}</span>
              </span>
            </span>
          </div>

          <div style="color:#fff;margin-bottom:12px">
          <span style="color:#999999;">
          ${showKeyTypes[4]}:
            <span style="color:#fff;">
              <span style="margin:0px 5px; color:rgba(${legend5.color[0]}, ${legend5.color[1]}, ${
            legend5.color[2]
          }, 1);">${formatNum(result[keyTypes[4]]?.value)}</span>
              <span>${result[keyTypes[1]].priceStaticT.toLocaleUpperCase()}</span>
            </span>
          </span>
        </div>

        <div style="color:#fff;margin-bottom:12px">
        <span style="color:#999999;">
        ${showKeyTypes[5]}:
          <span style="color:#fff;">
            <span style="margin:0px 5px; color:rgba(${legend6.color[0]}, ${legend6.color[1]}, ${
            legend6.color[2]
          }, 1);">${formatNum(result[keyTypes[5]]?.value)}</span>
            <span>${result[keyTypes[1]].priceStaticT.toLocaleUpperCase()}</span>
          </span>
        </span>
      </div>
              `;
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
            stroke: 'rgba(255, 255, 255, 0.15)',
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
        .color('name')
        .style({
          fields: ['name'],
          callback: (tVal) => {
            if (tVal === showKeyTypes[0]) {
              return {
                fill: `l(270) 0:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 0.2) 1:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 1)`,
              };
            }
            if (tVal === showKeyTypes[1]) {
              return {
                fill: `l(270) 0:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 0.2) 1:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 1)`,
              };
            }
            if (tVal === showKeyTypes[2]) {
              return {
                fill: `l(270) 0:rgba(${legend3.color[0]}, ${legend3.color[1]}, ${legend3.color[2]}, 0.2) 1:rgba(${legend3.color[0]}, ${legend3.color[1]}, ${legend3.color[2]}, 1)`,
              };
            }
            if (tVal === showKeyTypes[3]) {
              return {
                fill: `l(270) 0:rgba(${legend4.color[0]}, ${legend4.color[1]}, ${legend4.color[2]}, 0.2) 1:rgba(${legend4.color[0]}, ${legend4.color[1]}, ${legend4.color[2]}, 1)`,
              };
            }
            if (tVal === showKeyTypes[4]) {
              return {
                fill: `l(270) 0:rgba(${legend5.color[0]}, ${legend5.color[1]}, ${legend5.color[2]}, 0.2) 1:rgba(${legend5.color[0]}, ${legend5.color[1]}, ${legend5.color[2]}, 1)`,
              };
            }
            if (tVal === showKeyTypes[5]) {
              return {
                fill: `l(270) 0:rgba(${legend6.color[0]}, ${legend6.color[1]}, ${legend6.color[2]}, 0.2) 1:rgba(${legend6.color[0]}, ${legend6.color[1]}, ${legend6.color[2]}, 1)`,
              };
            }
          },
        })
        .tooltip(
          'time*value*name*staticT*priceStaticT',
          (time, value, name, staticT, priceStaticT) => {
            return {
              value,
              time,
              name,
              staticT,
              priceStaticT,
            };
          },
        );
      chart.current
        .line()
        .position('time*value')
        .size(2)
        .tooltip(false)
        .color('name', [
          `rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 1)`,
          `rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 1)`,
          `rgba(${legend3.color[0]}, ${legend3.color[1]}, ${legend3.color[2]}, 1)`,
          `rgba(${legend4.color[0]}, ${legend4.color[1]}, ${legend4.color[2]}, 1)`,
          `rgba(${legend5.color[0]}, ${legend5.color[1]}, ${legend5.color[2]}, 1)`,
          `rgba(${legend6.color[0]}, ${legend6.color[1]}, ${legend6.color[2]}, 1)`,
        ]);
      chart.current.render();
    },
    [showType, priceShowType],
  );

  const requestData = React.useCallback(async () => {
    setLoading(true);
    let result = null;
    try {
      if (!result) {
        const res = await dataHandlder();
        result = res.data;
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
  }, [showType, priceShowType, dataHandlder]);

  const updata = React.useCallback(
    (st, pt) => {
      if (chart.current && dataSource[0]) {
        chart.current.changeData(transfromData(dataSource[st][pt], st, pt));
      }
    },
    [dataSource],
  );

  const changeStatic = React.useCallback(
    (val) => {
      setShowType(val);
      if (dataSource && chart.current) {
        updata(val, priceShowType);
      }
    },
    [updata, priceShowType, dataSource],
  );

  const changePriceStatic = React.useCallback(
    (val) => {
      setPriceShowType(val);
      if (dataSource && chart.current) {
        updata(showType, val);
      }
    },
    [updata, showType, dataSource],
  );

  const getSelect = React.useMemo(() => {
    // if (showData.length !== 0) {
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
        ></ChartSelecter>
        丨
        <ChartSelecter
          options={priceOptions}
          showArrow={true}
          onClick={changePriceStatic}
          defaultLabel={priceOptions[0].value}
          hasBorder={false}
        ></ChartSelecter>
      </div>
    );
    // }
    // return null;
  }, [changeStatic, changePriceStatic]);
  const onRetry = React.useCallback(() => {
    requestData();
  }, [requestData]);
  const rander = React.useMemo(() => {
    if (loading) {
      return <Status mini={true} status="loading" />;
    }

    if (error) {
      return <Status mini={true} retry={onRetry} status="error" />;
    }
    return <div id={id} className={style.ov}></div>;
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
          className="mr-5"
        ></IconLabel>
        <IconLabel
          text={legend3.label}
          color={`rgb(${legend3.color[0]}, ${legend3.color[1]}, ${legend3.color[2]})`}
          className="mr-5"
        ></IconLabel>
        <IconLabel
          text={legend4.label}
          color={`rgb(${legend4.color[0]}, ${legend4.color[1]}, ${legend4.color[2]})`}
          className="mr-5"
        ></IconLabel>
        <IconLabel
          text={legend5.label}
          color={`rgb(${legend5.color[0]}, ${legend5.color[1]}, ${legend5.color[2]})`}
          className="mr-5"
        ></IconLabel>
        <IconLabel
          text={legend6.label}
          color={`rgb(${legend6.color[0]}, ${legend6.color[1]}, ${legend6.color[2]})`}
        ></IconLabel>
      </>
    );
  }, [legend1, legend2, legend3, legend4, legend5, legend6]);

  React.useEffect(() => {
    requestData();
    return () => {
      if (chart.current) {
        chart.current.destroy();
      }
    };
  }, [requestData]);

  return (
    <div className={style.container}>
      <div className={cn('w-full flex justify-between item-center', style.header)}>
        <ChartTitle text={labelText}></ChartTitle>
        <div className={cn('flex items-center', style.toright)}>{getLenged}</div>
        <div className={cn('flex items-center')}>{getSelect}</div>
      </div>
      {rander}
    </div>
  );
}
