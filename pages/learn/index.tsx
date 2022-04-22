import React from 'react';
import { useRouter, withRouter } from 'next/router';
import cn from 'classnames';
import { v4 as uuid } from 'uuid';
import { throttle } from '../../common/utils';
import style from './index.module.css';

import PagiNation from '../../components/pagination';

import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Footer from '../../components/footer';
import Tab from '../../components/tab';
import Search from '../../components/search';
import SelectLearn from '../../components/chart-select-learn';
import Status from '../../components/status';
import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import EventCardLearn from '../../components/EventCard-learn';

import { req_learn_article_list, req_learn_report_list } from '../../service/z_api';

const REPORTTAB = [
  {
    label: 'Articles',
    type: 'articles',
  },
  {
    label: 'MetaCat Report',
    type: 'report',
  },
];

const meta = {
  title: `Learn - ${SITE_NAME}`,
  description: META_DESCRIPTION,
};

const ps = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Chinese',
    value: 'zh',
  },
];

function Learn(r) {
  const router = useRouter();

  const timer = React.useRef(null);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [tabStateTR, setTabStateTR] = React.useState('articles');
  const [searchText, setSearchText] = React.useState('');
  const [options, setOptions] = React.useState(ps);
  const [showType, setShowType] = React.useState(ps[0].value);
  const [page, setPage] = React.useState(1);
  const [count, setCount] = React.useState(50);
  const [totalPage, setTotalPage] = React.useState(null);
  const [dataSource, setDataSource] = React.useState([]);
  const [routeTab, setRouteTab] = React.useState(r.router.query.type || 'articles');
  const onTabChange = React.useCallback(
    (i) => {
      if (i === routeTab) return;
      router.replace({
        pathname: '/learn',
        query: {
          type: i,
        },
      });
      setRouteTab(i);
    },
    [router],
  );

  const requestData = React.useCallback(
    async (p, c, t, type) => {
      setLoading(true);
      let result = null;
      if (type === 'articles' && type) {
        result = await req_learn_article_list(p, c, t);
      }
      if (type === 'report' && type) {
        result = await req_learn_report_list(p, c, t);
      }
      setLoading(false);
      if (result?.code === 100000 && result.data.list.length !== 0) {
        setDataSource(result.data.list);
        setTotalPage(result.data.total_page);
      } else {
        setError(true);
      }
    },
    [page, count, showType, routeTab],
  );

  const onSearchHandler = React.useCallback(
    async (text: string) => {
      if (text) {
        const d = dataSource.filter((item) => {
          return (
            item.title.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
            item.desc.toLocaleLowerCase().includes(text.toLocaleLowerCase())
          );
        });
        setDataSource(d);
      } else {
        requestData(page, count, showType, r.router.query.type);
      }
      setSearchText(text);
      // const data = await requestData({
      //     tab: tabState,
      //     subTab: subTabState,
      //     query: text,
      //     page: 1,
      //     type: typeState,
      //     needUpdateTypeList: true,
      // });

      // setDataSource(data);
    },
    [page, count, showType, dataSource, requestData],
  );

  const changeStatic = React.useCallback((val) => {
    setShowType(val);
    // if (dataSource) {
    // update(val);
    // }
  }, []);
  const onRetry = React.useCallback(() => {
    requestData(page, count, showType, r.router.query.type);
  }, [page, count, showType, requestData]);

  const onPageChangeHandler = React.useCallback(
    (number: number) => {
      const requestNumber = number + 1;
      requestData(requestNumber, count, showType, r.router.query.type);
    },
    [requestData, count, showType],
  );

  const reander = React.useMemo(() => {
    if (loading) {
      return <Status status="loading" />;
    }
    if (error) {
      return <Status retry={onRetry} status="error" />;
    }
    if (dataSource.length === 0) {
      return <Status status="search" />;
    }
    return (
      <div className={style.container}>
        {dataSource.map((item) => {
          return <EventCardLearn className="mt-7" {...item} key={uuid()} />;
        })}
      </div>
    );
  }, [dataSource, error, loading, onRetry]);

  React.useEffect(() => {
    if (r.router.query.type) {
      requestData(page, count, showType, r.router.query.type);
    }
  }, [requestData, r.router.query.type, page, count, showType]);

  const cls = cn('flex-1', style.bottomLine);
  return (
    <Page className={cn('min-h-screen', style.anPage)} meta={meta}>
      <div className="bg-black relative">
        <PageHeader className="relative z-10" active={'learn'} />
      </div>
      <div className={style.containerBanner}>
        <img src="/images/LearnBanner.png" className={style.banner} />
      </div>
      <div className={cn('tab-list flex mt-5', style.allHeight)}>
        <div className={cls}></div>
        <div className={cn('main-content flex px-0', style.r)}>
          {REPORTTAB.map((item) => {
            return (
              <Tab
                active={r.router.query.type === item.type}
                isMini={true}
                key={item.label}
                label={item.label}
                onClick={() => {
                  onTabChange(item.type);
                }}
              />
            );
          })}

          <div className={cls} />
          <div className={style.searchOrlangue}>
            <div className={style.right}>
              <Search
                text={searchText}
                onSearch={(text) => {
                  throttle(onSearchHandler, 1000)(text);
                }}
                type={'z'}
              ></Search>
              <div
                className={cn('flex items-center', style.border)}
                style={{ color: 'rgba(255,255,255, 0.3)' }}
              >
                <SelectLearn
                  options={options}
                  showArrow={true}
                  onClick={changeStatic}
                  className={style.selecterLong}
                  defaultLabel={options[0].label}
                  hasBorder={false}
                ></SelectLearn>
              </div>
            </div>
          </div>
        </div>

        <div className={cls} />
      </div>
      {reander}
      {dataSource.length !== 0 ? (
        <div className="mt-7 mb-10">
          <PagiNation
            total={totalPage}
            pageNumber={page - 1}
            pageSize={20}
            pageChange={onPageChangeHandler}
          />
        </div>
      ) : null}
      <Footer />
    </Page>
  );
}

export default withRouter(Learn);
