import React from 'react';
import cn from 'classnames';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

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

import {
  req_sandbox_avg_price_stats,
  req_sandbox_sold_total_stats,
  req_sandbox_sold_sun_stats,
  req_somniumspace__avg_price_stats,
  req_somniumspace_sold_total_stats,
  req_somniumspace_sold_sum_stats,
  req_ntfworlds_avg_price_stats,
  req_ntfworlds_sold_total_stats,
  req_ntfworlds_sold_sum_stats,
  req_webb_parcel_avg_price_stats,
  req_webb_sold_total_stats,
  req_webb_sold_sum_stats,
  req_sales_amount_percent,
  req_avg_parcel_price,
  req_sales_amount_stack,
  req_metaindex_ethprice,
  req_all_number_sales,
  req_otherside_avg_price,
  req_otherside_sales_num,
  req_otherside_sales_amount,
} from '../../service/z_api';

import style from './index.module.css';

const BaseBar = dynamic(() => import('../../components/base-bar'), {
  ssr: false,
});
const ChartLine = dynamic(() => import('../../components/chart-line'), {
  ssr: false,
});
const StackBar = dynamic(() => import('../../components/stack-bar'), {
  ssr: false,
});
const StackBarZ = dynamic(() => import('../../components/stack-bar-z'), {
  ssr: false,
});
const ChartLineSimple = dynamic(() => import('../../components/chart-line-simple'), {
  ssr: false,
});
const ChartLineToolTipSimple = dynamic(() => import('../../components/chart-line-tooltip-simple'), {
  ssr: false,
});
const ChartLineSandBox = dynamic(() => import('../../components/chart-line-sandbox'), {
  ssr: false,
});
const ChartLineToolTipSimpleSandbox = dynamic(
  () => import('../../components/chart-line-tooltip-simple-sandbox'),
  { ssr: false },
);
const StackBarZ2 = dynamic(() => import('../../components/stack-bar-z2'), { ssr: false });
const Annular = dynamic(() => import('../../components/analytics_annular'), { ssr: false });
const Miniline = dynamic(() => import('../../components/mini_line'), { ssr: false });
const Allline = dynamic(() => import('../../components/all_line'), { ssr: false });
const AllPillar2 = dynamic(() => import('../../components/all_pillar2'), { ssr: false });
const AllPillar = dynamic(() => import('../../components/all_pillar'), { ssr: false });
// import BaseBar from '../../components/base-bar';
// import ChartLine from '../../components/chart-line';
// import StackBar from '../../components/stack-bar';
// import StackBarZ from '../../components/stack-bar-z';
// import ChartLineSimple from '../../components/chart-line-simple';
// import ChartLineToolTipSimple from '../../components/chart-line-tooltip-simple';
// import ChartLineSandBox from '../../components/chart-line-sandbox';
// import ChartLineToolTipSimpleSandbox from '../../components/chart-line-tooltip-simple-sandbox';
// import StackBarZ2 from '../../components/stack-bar-z2';
// import Annular from '../../components/analytics_annular';
// import Miniline from '../../components/mini_line';
// import Allline from '../../components/all_line';
// import AllPillar2 from '../../components/all_pillar2';
// import AllPillar from '../../components/all_pillar';

const types = [
  {
    label: 'Otherside',
    icon: '/images/osd.png',
    value: 'otherside',
  },
  {
    label: 'The Sandbox',
    icon: '/images/home-icon.svg',
    value: 'sandbox',
  },
  {
    label: 'NFT Worlds',
    icon: '/images/worlds.svg',
    value: 'nftworlds',
  },
  {
    label: 'Decentraland',
    icon: '/images/Decentraland.jpg',
    value: 'decentraland',
  },

  {
    label: 'Worldwide Webb',
    icon: '/images/unnamed.svg',
    value: 'worldwidewebb',
  },
  {
    label: 'Voxels',
    icon: '/images/cvLogo.png',
    value: 'cryptovoxels',
  },
  {
    label: 'Somnium Space',
    icon: '/images/somniumspace.png',
    value: 'somniumspace',
  },
];

