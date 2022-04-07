import React from 'react';
import cn from 'classnames';

import { useRouter } from 'next/router';
import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Footer from '../../components/footer';
import AnalyticsInfo from '../../components/analytics-info';
import Switch from '../../components/switch';

import AnimationBack from '../../components/animation-back';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import {
  getCvTrafficStats,
  getCvParcelAvgPriceStats,
  getCvParcelSoldTotalStats,
  getCvParcelSoldSumStats,
  getCvMintStats,
  getCvParcelOwnerStats,
  getDclParcelAvgPriceStats,
  getDclParcelSoldSumStats,
  getDclParcelSoldTotalStats,
  getDclParcelOwnerStats,
} from '../../service';

import style from './index.module.css';

import BaseBar from '../../components/base-bar';
import ChartLine from '../../components/chart-line';
import StackBar from '../../components/stack-bar';
import ChartLineSimple from '../../components/chart-line-simple';
import ChartLineToolTipSimple from '../../components/chart-line-tooltip-simple';

const types = [
  {
    label: 'Cryptovoxels',
    icon: '/images/Crypto Voxel.jpg',
    value: 'cryptovoxels',
  },
  {
    label: 'Decentraland',
    icon: '/images/Decentraland.jpg',
    value: 'decentraland',
  },
];

export default function AnalyticsIndex(props) {
  const meta = {
    title: `Analytics - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const router = useRouter();

  const [showType, setShowType] = React.useState(props.query.type || 'cryptovoxels');

  const changeType = React.useCallback(
    (newType) => {
      setShowType(newType);
      router.replace(`/analytics?type=${newType}`);
    },
    [types],
  );

  const renderChartList = React.useMemo(() => {
    return showType === 'cryptovoxels' ? (
      <>
        <BaseBar
          id={'basebar1'}
          className="mt-5"
          labelText={'MONTHLY TRAFFIC'}
          dataHandlder={getCvTrafficStats}
          barWidth={18}
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
          barWidth={18}
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
          barWidth={18}
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
          barWidth={18}
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
      <>
        <ChartLine
          id={'dcl-chartline-1'}
          className="mt-5"
          labelText={'AVERAGE PARCEL PRICE'}
          dataHandlder={getDclParcelAvgPriceStats}
          legend1={{ label: 'Separate Land', color: [33, 212, 115] }}
          legend2={{ label: 'Land in Estate', color: [255, 172, 95] }}
          keyTypes={['land', 'estate']}
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
              label: 'USD',
              value: 'usd',
            },
            {
              label: 'MANA',
              value: 'mana',
            },
          ]}
        ></ChartLine>
        <ChartLineToolTipSimple
          id={'dcl-chartline-2'}
          className="mt-5"
          labelText={'NUMBER OF PARCEL SALES'}
          dataHandlder={getDclParcelSoldTotalStats}
          legend1={{ label: 'Land', color: [33, 212, 115] }}
          legend2={{ label: 'Estate', color: [255, 172, 95] }}
          keyTypes={['land', 'estate']}
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
        ></ChartLineToolTipSimple>
        <>
          <span className="hidden"></span>
          <StackBar
            id={'stackbar1'}
            className="mt-5"
            labelText={'MONTHLY PARCEL SALES AMOUNT'}
            dataHandler={getDclParcelSoldSumStats}
            legend1={{ label: 'Land', color: [33, 212, 115] }}
            legend2={{ label: 'Estate', color: [255, 172, 95] }}
            keyTypes={['land', 'estate']}
            barWidth={18}
            isEth={true}
            options={[
              {
                label: 'USD',
                value: 'usd',
              },
              {
                label: 'MANA',
                value: 'mana',
              },
            ]}
          ></StackBar>
        </>
        <>
          <span className="hidden"></span>
          <ChartLineSimple
            id={'chartlinesimple2'}
            className="mt-5"
            labelText={'TOTAL NUMBER OF LANDLORDS AT THE END OF EACH MONTH'}
            dataHandlder={getDclParcelOwnerStats}
            defaultColor={[34, 118, 252]}
          ></ChartLineSimple>
        </>
      </>
    );
  }, [showType]);

  return (
    <Page className={cn('min-h-screen', style.anPage)} meta={meta}>
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
        <div className={cn('w-full h-auto', style.table)}>
          <AnalyticsInfo></AnalyticsInfo>
        </div>
        <div
          className={cn(
            'w-full mt-7 p-5 flex flex-col justify-start items-center',
            style.chartList,
          )}
        >
          <Switch onActive={changeType} options={types} defaultValue={showType}></Switch>
          {renderChartList}
        </div>
      </div>
      <Footer />
    </Page>
  );
}

export async function getServerSideProps({ query }) {
  return {
    props: {
      query,
    }, // will be passed to the page component as props
  };
}
