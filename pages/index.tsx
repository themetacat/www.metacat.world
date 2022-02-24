import React from 'react';
import cn from 'classnames';
import Link from 'next/link';

import dynamic from 'next/dynamic';
import Page from '../components/page';
import Layout from '../components/layout';
import { SITE_NAME, META_DESCRIPTION } from '../common/const';
import { convert } from '../common/utils';

import Tab from '../components/tab';
import SecondTab from '../components/tab2';
import Card from '../components/card';
import SwiperTag from '../components/swiper-tag';
import PagiNation from '../components/pagination';
import Search from '../components/search';
import PostGrid from '../components/post-grid';
import Status from '../components/status';
import TopJumper from '../components/jump-to-top';
import TopicCardList from '../components/topic-card-list';

import BaseChart from '../components/base-chart';
import BaseBar from '../components/base-bar';
import StackBar from '../components/stack-bar';
import ChartLine from '../components/chart-line';

import {
  getCVEventList,
  getCVParcelList,
  getDCLEventList,
  getDCLParcelList,
  getTopicList,
  getCvParcelSoldTotalStats,
  getCvTrafficStats,
  getCvParcelAvgPriceStats,
} from '../service';

import style from './index.module.less';

const MapWithNoSSR = dynamic(() => import('../components/map'), {
  ssr: false,
});

const TAB = [
  {
    label: 'Cryptovoxel',
    icon: '/images/Crypto Voxel.jpg',
    type: 'voxel',
  },
  {
    label: 'Decentraland',
    icon: '/images/Decentraland.jpg',
    type: 'decentraland',
  },
];

const SUBTAB = [
  {
    label: 'Parcel',
    type: 'parcel',
  },
  {
    label: 'Map',
    type: 'map',
    isVoxelOnly: true,
  },
  {
    label: 'Analytics',
    type: 'analytics',
    isVoxelOnly: true,
  },
  {
    label: 'Event',
    type: 'event',
  },
];

export default function Index(props) {
  const meta = {
    title: `Home - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [tabState, setTabState] = React.useState(props.query.tab || 'voxel');
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
      if (tab === 'voxel') {
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
    let sub = subTabState;
    if (subTabState === 'analytics' || 'map') {
      sub = 'parcel';
      setSubTabState(sub);
    }
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
              return <Card {...card} key={idx}></Card>;
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
          <div className={style.mapBack}>
            <MapWithNoSSR
              zoomControl={false}
              zoomLimit={[6, 6]}
              initZoom={6}
              clickToJump={true}
              dragging={false}
              loadFinish={null}
            ></MapWithNoSSR>
          </div>
        </div>
      );
    }
    if (subTabState === 'analytics') {
      return (
        <div className={cn('main-content')}>
          <BaseChart className=" my-5">
            <BaseBar
              id={'basebar1'}
              labelText={'MONTHLY TRAFFIC'}
              dataHandlder={getCvTrafficStats}
              limit={12}
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
              limit={12}
            ></ChartLine>
          </BaseChart>
          <BaseChart className=" mb-5">
            <StackBar
              id={'stackbar'}
              labelText={'NUMBER OF PARCEL SALES'}
              dataHandler={getCvParcelSoldTotalStats}
              limit={12}
              isEth={true}
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
          </BaseChart>
        </div>
      );
    }
  }, [
    subTabState,
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

  React.useEffect(() => {
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
          <div className="main-content flex px-0">
            {TAB.map((item, index) => {
              return (
                <Tab
                  active={tabState === item.type}
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  isMini={false}
                  onClick={() => {
                    onTabChange(item.type);
                  }}
                />
              );
            })}
            <div className={cls} />
          </div>
          <div className={cls} />
        </div>
        <div className="main-content">
          <div className={cn('flex justify-between items-center pt-5', style.contentHeader)}>
            <div className="flex">
              {SUBTAB.map((item, index) => {
                if (!item.isVoxelOnly || (item.isVoxelOnly && tabState === 'voxel')) {
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
                return <></>;
              })}
            </div>
            {subTabState === 'parcel' ? (
              <Search text={searchText} onSearch={onSearchHandler}></Search>
            ) : null}
          </div>
          <div className={cn('mt-8', style.content)}>
            {subTabState === 'parcel' && (
              <SwiperTag onActive={onTypeChangeHandler} tags={typeList} label={typeState} />
            )}

            {tabState === 'voxel' && subTabState === 'analytics' && (
              <a href={`/analytics`}>
                <div
                  className={cn(
                    'main-content flex justify-between items-center mt-5 text-white font-normal',
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
        ...require(`../messages/common/${locale}.json`),
        ...require(`../messages/index/${locale}.json`),
      },
      now: new Date().getTime(),
      locale,
      query,
    },
  };
}
