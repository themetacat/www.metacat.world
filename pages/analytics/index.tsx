import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import cn from 'classnames';

import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';

import Page from '../../components/page';

// import PageHeader from '../../components/page-header';
import PageHeader from '../../components/top-navigation';

import Footer from '../../components/footer';

import AnalyticsInfo from '../../components/analytics-info';

import AnalyticsInfoSale from '../../components/analytics-info-sale';

import AnalyticsAverage from '../../components/analytics-info-average';

import AnalyticsInfoNum from '../../components/analytics-info-num';

import SwiperTagSearch from '../../components/swiper-tagSearch';

import Tab from '../../components/hometabParcels';

import Switch from '../../components/switch';

import AnimationBack from '../../components/animation-back';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import JumpToAnalytics from '../../components/jump_to_analytics';

import TopJumper from '../../components/jump-to-top';

import {
  getCvTrafficStats,
  getCvParcelAvgPriceStats,
  getCvParcelSoldTotalStats,
  getCvParcelSoldSumStats,
  getCvMintStats,
  getCvParcelOwnerStats,
  getChartNftworlds,
  getchartSomniumSpace,
  getSandboxOwnerStats,
  getDclParcelAvgPriceStats,
  getDclParcelSoldSumStats,
  getchartOtherside,
  getDclParcelSoldTotalStats,
  getchartWebb,
  getDecentralandStats,
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
  req_netvrk_avg_price,
  req_aavegotchi_sales_num,
  req_aavegotchi_avg_price,
  req_netvrk_sales_num,
  req_netvrk_sales_amount,
  req_aavegotchi_sales_amount,
  req_avg_creater_price,
  req_sales_rent_sum_price,
  req_num_of_rent
} from '../../service/z_api';


import style from './index.module.css';

