import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import toast from 'react-hot-toast';

import Page from '../../components/page';
// import PageHeader from '../../components/page-header';
import PageHeader from '../../components/top-navigation';
import BaseInfo from '../../components/base-info';
// import Card from '../../components/card';
import Card from '../../components/cardBuildingDetail';
import Status from '../../components/status';
import Footer from '../../components/footer';
import BaseBar from '../../components/topic-base-bar';
import BaseChart from '../../components/base-chart';
import UserAvatarBuilding from '../../components/user-avatar-building';
import MeteInput from '../../components/meta-input-search';

import { state } from '../../components/wallet-btn';

import { convert, getToken, setToken } from '../../common/utils';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import DaoModelListBuilding from '../../components/dao-model-list-building';
import { useWalletProvider } from '../../components/web3modal';
import ProfileIconLabel from '../../components/profile-icon-label';

import { getTopicDetail, refreshToken, getBaseInfo } from '../../service';
import { req_newBuilding_detail } from '../../service/z_api';



import api from '../../lib/z_api';

import style from './index.module.css';

const nav = [
  {
    label: 'Buildings',
    type: 'buildings',
  },
  {
    label: 'Wearables',
    type: 'wearables',
  },
];
export default function Topic({ base_info, parcel_list, wearable_list, traffic_list, wearable }) {
  const meta = {
    // title: `${base_info.name} - ${SITE_NAME}`,
    title: `BuildingDetail - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };
  const router = useRouter();

  const [navState, setNavState] = React.useState(router.query.type || 'buildings');
  const { pathname } = router;

  const { addr, from } = router.query;
  const [searchText, setSearchText] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [baseInfo, setBaseInfo] = React.useState(convert(base_info));
  const [baseInfoContent, setBaseInfoContent] = React.useState('');
  const [navBox, setNavBox] = React.useState([
    {
      label: 'Buildings',
      type: 'buildings',
    },
    {
      label: 'Wearables',
      type: 'wearables',
    },]);
  const [avatarContent, setAvatarContent] = React.useState('');
  const [countryContent, setCountryContent] = React.useState('');
  const [parcelList, setParcelList] = React.useState(convert(parcel_list));
  const [wearableList, setWearableList] = React.useState(convert(wearable_list));
  const [originParcelList, setOriginParcelList] = React.useState(convert(parcel_list));
  // const [trafficList, setTrafficList] = React.useState(convert(traffic_list));
  const [wearables, setWearables] = React.useState(wearable);
  const [originWearables, setOriginWearables] = React.useState(wearable);
  const [fixedState, setFixedState] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [homeDetail, setHomeDetail] = React.useState(null);
  const [twitterDetail, setTwitterDetail] = React.useState(null);
  const [desDetail, setDesDetail] = React.useState(null);
  const [introductionText, setIntroductionText] = React.useState(null);
  const [buildingsContainer, setBuildingsContainer] = React.useState(null);

  const web3 = useWalletProvider();

  const f1 = parcelList && wearables ? style.fix3 : style.fix2;

  const requestData = React.useCallback(
    async (topicId: string | string[]) => {
      // console.log(topicId,2);

      setLoading(true);
      setError(false);
      try {
        if (!topicId) {
          setLoading(false);
          return;
        }
        const topicNewBuilding = Number(topicId);
        const res = await getTopicDetail(topicNewBuilding);
        const {
          base_info: baseInfoRes,
          parcel_list: parcelListRes,
          // traffic_list: trafficLists,
        } = res.data;
        setBaseInfo(convert(baseInfoRes));
        setParcelList(convert(parcelListRes));
        // setTrafficList(convert(trafficLists));
        setLoading(false);
      } catch (err) {
        setError(true);
      }
    },
    [addr],
  );

  const onRetry = React.useCallback(() => {
    requestData(addr);
  }, [addr]);

  const renderStatus = React.useMemo(() => {
    if (loading) {
      return <Status status="loading" />;
    }

    if (error) {
      return <Status retry={onRetry} status="error" />;
    }

    if (parcelList?.length === 0) {
      return <Status status="empty" />;
    }

  }, [loading, error, parcelList, wearableList]);

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


      const resDeta = await req_newBuilding_detail(walletAddress)
      // setBuildingsContainer(resDeta.data.buildings)
      setParcelList(convert(resDeta.data.buildings));
      setWearableList(convert(resDeta.data.wearable));

      setBaseInfoContent(resDeta.data.base_info?.name)
      setAvatarContent(resDeta.data.base_info?.logo_url)
      setCountryContent(resDeta.data.base_info?.country)
      setHomeDetail(resDeta.data.base_info?.website)
      setDesDetail(resDeta.data.base_info?.discord)
      setIntroductionText(resDeta.data.base_info?.description)
      setTwitterDetail(resDeta.data.base_info?.twitter)

      const data = resultHandler(res, requestPersonal);
      if (!data) {
        return;
      }
      const { profile } = data;
      state.setState({ profile });
    },
    [resultHandler, baseInfoContent, walletAddress, avatarContent, countryContent, buildingsContainer],
  );

  const changeNav = React.useCallback((t) => {
    setNavState(t);
  }, []);



  React.useEffect(() => {
    if (parcelList?.length === 0) {
      setNavState('wearables')
      setNavBox([{
        label: 'Wearables',
        type: 'wearables',
      }])
    } else if (wearableList?.length === 0) {
      setNavBox([{
        label: 'Buildings',
        type: 'buildings',
      },])
    } else if (parcelList?.length !== 0 || wearableList?.length !== 0) {
      setNavBox([{
        label: 'Buildings',
        type: 'buildings',
      },
      {
        label: 'Wearables',
        type: 'wearables',
      }])
    }

    console.log(navBox, "navBox");

    const accessToken = getToken('atk');
    if (accessToken) {
      requestPersonal(accessToken);
    }
    const strAdd = router.asPath
    const newAdd = strAdd.split('=')[1]

    // const a = getToken('address');
    if (newAdd) {
      setWalletAddress(newAdd);
    }

  }, [requestPersonal, walletAddress,]);

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
            x.buildingName?.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1
          );
        });
        setParcelList(dataToShow);
      }
    }
    if (navState === 'wearables') {
      if (wearableList) {
        if (searchText === '' || searchText === null) {
          setWearables(wearableList);
          return;
        }
        const dataToShow = wearableList.filter((x) => {
          return (
            x.name?.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1
            // x.creator_name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1 ||
            // x.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1
          );
        });
        setWearables(dataToShow);
      }
    }
  }, [searchText, parcelList, navState, originWearables, wearableList]);

  const rander = React.useMemo(() => {
    console.log(parcelList?.length);

    if (navState === 'buildings') {

      return (
        <div className={cn('main-content')}>
          {/* <div className={style.teaffic}>
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
          </div> */}

          <div className={style.parcel}>
            {parcelList?.length > 0 ? (
              <div>
                {/* {trafficList?.length !== 0 ? (
                  <div className={style.title}>
                    <div></div>
                    <p>Buildings</p>
                  </div>
                ) : null} */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-7 gap-8 pb-7 justify-center">
                  {parcelList.map((card, idx) => {
                    return <Card {...card} key={idx} hasTypeTag={false} ></Card>;
                  })}
                </div>
              </div>
            ) : null}
          </div>
          {/* {renderStatus} */}
        </div>
      );
    }
    if (navState === 'wearables') {


      return (
        <div className={style.wearable}>
          <DaoModelListBuilding
            models={wearableList}
            type={'topicNewBuilding'}
            address={router.query.address}
          ></DaoModelListBuilding>
        </div>
      )
    }



  }, [navState, wearables, parcelList, search, wearableList, router.query.address]);

  React.useEffect(() => {
    const listener = () => {
      if (document.getElementById('switch') && window.scrollY > 350) {
        setFixedState(true);
      } else {
        setFixedState(false);
      }
    };
    document.addEventListener('scroll', listener);
    return () => document.removeEventListener('scroll', listener);

  }, [fixedState]);

  return (
    <Page className="min-h-screen flex flex-col" meta={meta}>
      <div className="bg-black relative">
        <div className={fixedState ? style.fix1 : null}>
          <PageHeader
            className="relative z-10"
            active={navState === 'buildings' ? 'Build' : 'wearables'}
          />
        </div>
        <div
          className={cn('main-content flex justify-center flex-col  relative z-10', style.signBack)}
        >
          <UserAvatarBuilding
            avatar={avatarContent}
            name={baseInfoContent}
            country={countryContent}
            from={from}
            id={addr}
            // website={homeDetail}
            contact={[
              {
                icon: '/images/home.svg',
                label: 'Home',
                address: { homeDetail },
              },
              {
                icon: '/images/twitter.svg',
                label: 'Twitter',
                address: { twitterDetail },
              },
              {
                icon: '/images/discord.svg',
                label: 'Discord',
                address: `${base_info?.discord}`,
              },
            ]}
          ></UserAvatarBuilding>
          <div className={cn('flex justify-start items-center', style.links)}>
            {twitterDetail ? (
              <ProfileIconLabel
                label="Twitter"
                icon="/images/v5/Twitter.png"
                prefix={true}
                link={`https://twitter.com/${twitterDetail}`}
                isLink={true}
                classname={'text-sm'}
              ></ProfileIconLabel>
            ) : null}
            {twitterDetail && homeDetail ? <div className={cn('mx-5', style.divide)}></div> : null}
            {homeDetail ? (
              <ProfileIconLabel
                label={`Homepage`}
                link={homeDetail}
                icon="/images/v5/home.png"
                prefix={true}
                isLink={true}
                classname={'text-sm'}
              ></ProfileIconLabel>
            ) : null}
            {homeDetail && desDetail ? <div className={cn('mx-5', style.divide)}></div> : null}
            {desDetail ? (
              <ProfileIconLabel
                label={`Discord`}
                link={desDetail}
                icon="/images/icon/discord.png"
                prefix={true}
                isLink={true}
                classname={'text-sm'}
              ></ProfileIconLabel>
            ) : null}
          </div>
          <div className={style.intor}>{introductionText}</div>
        </div>
      </div>
      {parcelList && wearableList?.length !== 0 ? (
        <div className={cn(style.nav, fixedState ? style.fix2 : null)}>
          <div className={style.navCOntainer}>
            <div className={style.nav}>
              {navBox.map((item, idx) => {
                console.log(item);

                return (
                  <div
                    className={cn(style.item, navState === item.type ? style.action : null,)}
                    key={idx}
                    onClick={() => {
                      changeNav(item.type);
                      // router.replace(`/topic/${router.query.id}?type=${item.type}`);
                    }}
                  >
                    {item.label}
                    {/* {parcelList?.length === 0 ? '' : ''} */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
      <div
        id="switch"
        className={cn(
          'flex justify-center items-center flex-1',
          style.search,
          fixedState ? f1 : null,
        )}
      >
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

// export async function getServerSideProps(context) {
//   let res = null;
//   if (Number(context.params.id) && context.params.id.indexOf('0x') === -1) {
//     const topic = Number(context.params.id);
//     res = await api.req_topic_detail(topic, undefined);
//   } else {
//     res = await api.req_topic_detail(undefined, context.params.id);
//   }
//   const { base_info, parcel_list, traffic_list, wearable } = res.data;

//   return {
//     props: {
//       base_info,
//       parcel_list,
//       traffic_list,
//       wearable,
//     }, // will be passed to the page component as props
//   };
// }
