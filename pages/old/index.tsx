import React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { v4 as uuid } from 'uuid';
import dynamic from 'next/dynamic';

import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import Page from '../../components/page';
import Layout from '../../components/layout';
import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import { convert, getToken, setToken } from '../../common/utils';

import Tab from '../../components/home_tab';
import SecondTab from '../../components/tab2';
import Card from '../../components/card';
import SwiperTag from '../../components/swiper-tag';
import PagiNation from '../../components/pagination';
import Search from '../../components/search';
import PostGrid from '../../components/post-grid';
import Status from '../../components/status';
import TopJumper from '../../components/jump-to-top';
import TopicCardList from '../../components/topic-card-list';

import BaseChart from '../../components/base-chart';
import BaseBar from '../../components/base-bar';
import StackBar from '../../components/stack-bar';
import ChartLine from '../../components/chart-line';
import ChartLineToolTipSimple from '../../components/chart-line-tooltip-simple';
import ChartLineSandBox from '../../components/chart-line-sandbox';
import StackBarZ from '../../components/stack-bar-z';
import ChartLineToolTipSimpleSandbox from '../../components/chart-line-tooltip-simple-sandbox';
import { useWalletProvider } from '../../components/web3modal';
import StackBarZ2 from '../../components/stack-bar-z2';

import { state } from '../../components/wallet-btn';

import {
  getCVEventList,
  getCVParcelList,
  getDCLEventList,
  getDCLParcelList,
  getTopicList,
  getCvParcelSoldTotalStats,
  getCvTrafficStats,
  getCvParcelAvgPriceStats,
  getDclParcelAvgPriceStats,
  getDclParcelSoldSumStats,
  getDclParcelSoldTotalStats,
  refreshToken,
  getBaseInfo,
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
  req_otherside_avg_price,
  req_otherside_sales_num,
  req_otherside_sales_amount,
  req_netvrk_avg_price,
  req_netvrk_sales_num,
  req_netvrk_sales_amount,
} from '../../service/z_api';

import style from './index.module.less';

const MapWithNoSSR = dynamic(() => import('../../components/map'), {
  ssr: false,
});

const DCLMapWithNoSSR = dynamic(() => import('../../components/decentraland-map'), {
  ssr: false,
});

const SandboxMap = dynamic(() => import('../../components/sandbox-map'), {
  ssr: false,
});

const SomniumMap = dynamic(() => import('../../components/somnium-map'), {
  ssr: false,
});

const OtherSideMap = dynamic(() => import('../../components/otherside-map'), {
  ssr: false,
});

const TAB = [
  {
    label: 'Voxels',
    icon: '/images/cvLogo.png',
    type: 'cryptovoxels',
  },
  {
    label: 'Decentraland',
    icon: '/images/Decentraland.jpg',
    type: 'decentraland',
  },
  {
    label: 'The Sandbox',
    icon: '/images/home-icon.svg',
    type: 'sandbox',
  },
  {
    label: 'Somnium Space',
    icon: '/images/somniumspace.png',
    type: 'somniumspace',
  },
  {
    label: 'NFT Worlds',
    icon: '/images/worlds.svg',
    type: 'nftworlds',
  },
  {
    label: 'Worldwide Webb',
    icon: '/images/unnamed.svg',
    type: 'worldwidewebb',
  },
  {
    label: 'Otherside',
    icon: '/images/osd.png',
    type: 'otherside',
  },
  {
    label: 'Netvrk',
    icon: '/images/netvrk_logomark.svg',
    type: 'netvrk',
  },
];

const SUBTAB = [
  {
    label: 'Parcel',
    type: 'parcel',
  },
  {
    label: 'Heatmap',
    type: 'map',
  },
  {
    label: 'Analytics',
    type: 'analytics',
  },
  {
    label: 'Events',
    type: 'event',
  },
];
const SUBTABZ = [
  {
    label: 'Analytics',
    type: 'analytics',
  },
];
const SUBTABZ2 = [
  {
    label: 'Heatmap',
    type: 'map',
  },
  {
    label: 'Analytics',
    type: 'analytics',
  },
];

