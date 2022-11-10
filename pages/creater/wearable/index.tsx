import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import Page from '../../../components/page';
// import PageHeader from '../../../components/page-header';
import PageHeader from '../../../components/top-navigation';
import Status from '../../../components/status';
import Footer from '../../../components/footer';
import TopicDetailCard from '../../../components/topic-detail-card';
import DaoModelList2 from '../../../components/dao-model-listWearable';
import WerableDetailCard from '../../../components/werableDetailCard';
import PagiNation from '../../../components/pagination';
import Tab from '../../../components/tab';

import AnimationBack from '../../../components/animation-back';

import { convert } from '../../../common/utils';

import { SITE_NAME, META_DESCRIPTION } from '../../../common/const';

import { req_space_buildings_list, req_wearable_list } from '../../../service/z_api';

import style from './index.module.css';

export default function TopicIndex() {
  const meta = {
    title: `Builders - ${SITE_NAME}`,
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
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [builders, setBuilders] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(20);
  const [totalPage, setTotalPage] = React.useState(1);
  // const [query, setQuery] = React.useState(null);
  // const [type, setTYPE] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [tabState, setTabState] = React.useState('wearable');
  const [fixedState, setFixedState] = React.useState(false);

  const cls = cn('flex-1', style.bottomLine);
  const onTabChange = React.useCallback((t) => {
    setTabState(t);
    router.replace(`/creater/${t}`);
  }, []);


  const requestData = async (page: number, count: number) => {
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
      const res = await req_wearable_list(page, count);
      // console.log(res,page, "req_wearable_listreq_wearable_list");

      // console.log(res.total_page);
      const { data, total_page } = res;

      setBuilders(convert(data));
      setTotalPage(total_page);
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
      // console.log(11111);

      const requestNumber = number + 1;

      await requestData(requestNumber, pageCount);
    },
    [pageCount],
  );

  React.useEffect(() => {
    requestData(pageNumber, pageCount);
  }, []);

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
            <div className="main-content flex px-0">
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

      <div className={cn('main-content', style.content)}>{renderStatus}</div>
      <Footer />
    </Page>
  );
}
