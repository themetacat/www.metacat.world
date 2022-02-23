import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Status from '../../components/status';
import Footer from '../../components/footer';
import TopicDetailCard from '../../components/topic-detail-card';
import PagiNation from '../../components/pagination';

import AnimationBack from '../../components/animation-back';

import { convert } from '../../common/utils';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import { getBuilderList } from '../../service';

import style from './index.module.css';

export default function AnalyticsIndex() {
  const meta = {
    title: `Analytics - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const router = useRouter();

  const { pathname } = router;

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [builders, setBuilders] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(50);
  const [totalPage, setTotalPage] = React.useState(0);
  const [pageNumber, setPageNumber] = React.useState(1);

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

  return (
    <Page className="min-h-screen" meta={meta}>
      <div className="bg-black relative">
        <PageHeader className="relative z-10" active={'analytics'} />
        <div
          className={cn(
            'main-content flex justify-center items-end relative z-10 pointer-events-none',
            style.signBack,
          )}
        >
          <img src="/images/analyticsBack.png" className={style.sign}></img>
        </div>
        <AnimationBack id="smoke" className="absolute w-full h-full top-0 left-0"></AnimationBack>
      </div>
      <div className={cn('', style.content)}>
        <div className="w-full h-48">
          <table>
            <tr>
              <td>WORKDS</td>
              <td>WORKDS</td>
              <td>WORKDS</td>
              <td>WORKDS</td>
              <td>WORKDS</td>
              <td>WORKDS</td>
            </tr>
          </table>
        </div>
      </div>
      <Footer />
    </Page>
  );
}