export default function Index(props) {
  const meta = {
    title: `Home - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [tabState, setTabState] = React.useState(props.query.tab || 'cryptovoxels');
  const [subTabState, setSubTabState] = React.useState(props.query.subTab || 'parcel');
  const [totalPage, setTotalPage] = React.useState(1);
  const [noData, setNoData] = React.useState(false);
  const [searchText, setSearchText] = React.useState(props.query.search || '');
  const [typeState, setTypeState] = React.useState(props.query.type || 'all');
  const [typeList, setTypeList] = React.useState([]);
  const [topicList, setTopicList] = React.useState([]);
  const nextCursor = React.useRef(1);

  const [dataSource, setDataSource] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const [percent, setPercent] = React.useState(0);
  const [tabPercent, setTabPercent] = React.useState(0);

  const web3 = useWalletProvider();

  const requestData = async ({
    tab,
    subTab,
    page,
    query = '',
    type,
    needUpdateTypeList = false,
  }): Promise<any[]> => {
    let data = [];
    setLoading(true);
    setError(false);

    try {
      if (tab === 'cryptovoxels') {
        if (subTab === 'parcel') {
          const res = await getCVParcelList(page, 50, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          const typeArray = Object.keys(type_total).map((key) => {
            const value = type_total[key];
            return { name: key, value };
          });

          // setPageNumber(currentPage);
          setTotalPage(total_page);

          if (needUpdateTypeList) {
            setTypeList(typeArray);
          }
          data = parcel_list;
        } else if (subTab === 'event') {
          const res = await getCVEventList(nextCursor.current, 10);
          const { cursor, count, event_list } = res.data;
          nextCursor.current = cursor;

          if (event_list.length === 0) {
            setNoData(true);
          } else {
            setNoData(false);
          }

          data = event_list;
        }
      } else if (tab === 'decentraland') {
        if (subTab === 'parcel') {
          const res = await getDCLParcelList(page, 50, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          // setPageNumber(currentPage);
          setTotalPage(total_page);

          const typeArray = Object.keys(type_total).map((key) => {
            const value = type_total[key];
            return { name: key, value };
          });

          if (needUpdateTypeList) {
            setTypeList(typeArray);
          }
          data = parcel_list;
        } else if (subTab === 'event') {
          const res = await getDCLEventList(nextCursor.current, 10);
          const { cursor, event_list } = res.data;
          nextCursor.current = cursor;

          if (event_list.length === 0) {
            setNoData(true);
          } else {
            setNoData(false);
          }

          data = event_list;
        }
      }
    } catch (err) {
      setError(true);
    }

    setLoading(false);
    return convert(data);
  };

  const onTabChange = async (tab) => {
    setTabState(tab);
    let sub = '';
    if (tab === 'cryptovoxels' || tab === 'decentraland') {
      sub = subTabState;
    } else if (
      tab === 'nftworlds' ||
      tab === 'worldwidewebb' ||
      // tab === 'otherside' ||
      tab === 'netvrk'
    ) {
      sub = SUBTABZ[0].type;
      setSubTabState(SUBTABZ[0].type);
    } else if (tab === 'sandbox' || tab === 'somniumspace' || tab === 'otherside') {
      if (SUBTABZ2.find((item) => item.type === subTabState)) {
        sub = SUBTABZ2.find((item) => item.type === subTabState).type;
        setSubTabState(sub);
      } else if (SUBTABZ2.find((item) => item.type !== subTabState)) {
        sub = SUBTABZ2[0].type;
        setSubTabState(SUBTABZ2[0].type);
      }
    } else {
      return;
    }
    // if (subTabState === 'map') {
    //   sub = 'parcel';
    //   setSubTabState(sub);
    // }
    setSearchText('');
    setTypeState('all');
    nextCursor.current = 1;
    const data = await requestData({
      tab,
      subTab: sub,
      page: 1,
      query: '',
      type: '',
      needUpdateTypeList: true,
    });
    setDataSource(data);
  };
  const onSubTabChange = React.useCallback(
    async (subTab) => {
      setSubTabState(subTab);
      setSearchText('');
      setTypeState('');

      const data = await requestData({
        tab: tabState,
        subTab,
        page: 1,
        query: '',
        type: '',
        needUpdateTypeList: true,
      });
      setDataSource(data);
    },
    [tabState, searchText, typeState],
  );

  const onTypeChangeHandler = React.useCallback(
    async (type: string) => {
      setTypeState(type);

      const data = await requestData({
        tab: tabState,
        subTab: subTabState,
        page: 1,
        query: searchText,
        type,
      });

      setDataSource(data);
    },
    [tabState, subTabState, searchText],
  );

  const onPageChangeHandler = React.useCallback(
    async (number: number) => {
      const requestNumber = number + 1;
      const data = await requestData({
        tab: tabState,
        subTab: subTabState,
        page: requestNumber,
        query: searchText,
        type: typeState,
      });
      setPageNumber(requestNumber);
      setDataSource(data);
    },
    [tabState, subTabState, typeState, searchText],
  );

  const onSearchHandler = React.useCallback(
    async (text: string) => {
      setSearchText(text);
      const data = await requestData({
        tab: tabState,
        subTab: subTabState,
        query: text,
        page: 1,
        type: typeState,
        needUpdateTypeList: true,
      });

      setDataSource(data);
    },
    [tabState, subTabState, typeState],
  );

  const loadMore = React.useCallback(
    async (defaultPage?: number) => {
      if (dataSource.length === 0) return;
      const list = await requestData({
        tab: tabState,
        subTab: subTabState,
        page: defaultPage || 1,
        query: searchText,
        type: typeState,
      });
      if (list.length === 0) {
        setHasMore(false);
        return;
      }
      setDataSource([...dataSource, ...list]);
      setPageNumber((defaultPage || pageNumber) + 1);
      setHasMore(true);
    },
    [pageNumber, hasMore, tabState, subTabState, searchText, typeState, dataSource],
  );

  const onRetry = React.useCallback(async () => {
    const data = await requestData({
      tab: tabState,
      subTab: subTabState,
      page: pageNumber,
      query: searchText,
      type: typeState,
      needUpdateTypeList: true,
    });
    setDataSource(data);
  }, [tabState, subTabState, pageNumber, searchText, typeState]);

  const renderContent = React.useMemo(() => {
    if (subTabState === 'parcel') {
      if (loading) {
        return <Status status="loading" />;
      }

      if (error) {
        return <Status retry={onRetry} status="error" />;
      }

      if (dataSource.length === 0) {
        return <Status status="empty" />;
      }
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-7">
            {dataSource.map((card, idx) => {
              return <Card {...card} key={uuid()}></Card>;
            })}
          </div>
          <PagiNation
            total={totalPage}
            pageNumber={pageNumber - 1}
            pageSize={9}
            pageChange={onPageChangeHandler}
          />
        </>
      );
    }
    if (subTabState === 'event') {
      if (error) {
        return (
          <div className="grid grid-cols-1 gap-8 my-7">
            <PostGrid loadMore={loadMore} hasMore={hasMore} events={dataSource} />

            <Status retry={onRetry} status="error" />
          </div>
        );
      }

      if (dataSource.length === 0) {
        return <Status status="empty" />;
      }

      return (
        <div className="grid grid-cols-1 gap-8 my-7">
          <PostGrid loadMore={loadMore} hasMore={hasMore} events={dataSource} />
        </div>
      );
    }
    if (subTabState === 'map') {
      return (
        <div className={style.mapContanier}>
          <div className={cn(' flex justify-center items-center', style.mapBack)}>
            {tabState === 'cryptovoxels' ? (
              <MapWithNoSSR
                zoomControl={false}
                zoomLimit={[6, 6]}
                initZoom={6}
                clickToJump={true}
                dragging={false}
                loadFinish={null}
              ></MapWithNoSSR>
            ) : null}
            {tabState === 'decentraland' ? (
              <DCLMapWithNoSSR
                zoomControl={false}
                zoomLimit={[6, 6]}
                initZoom={6}
                clickToJump={true}
                changeTypeControl={false}
                dragging={false}
                loadFinish={null}
              ></DCLMapWithNoSSR>
            ) : null}
            {tabState === 'sandbox' ? (
              <SandboxMap
                zoomControl={false}
                zoomLimit={[6, 6]}
                initZoom={6}
                clickToJump={true}
                changeTypeControl={false}
                dragging={false}
                loadFinish={null}
              ></SandboxMap>
            ) : null}
            {tabState === 'somniumspace' ? (
              <SomniumMap
                zoomControl={false}
                zoomLimit={[6, 6]}
                initZoom={6}
                clickToJump={true}
                changeTypeControl={true}
                dragging={false}
                loadFinish={null}
              ></SomniumMap>
            ) : null}
            {tabState === 'otherside' ? (
              <OtherSideMap
                zoomControl={false}
                zoomLimit={[6, 6]}
                initZoom={6}
                clickToJump={true}
                changeTypeControl={true}
                dragging={false}
                loadFinish={null}
              ></OtherSideMap>
            ) : null}
          </div>
        </div>
      );
    }
    if (subTabState === 'analytics') {
      if (tabState === 'cryptovoxels') {
        return (
          <div className={cn('main-content')}>
            <BaseChart className=" my-5">
              <BaseBar
                id={'basebar1'}
                labelText={'MONTHLY TRAFFIC'}
                dataHandlder={getCvTrafficStats}
                limit={15}
                barWidth={25}
              ></BaseBar>
            </BaseChart>
            <BaseChart className=" mb-5">
              <ChartLine
                id={'chartline1'}
                labelText={'AVERAGE PARCEL PRICE'}
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
                limit={15}
                tabState={tabState}
              ></ChartLine>
            </BaseChart>
            <BaseChart className=" mb-5">
              <StackBar
                id={'stackbar'}
                className="mt-5"
                labelText={'NUMBER OF PARCEL SALES'}
                dataHandler={getCvParcelSoldTotalStats}
                barWidth={18}
                limit={15}
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
            </BaseChart>
          </div>
        );
      }
      if (tabState === 'decentraland') {
        return (
          <div className={cn('main-content')}>
            <BaseChart className=" my-5">
              <ChartLine
                id={'dcl-chartline-1'}
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
                limit={15}
              ></ChartLine>
            </BaseChart>
            <BaseChart className=" my-5">
              <ChartLineToolTipSimple
                id={'dcl-chartline-2'}
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
                limit={15}
              ></ChartLineToolTipSimple>
            </BaseChart>
            <BaseChart className=" mb-5">
              <>
                <span className="hidden"></span>
                <StackBarZ2
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={getDclParcelSoldSumStats}
                  limit={15}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
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
            </BaseChart>
          </div>
        );
      }
      if (tabState === 'sandbox') {
        return (
          <div className={cn('main-content')}>
            <>
              <BaseChart className=" my-5">
                <ChartLineSandBox
                  id={'chartline1'}
                  labelText={'AVERAGE PARCEL PRICE'}
                  dataHandlder={req_sandbox_avg_price_stats}
                  limit={15}
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
                  tabState={tabState}
                ></ChartLineSandBox>
              </BaseChart>
              <BaseChart className=" my-5">
                <ChartLineToolTipSimpleSandbox
                  id={'dcl-chartline-2'}
                  labelText={'NUMBER OF PARCEL SALES'}
                  dataHandlder={req_sandbox_sold_total_stats}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
                  limit={15}
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
                  tabState={tabState}
                ></ChartLineToolTipSimpleSandbox>
              </BaseChart>
              <BaseChart className=" my-5">
                <StackBarZ
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={req_sandbox_sold_sun_stats}
                  legend1={{ label: 'Land', color: [255, 207, 95] }}
                  keyTypes={['land', 'estate']}
                  barWidth={18}
                  isEth={true}
                  showMarkerType="sandbox"
                  limit={15}
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
                  tabState={tabState}
                ></StackBarZ>
              </BaseChart>
            </>
          </div>
        );
      }
      if (tabState === 'nftworlds') {
        return (
          <div className={cn('main-content')}>
            <>
              <BaseChart className=" my-5">
                <ChartLineSandBox
                  id={'chartline1'}
                  labelText={'AVERAGE PARCEL PRICE'}
                  dataHandlder={req_ntfworlds_avg_price_stats}
                  limit={15}
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
                  tabState={tabState}
                ></ChartLineSandBox>
              </BaseChart>
              <BaseChart className=" my-5">
                <ChartLineToolTipSimpleSandbox
                  id={'dcl-chartline-2'}
                  labelText={'NUMBER OF PARCEL SALES'}
                  dataHandlder={req_ntfworlds_sold_total_stats}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
                  limit={15}
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
                  tabState={tabState}
                ></ChartLineToolTipSimpleSandbox>
              </BaseChart>
              <BaseChart className=" my-5">
                <StackBarZ
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={req_ntfworlds_sold_sum_stats}
                  legend1={{ label: 'Land', color: [255, 207, 95] }}
                  keyTypes={['land', 'estate']}
                  barWidth={18}
                  isEth={true}
                  showMarkerType="sandbox"
                  limit={15}
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
                  tabState={tabState}
                ></StackBarZ>
              </BaseChart>
            </>
          </div>
        );
      }
      if (tabState === 'worldwidewebb') {
        return (
          <div className={cn('main-content')}>
            <>
              <BaseChart className=" my-5">
                <ChartLineSandBox
                  id={'chartline1'}
                  labelText={'AVERAGE PARCEL PRICE'}
                  dataHandlder={req_webb_parcel_avg_price_stats}
                  limit={15}
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
                  tabState={tabState}
                ></ChartLineSandBox>
              </BaseChart>
              <BaseChart className=" my-5">
                <ChartLineToolTipSimpleSandbox
                  id={'dcl-chartline-2'}
                  labelText={'NUMBER OF PARCEL SALES'}
                  dataHandlder={req_webb_sold_total_stats}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
                  limit={15}
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
                  tabState={tabState}
                ></ChartLineToolTipSimpleSandbox>
              </BaseChart>
              <BaseChart className=" my-5">
                <StackBarZ
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={req_webb_sold_sum_stats}
                  legend1={{ label: 'Land', color: [255, 207, 95] }}
                  keyTypes={['land', 'estate']}
                  barWidth={18}
                  isEth={true}
                  showMarkerType="sandbox"
                  limit={15}
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
                  tabState={tabState}
                ></StackBarZ>
              </BaseChart>
            </>
          </div>
        );
      }
      if (tabState === 'somniumspace') {
        return (
          <div className={cn('main-content')}>
            <>
              <BaseChart className=" my-5">
                <ChartLineSandBox
                  id={'chartline1'}
                  labelText={'AVERAGE PARCEL PRICE'}
                  dataHandlder={req_somniumspace__avg_price_stats}
                  limit={15}
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
                  tabState={tabState}
                ></ChartLineSandBox>
              </BaseChart>
              <BaseChart className=" my-5">
                <ChartLineToolTipSimpleSandbox
                  id={'dcl-chartline-2'}
                  labelText={'NUMBER OF PARCEL SALES'}
                  dataHandlder={req_somniumspace_sold_total_stats}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
                  limit={15}
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
                  tabState={tabState}
                ></ChartLineToolTipSimpleSandbox>
              </BaseChart>
              <BaseChart className=" my-5">
                <StackBarZ
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={req_somniumspace_sold_sum_stats}
                  legend1={{ label: 'Land', color: [255, 207, 95] }}
                  keyTypes={['land', 'estate']}
                  barWidth={18}
                  isEth={true}
                  showMarkerType="sandbox"
                  limit={15}
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
                  tabState={tabState}
                ></StackBarZ>
              </BaseChart>
            </>
          </div>
        );
      }
      if (tabState === 'otherside') {
        return (
          <div className={cn('main-content')}>
            <>
              <BaseChart className=" my-5">
                <ChartLineSandBox
                  id={'chartline1'}
                  labelText={'AVERAGE PARCEL PRICE'}
                  dataHandlder={req_otherside_avg_price}
                  limit={15}
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
                  tabState={tabState}
                ></ChartLineSandBox>
              </BaseChart>
              <BaseChart className=" my-5">
                <ChartLineToolTipSimpleSandbox
                  id={'dcl-chartline-2'}
                  labelText={'NUMBER OF PARCEL SALES'}
                  dataHandlder={req_otherside_sales_num}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
                  limit={15}
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
                  tabState={tabState}
                ></ChartLineToolTipSimpleSandbox>
              </BaseChart>
              <BaseChart className=" my-5">
                <StackBarZ
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={req_otherside_sales_amount}
                  legend1={{ label: 'Land', color: [255, 207, 95] }}
                  keyTypes={['land', 'estate']}
                  barWidth={18}
                  isEth={true}
                  showMarkerType="sandbox"
                  limit={15}
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
                  tabState={tabState}
                ></StackBarZ>
              </BaseChart>
            </>
          </div>
        );
      }
      if (tabState === 'netvrk') {
        return (
          <div className={cn('main-content')}>
            <>
              <BaseChart className=" my-5">
                <ChartLineSandBox
                  id={'chartline1'}
                  labelText={'AVERAGE PARCEL PRICE'}
                  dataHandlder={req_netvrk_avg_price}
                  limit={15}
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
                  tabState={tabState}
                ></ChartLineSandBox>
              </BaseChart>
              <BaseChart className=" my-5">
                <ChartLineToolTipSimpleSandbox
                  id={'dcl-chartline-2'}
                  labelText={'NUMBER OF PARCEL SALES'}
                  dataHandlder={req_netvrk_sales_num}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
                  limit={15}
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
                  tabState={tabState}
                ></ChartLineToolTipSimpleSandbox>
              </BaseChart>
              <BaseChart className=" my-5">
                <StackBarZ
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={req_netvrk_sales_amount}
                  legend1={{ label: 'Land', color: [255, 207, 95] }}
                  keyTypes={['land', 'estate']}
                  barWidth={18}
                  isEth={true}
                  showMarkerType="sandbox"
                  limit={15}
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
                  tabState={tabState}
                ></StackBarZ>
              </BaseChart>
            </>
          </div>
        );
      }
    }
  }, [
    error,
    dataSource,
    hasMore,
    loadMore,
    loading,
    totalPage,
    pageNumber,
    onPageChangeHandler,
    onRetry,
  ]);

  const init = React.useCallback(async () => {
    const data = await requestData({
      tab: tabState,
      subTab: subTabState,
      page: 1,
      query: searchText,
      type: typeState,
      needUpdateTypeList: true,
    });
    setDataSource(data);
  }, [props.query]);

  const initTopic = React.useCallback(async () => {
    try {
      setTopicList([]);
      const res = await getTopicList();
      const { list } = res.data;
      setTopicList(convert(list));
    } catch (err) {
      setError(true);
    }
  }, [null]);

  const refreshTK = React.useCallback(async () => {
    const rToken = getToken('rtk');
    if (rToken) {
      const res = await refreshToken(rToken);
      const { code, data, msg } = res;
      if (code === 100003) {
        toast.error('Token timeout');
        window.location.href = '/';
        return null;
      }
      if (code !== 100000) {
        toast.error(msg);
        return null;
      }
      const { accessToken, refreshToken: rtk } = convert(data);
      setToken('atk', accessToken);
      setToken('rtk', rtk);
      state.setState({ accessToken, refreshToken: rtk });
      return accessToken;
    }
    return null;
  }, [null]);

  const resultHandler = React.useCallback(
    (res, callback) => {
      const { code, msg, data } = res;
      if (code === 100000) {
        return convert(data);
      }
      if (code === 100003) {
        refreshTK().then((token) => {
          if (token && callback) {
            callback(token);
          }
        });
        return null;
      }

      toast.error(msg);

      return null;
    },
    [refreshTK],
  );

  const requestPersonal = React.useCallback(
    async (token: string) => {
      const res = await getBaseInfo(token);
      const data = resultHandler(res, requestPersonal);
      if (!data) {
        return;
      }
      const { profile } = data;
      state.setState({ profile });
    },
    [resultHandler],
  );

  React.useEffect(() => {
    // console.log('');
    const accessToken = getToken('atk');
    if (accessToken) {
      requestPersonal(accessToken);
    }
  }, [requestPersonal]);

  React.useEffect(() => {
    if (
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
      )
    ) {
      // window.location.href="移动端url";
    } else {
      // window.location.href="pc端url";
      // console.log('pc');
      // window.location.href = "http://www.taobao.com";
    }
    initTopic();
    init();
  }, [null]);

  const cls = cn('flex-1', style.bottomLine);

  return (
    <Page meta={meta}>
      <Layout>
        {topicList.length > 0 ? (
          <>
            <div
              className={cn(
                'main-content flex justify-between items-center mt-5 text-white font-semibold',
                style.builders,
              )}
            >
              <div>BUILDERS</div>

              <div className={cn('flex items-center font-normal', style.more)}>
                <Link href={'/builders'}>more</Link>
                <img src="/images/tab-right.png"></img>
              </div>
            </div>
            <TopicCardList topics={topicList}></TopicCardList>
          </>
        ) : null}
        <div className={cn('tab-list flex mt-5', style.allHeight)}>
          <div className={cls}></div>
          <div className="main-content flex px-0 relative">
            <div
              className={cn(
                'p absolute z-50 flex justify-start items-center',
                {
                  hidden: tabPercent <= 0,
                },
                style.per,
              )}
            >
              <img className={style.icon} src="/images/tab-left.png"></img>
            </div>
            <Swiper
              modules={[Navigation]}
              spaceBetween={1}
              slidesPerView="auto"
              className={cn('w-full', style.swiper)}
              navigation={{
                prevEl: '.p',
                nextEl: '.n',
              }}
              onProgress={(swiper, progress) => {
                setTabPercent(progress);
              }}
            >
              {TAB.map((item, index) => {
                return (
                  <SwiperSlide
                    className={cn(
                      'box-border w-12 py-2 px-4 font-semibold text-white',
                      style.base,
                      tabState === item.type ? style.active : null,
                    )}
                    key={index}
                    onClick={() => {
                      onTabChange(item.type);
                    }}
                  >
                    <Tab
                      active={tabState === item.type}
                      key={item.label}
                      label={item.label}
                      icon={item.icon}
                      isMini={true}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <div
              className={cn(
                'n absolute z-50  flex justify-end items-center',
                {
                  hidden: tabPercent >= 1,
                },
                style.next,
              )}
            >
              <img className={style.icon} src="/images/tab-right.png"></img>
            </div>
            <div className={cls} />
          </div>
          <div className={cls} />
        </div>
        <div className="main-content">
          <div className={cn('flex justify-between items-center pt-5', style.contentHeader)}>
            <div className="flex">
              {tabState === 'cryptovoxels'
                ? SUBTAB.map((item, index) => {
                    if (item) {
                      return (
                        <SecondTab
                          label={item.label}
                          key={item.label}
                          onClick={() => {
                            onSubTabChange(item.type);
                          }}
                          active={subTabState === item.type}
                        />
                      );
                    }
                    return null;
                  })
                : null}
              {tabState === 'decentraland'
                ? SUBTAB.map((item, index) => {
                    if (item) {
                      return (
                        <SecondTab
                          label={item.label}
                          key={item.label}
                          onClick={() => {
                            onSubTabChange(item.type);
                          }}
                          active={subTabState === item.type}
                        />
                      );
                    }
                    return null;
                  })
                : null}
              {tabState === 'nftworlds' ||
              tabState === 'worldwidewebb' ||
              // tabState === 'otherside' ||
              tabState === 'netvrk'
                ? SUBTABZ.map((item, index) => {
                    if (item) {
                      return (
                        <SecondTab
                          label={item.label}
                          key={item.label}
                          onClick={() => {
                            onSubTabChange(item.type);
                          }}
                          active={subTabState === item.type}
                        />
                      );
                    }
                    return null;
                  })
                : null}

              {tabState === 'sandbox' || tabState === 'somniumspace' || tabState === 'otherside'
                ? SUBTABZ2.map((item, index) => {
                    if (item) {
                      return (
                        <SecondTab
                          label={item.label}
                          key={item.label}
                          onClick={() => {
                            onSubTabChange(item.type);
                          }}
                          active={subTabState === item.type}
                        />
                      );
                    }
                    return null;
                  })
                : null}
            </div>
            {subTabState === 'parcel' ? (
              <Search text={searchText} onSearch={onSearchHandler}></Search>
            ) : null}
          </div>
          <div className={cn('mt-8', style.content)}>
            {subTabState === 'parcel' && (
              <SwiperTag onActive={onTypeChangeHandler} tags={typeList} label={typeState} />
            )}

            {subTabState === 'analytics' && (
              <a href={`/analytics?type=${tabState}`}>
                <div
                  className={cn(
                    'main-content flex justify-between items-center mt-5font-normal',
                    style.analytics,
                  )}
                >
                  <div>For more data, to Metaverse Analytics </div>

                  <div className={cn('flex items-center font-normal', style.analyticsMore)}>
                    GET MORE
                    <img className="ml-2" src="/images/tab-right.png"></img>
                  </div>
                </div>
              </a>
            )}

            {renderContent}
          </div>
        </div>
        {subTabState === 'event' ? <TopJumper></TopJumper> : null}
      </Layout>
    </Page>
  );
}

export async function getServerSideProps({ locale = 'en-US', query }) {
  return {
    props: {
      messages: {
        ...require(`../../messages/common/${locale}.json`),
        ...require(`../../messages/index/${locale}.json`),
      },
      now: new Date().getTime(),
      locale,
      query,
    },
  };
}
