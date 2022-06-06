import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import Page from '../../../components/page';
import PageHeader from '../../../components/page-header';
import Status from '../../../components/status';
import Footer from '../../../components/footer';
import TopicDetailCard from '../../../components/topic-detail-card';
import PagiNation from '../../../components/pagination';
import Tab from '../../../components/tab';

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
  ];
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [builders, setBuilders] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(50);
  const [totalPage, setTotalPage] = React.useState(0);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [tabState, setTabState] = React.useState('buildings');
  const [fixedState, setFixedState] = React.useState(false);

  const cls = cn('flex-1', style.bottomLine);
  const onTabChange = React.useCallback((t) => {
    setTabState(t);
    router.replace(`/build/${t}`);
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
  }, []);

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
      <div className="bg-black relative">
        <div className={fixedState ? style.fix1 : null}>
          <PageHeader className={cn('relative z-20')} active={'builders'} />
        </div>
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
        <div
          className={cn('main-content flex justify-center items-end relative z-10', style.signBack)}
        >
          <img src="/images/buildingsBanner.png" className={style.sign}></img>
        </div>
      </div>

      <div className={cn('main-content', style.content)}>
        {builders.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-7 gap-4 pb-7 justify-center">
              {builders.map((card, idx) => {
                return <TopicDetailCard {...card} key={idx}></TopicDetailCard>;
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
