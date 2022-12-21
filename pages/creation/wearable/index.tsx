import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import Page from '../../../components/page';
// import PageHeader from '../../../components/page-header';
import PageHeader from '../../../components/top-navigation';
import Status from '../../../components/status';
import Footer from '../../../components/footer';
import TopicDetailCard from '../../../components/topic-detail-card';
import DaoModelList2 from '../../../components/dao-model-listWearable';
import WerableDetailCard from '../../../components/werableDetailCard';
import PagiNation from '../../../components/pagination';
import Tab6 from '../../../components/tab6';
import Tab from '../../../components/tab';

import AnimationBack from '../../../components/animation-back';
import CreationWearableList from '../../../components/creation_wearable_list';
import CreationMonaWearableList from '../../../components/creation_monaWear_list';

import { convert } from '../../../common/utils';

import { SITE_NAME, META_DESCRIPTION } from '../../../common/const';

import { req_wearableDcl_list, req_wearable_list, req_wearableMona_list } from '../../../service/z_api';

import style from './index.module.css';

export default function TopicIndex(props) {
  const meta = {
    title: `Creation - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const router = useRouter();

  const { pathname } = router;

  const TAB = [
    {
      label: 'Builders',
      type: 'builders',
    },
    {
      label: 'Buildings',
      type: 'buildings',
    },
    {
      label: 'Wearable',
      type: 'wearable',
    },
    // {
    //   label: 'Space Buildings',
    //   type: 'spacebuildings',
    // },
  ];

  const TABList = [
    {
      label: 'Voxels',
      icon: '/images/cvLogo.png',
      type: 'cryptovoxels',
      // link: '/parcels?tab=cryptovoxels',
    },
    {
      label: 'Decentraland',
      icon: '/images/Decentraland.jpg',
      type: 'decentraland',
      // link: '/parcels?tab=decentraland',
    },
    {
      label: 'Mona',
      icon: 'https://monaverse.com/branding/mona-logo-white.svg',
      type: 'mona',
    },
    // {
    //   label: 'The Sandbox',
    //   icon: '/images/home-icon.svg',
    //   type: 'sandbox',
    // },
    // {
    //     label: 'Somnium Space',
    //     icon: '/images/somniumspace.png',
    //     type: 'somniumspace',
    // },
    // {
    //   label: 'NFT Worlds',
    //   icon: '/images/worlds.svg',
    //   type: 'nftworlds',
    // },
    // {
    //   label: 'Worldwide Webb',
    //   icon: '/images/unnamed.svg',
    //   type: 'worldwidewebb',
    // },
    // {
    //   label: 'Otherside',
    //   icon: '/images/osd.png',
    //   type: 'otherside',
    // },
    // {
    //   label: 'Netvrk',
    //   icon: '/images/netvrk_logomark.svg',
    //   type: 'netvrk',
    // },
  ];


  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [builders, setBuilders] = React.useState([]);
  const [wearableList, setWearableList] = React.useState([]);
  const [wearableListMona, setWearableListMona] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(20);
  const [totalPage, setTotalPage] = React.useState(1);
  // const [query, setQuery] = React.useState(null);
  // const [type, setTYPE] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [tabState, setTabState] = React.useState('wearable');
  const [tabStateList, setTabStateList] = React.useState( props.query.tab || 'cryptovoxels' );
  const [fixedState, setFixedState] = React.useState(false);

  const cls = cn('flex-1', style.bottomLine);
  const onTabChange = React.useCallback((t) => {
    setTabState(t);
    router.replace(`/creation/${t}`);
  }, []);





  const requestData =async (page: number, count: number) => {
    setLoading(true);
    setError(false);
    try {
      if (!page) {
        setLoading(false);
        return;
      }

      // const newPage = page + 1
      // console.log(newPage,"newPagenewPage");

      // setPageNumber(newPage)
      if (tabStateList === 'cryptovoxels') {
        const res = await req_wearable_list(page, count);
        // console.log(res,page, "req_wearable_listreq_wearable_list");

        // console.log(res.total_page);
        const { data, total_page } = res;

        setBuilders(convert(data));
        setTotalPage(total_page);
      } else if (tabStateList === 'decentraland') {
        const resWear = await req_wearableDcl_list(page, count);

        setWearableList(resWear.data)
        setTotalPage(resWear.total_page);
        // console.log(resWear);
      } else if (tabStateList === 'mona') {

        const resMona = await req_wearableMona_list(page, count);
        setWearableListMona(resMona.data)
        setTotalPage(resMona.total_page);
      }
      // setTotalPage(total_page);
      setPageNumber(page);
      setLoading(false);
    } catch (err) {
      setError(true);
    }
  }

  const onRetry = React.useCallback(() => {
    requestData(pageNumber, pageCount);
  }, [pageNumber, pageCount]);

  const onPageChangeHandler = React.useCallback(
    async (number: number) => {

      const requestNumber = number + 1;

      await requestData(requestNumber, pageCount);
      // await requestData(pageNumber, pageCount);;
    },
    [pageCount,tabStateList],
  );

  const onTabChangeList =  (tab) => {
    // setPageNumber(pageNumber)
    // let subIndex;
    // // if (tabStateList === 'cryptovoxels') {
    // // } else if (tabStateList === 'decentraland') {
    // // }
    // subIndex = subIndex === -1 ? 0 : subIndex;
    setTabStateList(tab);
    // let sub = '';
    router.replace(`/creation/wearable?tab=${tab}`);
    // setPageNumber(1)
    // requestData(1, pageCount);
    // if (tab === 'cryptovoxels') {
    //   setPageNumber(1)
    //   router.replace(`/creation/wearable?tab=cryptovoxels`);
    //   // requestData(1, pageCount);
    // } else if (tab === 'decentraland') {
    //   setPageNumber(1)
    //   // requestData(1, pageCount);
    //   router.replace(`/creation/wearable?tab=decentraland`);

    // } else if (tab === 'mona') {
    //   setPageNumber(1)
    //   // requestData(1, pageCount);
    //   router.replace(`/creation/wearable?tab=mona`);
    // }
  };



  // React.useEffect(() => {
  //   requestData(pageNumber, pageCount);
  // }, []);
  React.useEffect(() => {
    // const tab = router.query.tab;
 
    setTabStateList(router.query.tab)
    onTabChangeList(router.query.tab)
    requestData(1, 20)
  }, [router.query.tab]);

  const renderStatus = React.useMemo(() => {
    if (loading) {
      return <Status status="loading" />;
    }

    if (error) {
      return <Status retry={onRetry} status="error" />;
    }

    if (builders?.length === 0) {
      return <Status status="empty" />;
    }
    if (builders?.length > 0) {
      // console.log(builders);

      return (
        <>
          <div
            className={cn(
              '',
              style.buildingsCon,
            )}
          >
            <DaoModelList2
              models={builders}
              type={'topic'}
              address={router.query.id}
            ></DaoModelList2>

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

  }, [loading, error,]);

  const renderStatusList = React.useMemo(() => {
    if (loading) {
      return <Status status="loading" />;
    }

    if (error) {
      return <Status retry={onRetry} status="error" />;
    }

    if (wearableList?.length === 0) {
      return <Status status="empty" />;
    }
    if (wearableList?.length > 0) {
      // console.log(builders);

      // return (
      <>
        <div
          className={cn(
            "w-full  top-0 left-0 grid grid-cols-4 gap-4 z-10",
            style.buildingsCon,
          )}
        >
          {
            wearableList.map((card) => {

              return <CreationWearableList {...card} models={wearableList} />
            })
          }
        </div>
        <PagiNation
          total={totalPage}
          pageNumber={pageNumber - 1}
          pageSize={9}
          pageChange={onPageChangeHandler}
        />
      </>
      // );
    }

  }, [loading, error,]);

  // React.useEffect(() => {
  //   const listener = () => {
  //     if (document.getElementById('switch') && window.scrollY > 90) {
  //       setFixedState(true);
  //     } else {
  //       setFixedState(false);
  //     }
  //   };
  //   document.addEventListener('scroll', listener);
  //   return () => document.removeEventListener('scroll', listener);
  // }, [fixedState]);

  return (
    <Page className="min-h-screen" meta={meta}>
      <div className="bg-black relative">
        <div className={fixedState ? style.fix1 : null}>
          <PageHeader className={cn('relative z-20')} active={'Build'} />
        </div>
        <div className={cn('bg-black relative', style.backImage)}>
          <div
            className={cn('tab-list flex', style.allHeight, fixedState ? style.fix2 : null)}
            id="switch"
          >
            <div className={cls}></div>
            <div className={cn("main-content flex px-0")}>
              {TAB.map((item, index) => {
                return (
                  <Tab
                    active={tabState === item.type}
                    key={item.label}
                    icon={null}
                    label={item.label}
                    isMini={true}
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
          <div className={style.imgContanier}>
            <div className={style.title}>Metaverse Wearable</div>
            <div className={style.text}>
              <div className={style.hengxian}></div>
              <div className={style.t}>ALL THE GENIUS VIRTUAL OUTFITS FOR DRESSING UP YOUR AVATAR</div>
              <div className={style.hengxian}></div>
            </div>
          </div>
        </div>
      </div>

      <div className={cn("flex px-0 relative", style.headNum)}>
        {TABList.map((item, index) => {
          return (
            <div
              className={cn(
                ' flex',
                style.baseCON,
                tabStateList === item.type ? style.active : null,
              )}
              key={index}
              onClick={() => {
                onTabChangeList(item.type);
              }}
            >
              <Tab6
                active={tabStateList === item.type}
                key={item.label}
                label={item.label}
                icon={item.icon}
                isMini={true}
              />
            </div>
          );
        })}
      </div>
      {/* <div className={cn('main-content', style.content)}>{renderStatusList}</div> */}
      {
        tabStateList === 'cryptovoxels' ?
          <div className={cn('main-content', style.content)}>{renderStatus}</div>
          : null
      }
      {
        tabStateList === 'decentraland' ?
          <>
            <div className={cn('main-content grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-5  justify-center', style.content)}>
              {/* {renderStatusList} */}
              {
                wearableList.map((card, idx) => {
                  return <CreationWearableList {...card} key={idx} model={wearableList} />
                })
              }
            </div>
            <PagiNation
              total={totalPage}
              pageNumber={pageNumber - 1}
              pageSize={9}
              pageChange={onPageChangeHandler}
            />
          </>
          : null
      }
      {
        tabStateList === 'mona' ?
          <>
            <div className={cn('main-content grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-5  justify-center', style.content)}>
              {/* {renderStatusList} */}
              {
                wearableListMona.map((card, idx) => {
                  return <CreationMonaWearableList {...card} key={idx} model={wearableListMona} />
                })
              }
            </div>
            <PagiNation
              total={totalPage}
              pageNumber={pageNumber - 1}
              pageSize={9}
              pageChange={onPageChangeHandler}
            />
          </>
          : null
      }


      <Footer />
    </Page>
  );
}
export async function getServerSideProps({ locale = 'en-US', query }) {
  return {
      props: {
          messages: {
              ...require(`../../../messages/common/${locale}.json`),
              ...require(`../../../messages/index/${locale}.json`),
          },
          now: new Date().getTime(),
          locale,
          query,
      },
  };
}