const hNav = [
  {
    type: 'all',
    value: 'All Worlds',
  },
  {
    type: 'single',
    value: 'Individual',
  },
];

export default function AnalyticsIndex(props) {
  const meta = {
    title: `Analytics - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };
  const router = useRouter();
  const [showType, setShowType] = React.useState(props.query.type || 'cryptovoxels');
  const [fixedState, setFixedState] = React.useState(false);
  const [headerNav, setHeaderNav] = React.useState(props.query.type ? hNav[1].type : hNav[0].type);
  const changeType = React.useCallback((newType) => {
    setShowType(newType);
    router.replace(`/analytics?type=${newType}`);
  }, []);

  const changeHeaderNav = React.useCallback(
    (nav) => {
      if (nav === 'single') {
        router.replace(`/analytics?type=${showType}`);
        setHeaderNav(nav);
      }
      if (nav === 'all') {
        router.replace(`/analytics`);
        setHeaderNav(nav);
      }
    },
    [headerNav],
  );

  const renderChartList = React.useMemo(() => {
    if (showType === 'cryptovoxels') {
      return (
        <>
          <BaseBar
            id={'basebar1'}
            className="mt-5"
            labelText={'Traffic'}
            dataHandlder={getCvTrafficStats}
            barWidth={18}
            textColor={style.cvColor}
          ></BaseBar>
          <ChartLine
            id={'chartline1'}
            labelText={'Average Parcel Price'}
            className="mt-5"
            dataHandlder={getCvParcelAvgPriceStats}
            textColor={style.cvColor}
            options={[
              {
                label: 'Daily price',
                value: 'daily',
              },
              {
                label: 'Monthly price',
                value: 'monthly',
              },
              {
                label: 'Quarterly price',
                value: 'quarterly',
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
            labelText={'Number Of Parcel Sales'}
            dataHandler={getCvParcelSoldTotalStats}
            barWidth={18}
            textColor={style.cvColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Monthly',
                value: 'monthly',
              },
              {
                label: 'Quarterly',
                value: 'quarterly',
              },
            ]}
          ></StackBar>
          <StackBarZ2
            id={'stackbar1'}
            className="mt-5"
            labelText={'Parcel Sales Amount'}
            dataHandler={getCvParcelSoldSumStats}
            isEth={true}
            barWidth={18}
            textColor={style.cvColor}
            options={[
              {
                label: 'Monthly',
                value: 'monthly',
              },
              {
                label: 'Quarterly',
                value: 'quarterly',
              },
            ]}
            optionsPrice={[
              {
                label: 'ETH',
                value: 'eth',
              },
              {
                label: 'USD',
                value: 'usd',
              },
            ]}
          ></StackBarZ2>
          <BaseBar
            id={'basebar2'}
            className="mt-5"
            labelText={'Monthly Parcel Minted'}
            dataHandlder={getCvMintStats}
            defaultColor={[130, 137, 195]}
            barWidth={18}
            textColor={style.cvColor}
          ></BaseBar>
          <ChartLineSimple
            id={'chartlinesimple'}
            className="mt-5"
            labelText={'Total Number Of Landlords At The End Of Each Month'}
            dataHandlder={getCvParcelOwnerStats}
            defaultColor={[194, 157, 135]}
            textColor={style.cvColor}
          ></ChartLineSimple>
        </>
      );
    }
    if (showType === 'decentraland') {
      return (
        <>
          <ChartLine
            id={'dcl-chartline-1'}
            className="mt-5"
            labelText={'Average Parcel Price'}
            dataHandlder={getDclParcelAvgPriceStats}
            legend1={{ label: 'Separate Land', color: [255, 107, 84] }}
            legend2={{ label: 'Land in Estate', color: [255, 207, 84] }}
            keyTypes={['land', 'estate']}
            textColor={style.dclColor}
            options={[
              {
                label: 'Daily price',
                value: 'daily',
              },
              {
                label: 'Monthly price',
                value: 'monthly',
              },
              {
                label: 'Quarterly price',
                value: 'quarterly',
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
            labelText={'Number Of Parcel Sales'}
            dataHandlder={getDclParcelSoldTotalStats}
            legend1={{ label: 'Land', color: [255, 79, 163] }}
            legend2={{ label: 'Estate', color: [225, 255, 40] }}
            keyTypes={['land', 'estate']}
            textColor={style.dclColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Monthly',
                value: 'monthly',
              },
              {
                label: 'Quarterly',
                value: 'quarterly',
              },
            ]}
          ></ChartLineToolTipSimple>
          <>
            <span className="hidden"></span>
            <StackBarZ2
              id={'stackbar1'}
              className="mt-5"
              labelText={'Parcel Sales Amount'}
              dataHandler={getDclParcelSoldSumStats}
              legend1={{ label: 'Land', color: [255, 207, 84] }}
              legend2={{ label: 'Estate', color: [255, 107, 84] }}
              keyTypes={['land', 'estate']}
              barWidth={18}
              isEth={true}
              textColor={style.dclColor}
              options={[
                {
                  label: 'Monthly',
                  value: 'monthly',
                },
                {
                  label: 'Quarterly',
                  value: 'quarterly',
                },
              ]}
              optionsPrice={[
                {
                  label: 'USD',
                  value: 'usd',
                },
                {
                  label: 'MANA',
                  value: 'mana',
                },
              ]}
            ></StackBarZ2>
          </>
          <>
            <span className="hidden"></span>
            <ChartLineSimple
              id={'chartlinesimple2'}
              className="mt-5"
              labelText={'Total Number Of Landlords At The End Of Each Month'}
              dataHandlder={getDclParcelOwnerStats}
              defaultColor={[255, 105, 40]}
              textColor={style.dclColor}
            ></ChartLineSimple>
          </>
        </>
      );
    }
    if (showType === 'sandbox') {
      return (
        <>
          <ChartLineSandBox
            id={'chartline1'}
            labelText={'Average Parcel Price'}
            className="mt-5"
            dataHandlder={req_sandbox_avg_price_stats}
            legend1={{ label: 'Primary', color: [24, 147, 247] }}
            textColor={style.sandboxColor}
            options={[
              {
                label: 'Daily price',
                value: 'daily',
              },
              {
                label: 'Monthly price',
                value: 'monthly',
              },
              {
                label: 'Quarterly price',
                value: 'quarterly',
              },
            ]}
            priceOptions={[
              {
                label: 'USD',
                value: 'usd',
              },
              {
                label: 'ETH',
                value: 'eth',
              },
            ]}
            tabState={showType}
          ></ChartLineSandBox>
          <ChartLineToolTipSimpleSandbox
            id={'dcl-chartline-2'}
            className="mt-5"
            labelText={'Number Of Parcel Sales'}
            dataHandlder={req_sandbox_sold_total_stats}
            legend1={{ label: 'Land', color: [24, 60, 247] }}
            keyTypes={['land', 'estate']}
            textColor={style.sandboxColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Monthly',
                value: 'monthly',
              },
              {
                label: 'Quarterly',
                value: 'quarterly',
              },
            ]}
            tabState={showType}
          ></ChartLineToolTipSimpleSandbox>
          <StackBarZ
            id={'stackbar1'}
            className="mt-5"
            labelText={'Parcel Sales Amount'}
            dataHandler={req_sandbox_sold_sun_stats}
            legend1={{ label: 'Land', color: [0, 117, 255] }}
            keyTypes={['land', 'estate']}
            barWidth={18}
            isEth={true}
            showMarkerType="sandbox"
            textColor={style.sandboxColor}
            options={[
              {
                label: 'Monthly',
                value: 'monthly',
              },
              {
                label: 'Quarterly',
                value: 'quarterly',
              },
            ]}
            optionsPrice={[
              {
                label: 'USD',
                value: 'usd',
              },
              {
                label: 'ETH',
                value: 'eth',
              },
            ]}
            tabState={showType}
          ></StackBarZ>
        </>
      );
    }
    if (showType === 'somniumspace') {
      return (
        <>
          <>
            <ChartLineSandBox
              id={'chartline1'}
              labelText={'Average Parcel Price'}
              className="mt-5"
              dataHandlder={req_somniumspace__avg_price_stats}
              legend1={{ label: 'Primary', color: [250, 216, 23] }}
              textColor={style.spaceColor}
              options={[
                {
                  label: 'Daily price',
                  value: 'daily',
                },
                {
                  label: 'Monthly price',
                  value: 'monthly',
                },
                {
                  label: 'Quarterly price',
                  value: 'quarterly',
                },
              ]}
              priceOptions={[
                {
                  label: 'USD',
                  value: 'usd',
                },
                {
                  label: 'ETH',
                  value: 'eth',
                },
              ]}
              tabState={showType}
            ></ChartLineSandBox>
            <ChartLineToolTipSimpleSandbox
              id={'dcl-chartline-2'}
              className="mt-5"
              labelText={'Number Of Parcel Sales'}
              dataHandlder={req_somniumspace_sold_total_stats}
              legend1={{ label: 'Land', color: [250, 159, 23] }}
              keyTypes={['land', 'estate']}
              textColor={style.spaceColor}
              options={[
                {
                  label: 'Daily',
                  value: 'daily',
                },
                {
                  label: 'Monthly',
                  value: 'monthly',
                },
                {
                  label: 'Quarterly',
                  value: 'quarterly',
                },
              ]}
              tabState={showType}
            ></ChartLineToolTipSimpleSandbox>
            <StackBarZ
              textColor={style.spaceColor}
              id={'stackbar1'}
              className="mt-5"
              labelText={'Parcel Sales Amount'}
              dataHandler={req_somniumspace_sold_sum_stats}
              legend1={{ label: 'Land', color: [250, 216, 23] }}
              keyTypes={['land', 'estate']}
              barWidth={18}
              isEth={true}
              showMarkerType="sandbox"
              options={[
                {
                  label: 'Monthly',
                  value: 'monthly',
                },
                {
                  label: 'Quarterly',
                  value: 'quarterly',
                },
              ]}
              optionsPrice={[
                {
                  label: 'USD',
                  value: 'usd',
                },
                {
                  label: 'ETH',
                  value: 'eth',
                },
              ]}
              tabState={showType}
            ></StackBarZ>
          </>
        </>
      );
    }
    if (showType === 'nftworlds') {
      return (
        <>
          <ChartLineSandBox
            id={'chartline1'}
            labelText={'Average Parcel Price'}
            className="mt-5"
            dataHandlder={req_ntfworlds_avg_price_stats}
            legend1={{ label: 'Primary', color: [132, 193, 14] }}
            textColor={style.nftColor}
            options={[
              {
                label: 'Daily price',
                value: 'daily',
              },
              {
                label: 'Monthly price',
                value: 'monthly',
              },
              {
                label: 'Quarterly price',
                value: 'quarterly',
              },
            ]}
            priceOptions={[
              {
                label: 'USD',
                value: 'usd',
              },
              {
                label: 'ETH',
                value: 'eth',
              },
            ]}
            tabState={showType}
          ></ChartLineSandBox>
          <ChartLineToolTipSimpleSandbox
            id={'dcl-chartline-2'}
            className="mt-5"
            labelText={'Number Of Parcel Sales'}
            dataHandlder={req_ntfworlds_sold_total_stats}
            legend1={{ label: 'Land', color: [0, 191, 8] }}
            keyTypes={['land', 'estate']}
            textColor={style.nftColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Monthly',
                value: 'monthly',
              },
              {
                label: 'Quarterly',
                value: 'quarterly',
              },
            ]}
            tabState={showType}
          ></ChartLineToolTipSimpleSandbox>
          <StackBarZ
            id={'stackbar1'}
            className="mt-5"
            labelText={'Parcel Sales Amount'}
            dataHandler={req_ntfworlds_sold_sum_stats}
            legend1={{ label: 'Land', color: [132, 193, 14] }}
            keyTypes={['land', 'estate']}
            barWidth={18}
            isEth={true}
            showMarkerType="sandbox"
            textColor={style.nftColor}
            options={[
              {
                label: 'Monthly',
                value: 'monthly',
              },
              {
                label: 'Quarterly',
                value: 'quarterly',
              },
            ]}
            optionsPrice={[
              {
                label: 'USD',
                value: 'usd',
              },
              {
                label: 'ETH',
                value: 'eth',
              },
            ]}
            tabState={showType}
          ></StackBarZ>
        </>
      );
    }
    if (showType === 'worldwidewebb') {
      return (
        <>
          <ChartLineSandBox
            id={'chartline1'}
            labelText={'Average Parcel Price'}
            className="mt-5"
            legend1={{ label: 'Primary', color: [229, 68, 155] }}
            dataHandlder={req_webb_parcel_avg_price_stats}
            textColor={style.webbColor}
            options={[
              {
                label: 'Daily price',
                value: 'daily',
              },
              {
                label: 'Monthly price',
                value: 'monthly',
              },
              {
                label: 'Quarterly price',
                value: 'quarterly',
              },
            ]}
            priceOptions={[
              {
                label: 'USD',
                value: 'usd',
              },
              {
                label: 'ETH',
                value: 'eth',
              },
            ]}
            tabState={showType}
          ></ChartLineSandBox>
          <ChartLineToolTipSimpleSandbox
            id={'dcl-chartline-2'}
            className="mt-5"
            labelText={'Number Of Parcel Sales'}
            dataHandlder={req_webb_sold_total_stats}
            legend1={{ label: 'Land', color: [177, 51, 255] }}
            keyTypes={['land', 'estate']}
            textColor={style.webbColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Monthly',
                value: 'monthly',
              },
              {
                label: 'Quarterly',
                value: 'quarterly',
              },
            ]}
            tabState={showType}
          ></ChartLineToolTipSimpleSandbox>
          <StackBarZ
            id={'stackbar1'}
            className="mt-5"
            labelText={'Parcel Sales Amount'}
            dataHandler={req_webb_sold_sum_stats}
            legend1={{ label: 'Land', color: [229, 68, 155] }}
            keyTypes={['land', 'estate']}
            barWidth={18}
            isEth={true}
            showMarkerType="sandbox"
            textColor={style.webbColor}
            options={[
              {
                label: 'Monthly',
                value: 'monthly',
              },
              {
                label: 'Quarterly',
                value: 'quarterly',
              },
            ]}
            optionsPrice={[
              {
                label: 'USD',
                value: 'usd',
              },
              {
                label: 'ETH',
                value: 'eth',
              },
            ]}
            tabState={showType}
          ></StackBarZ>
        </>
      );
    }
    if (showType === 'otherside') {
      return (
        <>
          <ChartLineSandBox
            id={'chartline1'}
            labelText={'Average Parcel Price'}
            className="mt-5"
            legend1={{ label: 'Primary', color: [255, 248, 187] }}
            dataHandlder={req_otherside_avg_price}
            textColor={style.osdColor}
            options={[
              {
                label: 'Daily price',
                value: 'daily',
              },
              {
                label: 'Monthly price',
                value: 'monthly',
              },
              {
                label: 'Quarterly price',
                value: 'quarterly',
              },
            ]}
            priceOptions={[
              {
                label: 'USD',
                value: 'usd',
              },
              {
                label: 'ETH',
                value: 'eth',
              },
            ]}
            tabState={showType}
          ></ChartLineSandBox>
          <ChartLineToolTipSimpleSandbox
            id={'dcl-chartline-2'}
            className="mt-5"
            labelText={'Number Of Parcel Sales'}
            dataHandlder={req_otherside_sales_num}
            legend1={{ label: 'Land', color: [255, 248, 187] }}
            keyTypes={['land', 'estate']}
            textColor={style.osdColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Monthly',
                value: 'monthly',
              },
              {
                label: 'Quarterly',
                value: 'quarterly',
              },
            ]}
            tabState={showType}
          ></ChartLineToolTipSimpleSandbox>
          <StackBarZ
            id={'stackbar1'}
            className="mt-5"
            labelText={'Parcel Sales Amount'}
            dataHandler={req_otherside_sales_amount}
            legend1={{ label: 'Land', color: [255, 248, 187] }}
            keyTypes={['land', 'estate']}
            barWidth={18}
            isEth={true}
            showMarkerType="sandbox"
            textColor={style.osdColor}
            options={[
              {
                label: 'Monthly',
                value: 'monthly',
              },
              {
                label: 'Quarterly',
                value: 'quarterly',
              },
            ]}
            optionsPrice={[
              {
                label: 'USD',
                value: 'usd',
              },
              {
                label: 'ETH',
                value: 'eth',
              },
            ]}
            tabState={showType}
          ></StackBarZ>
        </>
      );
    }
  }, [showType]);

  const reander = React.useMemo(() => {
    if (headerNav === 'all') {
      return (
        <>
          <div className={cn('flex flex-col justify-center items-center', style.content)}>
            <div
              className={cn('w-full mt-7 p-5 flex flex-col justify-start items-center', style.list)}
            >
              <div className={style.topContainer}>
                <Annular
                  id="annular1"
                  labelText={'Parcel Sales Amount (USD)'}
                  dataHandlder={req_sales_amount_percent}
                  legend1={{ label: 'The Sandbox', color: [24, 147, 247] }}
                  legend2={{ label: 'NFT Worlds', color: [132, 193, 14] }}
                  legend3={{ label: 'Decentraland', color: [255, 107, 84] }}
                  legend4={{ label: 'Worldwide Webb', color: [229, 68, 155] }}
                  legend5={{ label: 'Voxels ', color: [244, 210, 191] }}
                  legend6={{ label: 'Somnium Space ', color: [250, 216, 23] }}
                  options={[
                    {
                      label: 'Month',
                      value: 'month',
                    },
                    {
                      label: 'Quarter',
                      value: 'quarter',
                    },
                    {
                      label: 'Year',
                      value: 'year',
                    },
                    {
                      label: 'All time',
                      value: 'all_time',
                    },
                  ]}
                  priceOptions={[
                    {
                      label: 'USD',
                      value: 'usd',
                    },
                    // {
                    //   label: 'ETH',
                    //   value: 'eth',
                    // },
                  ]}
                ></Annular>
                <Miniline
                  id="miniline1"
                  labelText={'Metaverse Real Estate Index（MREI) vs. ETH Price'}
                  dataHandlder={req_metaindex_ethprice}
                  legend1={{ label: 'MREI', color: [35, 208, 234] }}
                  legend2={{ label: 'ETH', color: [157, 125, 252] }}
                ></Miniline>
              </div>
              <div className={style.allLine}>
                <Allline
                  id="allline1"
                  labelText="Average Parcel Price"
                  dataHandlder={req_avg_parcel_price}
                  legend1={{ label: 'The Sandbox', color: [24, 147, 247] }}
                  legend2={{ label: 'NFT Worlds', color: [132, 193, 14] }}
                  legend3={{ label: 'Decentraland', color: [255, 107, 84] }}
                  legend4={{ label: 'Worldwide Webb', color: [229, 68, 155] }}
                  legend5={{ label: 'Voxels ', color: [244, 210, 191] }}
                  legend6={{ label: 'Somnium Space ', color: [250, 216, 23] }}
                  legend7={{ label: 'Otherside', color: [255, 248, 187] }}
                  options={[
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly',
                      value: 'quarterly',
                    },
                    // {
                    //   label: 'Year',
                    //   value: 'year',
                    // },
                  ]}
                  priceOptions={[
                    {
                      label: 'USD',
                      value: 'usd',
                    },
                    // {
                    //   label: 'ETH',
                    //   value: 'eth',
                    // },
                  ]}
                ></Allline>
              </div>
              <div className={style.allLine}>
                <AllPillar
                  id="allpillar1"
                  labelText="Parcel Sales Amount"
                  dataHandlder={req_sales_amount_stack}
                  legend1={{ label: 'The Sandbox', color: [24, 147, 247] }}
                  legend2={{ label: 'NFT Worlds', color: [132, 193, 14] }}
                  legend3={{ label: 'Decentraland', color: [255, 107, 84] }}
                  legend4={{ label: 'Worldwide Webb', color: [229, 68, 155] }}
                  legend5={{ label: 'Voxels ', color: [244, 210, 191] }}
                  legend6={{ label: 'Somnium Space ', color: [250, 216, 23] }}
                  legend7={{ label: 'Otherside', color: [255, 248, 187] }}
                  options={[
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly',
                      value: 'quarterly',
                    },
                    {
                      label: 'Yearly',
                      value: 'yearly',
                    },
                  ]}
                  priceOptions={[
                    {
                      label: 'USD',
                      value: 'usd',
                    },
                    // {
                    //   label: 'ETH',
                    //   value: 'eth',
                    // },
                  ]}
                ></AllPillar>
              </div>
              <div className={style.allLine}>
                <AllPillar2
                  id="allpillar2"
                  labelText="Number Of Parcel Sales"
                  dataHandlder={req_all_number_sales}
                  legend1={{ label: 'The Sandbox', color: [24, 147, 247] }}
                  legend2={{ label: 'NFT Worlds', color: [132, 193, 14] }}
                  legend3={{ label: 'Decentraland', color: [255, 107, 84] }}
                  legend4={{ label: 'Worldwide Webb', color: [229, 68, 155] }}
                  legend5={{ label: 'Voxels ', color: [244, 210, 191] }}
                  legend6={{ label: 'Somnium Space ', color: [250, 216, 23] }}
                  legend7={{ label: 'Otherside', color: [255, 248, 187] }}
                  options={[
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly',
                      value: 'quarterly',
                    },
                    {
                      label: 'Yearly',
                      value: 'yearly',
                    },
                  ]}
                ></AllPillar2>
              </div>
              <div className={cn('w-full h-auto mt-7', style.table)}>
                <div className={style.tabContainer}>
                  <AnalyticsInfo options={types} labelText={'Coprehensive Data'}></AnalyticsInfo>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    if (headerNav === 'single') {
      return (
        <>
          <div className={cn('flex flex-col justify-center items-center', style.content)}>
            <div
              className={cn(
                'w-full mt-7 p-5 flex flex-col justify-start items-center',
                style.chartList,
              )}
            >
              <div className={cn(style.tmbg, fixedState ? style.fixed : null)}>
                <div className={cn(style.bg)}>
                  <Switch
                    onActive={changeType}
                    options={types}
                    defaultValue={showType}
                    id="switch"
                    className={style.aboslute}
                    fixedS={fixedState}
                  ></Switch>
                </div>
              </div>
              {renderChartList}
            </div>
          </div>
        </>
      );
    }
  }, [headerNav, changeType, renderChartList, fixedState]);

  // const Top = React.useCallback(() => {
  //   Dtop.current =
  //   return Dtop.current
  // }, [Dtop])

  // React.useEffect(() => {
  //   if (Top() <= 0) {
  //     setFixedState(true)
  //   } else {
  //     setFixedState(false)
  //   }
  // }, [Top, Dtop.current])
  React.useEffect(() => {
    const listener = () => {
      if (
        document.getElementById('switch') &&
        document.getElementById('switch').getBoundingClientRect().top <= 10 &&
        window.scrollY > 432
      ) {
        setFixedState(true);
      } else {
        setFixedState(false);
      }
    };
    document.addEventListener('scroll', listener);
    return () => document.removeEventListener('scroll', listener);
  }, [fixedState]);

  React.useEffect(() => {
    if (props.query.type) {
      setHeaderNav(hNav[1].type);
    } else {
      setHeaderNav(hNav[0].type);
    }
  }, [props.query.type]);
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
        <div className={style.headerNav}>
          <div className={style.navContainer}>
            {hNav.map((nav) => {
              return (
                <div
                  className={cn(headerNav === nav.type ? style.nav : style.n)}
                  onClick={() => {
                    changeHeaderNav(nav.type);
                  }}
                >
                  {nav.value}
                </div>
              );
            })}
          </div>
        </div>
        <AnimationBack id="smoke" className="absolute w-full h-full top-0 left-0"></AnimationBack>
      </div>
      {reander}
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
