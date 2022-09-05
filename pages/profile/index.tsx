import React from 'react';

import cn from 'classnames';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-hot-toast';

import { className } from 'babylonjs/index';

import { useRouter, withRouter } from 'next/router';

import { join } from 'path/posix';

import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Footer from '../../components/footer';
import Profile from '../../components/profile';
import Tab from '../../components/tab';
import ChangeEmail from '../../components/changeEmail';
import Tab4 from '../../components/tab4';
import Status from '../../components/status';
import Card from '../../components/parcels-card';
import CardBuilding from '../../components/cardBuilding';
import DclCard from '../../components/parcels-dcl-card';
import Tab3 from '../../components/tab3';
import ParcelsTab from '../../components/parcels-tab';
import RentSet from '../../components/parcels_rent_set';
import Popup from '../../components/popup';
import store from '../../store/profile';
import BaseChart from '../../components/base-chart';
import PieChart from '../../components/pie-chart';
import PieChartDece from '../../components/pie-chart-dece';
import ProfileDetail from '../../components/profiledetail';
import ProfileDetailDece from '../../components/profiledetail-dece';
import { state } from '../../components/wallet-btn';
import BaseBar from '../../components/parcel-base-bar';
import BaseBarDece from '../../components/parcel-basebardece';
import TrafficBar from '../../components/parcel-traffic_bar';
import Creator from '../../components/creator';
import DaoModelList2 from '../../components/dao-model-list2';
import DaoWebglCard2 from '../../components/dao-webgl-graphic2';
import JoinBuilders from '../../components/join_builders';
import JoinBuildersAdd from '../../components/join_builders_add';
import JoinBuildersWork from '../../components/join_builders_works';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import { useWalletProvider } from '../../components/web3modal';

import { convert, getToken, setToken } from '../../common/utils';

import { getBaseInfo, refreshToken, getParcelList2 } from '../../service';

import {
  req_parcels_cancel,
  req_parcels_leased,
  req_dcl_parcel_list,
  req_dcl_cancel,
  req_dcl_leased,
  req_cv_parcel_traffic,
  req_cv_parcel_traffic_daily,
  req_cv_parcel_month_traffic_detail,
  req_deceData_parcel_traffic_daily,
  req_dece_parcel_traffic_list,
  req_dece_parcel_traffic,
  req_cv_parcel_traffic_list,
  req_get_user_wearable,
  req_set_wearable_show_status,
} from '../../service/z_api';



import style from './index.module.css';



const TABData = [
  {
    label: 'Voxels',
    icon: '/images/cvLogo.png',
    type: 'cryptovoxels',
  },
  {
    label: 'Decentraland',
    icon: '/images/Decentraland.jpg',
    type: 'decentraland',
  },
];
const REPORTTAB = [
  {
    label: 'Voxels',
    icon: '/images/cvLogo.png',
    type: 'cryptovoxels',
  },
  {
    label: 'Decentraland',
    icon: '/images/Decentraland.jpg',
    type: 'decentraland',
  },
];

const TAB3 = [
  {
    label: 'Parcel List',
    type: 'parcellist',
  },
  {
    label: 'Traffic Report',
    type: 'trafficreport',
  },
  {
    label: 'My Wearables',
    type: 'wearablelist',
  },
  {
    label: 'My Buildings',
    type: 'building',
  },
  // {
  //   label: 'SALES REPORT',
  // },
];

