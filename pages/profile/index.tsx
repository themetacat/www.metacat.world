import React from 'react';

import cn from 'classnames';
import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Footer from '../../components/footer';
import Profile from '../../components/profile';
import Tab from '../../components/tab';
import PagiNation from '../../components/pagination';
import Status from '../../components/status';
import Card from '../../components/card';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import style from './index.module.css';

const TAB = [
  {
    label: 'Cryptovoxel',
    icon: '/images/Crypto Voxel.jpg',
    type: 'voxel',
  },
];

export default function ProfilePage() {
  const meta = {
    title: `ProfileSetting - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [dataSource, setDataSource] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const [noData, setNoData] = React.useState(false);

  const cls = cn('flex-1', style.bottomLine);

  const requestData = async ({
    tab,
    subTab,
    page,
    query = '',
    type,
    needUpdateTypeList = false,
  }): Promise<any[]> => {
    const data = [];
    return data;
  };

  const onPageChangeHandler = React.useCallback(
    async (number: number) => {
      const requestNumber = number + 1;
      const data = await requestData({
        tab: '',
        subTab: '',
        page: requestNumber,
        query: '',
        type: '',
      });
      setPageNumber(requestNumber);
      setDataSource(data);
    },
    [null],
  );

  const onRetry = React.useCallback(async () => {
    const data = await requestData({
      tab: '',
      subTab: '',
      page: pageNumber,
      query: '',
      type: '',
      needUpdateTypeList: true,
    });
    setDataSource(data);
  }, [pageNumber]);

  const renderContent = React.useMemo(() => {
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
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-7">
        {dataSource.map((card, idx) => {
          return <Card {...card} key={idx}></Card>;
        })}
      </div>
    );
  }, [error, dataSource, loading, totalPage, pageNumber, onPageChangeHandler, onRetry]);

  return (
    <Page className={cn('min-h-screen', style.anPage)} meta={meta}>
      <div className="bg-black relative">
        <PageHeader className="relative z-10" active={'profile'} />
      </div>
      <div className={cn('bg-black flex flex-col justify-center items-center')}>
        <Profile classname="main-content"></Profile>
      </div>
      <div className={cn('tab-list flex mt-5', style.allHeight)}>
        <div className={cls}></div>
        <div className="main-content flex px-0">
          {TAB.map((item, index) => {
            return (
              <Tab
                active={true}
                isMini={true}
                key={item.label}
                label={item.label}
                icon={item.icon}
              />
            );
          })}
          <div className={cls} />
        </div>
        <div className={cls} />
      </div>
      <div className={cn('mt-8', style.content)}>{renderContent}</div>
      <Footer />
    </Page>
  );
}
