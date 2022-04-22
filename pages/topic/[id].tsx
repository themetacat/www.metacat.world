import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import toast from 'react-hot-toast';

import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import BaseInfo from '../../components/base-info';
import Card from '../../components/card';
import Status from '../../components/status';
import Footer from '../../components/footer';
import BaseBar from '../../components/topic-base-bar';
import BaseChart from '../../components/base-chart';

import { state } from '../../components/wallet-btn';

import AnimationBack from '../../components/animation-back';

import { convert, getToken, setToken } from '../../common/utils';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import { useWalletProvider } from '../../components/web3modal';

import { getTopicDetail, refreshToken, getBaseInfo } from '../../service';
import api from '../../lib/api';

import style from './index.module.css';

export default function Topic({ base_info, parcel_list, traffic_list }) {
  const meta = {
    title: `${base_info.name} - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const router = useRouter();

  const { pathname } = router;
  const { id } = router.query;

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [baseInfo, setBaseInfo] = React.useState(convert(base_info));
  const [parcelList, setParcelList] = React.useState(convert(parcel_list));
  const [trafficList, setTrafficList] = React.useState(convert(traffic_list));

  const web3 = useWalletProvider();

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
        const {
          base_info: baseInfoRes,
          parcel_list: parcelListRes,
          traffic_list: trafficLists,
        } = res.data;
        setBaseInfo(convert(baseInfoRes));
        setParcelList(convert(parcelListRes));
        setTrafficList(convert(trafficLists));
        setLoading(false);
      } catch (err) {
        setError(true);
      }
    },
    [id],
  );

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

  const refreshTK = React.useCallback(async () => {
    const rToken = getToken('rtk');
    if (rToken) {
      const res = await refreshToken(rToken);
      const { code, data, msg } = res;
      if (code === 100003) {
        toast.error('Token timeout');
        window.location.href = '/';
        return null;
      }
      if (code !== 100000) {
        toast.error(msg);
        return null;
      }
      const { accessToken, refreshToken: rtk } = convert(data);
      setToken('atk', accessToken);
      setToken('rtk', rtk);
      state.setState({ accessToken, refreshToken: rtk });
      return accessToken;
    }
    return null;
  }, [null]);

  const resultHandler = React.useCallback(
    (res, callback) => {
      const { code, msg, data } = res;
      if (code === 100000) {
        return convert(data);
      }
      if (code === 100003) {
        refreshTK().then((token) => {
          if (token && callback) {
            callback(token);
          }
        });
        return null;
      }

      toast.error(msg);

      return null;
    },
    [refreshTK],
  );

  const requestPersonal = React.useCallback(
    async (token: string) => {
      const res = await getBaseInfo(token);
      const data = resultHandler(res, requestPersonal);
      if (!data) {
        return;
      }
      const { profile } = data;
      state.setState({ profile });
    },
    [resultHandler],
  );

  React.useEffect(() => {
    const accessToken = getToken('atk');
    if (accessToken) {
      requestPersonal(accessToken);
    }
  }, [requestPersonal]);

  return (
    <Page className="min-h-screen" meta={meta}>
      <div className="bg-black relative">
        <PageHeader className="relative z-10" active={pathname} />
        <div
          className={cn(
            'main-content flex justify-center items-end relative z-10 pointer-events-none',
            style.signBack,
          )}
        >
          <img src="/images/back.png" className={style.sign}></img>
        </div>
        <AnimationBack id="smoke" className="absolute w-full h-full top-0 left-0"></AnimationBack>
      </div>
      <div className={cn('main-content')}>
        <BaseInfo {...baseInfo} />

        <div className={style.teaffic}>
          {trafficList.length !== 0 ? (
            <div>
              <div className={cn(style.title, style.tb)}>
                <div></div>
                <p>Traffic</p>
              </div>
              <BaseChart>
                <BaseBar
                  id={'topic'}
                  labelText={'MONTHLY TRAFFIC'}
                  barWidth={20}
                  limit={14}
                  teaffic={trafficList}
                ></BaseBar>
              </BaseChart>
            </div>
          ) : null}
        </div>

        <div className={style.parcel}>
          {parcelList.length > 0 ? (
            <div>
              <div className={style.title}>
                <div></div>
                <p>Buildings</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-7 gap-8 pb-7 justify-center">
                {parcelList.map((card, idx) => {
                  return <Card {...card} key={idx} hasTypeTag={false}></Card>;
                })}
              </div>
            </div>
          ) : null}
        </div>
        {renderStatus}
      </div>
      <Footer />
    </Page>
  );
}

export async function getServerSideProps(context) {
  const topic = Number(context.params.id);
  const res = await api.getTopicDetail(topic);
  console.log(res.data);
  const { base_info, parcel_list, traffic_list } = res.data;
  return {
    props: {
      base_info,
      parcel_list,
      traffic_list,
    }, // will be passed to the page component as props
  };
}