const BaseBar = dynamic(() => import(/* webpackPrefetch: true */ '../../components/base-bar'), {
  ssr: false,
});
const BaseVoxelsData = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/base_Voxels_Data'),
  {
    ssr: false,
  },
);
const BaseBarData = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/base-barData'),
  {
    ssr: false,
  },
);
const ChartLine = dynamic(() => import(/* webpackPrefetch: true */ '../../components/chart-line'), {
  ssr: false,
});
const StackBar = dynamic(() => import(/* webpackPrefetch: true */ '../../components/stack-bar'), {
  ssr: false,
});
const StackBarZ = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/stack-bar-z'),
  {
    ssr: false,
  },
);
const ChartLineSimple = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/chart-line-simple'),
  {
    ssr: false,
  },
);
const ChartNftworlds = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/chart-ChartNftworlds'),
  {
    ssr: false,
  },
);
const ChartLineToolTipSimple = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/chart-line-tooltip-simple'),
  {
    ssr: false,
  },
);
const ChartLineSandBox = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/chart-line-sandbox'),
  {
    ssr: false,
  },
);
const ChartOtherside = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/chart-otherside'),
  {
    ssr: false,
  },
);
const ChartLineToolTipSimpleSandbox = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/chart-line-tooltip-simple-sandbox'),
  { ssr: false },
);
const ChartWebb = dynamic(() => import(/* webpackPrefetch: true */ '../../components/chart-Webb'), {
  ssr: false,
});
const ChartSandBox = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/chart-sandBox'),
  { ssr: false },
);
const ChartSomniumSpace = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/chart-SomniumSpace'),
  { ssr: false },
);
const StackBarZ2 = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/stack-bar-z2'),
  { ssr: false },
);
const Annular = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/analytics_annular'),
  { ssr: false },
);
const Miniline = dynamic(() => import(/* webpackPrefetch: true */ '../../components/mini_line'), {
  ssr: false,
});
const Allline = dynamic(() => import(/* webpackPrefetch: true */ '../../components/all_line'), {
  ssr: false,
});
const AlllineData = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/all_line_data'),
  {
    ssr: false,
  },
);
const AllPillar2 = dynamic(
  () => import(/* webpackPrefetch: true */ '../../components/all_pillar2'),
  { ssr: false },
);
const AllPillar = dynamic(() => import(/* webpackPrefetch: true */ '../../components/all_pillar'), {
  ssr: false,
});
const AllPillarNum = dynamic(() => import(/* webpackPrefetch: true */ '../../components/all_pillarNum'), {
  ssr: false,
});
const AllPillarNum2 = dynamic(() => import(/* webpackPrefetch: true */ '../../components/all_pillarNum2'), {
  ssr: false,
});

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
  {
    label: 'Netvrk',
    icon: '/images/netvrk_logomark.svg',
    value: 'netvrk',
  },
  {
    label: 'Aavegotchi',
    icon: 'https://www.aavegotchi.com/img/brand/sun.png',
    value: 'aavegotchi',
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
  const headerRef = React.useRef(null)
  const [showType, setShowType] = React.useState(props.query.type || 'cryptovoxels');
  const [fixedState, setFixedState] = React.useState(false);
  const [fixedStateAll, setFixedStateAll] = React.useState(false);
  const [offsetWidthNum, setOffsetWidthNum] = React.useState(0);
    const [tabPercent, setTabPercent] = React.useState(0);
  const [headerNav, setHeaderNav] = React.useState(props.query.type ? hNav[1].type : hNav[0].type);
  const changeType = React.useCallback((newType) => {
    setShowType(newType);

    // router.replace(`/analytics?type=${newType}`);
    if (newType) {
      router.replace(`/analytics?type=${newType}`);
    }
  }, []);



  const changeHeaderNav = React.useCallback(
    (nav) => {

      if (nav === 'single') {
        router.replace('/analytics?type=cryptovoxels')
        // router.replace(`/analytics?type=${showType}`);
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
          <BaseVoxelsData
            id={'stackbar'}
            className="mt-5"
            labelText={'Traffic'}
            dataHandler={getCvTrafficStats}
            barWidth={18}
            textColor={style.cvColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
          ></BaseVoxelsData>
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
                label: 'Weekly price',
                value: 'weekly',
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
            labelText={'Number of Parcel Sales'}
            dataHandler={getCvParcelSoldTotalStats}
            barWidth={18}
            textColor={style.cvColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
            labelText={'Total Number of Landlords At The End of Each Month'}
            dataHandlder={getCvParcelOwnerStats}
            defaultColor={[255, 224, 206]}
            textColor={style.cvColor}
          ></ChartLineSimple>
        </>
      );
    }

    if (showType === 'decentraland') {
      return (
        <>
          <BaseBarData
            id={'stackbar'}
            className="mt-5"
            labelText={'Traffic'}
            dataHandler={getDecentralandStats}
            barWidth={18}
            textColor={style.cvColor}
            legend2={{ label: '', color: [225, 110, 92] }}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
          ></BaseBarData>

          <ChartLine
            id={'dcl-chartline-1'}
            className="mt-5"
            labelText={'Average Parcel Price'}
            dataHandlder={getDclParcelAvgPriceStats}
            legend1={{ label: 'Separate Land', color: [240, 117, 97] }}
            legend2={{ label: 'Land in Estate', color: [255, 190, 114] }}
            keyTypes={['land', 'estate']}
            textColor={style.dclColor}
            options={[
              {
                label: 'Daily price',
                value: 'daily',
              },
              {
                label: 'Weekly price',
                value: 'weekly',
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
              {
                label: 'MANA',
                value: 'mana',
              },
            ]}
          ></ChartLine>
          <ChartLineToolTipSimple
            id={'dcl-chartline-2'}
            className="mt-5"
            labelText={'Number of Parcel Sales'}
            dataHandlder={getDclParcelSoldTotalStats}
            legend1={{ label: 'Land', color: [240, 117, 97] }}
            legend2={{ label: 'Estate', color: [255, 190, 114] }}
            keyTypes={['land', 'estate']}
            textColor={style.dclColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
          ></ChartLineToolTipSimple>
          <>
            <span className="hidden"></span>
            <StackBarZ2
              id={'stackbar1'}
              className="mt-5"
              labelText={'Parcel Sales Amount'}
              dataHandler={getDclParcelSoldSumStats}
              legend1={{ label: 'Land', color: [240, 117, 97] }}
              legend2={{ label: 'Estate', color: [255, 190, 114] }}
              keyTypes={['land', 'estate']}
              barWidth={18}
              isEth={true}
              textColor={style.dclColor}
              options={[
                {
                  label: 'Daily',
                  value: 'daily',
                },
                {
                  label: 'Weekly',
                  value: 'weekly',
                },
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
              optionsPrice={[
                {
                  label: 'USD',
                  value: 'usd',
                },
                {
                  label: 'ETH',
                  value: 'eth',
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
              labelText={'Total Number of Landlords At The End of Each Month'}
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
            legend1={{ label: 'Primary', color: [119, 152, 238] }}
            textColor={style.sandboxColor}
            options={[
              {
                label: 'Daily price',
                value: 'daily',
              },
              {
                label: 'Weekly price',
                value: 'weekly',
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
            labelText={'Number of Parcel Sales'}
            dataHandlder={req_sandbox_sold_total_stats}
            legend1={{ label: 'Land', color: [42, 97, 237] }}
            keyTypes={['land', 'estate']}
            textColor={style.sandboxColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
            tabState={showType}
          ></ChartLineToolTipSimpleSandbox>
          <StackBarZ
            id={'stackbar1'}
            className="mt-5"
            labelText={'Parcel Sales Amount'}
            dataHandler={req_sandbox_sold_sun_stats}
            legend1={{ label: 'Land', color: [119, 152, 238] }}
            keyTypes={['land', 'estate']}
            barWidth={18}
            isEth={true}
            showMarkerType="sandbox"
            textColor={style.sandboxColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
          <ChartSandBox
            id={'chartlinesimple'}
            className="mt-5"
            labelText={'Total Number of Landlords At The End of Each Month'}
            dataHandlder={getSandboxOwnerStats}
            defaultColor={[119, 152, 238]}
            textColor={style.sandboxColor}
          ></ChartSandBox>
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
                  label: 'Weekly price',
                  value: 'weekly',
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
              labelText={'Number of Parcel Sales'}
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
                  label: 'Weekly',
                  value: 'weekly',
                },
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
                  label: 'Daily',
                  value: 'daily',
                },
                {
                  label: 'Weekly',
                  value: 'weekly',
                },
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
            <ChartSomniumSpace
              id={'charnftworlds'}
              className="mt-5"
              labelText={'Total Number of Landlords At The End of Each Month'}
              dataHandlder={getchartSomniumSpace}
              defaultColor={[194, 157, 135]}
              textColor={style.cvColor}
            ></ChartSomniumSpace>
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
            legend1={{ label: 'Primary', color: [175, 234, 101] }}
            textColor={style.nftColor}
            options={[
              {
                label: 'Daily price',
                value: 'daily',
              },
              {
                label: 'Weekly price',
                value: 'weekly',
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
            labelText={'Number of Parcel Sales'}
            dataHandlder={req_ntfworlds_sold_total_stats}
            legend1={{ label: 'Land', color: [33, 238, 29] }}
            keyTypes={['land', 'estate']}
            textColor={style.nftColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
            tabState={showType}
          ></ChartLineToolTipSimpleSandbox>
          <StackBarZ
            id={'stackbar1'}
            className="mt-5"
            labelText={'Parcel Sales Amount'}
            dataHandler={req_ntfworlds_sold_sum_stats}
            legend1={{ label: 'Land', color: [175, 234, 101] }}
            keyTypes={['land', 'estate']}
            barWidth={18}
            isEth={true}
            showMarkerType="sandbox"
            textColor={style.nftColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
          <ChartNftworlds
            id={'charnftworlds'}
            className="mt-5"
            labelText={'Total Number of Landlords At The End of Each Month'}
            dataHandlder={getChartNftworlds}
            defaultColor={[175, 234, 101]}
            textColor={style.nftColor}
          ></ChartNftworlds>
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
            legend1={{ label: 'Primary', color: [245, 120, 157] }}
            dataHandlder={req_webb_parcel_avg_price_stats}
            textColor={style.webbColor}
            options={[
              {
                label: 'Daily price',
                value: 'daily',
              },
              {
                label: 'Weekly price',
                value: 'weekly',
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
            labelText={'Number of Parcel Sales'}
            dataHandlder={req_webb_sold_total_stats}
            legend1={{ label: 'Land', color: [244, 68, 79] }}
            keyTypes={['land', 'estate']}
            textColor={style.webbColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
            tabState={showType}
          ></ChartLineToolTipSimpleSandbox>
          <StackBarZ
            id={'stackbar1'}
            className="mt-5"
            labelText={'Parcel Sales Amount'}
            dataHandler={req_webb_sold_sum_stats}
            legend1={{ label: 'Land', color: [245, 120, 157] }}
            keyTypes={['land', 'estate']}
            barWidth={18}
            isEth={true}
            showMarkerType="sandbox"
            textColor={style.webbColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
          <ChartWebb
            id={'chartworldwidewebb'}
            className="mt-5"
            labelText={'Total Number of Landlords At The End of Each Month'}
            dataHandlder={getchartWebb}
            defaultColor={[245, 120, 157]}
            textColor={style.webbColor}
          ></ChartWebb>
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
            textColor={style.othersideColor}
            options={[
              {
                label: 'Daily price',
                value: 'daily',
              },
              {
                label: 'Weekly price',
                value: 'weekly',
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
            labelText={'Number of Parcel Sales'}
            dataHandlder={req_otherside_sales_num}
            legend1={{ label: 'Land', color: [237, 195, 133] }}
            keyTypes={['land', 'estate']}
            textColor={style.othersideColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
            textColor={style.othersideColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
          <ChartOtherside
            id={'charnftworlds'}
            className="mt-5"
            labelText={'Total Number of Landlords At The End of Each Month'}
            dataHandlder={getchartOtherside}
            defaultColor={[194, 157, 135]}
            textColor={style.othersideColor}
          ></ChartOtherside>
        </>
      );
    }
    if (showType === 'netvrk') {
      return (
        <>
          <ChartLineSandBox
            id={'netvrk1'}
            labelText={'Average Parcel Price'}
            className="mt-5"
            legend1={{ label: 'Primary', color: [196, 148, 254] }}
            dataHandlder={req_netvrk_avg_price}
            textColor={style.osdColor}
            options={[
              {
                label: 'Daily price',
                value: 'daily',
              },
              {
                label: 'Weekly price',
                value: 'weekly',
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
            id={'netvrk2'}
            className="mt-5"
            labelText={'Number of Parcel Sales'}
            dataHandlder={req_netvrk_sales_num}
            legend1={{ label: 'Land', color: [148, 159, 254] }}
            keyTypes={['land', 'estate']}
            textColor={style.osdColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
            tabState={showType}
          ></ChartLineToolTipSimpleSandbox>
          <StackBarZ
            id={'netvrk3'}
            className="mt-5"
            labelText={'Parcel Sales Amount'}
            dataHandler={req_netvrk_sales_amount}
            legend1={{ label: 'Land', color: [196, 148, 254] }}
            keyTypes={['land', 'estate']}
            barWidth={18}
            isEth={true}
            showMarkerType="sandbox"
            textColor={style.osdColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
    if (showType === 'aavegotchi') {
      return (
        <>
          <ChartLineSandBox
            id={'netvrk1'}
            labelText={'Average Parcel Price'}
            className="mt-5"
            legend1={{ label: 'Primary', color: [196, 148, 254] }}
            dataHandlder={req_aavegotchi_avg_price}
            textColor={style.osdColor}
            options={[
              {
                label: 'Daily price',
                value: 'daily',
              },
              {
                label: 'Weekly price',
                value: 'weekly',
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
            id={'netvrk2'}
            className="mt-5"
            labelText={'Number of Parcel Sales'}
            dataHandlder={req_aavegotchi_sales_num}
            legend1={{ label: 'Land', color: [148, 159, 254] }}
            keyTypes={['land', 'estate']}
            textColor={style.osdColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
            tabState={showType}
          ></ChartLineToolTipSimpleSandbox>
          <StackBarZ
            id={'netvrk3'}
            className="mt-5"
            labelText={'Parcel Sales Amount'}
            dataHandler={req_aavegotchi_sales_amount}
            legend1={{ label: 'Land', color: [196, 148, 254] }}
            keyTypes={['land', 'estate']}
            barWidth={18}
            isEth={true}
            showMarkerType="sandbox"
            textColor={style.osdColor}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
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
                  textColor={style.allColor}
                  legend1={{ label: 'The Sandbox', color: [119, 152, 238] }}
                  legend2={{ label: 'Netvrk', color: [192, 151, 234] }}
                  legend3={{ label: 'NFT Worlds', color: [175, 234, 101] }}
                  legend4={{ label: 'Somnium ', color: [240, 201, 124] }}
                  legend5={{ label: 'Otherside', color: [255, 248, 187] }}
                  legend6={{ label: 'Decentraland', color: [240, 117, 97] }}
                  legend7={{ label: 'Worldwide Webb', color: [245, 120, 157] }}
                  legend8={{ label: 'Voxels ', color: [244, 210, 191] }}
                  legend9={{ label: 'Cryptovoxels ', color: [255, 224, 206] }}
                  options={[
                    {
                      label: 'Day',
                      value: 'day',
                    },
                    {
                      label: 'Week',
                      value: 'week',
                    },
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
                  textColor={style.allColor}
                  legend1={{ label: 'MREI', color: [0, 236, 179,] }}
                  legend2={{ label: 'ETH', color: [0, 208, 236] }}
                ></Miniline>
              </div>
              <div className={style.allLine}>
                <Allline
                  id="allline1"
                  textColor={style.allColor}
                  labelText="Average Parcel Price"
                  dataHandlder={req_avg_parcel_price}
                  legend1={{ label: 'Otherside', color: [255, 248, 187] }}
                  legend2={{ label: 'The Sandbox', color: [119, 152, 238] }}
                  legend3={{ label: 'NFT Worlds', color: [175, 234, 101] }}
                  legend4={{ label: 'Decentraland', color: [240, 117, 97] }}
                  legend5={{ label: 'Worldwide Webb', color: [245, 120, 157] }}
                  legend6={{ label: 'Voxels ', color: [244, 210, 191] }}
                  legend7={{ label: 'Somnium ', color: [240, 201, 124] }}
                  legend8={{ label: 'Netvrk', color: [192, 151, 234] }}
                  options={[
                    {
                      label: 'Daily',
                      value: 'daily',
                    },
                    {
                      label: 'Weekly',
                      value: 'weekly',
                    },
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
                    {
                      label: 'ETH',
                      value: 'eth',
                    },
                  ]}
                ></Allline>
              </div>
              <div className={style.allLine}>
                <AllPillar
                  id="allpillar1"
                  textColor={style.allColor}
                  labelText="Parcel Sales Amount"
                  dataHandlder={req_sales_amount_stack}
                  legend1={{ label: 'Otherside', color: [255, 248, 187] }}
                  legend2={{ label: 'The Sandbox', color: [119, 152, 238] }}
                  legend3={{ label: 'NFT Worlds', color: [175, 234, 101] }}
                  legend4={{ label: 'Decentraland', color: [240, 117, 97] }}
                  legend5={{ label: 'Worldwide Webb', color: [245, 120, 157] }}
                  legend6={{ label: 'Voxels ', color: [244, 210, 191] }}
                  legend7={{ label: 'Somnium ', color: [240, 201, 124] }}
                  legend8={{ label: 'Netvrk', color: [192, 151, 234] }}
                  options={[
                    {
                      label: 'Daily',
                      value: 'daily',
                    },
                    {
                      label: 'Weekly',
                      value: 'weekly',
                    },
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
                    {
                      label: 'ETH',
                      value: 'eth',
                    },
                  ]}
                ></AllPillar>
              </div>
              <div className={style.allLine}>
                <AllPillar2
                  id="allpillar2"
                  textColor={style.allColor}
                  labelText="Number of Parcel Sales"
                  dataHandlder={req_all_number_sales}
                  legend1={{ label: 'Otherside', color: [255, 248, 187] }}
                  legend2={{ label: 'The Sandbox', color: [119, 152, 238] }}
                  legend3={{ label: 'NFT Worlds', color: [175, 234, 101] }}
                  legend4={{ label: 'Decentraland', color: [240, 117, 97] }}
                  legend5={{ label: 'Worldwide Webb', color: [245, 120, 157] }}
                  legend6={{ label: 'Voxels ', color: [244, 210, 191] }}
                  legend7={{ label: 'Somnium ', color: [240, 201, 124] }}
                  legend8={{ label: 'Netvrk', color: [192, 151, 234] }}
                  options={[
                    {
                      label: 'Daily',
                      value: 'daily',
                    },
                    {
                      label: 'Weekly',
                      value: 'weekly',
                    },
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
              <div className={style.allLine}>
                <AlllineData
                  id="allline2"
                  labelText="Floor Price"
                  textColor={style.allColor}
                  dataHandlder={req_avg_creater_price}
                  legend1={{ label: 'Otherside', color: [255, 248, 187] }}
                  legend2={{ label: 'The Sandbox', color: [119, 152, 238] }}
                  legend3={{ label: 'NFT Worlds', color: [175, 234, 101] }}
                  legend4={{ label: 'Decentraland', color: [240, 117, 97] }}
                  legend5={{ label: 'Worldwide Webb', color: [245, 120, 157] }}
                  legend6={{ label: 'Voxels ', color: [244, 210, 191] }}
                  legend7={{ label: 'Somnium ', color: [240, 201, 124] }}
                  legend8={{ label: 'Netvrk', color: [192, 151, 234] }}
                  options={[
                    {
                      label: 'Daily',
                      value: 'daily',
                    },
                  ]}
                  priceOptions={[
                    {
                      label: 'ETH',
                      value: 'eth',
                    },
                  ]}
                ></AlllineData>
              </div>

              <div className={cn('w-full h-auto mt-7', style.table)}>
                <div className={style.tabContainer}>
                  <AnalyticsInfo options={types} labelText={'Comprehensive Data'} textColor={style.allColor}></AnalyticsInfo>
                </div>
              </div>
              <div className={cn('w-full h-auto mt-7', style.table)}>
                <div className={style.tabContainer}>
                  <AnalyticsInfoSale options={types} labelText={'Parcel Sales Amount'} textColor={style.allColor}></AnalyticsInfoSale>
                </div>
              </div>
              <div className={cn('w-full h-auto mt-7', style.tableBox)}>
                <div className={style.tabContainer}>
                  <AnalyticsAverage options={types} labelText={'Average Parcel Price'} textColor={style.allColor}
                    priceOptions={[
                      {
                        label: 'USD',
                        value: 'USD',
                      },
                      {
                        label: 'ETH',
                        value: 'ETH',
                      },
                    ]}
                  ></AnalyticsAverage>
                </div>
                <div className={style.tabContainer} style={{ marginLeft: "20px" }}>
                  <AnalyticsInfoNum options={types} labelText={'Number Of Parcel Sales'} textColor={style.allColor}></AnalyticsInfoNum>
                </div>
              </div>
              <div className={style.allLine}>
                <AllPillarNum
                  id="allpillarNum"
                  textColor={style.allColor}
                  labelText="Parcel Rent Amount(Data Source"
                  imgBox={'data:image/png;base64,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'}
                  toLink={'https://landworks.xyz/'}
                  dataHandlder={req_sales_rent_sum_price}
                  // legend1={{ label: 'Otherside', color: [255, 248, 187] }}
                  // legend2={{ label: 'The Sandbox', color: [119, 152, 238] }}
                  // legend3={{ label: 'NFT Worlds', color: [175, 234, 101] }}
                  legend4={{ label: 'Decentraland', color: [240, 117, 97] }}
                  // legend5={{ label: 'Worldwide Webb', color: [245, 120, 157] }}
                  legend6={{ label: 'Voxels ', color: [244, 210, 191] }}
                  // legend7={{ label: 'Somnium ', color: [240, 201, 124] }}
                  // legend8={{ label: 'Netvrk', color: [192, 151, 234] }}
                  options={[
                    // {
                    //   label: 'Daily',
                    //   value: 'daily',
                    // },
                    {
                      label: 'Weekly',
                      value: 'weekly',
                    },
                    // {
                    //   label: 'Monthly',
                    //   value: 'monthly',
                    // },
                    // {
                    //   label: 'Quarterly',
                    //   value: 'quarterly',
                    // },
                    // {
                    //   label: 'Yearly',
                    //   value: 'yearly',
                    // },
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
                ></AllPillarNum>

              </div>
              <div className={style.allLine}>
                <AllPillarNum2
                  id="allpillarNum2"
                  textColor={style.allColor}
                  labelText="Number of Parcel Rent(Data Source"
                  imgBox={'data:image/png;base64,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'}
                  toLink={'https://landworks.xyz/'}
                  dataHandlder={req_num_of_rent}
                  // legend1={{ label: 'Otherside', color: [255, 248, 187] }}
                  // legend2={{ label: 'The Sandbox', color: [119, 152, 238] }}
                  // legend3={{ label: 'NFT Worlds', color: [175, 234, 101] }}
                  legend4={{ label: 'Decentraland', color: [240, 117, 97] }}
                  // legend5={{ label: 'Worldwide Webb', color: [245, 120, 157] }}
                  legend6={{ label: 'Voxels ', color: [244, 210, 191] }}
                  // legend7={{ label: 'Somnium ', color: [240, 201, 124] }}
                  // legend8={{ label: 'Netvrk', color: [192, 151, 234] }}
                  options={[
                    // {
                    //   label: 'Daily',
                    //   value: 'daily',
                    // },
                    {
                      label: 'Weekly',
                      value: 'weekly',
                    },
                    // {
                    //   label: 'Monthly',
                    //   value: 'monthly',
                    // },
                    // {
                    //   label: 'Quarterly',
                    //   value: 'quarterly',
                    // },
                    // {
                    //   label: 'Yearly',
                    //   value: 'yearly',
                    // },
                  ]}
                // priceOptions={[
                //   {
                //     label: 'USD',
                //     value: 'usd',
                //   },
                //   {
                //     label: 'ETH',
                //     value: 'eth',
                //   },
                // ]}
                ></AllPillarNum2>

              </div>
            </div>
          </div>
          <TopJumper></TopJumper>
        </>
      );
    }
    if (headerNav === 'single') {
      
      return (
        <>
          <div className={cn(style.tmbg,)}>
            <Switch
              onActive={changeType}
              options={types}
              defaultValue={showType}
              id="switch"
              className={offsetWidthNum <= 1200 ? style.headNum : style.aboslute}
              fixedS={fixedState}
            ></Switch>
            
            {/* <div
                className={cn(
                  'n absolute z-40  flex justify-end items-center',
                  {
                    hidden: tabPercent >= 1,
                  },
                  style.next,
                )}
              >
                <img className={style.icon} src="/images/tab-right.png"></img>
              </div> */}
          </div>
          <div className={cn('flex flex-col justify-center items-center', style.content)}>
            <div
              className={cn(
                'w-full mt-7 p-5 flex flex-col justify-start items-center',
                style.chartList,
              )}
              style={{ marginTop: "25px" }}
            >
              {renderChartList}
            </div>
          </div>
          <JumpToAnalytics></JumpToAnalytics>
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
  console.log(tabPercent);
  

  React.useEffect(() => {

    if (props.query.type) {
      setHeaderNav(hNav[1].type);
    } else {
      setHeaderNav(hNav[0].type);
    }
  }, [props.query.type]);

  React.useEffect(() => {
    const listener = () => {
      if (
        document.getElementById('switch') &&
        // document.getElementById('switch').getBoundingClientRect().top <= 10 &&
        window.scrollY > 350
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
    setOffsetWidthNum(headerRef?.current?.clientWidth)
    const listener = () => {
      if (
        document.querySelector('.myClassName') &&
        document.querySelector('.myClassName').getBoundingClientRect().top <= 10 &&
        window.scrollY > 0
      ) {
        setFixedStateAll(true);

      } else {
        setFixedStateAll(false);
      }
    };
    document.addEventListener('scroll', listener);
    return () => document.removeEventListener('scroll', listener);
  }, [fixedStateAll, offsetWidthNum]);
// console.log(headerNav,"headerNav",fixedStateAll);

  return (
    <Page className={cn('min-h-screen', offsetWidthNum <= 1200 ? style.anPage1 : style.anPage,)} meta={meta}>
      <div  className={cn('myClassName', fixedStateAll === true ? style.a : null)} ref={headerRef}>
        <PageHeader active={'analytics'} />
      </div>

      <div className="bg-black relative">

        <div
          className={cn(
            'main-content flex justify-center items-end relative z-10 pointer-events-none',
            style.signBack,
          )}
        >
          <img src="/images/analyticsBack.png" className={style.sign}></img>
        </div>
        <div className={cn('', style.headerNav,

        )}>
          <div
            className={cn(style.navContainer,)}>
            {hNav.map((nav) => {
              return (
                <div
                  className={cn(headerNav === nav.type ? style.nav : style.n,)}
                  onClick={() => {
                    changeHeaderNav(nav.type);
                  }}
                  id='navContainer'

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
