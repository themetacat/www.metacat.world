import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import BaseInfo from '../../components/base-info';
import Card from '../../components/card';
import Status from '../../components/status';
import Footer from '../../components/footer';

import { convert } from '../../common/utils';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import { getTopicDetail } from '../../service';

import style from './index.module.css';

export default function Topic() {
  const meta = {
    title: `Home - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const router = useRouter();

  const { pathname } = router;
  const { id } = router.query;

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [baseInfo, setBaseInfo] = React.useState({});
  const [parcelList, setParcelList] = React.useState([]);

  const requestData = React.useCallback(
    async (topicId: string | string[]) => {
      setLoading(true);
      setError(false);
      try {
        if (!topicId) {
          setLoading(false);
          return;
        }
        const topic = Number(topicId);
        const res = await getTopicDetail(topic);
        const { base_info, parcel_list } = res.data;
        setBaseInfo(convert(base_info));
        setParcelList(convert(parcel_list));
        setLoading(false);
      } catch (err) {
        setError(true);
      }
    },
    [id],
  );

  React.useEffect(() => {
    requestData(id);
    // smoke('smoke');
  }, [id]);

  const onRetry = React.useCallback(() => {
    requestData(id);
  }, [id]);

  const renderStatus = React.useMemo(() => {
    if (loading) {
      return <Status status="loading" />;
    }

    if (error) {
      return <Status retry={onRetry} status="error" />;
    }

    if (parcelList.length === 0) {
      return <Status status="empty" />;
    }
  }, [loading, error, parcelList]);

  return (
    <Page className="min-h-screen" meta={meta}>
      <div className="bg-black relative">
        <PageHeader className="relative z-10" active={pathname} />
        <div
          className={cn('main-content flex justify-center items-end relative z-10', style.signBack)}
        >
          <img src="/images/back.png" className={style.sign}></img>
        </div>
        {/* <canvas id="smoke" className="absolute w-full h-full top-0 left-0"></canvas> */}
      </div>
      <div className={cn('main-content')}>
        <BaseInfo {...baseInfo} />
        {parcelList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-7 gap-8 pb-7 justify-center">
            {parcelList.map((card, idx) => {
              return <Card {...card} key={idx} hasTypeTag={false}></Card>;
            })}
          </div>
        ) : null}
        {renderStatus}
      </div>
      <Footer />
    </Page>
  );
}
