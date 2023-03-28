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
  textCount?: string;
  dataHandlder?;
  legend1?;
  legend2?;
  legend3?;
  legend4?;
  legend5?;
  legend6?;
  options?;
  legend7?;
  legend8?;
  priceOptions?;
  limit?: number;
  textColor?;
  HyperlinkJump?;
  imgBox?;
  toLink?;
  iconImgLight?;
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
  'somniumspace',
];

const showKeyTypes = [
  'Otherside',
  'The Sandbox',
  'NFT Worlds',
  'Decentraland',
  'Worldwide Webb',
  'Voxels',
  'Somnium Space',
  'Netvrk',
];

export default function Dcl_landNum({
  id,
  labelText,
  dataHandlder,
  HyperlinkJump,
  iconImgLight,
  legend1,
  legend2,
  legend3,
  legend4,
  legend5,
  legend6,
  legend7,
  legend8,
  options,
  priceOptions,
  textCount,
  limit,
  textColor,
  imgBox,
  toLink,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [dataSource, setDataSource] = React.useState(null);
  const [showType, setShowType] = React.useState(options[0].value);
  // const [priceShowType, setPriceShowType] = React.useState(priceOptions[0].value);
  const chart = React.useRef(null);
  const transfromData = React.useCallback(
    (data, type, ) => {
      const result = [];
      if (limit) {
        const l = data.length;
        const d = l - limit * 2;
        const last = data.slice(d);
        last.forEach((element) => {
          result.push({
            ...element,
            staticT: type,
            // priceStaticT: priceType,
          });
        });
        return result;
      }
      data.forEach((element) => {
        result.push({
          ...element,
          staticT: type,
          // priceStaticT: priceType,
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
        height: 400,
      });
      if (data[showType] && data[showType]) {
        chart.current.data(transfromData(data[showType], showType, ));
      }
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
          // console.log(name, 666, items[0]?.value);
          // const a = { name: 'Decentraland' };
          // items.push(a)
          // console.log(items,22);
          const container = document.createElement('div');
          container.className = 'g2-tooltip';
          const title = `<div class="g2-tooltip-title" style="margin-top: 12px;margin-bottom: 12px;' ">Date: <span style="color:#fff; margin-left:5px">${name}</span></div>`;

          const result = {
            thesandbox: null,
            nftworlds: null,
            decentraland: null,
            worldwidewebb: null,
            voxels: null,
            somniumspance: null,
          };
          if (items.length <= 0) {
            return;
          }
          items.forEach((item, index) => {
            // console.log(item, showKeyTypes[3], result);
            // console.log(result[showKeyTypes[3]]);

            // result[item.name] = 'Decentraland';
            // console.log(655, Number(result[showKeyTypes[3]]?.value));
          });
          const title1 = `<div style="font-size:16px; font-weight:600; margin-bottom: 12px;">${formatNum(
            // Number(result[showKeyTypes[3]]?.value) +
            // Number(result[showKeyTypes[0]]?.value) +
            // Number(result[showKeyTypes[1]]?.value) +
            // Number(result[showKeyTypes[2]]?.value) +
            // Number(result[showKeyTypes[3]]?.value) +
            Number(items[0]?.value),
            // Number(result[showKeyTypes[7]]?.value) +
            // Number(result[showKeyTypes[5]]?.value),
          )} 
          <span style="font-size:12px; font-weight:400; color:#fff;">Total</span></div>`;

          const staticItem = `
      <div style="color:#fff;margin-bottom:12px">
      <span style="color:rgba(${legend4.color[0]}, ${legend4.color[1]}, ${legend4.color[2]}, 1);">
      ${showKeyTypes[3]}:
        <span style="color:#fff;">
          <span style="margin:0px 5px;font-size:16px;font-weight:700; color:rgba(${
            legend4.color[0]
          }, ${legend4.color[1]}, ${legend4.color[2]}, 1);">${formatNum(items[0]?.value)}</span>
        
        </span>
      </span>
    </div>

   

  <div style="color:#fff;margin-bottom:12px">
 
</div>



  


              `;
          container.innerHTML = title + title1 + staticItem;
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
              if (y !== 0) {
                return {
                  lineDash: [5, 5],
                  lineWidth: 1,
                  stroke:
                    iconImgLight === true ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)',
                };
              }
              return null;
            },
          },
        },
        label: {
          offsetX: 2 / 2,
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
            stroke: iconImgLight === true ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)',
          },
        },
        label: {
          style: { fill: iconImgLight === true ? '#000' : 'rgba(255,255, 255, 0.85)' },
          offsetX: showType === 'yearly' ? 0 : 25,
          offsetY: 0,
          rotate: showType === 'yearly' ? 0 : 1,
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
      /**
       *   `rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 1)`,
          `rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 1)`,
          `rgba(${legend3.color[0]}, ${legend3.color[1]}, ${legend3.color[2]}, 1)`,
          `rgba(${legend4.color[0]}, ${legend4.color[1]}, ${legend4.color[2]}, 1)`,
          `rgba(${legend5.color[0]}, ${legend5.color[1]}, ${legend5.color[2]}, 1)`,
          `rgba(${legend6.color[0]}, ${legend6.color[1]}, ${legend6.color[2]}, 1)`,
       */
      chart.current
        .interval()
        .position('time*value')
        .size(showType === 'yearly' ? 70 : 20)
        .color('name', (tVal) => {
          // if (tVal === 'Otherside') {
          //   return `rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 1)`;
          // }
          // if (tVal === 'The Sandbox') {
          //   return `rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 1)`;
          // }
          // if (tVal === 'NFT Worlds') {
          //   return `rgba(${legend3.color[0]}, ${legend3.color[1]}, ${legend3.color[2]}, 1)`;
          // }
          if (tVal) {
            return `rgba(${legend4.color[0]}, ${legend4.color[1]}, ${legend4.color[2]}, 1)`;
          }
          // if (tVal === 'Worldwide Webb') {
          //   return `rgba(${legend5.color[0]}, ${legend5.color[1]}, ${legend5.color[2]}, 1)`;
          // }
          // if (tVal === 'Voxels') {
          //   return `rgba(${legend6.color[0]}, ${legend6.color[1]}, ${legend6.color[2]}, 1)`;
          // }
          // if (tVal === 'Somnium Space') {
          //   return `rgba(${legend7.color[0]}, ${legend7.color[1]}, ${legend7.color[2]}, 1)`;
          // }

          // if (tVal === 'Netvrk') {
          //   return `rgba(${legend8.color[0]}, ${legend8.color[1]}, ${legend8.color[2]}, 1)`;
          // }
        })
        .style({
          fields: ['name'],
          callback: (tVal) => {
            // if (tVal === 'Otherside') {
            //   return {
            //     fill: `l(270) 0:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 0.2) 1:rgba(${legend1.color[0]}, ${legend1.color[1]}, ${legend1.color[2]}, 1)`,
            //   };
            // }
            // if (tVal === 'The Sandbox') {
            //   return {
            //     fill: `l(270) 0:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 0.2) 1:rgba(${legend2.color[0]}, ${legend2.color[1]}, ${legend2.color[2]}, 1)`,
            //   };
            // }
            // if (tVal === 'NFT Worlds') {
            //   return {
            //     fill: `l(270) 0:rgba(${legend3.color[0]}, ${legend3.color[1]}, ${legend3.color[2]}, 0.2) 1:rgba(${legend3.color[0]}, ${legend3.color[1]}, ${legend3.color[2]}, 1)`,
            //   };
            // }
            // if (tVal) {
              return {
                fill: `l(270) 0:rgba(${legend4.color[0]}, ${legend4.color[1]}, ${legend4.color[2]}, 0.2) 1:rgba(${legend4.color[0]}, ${legend4.color[1]}, ${legend4.color[2]}, 1)`,
              };
            // }
            // if (tVal === 'Worldwide Webb') {
            //   return {
            //     fill: `l(270) 0:rgba(${legend5.color[0]}, ${legend5.color[1]}, ${legend5.color[2]}, 0.2) 1:rgba(${legend5.color[0]}, ${legend5.color[1]}, ${legend5.color[2]}, 1)`,
            //   };
            // }
            // if (tVal === 'Voxels') {
            //   return {
            //     fill: `l(270) 0:rgba(${legend6.color[0]}, ${legend6.color[1]}, ${legend6.color[2]}, 0.2) 1:rgba(${legend6.color[0]}, ${legend6.color[1]}, ${legend6.color[2]}, 1)`,
            //   };
            // }
            // if (tVal === 'Somnium Space') {
            //   return {
            //     fill: `l(270) 0:rgba(${legend7.color[0]}, ${legend7.color[1]}, ${legend7.color[2]}, 0.2) 1:rgba(${legend7.color[0]}, ${legend7.color[1]}, ${legend7.color[2]}, 1)`,
            //   };
            // }

            // if (tVal === 'Netvrk') {
            //   return {
            //     fill: `l(270) 0:rgba(${legend8.color[0]}, ${legend8.color[1]}, ${legend8.color[2]}, 0.2) 1:rgba(${legend8.color[0]}, ${legend8.color[1]}, ${legend8.color[2]}, 1)`,
            //   };
            // }
          },
        })
        .tooltip('time*value*staticT*priceStaticT', (time, value, staticT, priceStaticT) => {
          return {
            value,
            time,
            // name,
            staticT,
            priceStaticT,
          };
        })
        .adjust({
          type: 'stack',
          reverseOrder: false,
        });
      chart.current.render();
    },
    [showType],
  );

  const requestData = React.useCallback(async () => {
    setLoading(true);
    const result = await dataHandlder('num');

    setLoading(false);

    if (result.code === 100000 && result.data[showType] && result.data[showType]) {
      setDataSource(result.data);
      initChart(result.data);
      // initChart(result.data[showType][priceShowType])
    } else {
      setError(true);
    }
  }, [showType,  dataHandlder]);
  const updata = React.useCallback(
    (st) => {
      if (chart.current && dataSource[0]) {
        chart.current.changeData(transfromData(dataSource[st], st, ));
      }
    },
    [dataSource, chart.current],
  );

  const changeStatic = React.useCallback(
    (val) => {
      setShowType(val);
      if (dataSource && chart.current) {
        updata(val);
      }
    },
    [updata, dataSource, chart.current],
  );

  const changePriceStatic = React.useCallback(
    (val) => {
      // setPriceShowType(val);
      if (dataSource && chart.current) {
        updata(showType);
      }
    },
    [updata, showType, dataSource, chart.current],
  );

  const getSelect = React.useMemo(() => {
    // if (showData.length !== 0) {
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
          cl={style.bg}
        ></ChartSelecter>
        {/* 丨
        <ChartSelecter
          iconImgLight={iconImgLight}
          options={priceOptions}
          showArrow={true}
          onClick={changePriceStatic}
          defaultLabel={priceOptions[0].value}
          hasBorder={false}
          cl={style.bg}
        ></ChartSelecter> */}
      </div>
    );
    // }
    // return null;
  }, [changeStatic, changePriceStatic]);

  const getLenged = React.useMemo(() => {
    return (
      <>
        {/* <IconLabel
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
        ></IconLabel> */}
        {/* <IconLabel
          iconImgLight={iconImgLight}
          text={legend4.label}
          color={`rgb(${legend4.color[0]}, ${legend4.color[1]}, ${legend4.color[2]})`}
          className="mr-5"
        ></IconLabel> */}
        {/* <IconLabel
          text={legend5.label}
          color={`rgb(${legend5.color[0]}, ${legend5.color[1]}, ${legend5.color[2]})`}
          className="mr-5"
        ></IconLabel> */}
        {/* <IconLabel
         iconImgLight={iconImgLight}
          text={legend6.label}
          color={`rgb(${legend6.color[0]}, ${legend6.color[1]}, ${legend6.color[2]})`}
          className="mr-5"
        ></IconLabel> */}
        {/* <IconLabel
          text={legend7.label}
          color={`rgb(${legend7.color[0]}, ${legend7.color[1]}, ${legend7.color[2]})`}
          className="mr-5"
        ></IconLabel>
        <IconLabel
          text={legend8.label}
          color={`rgb(${legend8.color[0]}, ${legend8.color[1]}, ${legend8.color[2]})`}
          className="mr-5"
        ></IconLabel> */}
      </>
    );
  }, [legend1, legend2, legend3, legend4, legend5, legend6, legend7]);

  const onRetry = React.useCallback(() => {
    requestData();
  }, [requestData]);
  const rander = React.useMemo(() => {
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
    return <div id={id} className={style.ov}></div>;
  }, [loading, error, onRetry]);

  React.useEffect(() => {
    requestData();
    return () => {
      if (chart.current) {
        chart.current?.destroy();
      }
    };
  }, [requestData]);

  return (
    <div className={style.container}>
      <div className={cn('w-full flex justify-between item-center', style.header)}>
        <ChartTitle
          iconImgLight={iconImgLight}
          Hyperlink={HyperlinkJump}
          text={labelText}
          color={textColor}
        ></ChartTitle>
        {/* <div className={cn('flex items-center', style.toright)}>{getLenged}</div> */}
        <div className="flex items-center">{getSelect}</div>
      </div>
      {rander}
    </div>
  );
}
