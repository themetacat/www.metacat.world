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

export default function AllPillar({
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

  const requestData = React.useCallback(async () => {
    setLoading(true);
    const result = await dataHandlder();
    setLoading(false);
    console.log(result.data);
    if (result.code === 100000) {
      setDataSource(result.data);
      // initChart(result.data[showType][priceShowType])
      // initChart(result.data[showType][priceShowType])
    } else {
      setError(true);
    }
  }, [showType, priceShowType, dataHandlder]);
  const updata = React.useCallback(
    (st, pt) => {
      if (chart.current && dataSource[0]) {
        chart.current.changeData(transfromData(dataSource[st][pt], st, pt));
      }
    },
    [dataSource, chart.current],
  );

  const changeStatic = React.useCallback(
    (val) => {
      setShowType(val);
      if (dataSource && chart.current) {
        updata(val, priceShowType);
      }
    },
    [updata, priceShowType, dataSource, chart.current],
  );

  const changePriceStatic = React.useCallback(
    (val) => {
      setPriceShowType(val);
      if (dataSource && chart.current) {
        updata(showType, val);
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
        <div className="flex items-center">{getSelect}</div>
      </div>
      {/* {rander} */}
    </div>
  );
}
