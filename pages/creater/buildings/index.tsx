import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import Page from '../../../components/page';
// import PageHeader from '../../../components/page-header';
import PageHeader from '../../../components/top-navigation';
import Status from '../../../components/status';
import Footer from '../../../components/footer';
import TopicDetailCardBuildings from '../../../components/topic-detail-card-Buildings';
import PagiNation from '../../../components/pagination';
import Tab from '../../../components/tab';
import TopJumper from '../../../components/jump-to-top';

import AnimationBack from '../../../components/animation-back';

import { convert } from '../../../common/utils';

import { SITE_NAME, META_DESCRIPTION } from '../../../common/const';

import { getBuilderList } from '../../../service';

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
    // {
    //   label: 'Space Buildings',
    //   type: 'spacebuildings',
    // },
  ];
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [builders, setBuilders] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(80);
  const [totalPage, setTotalPage] = React.useState(0);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [tabState, setTabState] = React.useState('buildings');
  const [fixedState, setFixedState] = React.useState(false);

  const cls = cn('flex-1', style.bottomLine);
  const onTabChange = React.useCallback((t) => {
    setTabState(t);
    router.replace(`/creater/${t}`);
  }, []);

  const requestData = React.useCallback(async (page: number, count: number) => {
    setLoading(true);
    setError(false);
    try {
      if (!page) {
        setLoading(false);
        return;
      }
      const res = await getBuilderList(page, count);
      const { list, total_page } = res.data;
      setBuilders(convert(list));
      setTotalPage(total_page);
      setPageNumber(page);
      setLoading(false);
    } catch (err) {
      setError(true);
    }
  }, []);

  const onRetry = React.useCallback(() => {
    requestData(pageNumber, pageCount);
  }, [pageNumber, pageCount]);

  const onPageChangeHandler = React.useCallback(
    async (number: number) => {
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

    if (builders.length === 0) {
      return <Status status="empty" />;
    }
  }, [loading, error, builders]);

  React.useEffect(() => {
    const listener = () => {
      if (document.getElementById('switch') && window.scrollY > 90) {
        setFixedState(true);
      } else {
        setFixedState(false);
      }
    };
    document.addEventListener('scroll', listener);
    return () => document.removeEventListener('scroll', listener);
  }, [fixedState]);

  return (
    <Page className="min-h-screen" meta={meta}>
         <div className={cn(fixedState ? style.fix1 : null)}>
            <PageHeader className={cn('')} active={'Build'} />
          </div>
      <div className={cn('bg-black relative', style.backImage)}>
        <div className={style.topCon}>
       
          <div
            className={cn('tab-list flex ', fixedState ? style.fix2 :  style.allHeight,)}
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
        </div>
        {/* <div
          className={cn('main-content flex justify-center items-end relative z-10', style.signBack)}
        >
          <img src="/images/buildingsBanner.png" className={style.sign}></img>
        </div> */}
        <div className={style.imgContanier}>
          <div className={style.title}>Featured Buildings</div>
          <div className={style.text}>
            <div className={style.hengxian}></div>
            <div className={style.t}>
              EXCELLENT BUILDINGS ARE GATHERED ACCORDING TO THE LANDOWNERS OR ARCHITECTS.
              {/* EXCELLENT &nbsp;&nbsp;
              BUILDINGS &nbsp;&nbsp;
              ARE&nbsp;&nbsp;&nbsp;
              GATHERED&nbsp;&nbsp;
              ACCORDING&nbsp;&nbsp;
              TO&nbsp;&nbsp;&nbsp;
              THE&nbsp;&nbsp;&nbsp;
              LANDOWNERS&nbsp;&nbsp;
              OR&nbsp;&nbsp;&nbsp;
              ARCHITECTS&nbsp;&nbsp; */}
            </div>
            {/* <div className={style.t}>Excellent buildings are gathered according to the landowners or architects.</div> */}
            <div className={style.hengxian}></div>
          </div>
        </div>
      </div>
      <TopJumper classname={style.jumper}></TopJumper>
      <div className={cn('main-content', style.content)}>
        {builders.length > 0 ? (
          <>
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-5  justify-center',
                style.buildingsCon,
              )}
            >
              {builders.map((card, idx) => {
                return <TopicDetailCardBuildings {...card} key={idx}></TopicDetailCardBuildings>;
              })}
            </div>
            <PagiNation
              total={totalPage}
              pageNumber={pageNumber - 1}
              pageSize={9}
              pageChange={onPageChangeHandler}
            />
          </>
        ) : null}
        {renderStatus}
      </div>

      <Footer />
    </Page>
  );
}
