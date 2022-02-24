import React from 'react';
import cn from 'classnames';

import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Footer from '../../components/footer';
import AnalyticsInfo from '../../components/analytics-info';
import Switch from '../../components/switch';
import BaseBar from '../../components/base-bar';

import AnimationBack from '../../components/animation-back';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import {
  getCvTrafficStats,
  getCvParcelAvgPriceStats,
  getCvParcelSoldTotalStats,
  getCvParcelSoldSumStats,
  getCvMintStats,
  getCvParcelOwnerStats,
} from '../../service';

import style from './index.module.css';
import ChartLine from '../../components/chart-line';
import StackBar from '../../components/stack-bar';
import ChartLineSimple from '../../components/chart-line-simple';
import Status from '../../components/status';

const types = [
  {
    label: 'Cryptovoxel',
    icon: '/images/Crypto Voxel.jpg',
    value: 'voxel',
  },
  {
    label: 'Decentraland',
    icon: '/images/Decentraland.jpg',
    value: 'decentraland',
  },
];

export default function AnalyticsIndex() {
  const meta = {
    title: `Analytics - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const [showType, setShowType] = React.useState(types[0].value);

  const changeType = React.useCallback(
    (newType) => {
      setShowType(newType);
    },
    [types],
  );

  const renderChartList = React.useMemo(() => {
    return showType === 'voxel' ? (
      <>
        <BaseBar
          id={'basebar1'}
          className="mt-5"
          labelText={'MONTHLY TRAFFIC'}
          dataHandlder={getCvTrafficStats}
        ></BaseBar>
        <ChartLine
          id={'chartline1'}
          labelText={'AVERAGE PARCEL PRICE'}
          className="mt-5"
          dataHandlder={getCvParcelAvgPriceStats}
          options={[
            {
              label: 'Daily price',
              value: 'daily',
            },
            {
              label: 'Monthly price',
              value: 'monthly',
            },
          ]}
          priceOptions={[
            {
              label: 'ETH',
              value: 'eth',
            },
            {
              label: 'USD',
              value: 'usd',
            },
          ]}
        ></ChartLine>
        <StackBar
          id={'stackbar'}
          className="mt-5"
          labelText={'NUMBER OF PARCEL SALES'}
          dataHandler={getCvParcelSoldTotalStats}
          options={[
            {
              label: 'Daily',
              value: 'daily',
            },
            {
              label: 'Monthly',
              value: 'monthly',
            },
          ]}
        ></StackBar>
        <StackBar
          id={'stackbar1'}
          className="mt-5"
          labelText={'MONTHLY PARCEL SALES AMOUNT'}
          dataHandler={getCvParcelSoldSumStats}
          isEth={true}
          options={[
            {
              label: 'ETH',
              value: 'eth',
            },
            {
              label: 'USD',
              value: 'usd',
            },
          ]}
        ></StackBar>

        <BaseBar
          id={'basebar2'}
          className="mt-5"
          labelText={'MONTHLY PARCEL MINTED'}
          dataHandlder={getCvMintStats}
          defaultColor={[33, 212, 115]}
        ></BaseBar>

        <ChartLineSimple
          id={'chartlinesimple'}
          className="mt-5"
          labelText={'TOTAL NUMBER OF LANDLORDS AT THE END OF EACH MONTH'}
          dataHandlder={getCvParcelOwnerStats}
          defaultColor={[246, 147, 55]}
        ></ChartLineSimple>
      </>
    ) : (
      <Status status="coming"></Status>
    );
  }, [showType]);

  return (
    <Page className="min-h-screen" meta={meta}>
      <div className="bg-black relative">
        <PageHeader className="relative z-10" active={'analytics'} />
        <div
          className={cn(
            'main-content flex justify-center items-end relative z-10 pointer-events-none',
            style.signBack,
          )}
        >
          <img src="/images/analyticsBack.png" className={style.sign}></img>
        </div>
        <AnimationBack id="smoke" className="absolute w-full h-full top-0 left-0"></AnimationBack>
      </div>
      <div className={cn('flex flex-col justify-center items-center', style.content)}>
        <div className={cn('w-full h-48', style.table)}>
          <AnalyticsInfo></AnalyticsInfo>
        </div>
        <div
          className={cn(
            'w-full mt-7 p-5 flex flex-col justify-start items-center',
            style.chartList,
          )}
        >
          <Switch onActive={changeType} options={types}></Switch>
          {renderChartList}
        </div>
      </div>
      <Footer />
    </Page>
  );
}
