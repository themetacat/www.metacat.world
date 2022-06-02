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
import UserAvatar from '../../components/user-avatar';
import MeteInput from '../../components/meta-input-search';

import { state } from '../../components/wallet-btn';

import AnimationBack from '../../components/animation-back';

import { convert, getToken, setToken } from '../../common/utils';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import DaoModelList from '../../components/dao-model-list';
import { useWalletProvider } from '../../components/web3modal';

import { getTopicDetail, refreshToken, getBaseInfo } from '../../service';
import api from '../../lib/test';

import style from './index.module.css';

const nav = [
  {
    label: 'Buildings',
    type: 'buildings',
  },
  {
    label: 'Wearable',
    type: 'wearable',
  },
];

export default function Topic({ base_info, parcel_list, traffic_list, wearable }) {
  const meta = {
    title: `${base_info.name} - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const router = useRouter();
  const [navState, setNavState] = React.useState(parcel_list ? 'buildings' : 'wearable');
  const { pathname } = router;
  const { id } = router.query;
  const [searchText, setSearchText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [baseInfo, setBaseInfo] = React.useState(convert(base_info));
  const [parcelList, setParcelList] = React.useState(convert(parcel_list));
  const [trafficList, setTrafficList] = React.useState(convert(traffic_list));
  const [wearables, setWearables] = React.useState(wearable);

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

  const changeNav = React.useCallback((t) => {
    setNavState(t);
  }, []);

  React.useEffect(() => {
    const accessToken = getToken('atk');
    if (accessToken) {
      requestPersonal(accessToken);
    }
  }, [requestPersonal]);

  const onSearchHandler = React.useCallback(
    (text: string) => {
      setSearchText(text);
    },
    [null],
  );

  const search = React.useCallback(() => {
    if (navState === 'buildings') {
      if (parcelList) {
        if (searchText === '' || searchText === null) {
          setParcelList(parcelList);
          return;
        }
        const dataToShow = parcelList.filter((x) => {
          return (
            x.description.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1 ||
            x.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1
          );
        });
        setParcelList(dataToShow);
      }
    }
    if (navState === 'wearable') {
      if (parcelList) {
        if (searchText === '' || searchText === null) {
          setParcelList(parcelList);
          return;
        }
        const dataToShow = parcelList.filter((x) => {
          return (
            x.description.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1 ||
            x.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1
          );
        });
        setParcelList(dataToShow);
      }
    }
  }, [searchText, parcelList, navState]);

  const rander = React.useMemo(() => {
    if (navState === 'buildings') {
      return (
        <div className={cn('main-content')}>
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
                    labelText={'DAILY TRAFFIC'}
                    barWidth={20}
                    limit={14}
                    teaffic={trafficList.reverse()}
                  ></BaseBar>
                </BaseChart>
              </div>
            ) : null}
          </div>

          <div className={style.parcel}>
            {parcelList.length > 0 ? (
              <div>
                {trafficList.length !== 0 ? (
                  <div className={style.title}>
                    <div></div>
                    <p>Buildings</p>
                  </div>
                ) : null}
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
      );
    }
    if (navState === 'wearable') {
      return (
        <div className={style.wearable}>
          <DaoModelList models={wearable}></DaoModelList>
        </div>
      );
    }
  }, [navState, wearable, parcelList, trafficList, search]);

  return (
    <Page className="min-h-screen" meta={meta}>
      <div className="bg-black relative">
        <PageHeader className="relative z-10" active={'builders'} />
        <div
          className={cn('main-content flex justify-center flex-col  relative z-10', style.signBack)}
        >
          <UserAvatar
            avatar={base_info.logo_url}
            name={base_info.name}
            contact={[
              {
                icon: '/images/home.svg',
                label: 'Home',
                address: `${base_info.website}`,
              },
              {
                icon: '/images/twitter.svg',
                label: 'Twitter',
                address: `${base_info.twitter}`,
              },
              {
                icon: '/images/discord.svg',
                label: 'Discord',
                address: `${base_info.discord}`,
              },
            ]}
          ></UserAvatar>
          <div className={cn(' text-center mt-4 mb-7', style.desc)}>{base_info.description}</div>
        </div>
      </div>
      {parcel_list && wearable ? (
        <div className={style.nav}>
          <div className={style.navCOntainer}>
            <div className={style.nav}>
              {nav.map((item, idx) => {
                return (
                  <div
                    className={cn(style.item, navState === item.type ? style.action : null)}
                    key={idx}
                    onClick={() => {
                      changeNav(item.type);
                    }}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
      <div className={cn('flex justify-center items-center mb-5', style.t)}>
        <MeteInput
          require={false}
          name={'username'}
          bold={true}
          value={searchText}
          requirePrefix={false}
          onChangeHandler={(val) => {
            onSearchHandler(val);
          }}
          onEnter={search}
          placeholder="Search"
          prefix="/images/Frame.png"
        ></MeteInput>
        <div
          className={cn(
            'flex justify-center items-center font-medium text-lg cursor-pointer',
            style.searchbtn,
          )}
          onClick={search}
        >
          Search
        </div>
      </div>
      {rander}
      <Footer />
    </Page>
  );
}

export async function getServerSideProps(context) {
  let res = null;
  if (Number(context.params.id)) {
    const topic = Number(context.params.id);
    res = await api.req_topic_detail(topic, undefined);
  } else {
    res = await api.req_topic_detail(undefined, context.params.id);
  }
  const { base_info, parcel_list, traffic_list, wearable } = res.data;
  return {
    props: {
      base_info,
      parcel_list,
      traffic_list,
      wearable,
    }, // will be passed to the page component as props
  };
}