const wearablesNav = [
  {
    label: 'All',
    type: 'all',
  },
  {
    label: 'Shown',
    type: 'shown',
  },
  {
    label: 'Hidden',
    type: 'hidden',
  },
];
const showOrHide = {
  all: [
    {
      label: 'Show serveral',
      type: 'showServeral',
    },
    {
      label: 'Hide serveral',
      type: 'hideserveral',
    },
  ],
  shown: [
    {
      label: 'Hide serveral',
      type: 'hideserveral',
    },
  ],
  hidden: [
    {
      label: 'Show serveral',
      type: 'showServeral',
    },
  ],
};
function ProfilePage(r) {
  const nav_Label = React.useRef(null);
  const meta = {
    title: `Profile - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const router = useRouter();
  const s = store.useState('rentOutState', 'id', 'status', 'parcels_cardState', 'type');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [dataSource, setDataSource] = React.useState([]);
  const [dataBuildSource, setDataBuildSource] = React.useState([]);
  const [dclDataSource, setDclDataSource] = React.useState([]);
  const [avatar, setAvatarUrl] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [nickName, setNickName] = React.useState('');
  const [introductionText, setIntroduction] = React.useState('');
  const [countryAddress, setcountry] = React.useState('');
  const [twitterAddress, setTwitterAddress] = React.useState('');
  const [websiteAddress, setWebsiteAddress] = React.useState('');
  const [orginData, setOrginData] = React.useState({ parcelList: [] });
  const [showType, setShowType] = React.useState('cryptovoxels');
  const [tabState, setTabState] = React.useState('cryptovoxels');
  const [statue, setStatue] = React.useState(null);
  const [emailState, setEmailState] = React.useState(null);
  const [cartData, setCartData] = React.useState([]);
  const [manySetState, setManySetState] = React.useState(false);
  const [parcelsIds, setParcelsIds] = React.useState([]);
  const [cardState, setCardState] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [rent_set_state, set_rent_set_state] = React.useState(false);
  const [status, set_status] = React.useState('');
  const [type, set_type] = React.useState(false);
  const [value, set_value] = React.useState('');
  const [routeTab, setRouteTab] = React.useState(r.router.query.type || 'parcellist');
  const [email, setEmail] = React.useState(null);

  const [showTab, setShowTab] = React.useState(TAB3[0].label);
  const [tabStateTR, setTabStateTR] = React.useState(false);
  const [creatorState, setCreatorState] = React.useState(false);
  const [modifyEmail, setModifyEmail] = React.useState(false);

  const [navLabel, setNavLabel] = React.useState('All');
  const [wearablesNavState, setWearablesNavState] = React.useState('all');
  const wearablesState = React.useRef(null);
  const [showOrHideState, setShowOrHideState] = React.useState(false);
  const [creatorsState, setCreatorsState] = React.useState(null);
  const [wearablesCreatorsData, setWearablesCreatorsData] = React.useState([]);
  // const [ownerData, setOwnerData] = React.useState([]);
  const [wearablesCreatorsOriginData, setWearablesCreatorsOriginData] = React.useState([]);
  const [wearablesShowData, setWearablesShowData] = React.useState([]);
  const [wearablesHideData, setWearablesHideData] = React.useState([]);

  const [wearablesShowOrHideState, setWearablesShowOrHideState] = React.useState(false);
  const [joinBuilders, setJoinBuilders] = React.useState(false);
  const [wearablesShowOrHide, setWearablesShowOrHide] = React.useState(null);
  const [wearablesSleceteIdList, setWearablesSleceteIdList] = React.useState([]);
  const [initEmail, setInitEmail] = React.useState('');
  const [orginName, setOrginName] = React.useState('');
  const [country, setCountry] = React.useState('');

  const Nav = [
    {
      label: 'All',
      state: 1,
      num: 0,
    },
  ];

  // {
  //   label: 'For rent',
  //   state: 0,
  //   num: 0,
  // },
  // {
  //   label: 'Leased',
  //   state: 0,
  //   num: 0,
  // },
  // {
  //   label: 'Not for rent',
  //   state: 0,
  //   num: 0,
  // },

  // <div className={style.nav_right}>
  //             <div
  //               className={style.nav_right_item}
  //               onClick={(event) => {
  //                 event.stopPropagation();
  //                 manySet(manySetState);
  //                 setSelectedIds([]);
  //               }}
  //             >
  //               <img src="/images/Settings.png" />
  //               <div>Batch setting</div>
  //               {manySetState ? (
  //                 <div className={style.container}>
  //                   <div className={style.manySetList}>
  //                     {manySetLabel.map((item) => {
  //                       return (
  //                         <div
  //                           className={style.setItem}
  //                           key={item.label}
  //                           onClick={() => {
  //                             manyChange(item.label, cartData);
  //                             setSelectedIds([]);
  //                             store.setState(() => ({ parcels_cardState: true }));
  //                           }}
  //                         >
  //                           {item.label}
  //                         </div>
  //                       );
  //                     })}
  //                   </div>
  //                 </div>
  //               ) : (
  //                 <div></div>
  //               )}
  //             </div>
  //              <div className={style.nav_right_item}>
  //             <img src="/images/icon/kapian.png" className={style.left} />
  //             <div className={style.shuxian}></div>
  //             <img src="/images/icon/liebiao.png" className={style.right} />
  //           </div>
  //         </div>

  const [nav, setNav] = React.useState(Nav);
  const web3 = useWalletProvider();

  const all_many_set = [
    {
      label: 'Rent out several',
    },
    {
      label: 'Cancel lease for multiple',
    },
    {
      label: 'Mark several as leased',
    },
  ];

  const for_rent_many_set = [
    {
      label: 'Mark several as leased',
    },
    {
      label: 'Cancel lease for multiple',
    },
  ];
  const leased = [];

  const not_for_rent_many_set = [
    {
      label: 'Rent out several',
    },
  ];
  const [manySetLabel, setManySetLabel] = React.useState(all_many_set);
  const cls = cn('flex-1', style.bottomLine);

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

  const changeTab3 = React.useCallback(
    async (l, t) => {
      setTabState('cryptovoxels');
      setShowTab(l);
      setRouteTab(t);
      router.replace(`/profile?type=${t}`);
    },
    [showTab],
  );

  const onTabChange = React.useCallback(
    async (tab) => {
      if (tabState === tab) return;
      setLoading(true);
      setTabState(tab);
      setParcelsIds([]);
      setSelectedIds([]);
      setCardState(false);
      store.setState(() => ({ parcels_cardState: false, id: null }));
      if (tab === 'cryptovoxels') {
        setDataSource(orginData.parcelList);
        store.setState(() => ({ type: 'cv' }));
      }
      if (tab === 'decentraland') {
        setDataSource(orginData.parcelList);
        store.setState(() => ({ type: 'dcl' }));
      }
    },
    [orginData, tabState],
  );
  const onTabChangeTR = React.useCallback(
    async (tab) => {
      setShowType(tab);
      if (tabState === tab) return;
      setLoading(true);
      setTabState(tab);
      setParcelsIds([]);
      setSelectedIds([]);
      setCardState(false);
      store.setState(() => ({ parcels_cardState: false, id: null }));
      if (tab === 'cryptovoxels') {
        setDataSource(orginData.parcelList);
        store.setState(() => ({ type: 'cv' }));
      }
      if (tab === 'decentraland') {

        setDclDataSource(orginData.parcelList);
        store.setState(() => ({ type: 'dcl' }));
      }
    },
    [orginData, tabState],
  );

  // const onTabChangeTR = React.useCallback((i) => {

  //   setTabStateTR(i);

  // }, []);

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

  const changeNavTab = React.useCallback(

    (nav_label, index = 0) => {
      // console.log(nav_label,222222222222222);

      // setNavLabel(navLabel);
      setNavLabel(nav_label);
      setCardState(false);
      setManySetState(false);
      nav_Label.current = nav_label;
      // changeNum(dataSource, nav_label);
      // console.log(Nav);

      const set_nav = Nav.map((item, i) => {
        if (index === i) return { ...item, state: 1 };
        return { ...item, state: 0 };
      });
      // console.log(set_nav);
      setNav(set_nav);
    },
    [Nav, setCardState, setManySetState, setNavLabel, setNav, dataSource, cartData],
  );

  // 过滤数组 拿到每一项对应的数量
  const changeNum = React.useCallback(
    (data, current_label = 'All') => {
      if (current_label === 'All') {
        const current_all = data.slice();
        setCartData(current_all);
      }
      if (current_label === 'For rent') {
        const current_forRent = data.filter((item) => item.status === 'for_rent');
        setCartData(current_forRent);
      }
      if (current_label === 'Leased') {
        const current_leased = data.filter((item) => item.status === 'leased');
        setCartData(current_leased);
      }
      if (current_label === 'Not for rent') {
        const notForRent = data.filter((item) => item.status === 'not_for_rent');
        setCartData(notForRent);
      }
      if (nav_Label.current === null) {
        changeNavTab('All');
      }
    },
    [Nav, setCartData, navLabel, setLabel, setNavLabel, cartData],
  );

  const requestData = React.useCallback(
    async (token: string) => {
      setLoading(true);
      try {
        const res = await getParcelList2(token);
        const data = resultHandler(res, requestData);
        setLoading(false);
        if (!data) {
          return;
        }
        setDataSource(data.parcelList);
        changeNum(data.parcelList, nav_Label.current);
      } catch {
        setError(true);
      }
    },
    [resultHandler, tabState, nav_Label],
  );

  const reqDclData = React.useCallback(
    async (token: string) => {
      try {
        const res = await req_dcl_parcel_list(token);
        const data = resultHandler(res, reqDclData);
        setLoading(false);
        if (!data) {
          return;
        }
        setDclDataSource(data.parcelList);
        changeNum(data.parcelList, nav_Label.current);
      } catch {
        setError(true);
      }
    },
    [resultHandler, tabState, nav_Label],
  );

  const requestPersonal = React.useCallback(
    async (token: string) => {
      const res = await getBaseInfo(token);

      const sta = res.data.profile.creator_status
      // const emailState = res.data.profile.email

      setStatue(sta)
      console.log(sta, 88888, emailState, 888, statue);

      // setEmailState(res.data.profile.email)
      // console.log(res.data.profile.creator_status,99999);

      // const statue = res.data.profile.creator_status;

      const data = resultHandler(res, requestPersonal);
      if (!data) {
        return;
      }
      const { profile } = data;
      const {
        address: addr,
        nickName: name,
        introduction: m,
        country: n,
        avatar: ava,
        links,
        email: e,
        creatorStatus,
      } = profile;
      const { twitterName, websiteUrl } = links;
      setToken('address', addr);
      setEmail(e);
      setAvatarUrl(ava);
      setCreatorsState(creatorStatus);
      setAddress(addr);
      setNickName(name);
      setIntroduction(m);
      setcountry(n);
      setTwitterAddress(twitterName);
      setWebsiteAddress(websiteUrl);
      state.setState({ profile });
    },
    [resultHandler, statue],
  );

  const reqWearablesData = React.useCallback(async () => {
    const result = await req_get_user_wearable(await refreshTK());
    if (result.code === 100000) {
      const show = result.data.filter((i) => {
        return i.show_status === 1;
      });
      const hide = result.data.filter((i) => {
        return i.show_status === 2;
      });
      // console.log(wearablesState.current);
      if (wearablesState.current === 'all') {
        setWearablesCreatorsData(result.data);
      } else if (wearablesState.current === 'shown') {
        setWearablesCreatorsData(show);
      } else if (wearablesState.current === 'hidden') {
        setWearablesCreatorsData(hide);
      } else {
        setWearablesCreatorsData(result.data);
      }
      setWearablesCreatorsOriginData(result.data);
      setWearablesShowData(show);
      setWearablesHideData(hide);
    }
  }, [refreshTK]);

  const onRetry = React.useCallback(async () => {
    const accessToken = getToken('atk');
    if (accessToken && tabState === 'cryptovoxels') {
      requestData(accessToken);
    }
    if (accessToken && tabState === 'decentraland') {
      reqDclData(accessToken);
    }
  }, [requestData, getToken, reqDclData]);

  const addWork = React.useCallback(async () => {
    // <JoinBuilders/>
    // joinBuilders
    setJoinBuilders(true)
    console.log(joinBuilders, 5555555555);


    // renderssssContent
  }, [joinBuilders])


  const turnOff = () => {
    setJoinBuilders(false)
  }
  const turnBuild = () => {
    setTabStateTR(false)
  }
  const nextBtn = () => {
    setJoinBuilders(false)
    setTabStateTR(true)
  }
  const nextBtnAdd = () => {
    setTabStateTR(false)
  }
  const addBuildOther = () => {
    console.log(444444444);

  }

  const select = React.useCallback(
    (id, ids) => {
      if (ids.findIndex((item) => item === id) === -1) return;
      if (selectedIds.findIndex((item) => item === id) !== -1) {
        selectedIds.splice(
          selectedIds.findIndex((item) => item === id),
          1,
        );
        setSelectedIds([...selectedIds]);
      } else {
        selectedIds.push(id);
        setSelectedIds([...selectedIds]);
      }
    },
    [state, selectedIds],
  );

  const renderContent = React.useMemo(() => {
    if (loading) {
      return <Status status="loading" />;
    }
    if (error) {
      return <Status retry={onRetry} status="error" />;
    }
    if (cartData.length === 0) {
      return <Status status="empty" />;
    }
    if (tabState === 'cryptovoxels') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
          {dataSource.map((card) => {
            return (
              <Card
                {...card}
                parcelsIds={parcelsIds}
                state={cardState}
                key={uuid()}
                selectedIds={selectedIds}
                onClick={(id, ids) => {
                  select(id, ids);
                }}
              ></Card>
            );
          })}
        </div>
      );
    }
    if (tabState === 'decentraland') {
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-7">
            {dclDataSource.map((card) => {
              return (
                <DclCard
                  {...card}
                  parcelsIds={parcelsIds}
                  state={cardState}
                  key={uuid()}
                  y
                  selectedIds={selectedIds}
                  onClick={(id, ids) => {
                    select(id, ids);
                  }}
                ></DclCard>
              );
            })}
          </div>
        </>
      );
    }
  }, [
    error,
    dataSource,
    loading,
    onRetry,
    changeNum,
    parcelsIds,
    setCardState,
    tabState,
    reqDclData,
  ]);
  const renderBuilding = React.useMemo(() => {
    if (loading) {
      return <Status status="loading" />;
    }
    if (error) {
      return <Status retry={onRetry} status="error" />;
    }
    if (dataBuildSource.length === 0) {
      return <Status addWork={addWork} status="emptyBuilding" />;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
        {dataBuildSource.map((card) => {
          return (
            <CardBuilding
              {...card}
              parcelsIds={parcelsIds}
              state={cardState}
              key={uuid()}
              selectedIds={selectedIds}
              onClick={(id, ids) => {
                select(id, ids);
              }}
            ></CardBuilding>
          );
        })}
      </div>
    );
  }, [
    error,
    dataBuildSource,
    loading,
    onRetry,
    changeNum,
    parcelsIds,
    setCardState,
    tabState,
    reqDclData,
  ]);

  // 批量设置
  const manySet = React.useCallback(
    (current_manySetState) => {
      setManySetState(!current_manySetState);
      nav.forEach((item) => {
        if (item.state === 1) {
          if (item.label === 'All') setManySetLabel(all_many_set);
          if (item.label === 'For rent') setManySetLabel(for_rent_many_set);
          if (item.label === 'Leased') setManySetLabel(leased);
          if (item.label === 'Not for rent') setManySetLabel(not_for_rent_many_set);
        }
      });
    },
    [setManySetState, nav, setManySetLabel],
  );

  const manyChange = React.useCallback(
    (many_label, data, sta = true) => {
      const ids = [];
      if (many_label === 'Rent out several')
        data.forEach((item) => {
          if (item.status === 'not_for_rent') ids.push(item.parcelId);
        });
      if (many_label === 'Cancel lease for multiple' || many_label === 'Mark several as leased')
        data.forEach((item) => {
          if (item.status === 'for_rent') ids.push(item.parcelId);
        });
      setParcelsIds(ids);
      setCardState(sta);
      setLabel(many_label);
      setSelectedIds([]);
      changeNum(dataSource, nav_Label);
    },
    [setParcelsIds, setLabel, setCardState, changeNavTab, changeNum, nav_Label, dataSource],
  );

  const close_rent_set = React.useCallback(
    (current_state) => {
      manyChange(label, cartData, false);
      set_rent_set_state(current_state);
      setManySetState(false);
      setSelectedIds([]);
      store.setState(() => ({ rentOutState: false }));
    },
    [rent_set_state, manyChange],
  );


  const requireData = React.useCallback(
    async (token) => {
      const res = await getBaseInfo(token);
      const data = resultHandler(res, requireData);
      if (data) {
        const profile = convert(data.profile);
        const {
          address: addr,
          nickName: name,
          // avatar,
          links,
          email: e,
          country: c,
          introduction: i,
        } = profile;
        const { twitterName, websiteUrl } = links;
        setAvatarUrl(avatar);
        setInitEmail(e);
        if (e) {
          setEmail(e);
        }
        setCountry(c);
        setIntroduction(i);
        setAddress(addr);
        setNickName(name);
        setOrginName(name);
        setTwitterAddress(twitterName);
        setWebsiteAddress(websiteUrl);
        state.setState({ profile });
      }
    },
    [resultHandler],
  );

  const closeEmail = React.useCallback((t) => {
    setEmailState(false);
    const accessToken = getToken('atk');

    if (t === 'bind') {
      toast.success('Binding succeeded');
    }
    if (t === 'modify') {
      setModifyEmail(false);
      setEmailState(true);
    }

    if (accessToken) {
      requireData(accessToken);
    }
  }, []);

  const req_event = React.useCallback(async () => {
    if (selectedIds.length === 0) return;
    // 批量挂出
    if (label === 'Rent out several') {
      set_rent_set_state(true);
      setManySetState(false);
      setCardState(false);
      store.setState(() => ({ parcels_cardState: false, updateOrAdd: 'add' }));
    }
    if (s.type === 'cv') {
      // 批量标记已出租
      if (label === 'Mark several as leased') {
        const token = await refreshTK();
        const result = await req_parcels_leased(token, selectedIds.join(','));
        if (result.code === 100000) {
          store.setState(() => ({ rentOutState: false, status: 'Successfully marked!' }));
        } else {
          store.setState(() => ({ rentOutState: false, status: 'Failed!' }));
        }
        set_rent_set_state(true);
        setManySetState(false);
        setCardState(false);
        store.setState(() => ({ parcels_cardState: false }));
      }
      // 批量取消出租
      if (label === 'Cancel lease for multiple') {
        const token = await refreshTK();
        const result = await req_parcels_cancel(token, selectedIds.join(','));
        if (result.code === 100000)
          store.setState(() => ({ rentOutState: false, status: 'Successfully cancelled!' }));
        else store.setState(() => ({ rentOutState: false, status: 'Failed!' }));

        set_rent_set_state(true);
        setManySetState(false);
        setCardState(false);
        store.setState(() => ({ parcels_cardState: false }));
      }
    }
    if (s.type === 'dcl') {
      // 批量标记已出租
      if (label === 'Mark several as leased') {
        const token = await refreshTK();
        const result = await req_dcl_leased(token, selectedIds.join(','));
        if (result.code === 100000) {
          store.setState(() => ({ rentOutState: false, status: 'Successfully marked!' }));
        } else {
          store.setState(() => ({ rentOutState: false, status: 'Failed!' }));
        }
        set_rent_set_state(true);
        setManySetState(false);
        setCardState(false);
        store.setState(() => ({ parcels_cardState: false }));
      }
      // 批量取消出租
      if (label === 'Cancel lease for multiple') {
        const token = await refreshTK();
        const result = await req_dcl_cancel(token, selectedIds.join(','));
        if (result.code === 100000)
          store.setState(() => ({ rentOutState: false, status: 'Successfully cancelled!' }));
        else store.setState(() => ({ rentOutState: false, status: 'Failed!' }));
        set_rent_set_state(true);
        setManySetState(false);
        setCardState(false);
        store.setState(() => ({ parcels_cardState: false }));
      }
    }
  }, [selectedIds, setCardState, set_rent_set_state]);

  const watcher_store = React.useCallback(() => {
    set_rent_set_state(s.rentOutState);
    setManySetState(false);
    const id = [];
    if (s.id) {
      id.push(s.id);
      setSelectedIds(id);
    }
  }, [s, setSelectedIds]);
  const watcher_store_status = React.useCallback(() => {
    if (s.status === '') return;
    if (s.status !== 'Failed!') {
      set_status('succeed');
      set_type(true);
      set_value(s.status);
      setTimeout(() => {
        set_type(false);
        store.setState(() => ({ status: '' }));
      }, 2000);
      return;
    }
    set_status('error');
    set_type(true);
    set_value(s.status);
    setTimeout(() => {
      set_type(false);
      store.setState(() => ({ status: '' }));
    }, 2000);
  }, [s.status, set_status, set_type, set_value]);
  const watcher_cardState = React.useCallback(() => {
    setCardState(s.parcels_cardState);
  }, [s.parcels_cardState]);


  React.useEffect(() => {
    setNavLabel('All')
    const accessToken = getToken('atk');
    setRouteTab(r.router.query.type);
    reqWearablesData();
    requestPersonal(accessToken);
    if (tabState === 'cryptovoxels') requestData(accessToken);
    if (tabState === 'decentraland') reqDclData(accessToken);
    watcher_store();
    watcher_store_status();
    watcher_cardState();
    if (!accessToken) window.location.href = '/';
  }, [
    navLabel,
    getToken,
    requestData,
    requestPersonal,
    watcher_store,
    reqDclData,
    r.router.query.type,
    routeTab,
    tabState,
    reqWearablesData,
  ]);

  const tag1 = () => {
    if (label === 'Cancel lease for multiple') return 'Cancel leased';
    return 'Mark as leased';
  };
  const tag2 = () => {
    if (cardState) {
      return (
        <div className={style.succeedOrCancel}>
          <div className={style.container}>
            <div className={style.info}>
              selected ({selectedIds.length}/{parcelsIds.length})
            </div>
            <div
              className={style.succeed}
              onClick={() => {
                req_event();
                if (selectedIds.length === 0) return;
                if (label === 'Rent out several') {
                  store.setState(() => ({
                    parcels_cardState: false,
                    rentOutState: true,
                    id: null,
                  }));
                }
              }}
            >
              {label === 'Rent out several' ? 'Rent out' : tag1()}
            </div>
            <div
              className={style.cancel}
              onClick={() => {
                manyChange(label, cartData);
                setCardState(false);
                setSelectedIds([]);
                store.setState(() => ({ parcels_cardState: false }));
              }}
            >
              Close
            </div>
          </div>
        </div>
      );
    }
    return <div></div>;
  };

  const settingShowOrHide = React.useCallback((t) => {
    setWearablesShowOrHideState(true);
    setWearablesShowOrHide(t === 'showServeral' ? 1 : 2);
  }, []);

  const batchShowOrHide = React.useCallback(
    async (id = null, stat = null) => {
      let result = null;
      if (id && stat) {
        result = await req_set_wearable_show_status(await refreshTK(), id, stat);
      } else {
        result = await req_set_wearable_show_status(
          await refreshTK(),
          wearablesSleceteIdList.join(),
          wearablesShowOrHide,
        );
      }
      // console.log(result, wearablesShowOrHide, stat);
      if (result.code === 100000) {
        if (wearablesShowOrHide === 2 || stat === 2) {
          toast.success('Successfully hidden!');
        }
        if (wearablesShowOrHide === 1 || stat === 1) {
          toast.success('Successfully shown!');
        }
      } else {
        toast.error('Failed!');
      }
      setWearablesShowOrHideState(false);
      setWearablesShowOrHide(0);
      setWearablesSleceteIdList([]);
      reqWearablesData();
    },
    [wearablesShowOrHide, wearablesSleceteIdList, reqWearablesData],
  );

  const setWearablesId = React.useCallback(
    (id) => {
      if (wearablesSleceteIdList.findIndex((item) => item === id) === -1) {
        wearablesSleceteIdList.push(id);
      } else {
        wearablesSleceteIdList.splice(
          wearablesSleceteIdList.findIndex((item) => item === id),
          1,
        );
      }
      setWearablesSleceteIdList([...wearablesSleceteIdList]);
    },
    [wearablesSleceteIdList],
  );
  const creatorsReander = React.useMemo(() => {

    if (wearablesCreatorsData.length === 0) {
      return (
        <div className={style.totop}>
          <Status status="empty" />;
        </div>
      );
    }
    if (wearablesCreatorsData.length !== 0) {
      return (
        <>
          <DaoModelList2
            models={wearablesCreatorsData}
            token={refreshTK()}
            wearablesShowOrHideState={wearablesShowOrHideState}
            wearablesShowOrHide={wearablesShowOrHide}
            length={wearablesCreatorsData.length}
            onClick={setWearablesId}
            wearablesSleceteIdList={wearablesSleceteIdList}
            batchShowOrHide={batchShowOrHide}
          ></DaoModelList2>
        </>
      );
    }
  }, [
    wearablesCreatorsData,
    wearablesShowOrHideState,
    wearablesShowOrHide,
    setWearablesId,
    wearablesSleceteIdList,
    batchShowOrHide,
  ]);
  // const ownedRander = React.useMemo(() => {
  //   if (ownerData.length === 0) {
  //     return (
  //       <div className={style.totop}>
  //         <Status status="empty" />;
  //       </div>
  //     );
  //   }
  //   if (ownerData.length !== 0) {
  //     return (
  //       <>
  //         <DaoModelList2 models={ownerData} type={'owner'}></DaoModelList2>
  //       </>
  //     );
  //   }
  // }, [ownerData]);

  const creatorDisplay = React.useCallback(() => {
    setCreatorState(true);
  }, []);
  const changeCreatorState = React.useCallback(
    async (sta = false) => {
      if (sta) {
        requestPersonal(await refreshTK());
      }
      setCreatorState(false);
    },
    [requestPersonal],
  );
  const randerCardList = React.useMemo(() => {
    if (routeTab === 'parcellist') {
      return (
        <>
          <div className={cn('tab-list flex ', style.allHeight)}>
            <div className={cls}></div>
            <div className={cn("main-content flex px-0", style.tabtext)} >
              {TABData.map((item) => {
                return (
                  <Tab4
                    active={tabState === item.type}
                    isMini={true}
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
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
          {/* 导航 */}
          <div className={style.nav}>
            <div className={style.nav_left}>
              {nav.map((item, index) => {
                return (
                  <>
                    <ParcelsTab
                      dataSource={tabState === 'cryptovoxels' ? dataSource : dclDataSource}
                      label={item.label}
                      state={item.state}
                      num={item.num}
                      key={item.label}
                      onClick={() => {
                        changeNavTab(item.label, index);
                      }}
                    />
                  </>
                );
              })}
            </div>
          </div>
          {/* 导航结束 */}
          {/* 卡片开始 */}
          <div className={cn('main-content mt-8', style.content)} style={{ marginTop: "-20px" }}>{renderContent}</div>

          {/* 卡片结束 */}
          {tag2()}
          <RentSet
            state={rent_set_state}
            onClick={(current_state) => {
              close_rent_set(current_state);
            }}
            selectedIds={selectedIds}
          />
          <Popup status={status} type={type} value={value} />
        </>
      );
    }
    if (routeTab === 'trafficreport') {
      if (showType === "cryptovoxels") {
        return (
          <>
            <div className={cn('tab-list flex mt-5', style.allHeight)}>
              <div className={cls}></div>
              <div className={cn("main-content flex px-0", style.tabtext)}>
                {REPORTTAB.map((item) => {
                  return (
                    <Tab4
                      active={tabState === item.type}
                      isMini={true}
                      key={item.label}
                      label={item.label}
                      icon={item.icon}
                      onClick={() => {
                        onTabChangeTR(item.type);
                      }}
                    />
                  );
                })}
                <div className={cls} />
              </div>
              <div className={cls} />
            </div>
            <div className={cn(style.content)}>
              <BaseChart >
                <BaseBar
                  id={'parcel1'}
                  labelText={'DAILY TRAFFIC OF ALL MY PARCELS '}
                  dataHandlder={req_cv_parcel_traffic}
                  barWidth={20}
                  limit={21}
                  textColor={style.nftColor}
                  token={refreshTK()}
                ></BaseBar>
              </BaseChart>
              {/* <BaseChart className=" my-5">
                <TrafficBar
                  id={'parcel3'}
                  labelText={'DAILY TRAFFIC'}
                  dataHandlder={req_cv_parcel_traffic_list}
                  barWidth={20}
                  limit={21}
                  textColor={style.nftColor}
                  token={refreshTK()}
                ></TrafficBar>
              </BaseChart> */}
              <BaseChart className=" my-5" type={true}>
                <PieChart
                  id="piechart2"
                  labelText={'PERCENTAGE OF PARCEL TRAFFIC '}
                  dataHandlder={req_cv_parcel_traffic_daily}
                  token={refreshTK()}
                  textColor={style.nftColor}
                  options={[
                    {
                      label: 'Day',
                      value: 'day',
                    },
                    {
                      label: 'Week',
                      value: 'week',
                    },
                    {
                      label: 'Month',
                      value: 'month',
                    },
                  ]}
                ></PieChart>
              </BaseChart>
              <BaseChart className=" my-5" type={true}>
                <ProfileDetail
                  label={'DETAILED TRAFFIC INFORMATION LIST OF PARCELS'}
                  dataHandlder={req_cv_parcel_month_traffic_detail}
                  token={refreshTK()}
                  textColor={style.nftColor}
                ></ProfileDetail>
              </BaseChart>
            </div>
          </>
        );
      }
      if (showType === "decentraland") {
        return (
          <>
            <div className={cn('tab-list flex ', style.allHeight)}>
              <div className={cls}></div>
              <div className="main-content flex px-0">
                {REPORTTAB.map((item) => {
                  return (
                    <Tab4
                      active={tabState === item.type}
                      isMini={true}
                      key={item.label}
                      label={item.label}
                      icon={item.icon}
                      onClick={() => {
                        onTabChangeTR(item.type);
                      }}
                    />
                  );
                })}
                <div className={cls} />
              </div>
              <div className={cls} />
            </div>
            <div className={cn(style.content)}>
              <BaseChart >
                <BaseBarDece
                  id={'parcel1'}
                  labelText={'DAILY TRAFFIC OF ALL MY PARCELS '}
                  dataHandlder={req_dece_parcel_traffic}
                  barWidth={20}
                  limit={21}
                  textColor={style.deceColor}
                  token={refreshTK()}
                ></BaseBarDece>
              </BaseChart>
              <BaseChart className=" my-5" type={true}>
                <PieChartDece
                  id="piechart2"
                  labelText={'PERCENTAGE OF PARCEL TRAFFIC '}
                  dataHandlder={req_deceData_parcel_traffic_daily}
                  token={refreshTK()}
                  textColor={style.deceColor}
                  options={[
                    {
                      label: 'Day',
                      value: 'day',
                    },
                    {
                      label: 'Week',
                      value: 'week',
                    },
                    {
                      label: 'Month',
                      value: 'month',
                    },
                  ]}
                ></PieChartDece>
              </BaseChart>
              <BaseChart className=" my-5" type={true}>
                <ProfileDetailDece
                  label={'DETAILED TRAFFIC INFORMATION LIST OF PARCELS'}
                  dataHandlder={req_dece_parcel_traffic_list}
                  token={refreshTK()}
                  textColor={style.deceColor}
                ></ProfileDetailDece>
              </BaseChart>
            </div>
          </>
        )

      }
    }
    if (routeTab === 'wearablelist') {
      
      // if(statue===1){
      return (
        <>
          {statue === 1 ?
            <div className={style.createrCont}>
              <span className={style.join}>Join Creators to show your works</span>
              <span className={style.apply}>Apply</span>
            </div>
            : <></>}
        </>
      )
      // }else{


    }
    // return (
    //   <>
    //     {/* <div className={cn('tab-list flex mt-5', style.allHeight)}>
    //       <div className={cls}></div>
    //       <div className="main-content flex px-0">
    //         {TAB.map((item) => {
    //           return (
    //             <Tab
    //               active={tabState === item.type}
    //               isMini={true}
    //               key={item.label}
    //               label={item.label}
    //               icon={item.icon}
    //               onClick={() => {
    //                 onTabChange(item.type);
    //               }}
    //             />
    //           );
    //         })}
    //         <div className={cls} />
    //       </div>
    //       <div className={cls} />
    //     </div> */}

    //     <div className={style.wearablesContainer}>
    //       <div className={style.title}>
    //         <div className={style.wearables}

    //         ></div>
    //         <div className={style.texteated}>Wearables Created</div>
    //       </div>
    //       <div className={style.wearablesNav}>
    //         <div className={style.left}>
    //           {wearablesNav.map((item, index) => {
    //             return (
    //               <>

    //                 <div
    //                   onClick={() => {
    //                     setWearablesNavState(item.type);
    //                     wearablesState.current = item.type;
    //                     setShowOrHideState(false);
    //                     if (item.type === 'all') {
    //                       setWearablesCreatorsData(wearablesCreatorsOriginData);
    //                     }
    //                     if (item.type === 'shown') {
    //                       setWearablesCreatorsData(wearablesShowData);
    //                     }
    //                     if (item.type === 'hidden') {
    //                       setWearablesCreatorsData(wearablesHideData);
    //                     }
    //                   }}
    //                   className={cn(
    //                     style.wearablesNavItem,
    //                     wearablesNavState === item.type ? style.wearableNavAction : null,
    //                   )}
    //                   key={uuid()}
    //                 >
    //                   {/* <div className={style.mmm}> */}
    //                   <div >{item.label}
    //                     {/* <span>{item.label}</span> */}
    //                     <span style={{ marginLeft: "2px" }}>
    //                       {item.type === 'all' ? wearablesCreatorsOriginData.length : null}
    //                       {item.type === 'shown' ? wearablesShowData.length : null}
    //                       {item.type === 'hidden' ? wearablesHideData.length : null}
    //                     </span>
    //                   </div>

    //                   {/* </div> */}
    //                 </div>
    //               </>
    //             );
    //           })}
    //         </div>
    //         <div
    //           className={style.right}
    //           onClick={() => {
    //             setShowOrHideState(!showOrHideState);
    //           }}
    //         >
    //           <img src="/images/Settings.png" />
    //           <div>Batch setting</div>
    //           <ul
    //             className={
    //               wearablesNavState === 'all' && showOrHideState
    //                 ? style.showOrHideList
    //                 : style.showOrHideList1
    //             }
    //           >
    //             {showOrHideState
    //               ? showOrHide[wearablesNavState].map((item, index) => {
    //                 return (
    //                   <li
    //                     className={style.showOrHideItem}
    //                     key={index}
    //                     onClick={() => {
    //                       settingShowOrHide(item.type);
    //                     }}
    //                   >
    //                     {item.label}
    //                   </li>
    //                 );
    //               })
    //               : null}
    //           </ul>
    //         </div>
    //       </div>
    //       <div style={{ marginTop: '22px', marginBottom: '50px' }}>{creatorsReander}</div>
    //     </div>
    //   </>
    // );
    // }
    if (routeTab === 'building') {
      return (
        <>
          <div className={style.buildingContainer}>
            <div className={cn('main-content mt-8', style.content)} style={{ marginTop: "-20px" }}>{renderBuilding}
            </div>
          </div>
        </>
      )

    }
  }, [
    showTab,
    status,
    type,
    value,
    selectedIds,
    rent_set_state,
    s,
    cartData,
    manySetLabel,
    renderContent,
    renderBuilding,
    dataSource,
    dataBuildSource,
    tabState,
    routeTab,
    creatorsReander,
  ]);

  return (
    <Page className={cn('min-h-screen', style.anPage,)} meta={meta} >
      {/* joinBuilders === true?style.joinBuilders:'' */}
      <div
        onClick={() => {
          setManySetState(false);
        }}
        className={style.bigPic}
      >
        <div className=" relative">
          <PageHeader className="relative z-10" active={'profile'} />
        </div>

        <div className={cn(' flex flex-col justify-center items-center')}>
          <Profile
            avater={avatar}
            address={address}
            creatorsState={creatorsState}
            twitter={twitterAddress}
            home={websiteAddress}
            country={countryAddress}
            name={nickName}
            email={email}
            onClick={creatorDisplay}
            classname="main-content"
          ></Profile>
          <div className={style.intor}>{introductionText}</div>
          <div className={cn(style.tablebg)}>
            <div className={cn(style.tableList)}>
              {TAB3.map((item) => {
                return (
                  <Tab3
                    label={item.label}
                    key={item.label}
                    active={routeTab === item.type}
                    onClick={() => {
                      changeTab3(item.label, item.type);
                    }}
                  />
                );
              })}
            </div>
          </div>
          {randerCardList}
          <div style={{ width: "100%" }}><Footer /></div>
        </div>
      </div>
      {creatorState ? (
        <Creator
          onClick={changeCreatorState}
          token={refreshTK()}
          email={email}
          address={address}
        ></Creator>
      ) : null}

      {wearablesShowOrHideState ? (
        <div className={style.settingShowOrHide}>
          {`${wearablesSleceteIdList.length}/${wearablesShowOrHide === 1 ? wearablesHideData.length : wearablesShowData.length
            } selected`}
          <div
            onClick={() => {
              setWearablesShowOrHideState(false);
              setWearablesShowOrHide(0);
              setWearablesSleceteIdList([]);
            }}
            className={style.close}
          >
            Close
          </div>
          <div
            className={style.showOrHide}
            onClick={() => {
              batchShowOrHide();
            }}
          >
            {wearablesShowOrHide !== 1 ? 'Hide' : 'Show'}
          </div>
        </div>
      ) : null}
      {joinBuilders === true ? <>
        <JoinBuilders
            turnOff={turnOff} 
            nextBtn={nextBtn}
          />
        {/* <JoinBuildersWork
          turnOff={turnOff}
          nextBtnAdd={nextBtnAdd}
        /> */}

        {/* <ChangeEmail
        value={email}
        state={emailState}
        closeEmail={closeEmail}
        modifyEmail={modifyEmail}
      ></ChangeEmail> */}
      </> : ''}
      {tabStateTR === true ? <>
        <JoinBuildersAdd
          turnBuild={turnBuild}
          nextBtnAdd={nextBtnAdd}
        />
      </> : ''}
    </Page>
  );
}

export default withRouter(ProfilePage);
