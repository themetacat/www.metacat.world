import React from 'react';

import cn from 'classnames';
import { v4 as uuid } from 'uuid';
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

import { req_learn_article_list } from '../../service/z_api';

const REPORTTAB = [
  {
    label: 'Articles',
    type: 'articles',
  },
  {
    label: 'MetaCat Report',
    type: 'metacat report',
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

export default function Learn() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [tabState, setTabState] = React.useState('articles');
  const [tabStateTR, setTabStateTR] = React.useState('articles');
  const [searchText, setSearchText] = React.useState('');
  const [options, setOptions] = React.useState(ps);
  const [showType, setShowType] = React.useState(ps[0].value);
  const [page, setPage] = React.useState(1);
  const [count, setCount] = React.useState(50);
  const [totalPage, setTotalPage] = React.useState(null);
  const [dataSource, setDataSource] = React.useState([]);
  const onTabChange = React.useCallback((i) => {
    setTabState(i);
  }, []);

  const requestData = React.useCallback(
    async (p, c, t) => {
      setLoading(true);
      const result = await req_learn_article_list(p, c, t);
      setLoading(false);
      if (result.code === 100000 && result.data.list.length !== 0) {
        setDataSource(result.data.list);
        setTotalPage(result.data.total_page);
      } else {
        setError(true);
      }
    },
    [page, count, showType],
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
        requestData(page, count, showType);
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
    [dataSource, requestData],
  );

  const changeStatic = React.useCallback((val) => {
    setShowType(val);
    // if (dataSource) {
    // update(val);
    // }
  }, []);
  const onRetry = React.useCallback(() => {
    requestData(page, count, showType);
  }, [page, count, showType, requestData]);

  const onPageChangeHandler = React.useCallback(
    (number: number) => {
      const requestNumber = number + 1;
      requestData(requestNumber, count, showType);
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
    requestData(page, count, showType);
  }, [requestData]);

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
        <div className="main-content flex px-0">
          {REPORTTAB.map((item) => {
            return (
              <Tab
                active={tabState === item.type}
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
        </div>
        <Search text={searchText} onSearch={onSearchHandler} type={'z'}></Search>
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
