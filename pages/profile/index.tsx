import React, { useEffect } from 'react';

import cn from 'classnames';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-hot-toast';

import { className } from 'babylonjs/index';

import { useRouter, withRouter } from 'next/router';

import { join } from 'path/posix';

import Page from '../../components/page';
// import PageHeader from '../../components/page-header';
import PageHeader from '../../components/top-navigation';
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
import JoinModal from '../../components/v2/join-modal';
import Creator from '../../components/creator';
import DaoModelList2 from '../../components/dao-model-list2';
import DaoWebglCard2 from '../../components/dao-webgl-graphic2';
import JoinBuilders from '../../components/join_builders';
import JoinBuildersAdd from '../../components/join_builders_add';
import AddBuildings from '../../components/addBuilding';
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
  req_building_list,
  req_cv_parcel_traffic_list,
  req_get_user_wearable,
  req_set_wearable_show_status,
  req_bind_ver_email_code,
  req_userBuilder_apply_become,
  req_user_add_or_edit_building,
  req_get_building_detail_info,
  req_builder_del_self_building,
} from '../../service/z_api';


// console.log(req_building_list('0x79EF3DA763754387F06022Cf66c2668854B3389B'));




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
  const [noWork, setNoWork] = React.useState(false);
  const [builderSat, setBuilderSat] = React.useState(false);
  const [dataSource, setDataSource] = React.useState([]);
  const [dataBuildSource, setDataBuildSource] = React.useState([]);
  const [dclDataSource, setDclDataSource] = React.useState([]);
  const [avatar, setAvatarUrl] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [nickNameVal, setNickNameVla] = React.useState('');
  const [introductionText, setIntroduction] = React.useState('');
  const [countryAddress, setcountry] = React.useState('');
  const [twitterAddress, setTwitterAddress] = React.useState('');
  const [websiteAddress, setWebsiteAddress] = React.useState('');
  const [orginData, setOrginData] = React.useState({ parcelList: [] });
  const [showType, setShowType] = React.useState('cryptovoxels');
  const [tabState, setTabState] = React.useState('cryptovoxels');
  const [statue, setStatue] = React.useState(null);
  const [emailStateVal, setEmailStateVal] = React.useState(null);
  const [buildState, setBuildState] = React.useState(null);
  const [cartData, setCartData] = React.useState([]);
  const [manySetState, setManySetState] = React.useState(false);
  const [parcelsIds, setParcelsIds] = React.useState([]);
  const [cardState, setCardState] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [rent_set_state, set_rent_set_state] = React.useState(false);
  const [status, set_status] = React.useState('');
  const [saveIconVal, setSaveIconVal] = React.useState(false);
  const [type, set_type] = React.useState(false);
  const [value, set_value] = React.useState('');
  const [routeTab, setRouteTab] = React.useState(r.router.query.type || 'parcellist');
  const [email, setEmail] = React.useState(null);
  const [addbuild, setAddbuild] = React.useState(false);

  const [showTab, setShowTab] = React.useState(TAB3[0].label);
  const [tabStateTR, setTabStateTR] = React.useState(false);
  const [creatorState, setCreatorState] = React.useState(false);
  const [modifyEmail, setModifyEmail] = React.useState(false);

  const [navLabel, setNavLabel] = React.useState('All');
  const [wearablesNavState, setWearablesNavState] = React.useState('all');
  const wearablesState = React.useRef(null);
  const [showOrHideState, setShowOrHideState] = React.useState(false);
  // const [showOrHideStateConent, setShowOrHideStateConent] = React.useState(false);
  const [creatorsState, setCreatorsState] = React.useState(null);
  const [wearablesCreatorsData, setWearablesCreatorsData] = React.useState([]);
  // const [ownerData, setOwnerData] = React.useState([]);
  const [wearablesCreatorsOriginData, setWearablesCreatorsOriginData] = React.useState([]);
  const [wearablesShowData, setWearablesShowData] = React.useState([]);
  const [wearablesHideData, setWearablesHideData] = React.useState([]);

  const [wearablesShowOrHideState, setWearablesShowOrHideState] = React.useState(false);
  const [joinBuilders, setJoinBuilders] = React.useState(false);
  const [emailBuilders, setEmailBuilders] = React.useState(false);
  const [wearablesShowOrHide, setWearablesShowOrHide] = React.useState(null);
  const [wearablesSleceteIdList, setWearablesSleceteIdList] = React.useState([]);
  const [stateVal, setStateVal] = React.useState(false);
  const [initEmail, setInitEmail] = React.useState('');
  const [orginName, setOrginName] = React.useState('');
  const [country, setCountry] = React.useState('');
  // const [buildName, setBuildData] = React.useState('');
  const [buildAll, setBuildAll] = React.useState(null);
  const [buildInc, setBuildInc] = React.useState('add');
  const [walletAddress, setWalletAddress] = React.useState('');
  const [saveIcon, setSaveIcon] = React.useState(false);
  // const [buildFiles, setBuildFiles] = React.useState([]);
  const [createrStateVal, setCreaterStateVal] = React.useState(null);
  const [emailStateWearable, setEmailStateWearable] = React.useState(null);
  const [tokenWearable, setTokenWearable] = React.useState(null);
  const [buildStateWearable, setBuildStateVal] = React.useState(1);
  const [addressWearable, setaddressWerVal] = React.useState(null);
  const [emaileWearable, setemailWearVal] = React.useState(null);

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
  const resultHandlerBu = React.useCallback(
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

      // toast.error(msg);

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

      // const sta = res.data.profile.creator_status
      const emailState = res.data.profile.email
      const buildNum = res.data.profile.builder_status
      const wallet = res.data.profile.address
      setNoWork(true)
      setStatue(res.data.profile.creator_status)
      setBuildState(buildNum)
      setWalletAddress(wallet)
      // setCreaterStateVal(res.data.profile.creator_status)
      setEmailStateWearable(res.data.profile.email)
      // console.log(sta, 88888, emailState, 888, statue, res.data.profile.builder_status, buildState);
      // console.log(statue, "setEmailStateWearable");

      setEmailStateVal(emailState)
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
      setNickNameVla(name);
      setIntroduction(m);
      setcountry(n);
      setTwitterAddress(twitterName);
      setWebsiteAddress(websiteUrl);
      state.setState({ profile });
    },
    [resultHandler, statue, buildState, walletAddress],
  );

  const reqWearablesData = React.useCallback(async () => {
    // const result = await req_get_user_wearable(await refreshTK());
    const result = await req_get_user_wearable(await tokenWearable);
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
    }else if(result.code === 100003){
       const resultWe = await req_get_user_wearable(await refreshTK());
       if (resultWe.code === 100000) {
        const show = resultWe.data.filter((i) => {
          return i.show_status === 1;
        });
        const hide = resultWe.data.filter((i) => {
          return i.show_status === 2;
        });
        // console.log(wearablesState.current);
        if (wearablesState.current === 'all') {
          setWearablesCreatorsData(resultWe.data);
        } else if (wearablesState.current === 'shown') {
          setWearablesCreatorsData(show);
        } else if (wearablesState.current === 'hidden') {
          setWearablesCreatorsData(hide);
        } else {
          setWearablesCreatorsData(resultWe.data);
        }
        setWearablesCreatorsOriginData(resultWe.data);
        setWearablesShowData(show);
        setWearablesHideData(hide);
        }
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
    // if (accessToken && routeTab === 'building') {
    //   reqBuilderData(accessToken);
    // }
  }, [requestData, getToken, reqDclData]);

  const addWork = React.useCallback(async (emailState) => {

    if (emailState === null || emailState === '') {
      setJoinBuilders(true)
    } else if (emailState !== '') {
      setEmailBuilders(true)
      // this.props.emailState(this.props.emailState)
    }
    // console.log(joinBuilders, 55555, emailState);


    // if(buildState){

    // }

  }, [joinBuilders, emailStateVal])

  const unloadBuilders = React.useCallback(async () => {
    setAddbuild(true)
    // router.replace('profile/addBuilding')
    setBuildInc('add')
    setBuildAll([])
  }, [])


  const turnOff = () => {
    setJoinBuilders(false)
    setEmailBuilders(false)
    setStateVal(false)
  }
  const editStateVal = (statev) => {
    // console.log(state);
    setStateVal(statev)
    setJoinBuilders(false)
    const resBuil = req_building_list(walletAddress);
    resBuil.then((resBuilV) => {
      if (resBuilV.data) {
        setDataBuildSource(resBuilV.data)
      }
    })
  }
  const turnBuild = () => {
    setTabStateTR(false)
  }
  // const nextBtnAdd = (token: string, buildData: any) => {
  //   console.log(token);

  //   const res = req_userBuilder_apply_become(token, 'builder', buildData.toString());

  //   setTabStateTR(false)
  //   setEmailBuilders(false)
  // }
  // setTabStateTR(false)

  const nextBtn = (code, token: string) => {
    let result = null;
    result = req_bind_ver_email_code(code.toString(), token);
    if (result.code === 100000) {
      setJoinBuilders(false)
      setTabStateTR(true)
    }
  }
  // const nextBtn = React.useCallback(async () => {
  //   if (!email && !code) return;
  //   let result = null;

  //   if (modifyEmail) {
  //     // result = await req_modify_old_email_ver_code(code.toString(), token);
  //     // if (result.code === 100000) {
  //     //   closeEmail('modify');
  //     // } else if (result.code === 100013) {
  //     //   toast.error('Invalid verification code');
  //     // } else {
  //     //   toast.error('Verification code error');
  //     // }
  //   } else {
  //     result = await req_bind_ver_email_code(code.toString(), token);
  //     if (result.code === 100000) {
  //       // closeEmail('bind');
  //     } else if (result.code === 100013) {
  //       toast.error('Invalid verification code');
  //     } else {
  //       toast.error('Verification code error');
  //     }
  //   }
  //   setCode('');
  //   setCodeClear(false);
  //   setCodeState('getCode');
  //   clearInterval(timeId.current);
  //   time.current = 60;
  // }, [email, code, modifyEmail]);
  // const retProps =(arr)=>{
  //   console.log(arr);
  //   setBuildData(arr)
  // }
  const retProps = React.useCallback((token: string, buildData: any) => {
    if (buildData.length === 0) {
      toast.error('Please fill in the link address');
      return false;
    }
    const showIndex = false
    buildData?.map((item) => {
      if (item !== '') {
        const reg = '^((https|http|ftp|rtsp|mms)?://)'
          + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?'
          + '(([0-9]{1,3}.){3}[0-9]{1,3}'
          + '|'
          + '([0-9a-z_!~*\'()-]+.)*'
          + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].'
          + '[a-z]{2,6})'
          + '(:[0-9]{1,4})?'
          + '((/?)|'
          + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
        const re = new RegExp(reg)
        if (!re.test(item)) {
          toast.error("Not the correct URL, please pay attention to check");
          return false;
        }
      }
      return true;
    })
    if (showIndex) {
      return false;
    }
    const res = req_userBuilder_apply_become(token, 'builder', buildData.toString());

    res.then((resV) => {
      setBuildState(2)
    })
    setTabStateTR(false)
    setEmailBuilders(false)
  }
    ,
    [buildState, walletAddress],
  );

  const reqBuilderData = React.useCallback(
    async (walletAddressVal: string) => {
      try {

        const res = await req_building_list(walletAddressVal);
        // console.log(res, 5959);


        const data = resultHandlerBu(res, reqBuilderData);
        // console.log(data, 56569, res);


        setLoading(false);
        if (!data) {
          return;
        }
        // console.log(data, 8989);
        setDataBuildSource(data);
        // changeNum(data, nav_Label.current);
      } catch {
        setError(true);
      }
    },
    [resultHandlerBu, routeTab, nav_Label, walletAddress, dataBuildSource],
  );

  const requireBuilder = React.useCallback(
    async (token) => {
      const res = await req_get_building_detail_info(token);
      const data = resultHandler(res, requireBuilder);
      // if (data) {
      //   const profile = convert(data.profile);
      //   const {
      //     address: addr,
      //     nickName: name,
      //     avatar,
      //     links,
      //     email: e,
      //     country: c,
      //     introduction: i,
      //   } = profile;
      //   const { twitterName, websiteUrl } = links;
      //   setAvatarUrl(avatar);
      //   setInitEmail(e);
      //   if (e) {
      //     setEmail(e);
      //   }
      //   setCountry(c);
      //   setIntroduction(i);
      //   setAddress(addr);
      //   setNickNameVla(name);
      //   setOrginName(name);
      //   setTwitterAddress(twitterName);
      //   setWebsiteAddress(websiteUrl);
      //   state.setState({ profile });
      // }
    },
    [resultHandler],
  );

  const DeleteBuild = React.useCallback((token, buildingLinkCon: string,) => {

    // console.log(buildingLinkCon, 558);
    const res = req_builder_del_self_building(token, buildingLinkCon)
    // console.log(res, 565656);
    res.then((resC) => {
      toast(resC.msg)
      if (resC.code === 100000) {
        const resBuil = req_building_list(walletAddress);
        resBuil.then((resBuilvAL) => {
          if (resBuilvAL.data) {
            setDataBuildSource(resBuilvAL.data)
          }
        })
      }
    })
  },
    [walletAddress],
  );
  const EditBuild = async (buildingLinkCon: string) => {
    setBuildInc('edit')
    const res = await req_get_building_detail_info(buildingLinkCon)
    // console.log(res, buildingLinkCon);
    if (res.data) {
      setBuildAll(res.data)
      setAddbuild(true)
    }
  }

  const closeBuild = () => {
    setAddbuild(false)

    // router.replace(`/profile?type=building`)
  }

  const Save = React.useCallback((token: string, operationType: string, nickName: string, platform: string, linkBuild: string, introduction: string, format: string, subArrData, files_link_cover: string, files_link_del,) => {
    // setBuildInc(operationType)
    // console.log(buildInc, operationType, 54, nickName, 565656);
    // if (nickName === '' || platform === '' || linkBuild === '' || format === '' || subArrData.length === 0) {
    //   setSaveVal(false)
    // }else{
    //   console.log(saveVal,11111);

    //   setSaveVal(true)
    // }


    if (nickName === '') {
      toast.error('Please fill in Building Name');
      return false;
    }
    if (nickName.length > 200) {
      toast.error('Max text length 200');
      return false;
    }
    if (platform === '') {
      toast.error('Please choose Platform');
      return false;
    }
    if (linkBuild === '') {
      toast.error('Please fill in Link To Building');
      return false;
    }
    if (linkBuild !== '') {
      // let reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
      // if(!reg.test(linkBuild)){
      const reg = '^((https|http|ftp|rtsp|mms)?://)'
        + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?'
        + '(([0-9]{1,3}.){3}[0-9]{1,3}'
        + '|'
        + '([0-9a-z_!~*\'()-]+.)*'
        + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].'
        + '[a-z]{2,6})'
        + '(:[0-9]{1,4})?'
        + '((/?)|'
        + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
      const re = new RegExp(reg)
      if (!re.test(linkBuild)) {
        toast.error("Not the correct URL, please pay attention to check");
        return false;
      }
    }
    // const linkBuildIndex = linkBuild.indexOf('http://')
    // const linkBuildCom = linkBuild.indexOf('.com')
    // if (linkBuildIndex === -1 || linkBuildCom === -1) {
    //   toast.error('Please fill in the correct address');
    //   return false;
    // }
    if (format === '') {
      toast.error('Please choose Format of Building');
      return false;
    }
    if (subArrData.length === 0) {
      toast.error(' Please upload the building file');
      return false;
    }
    if (subArrData.length === 0) {
      toast.error('Please upload the building file');
      return false;
    }
    let imgCont = files_link_cover
    if (imgCont === '') {
      [imgCont] = subArrData

      // toast.error('请设置封面图');
      // return false;
    }
    const indexBuild = subArrData.indexOf(imgCont)

    if (indexBuild === -1) {
      // files_link_cover = subArrData[0]
      [imgCont] = subArrData
      // toast.error('请设置封面图');
      // return false;
    }
    // console.log(indexBuild);

    const res = req_user_add_or_edit_building(token, buildInc, nickName, platform, linkBuild, introduction, format, subArrData.join(','), imgCont.toString(), files_link_del.join(','));
    // console.log(res, subArrData);
    // console.log(files_link_cover, "files_link_cover");



    // console.log(buildInc, nickName, platform, linkBuild, introduction, format, subArrData, 558, res);


    setSaveIcon(true)
    res.then((resCON) => {
      // toast(res.msg)
      setSaveIcon(true)
      if (resCON.code === 100000) {

        toast(resCON.msg)
        setAddbuild(false)
        const resBuil = req_building_list(walletAddress);

        resBuil.then((resBuilCon) => {
          if (resBuilCon.data) {
            setDataBuildSource(resBuilCon.data)
            // console.log(resBuil.data, 96898)
          }

        });

        // console.log(dataBuildSource, 6565);
      }
    });



  },
    [resultHandlerBu, saveIcon, routeTab, nav_Label, dataBuildSource, reqBuilderData, walletAddress, buildInc],
  );

  // const addWork = React.useCallback(async () => {
  //   console.log('hhhhhhhhhhhhhhhhhhh');
  //   // <JoinBuilders/>
  //   // joinBuilders
  //   setJoinBuilders(true);
  //   console.log(joinBuilders, 5555555555);

  //   // renderssssContent
  // }, [joinBuilders]);

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
  const addWorkWerable = () => {
    // console.log(55, tokenWearable);
    setShowModal(true)
    const res = getBaseInfo(tokenWearable);
    res.then((resWeable) => {
      setaddressWerVal(resWeable.data.profile.address);
      setemailWearVal(resWeable.data.profile.email);

    })
  }

  const renderWerable = React.useMemo(() => {
    // console.log(statue);

    if (loading) {
      return <Status status="loading" />;
    }
    if (error) {
      return <Status retry={onRetry} status="error" />;
    }
    if (statue === 1) {
      return <Status addWorkWerable={addWorkWerable} status="emptyWerable" />;

    }

  }, [statue,
    error,
    loading,
    onRetry])

  const renderBuilding = React.useMemo(() => {

    if (loading) {
      return <Status status="loading" />;
    }
    if (error) {
      return <Status retry={onRetry} status="error" />;
    }
    if (buildState === 1) {
      return <Status addWork={() => { addWork(emailStateVal) }} status="emptyBuilding" />;
    }
    if (buildState === 2) {
      return <Status status="waitBuilder" />;

    }
    if (buildState === 4 && dataBuildSource.length === 0) {
      // console.log(dataBuildSource.length,9889898989);

      return <Status status="AddBuilder" unloadBuilders={() => { unloadBuilders() }} />;
    }
    // else {

    // }
    if (buildState === 4 && dataBuildSource.length !== 0) {
      //   // console.log(dataBuildSource,6565656);

      return (
        <>
          <div className={style.contentB}>
            <div className={style.conAdd}>Add more works to let everyone know you better</div>
            <div className={style.unload} onClick={unloadBuilders}>Add more works</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">

            {dataBuildSource.map((card) => {
              return (
                <CardBuilding
                  {...card}
                  parcelsIds={parcelsIds}
                  state={cardState}
                  key={uuid()}
                  selectedIds={selectedIds}
                  EditBuild={EditBuild}
                  DeleteBuild={DeleteBuild}
                  onClick={(id, ids) => {
                    select(id, ids);
                  }}
                ></CardBuilding>
              );
            })}
          </div>
        </>
      );
    }

  }, [
    error,
    dataBuildSource,
    loading,
    onRetry,
    buildState,
    walletAddress,
    builderSat,
    changeNum,
    parcelsIds,
    setCardState,
    tabState,
    reqBuilderData,
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
        setNickNameVla(name);
        setOrginName(name);
        setTwitterAddress(twitterName);
        setWebsiteAddress(websiteUrl);
        state.setState({ profile });
      }
    },
    [resultHandler],
  );

  const closeEmail = React.useCallback((t) => {
    setEmailStateVal(false);
    const accessToken = getToken('atk');

    if (t === 'bind') {
      toast.success('Binding succeeded');
    }
    if (t === 'modify') {
      setModifyEmail(false);
      setEmailStateVal(true);
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
        // const token = await refreshTK();
        const token = await tokenWearable;
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
  //   useEffect(()=>{
  // console.log(saveVal,999999);
  //   },[saveVal])
  useEffect(() => {
    // const accessToken = getToken('atk');
    // console.log(accessToken);

    reqBuilderData(walletAddress)


  }, [addbuild, walletAddress,])

  React.useEffect(() => {


    setSaveIcon(false)
    const a = getToken('address');
    if (a) {
      setWalletAddress(a);
    }

    setNavLabel('All')
    req_building_list(walletAddress)
    const accessToken = getToken('atk');
    setTokenWearable(accessToken)
    setRouteTab(r.router.query.type);
    reqWearablesData();
    requestPersonal(accessToken);
    requireBuilder(accessToken)
    if (tabState === 'cryptovoxels') requestData(accessToken);
    if (tabState === 'decentraland') reqDclData(accessToken);
    // if(routeTab === 'building')reqBuilderData(accessToken);
    watcher_store();
    watcher_store_status();
    watcher_cardState();
    if (!accessToken) window.location.href = '/';
  }, [
    tokenWearable,
    navLabel,
    getToken,
    requestData,
    builderSat,
    buildState,
    statue,
    walletAddress,
    requestPersonal,
    watcher_store,
    dataBuildSource,
    // reqBuilderData,
    addressWearable,
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
      setSaveIconVal(id)
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
        setSaveIconVal(null)

     


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
            // token={refreshTK()}
            token={tokenWearable}
            saveIconVal={saveIconVal}
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


  const drag = function (evt, dbele?) {
    let containerVal = dbele
    if (!dbele) {
      containerVal = document.querySelector('.addBuilding_content__GcPPZ')
    }

    // ele.onmousedown = function (evt) {

    const oEvent = evt;
    const disX = oEvent.clientX - containerVal.offsetLeft;
    const disY = oEvent.clientY - containerVal.offsetTop;
    document.onmousemove = function (evts) {
      // console.log(evts);
      const evtUp = evts;
      let leftX = evtUp.clientX - disX;
      let topY = evtUp.clientY - disY;

      if (
        leftX >
        document.querySelector("#container").clientWidth - containerVal.offsetWidth
      ) {
        leftX =
          document.body.clientWidth -
          containerVal.offsetWidth;
      }
      if (leftX < 0) {
        leftX = 0;
      }
      if (
        topY >
        document.querySelector("#container").clientHeight -
        containerVal.offsetHeight
      ) {
        topY =
          document.body.clientHeight -
          containerVal.offsetHeight;
      }
      if (topY < 0) {
        topY = 0;
      }

      if (containerVal) {
        containerVal.style.left = `${leftX}px`;
        containerVal.style.marginLeft = "0px";
        containerVal.style.marginTop = "0px";
        // containerVal.style.marginBottom = 50 + "px";
        containerVal.style.top = `${topY}px`;
        containerVal.style.zIndex = "999999";
      } else {
        return false;
      }
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }


  const dragJoin = function (evt, dbele) {
    let containerVal = dbele
    if (!dbele) {
      containerVal = document.querySelector('.join_builders_works_container2__VidgJ')
    }
    // ele.onmousedown = function (evt) {
    const oEvent = evt;
    const disX = oEvent.clientX - containerVal.offsetLeft;
    const disY = oEvent.clientY - containerVal.offsetTop;
    document.onmousemove = function (evts) {
      // console.log(evts);
      const evtUp = evts;
      let leftX = evtUp.clientX - disX;
      let topY = evtUp.clientY - disY;

      if (
        leftX >
        document.querySelector("#container").clientWidth - containerVal.offsetWidth
      ) {
        leftX =
          document.body.clientWidth -
          containerVal.offsetWidth;
      }
      if (leftX < 0) {
        leftX = 0;
      }
      if (
        topY >
        document.querySelector("#container").clientHeight -
        containerVal.offsetHeight
      ) {
        topY =
          document.body.clientHeight -
          containerVal.offsetHeight;
      }
      if (topY < 0) {
        topY = 0;
      }
      if (containerVal) {
        containerVal.style.left = `${leftX}px`;
        containerVal.style.marginLeft = "0px";
        containerVal.style.marginTop = "0px";
        // containerVal.style.marginBottom = 50 + "px";
        containerVal.style.top = `${topY}px`;
        containerVal.style.zIndex = "999999";
      } else {
        return false;
      }
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }
  const dragHead = function (evt, dbele?) {
    let containerVal = dbele
    if (!dbele) {
      containerVal = document.querySelector('.join_builders_container__31cSn')
    }

    // ele.onmousedown = function (evt) {
    const oEvent = evt;
    const disX = oEvent.clientX - containerVal.offsetLeft;
    const disY = oEvent.clientY - containerVal.offsetTop;
    document.onmousemove = function (evts) {
      // console.log(evts);
      const evtUp = evts;
      let leftX = evtUp.clientX - disX;
      let topY = evtUp.clientY - disY;

      if (
        leftX >
        document.querySelector("#container").clientWidth - containerVal.offsetWidth
      ) {
        leftX =
          document.body.clientWidth -
          containerVal.offsetWidth;
      }
      if (leftX < 0) {
        leftX = 0;
      }
      if (
        topY >
        document.querySelector("#container").clientHeight -
        containerVal.offsetHeight
      ) {
        topY =
          document.body.clientHeight -
          containerVal.offsetHeight;
      }
      if (topY < 0) {
        topY = 0;
      }

      if (containerVal) {
        containerVal.style.left = `${leftX}px`;
        containerVal.style.marginLeft = "0px";
        containerVal.style.marginTop = "0px";
        // containerVal.style.marginBottom = 50 + "px";
        containerVal.style.top = `${topY}px`;
        containerVal.style.zIndex = "999999";
      } else {
        return false;
      }
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }


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
            <div className={cn('main-content flex px-0', style.tabtext)}>
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
          <div className={cn('main-content mt-8', style.content)} style={{ marginTop: '-20px' }}>
            {renderContent}
          </div>

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
      if (showType === 'cryptovoxels') {
        return (
          <>
            <div className={cn('tab-list flex mt-5', style.allHeight)}>
              <div className={cls}></div>
              <div className={cn('main-content flex px-0', style.tabtext)}>
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
              <BaseChart>
                <BaseBar
                  id={'parcel1'}
                  labelText={'DAILY TRAFFIC OF ALL MY PARCELS '}
                  dataHandlder={req_cv_parcel_traffic}
                  barWidth={20}
                  limit={21}
                  textColor={style.nftColor}
                // token={refreshTK()}
                token={tokenWearable}
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
                  // token={refreshTK()}
                  token={tokenWearable}
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
                 // token={refreshTK()}
                 token={tokenWearable}
                  textColor={style.nftColor}
                ></ProfileDetail>
              </BaseChart>
            </div>
          </>
        );
      }
      if (showType === 'decentraland') {
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
              <BaseChart>
                <BaseBarDece
                  id={'parcel1'}
                  labelText={'DAILY TRAFFIC OF ALL MY PARCELS '}
                  dataHandlder={req_dece_parcel_traffic}
                  barWidth={20}
                  limit={21}
                  textColor={style.deceColor}
                 // token={refreshTK()}
                 token={tokenWearable}
                ></BaseBarDece>
              </BaseChart>
              <BaseChart className=" my-5" type={true}>
                <PieChartDece
                  id="piechart2"
                  labelText={'PERCENTAGE OF PARCEL TRAFFIC '}
                  dataHandlder={req_deceData_parcel_traffic_daily}
                  // token={refreshTK()}
                  token={tokenWearable}
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
                  // token={refreshTK()}
                  token={tokenWearable}
                  textColor={style.deceColor}
                ></ProfileDetailDece>
              </BaseChart>
            </div>
          </>
        );
      }
    }
    if (routeTab === 'wearablelist') {

      // return (
      //   <>

      //     <>
      //       <div className={style.buildingContainer}>
      //         <div className={cn('main-content mt-8', style.content)} style={{ marginTop: "-20px" }}>
      //           {renderWerable}

      //         </div>
      //       </div>
      //     </>
      //     : <></>

      //   </>
      // )
      // if(statue===1){
      // return (
      //   <>
      //     {statue === 1 ?
      //       <div className={style.createrCont}>
      //         <span className={style.join}>Join Creators to show your works</span>
      //         <span className={style.apply}>Apply</span>
      //       </div>
      //       :
      //       <>

      //       </>}
      //   </>
      // )
      // }else{





      return (
        <>
          {statue === 1 ? <>
            <div className={style.createrCont}>
              <span className={style.join}>Join Creators to show your works</span>
              <span className={style.apply} onClick={addWorkWerable}>Apply</span>
            </div>
          </> : null}
          {statue === 2 ? <>
            <div className={style.createrCont}>
              <span className={style.join}>Waiting to become a creator</span>
            </div>
          </> : null}


          {/* <div className={cn('tab-list flex mt-5', style.allHeight)}>
          <div className={cls}></div>
          <div className="main-content flex px-0">
            {TAB.map((item) => {
              return (
                <Tab
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
        </div>  */}
          <div className={style.wearablesContainer}>
            <div className={style.title}>
              <div className={style.wearables}></div>
              <div className={style.texteated}>Wearables Created</div>
            </div>
            <div className={style.wearablesNav}>
              <div className={style.left}>
                {wearablesNav.map((item, index) => {
                  return (
                    <>
                      <div
                        onClick={() => {
                          setWearablesNavState(item.type);
                          wearablesState.current = item.type;
                          setShowOrHideState(false);
                          if (item.type === 'all') {
                            setWearablesCreatorsData(wearablesCreatorsOriginData);
                          }
                          if (item.type === 'shown') {
                            setWearablesCreatorsData(wearablesShowData);
                          }
                          if (item.type === 'hidden') {
                            setWearablesCreatorsData(wearablesHideData);
                          }
                        }}
                        className={cn(
                          style.wearablesNavItem,
                          wearablesNavState === item.type ? style.wearableNavAction : null,
                        )}
                        key={uuid()}
                      >
                        {/* <div className={style.mmm}> */}
                        <div>
                          {item.label}
                          {/* <span>{item.label}</span> */}
                          <span style={{ marginLeft: '2px' }}>
                            {item.type === 'all' ? wearablesCreatorsOriginData.length : null}
                            {item.type === 'shown' ? wearablesShowData.length : null}
                            {item.type === 'hidden' ? wearablesHideData.length : null}
                          </span>
                        </div>

                        {/* </div> */}
                      </div>
                    </>
                  );
                })}
              </div>
              {
                statue === 1 || statue === 2 ? null :
                  <div
                    className={style.right}
                    onClick={() => {
                      setShowOrHideState(!showOrHideState);
                    }}
                    onMouseLeave={() => {
                      setTimeout(() => {
                        setShowOrHideState(false);
                      }, 2000);
                    }}
                  >
                    <img src="/images/Settings.png" />
                    <div>Batch setting</div>
                    <ul
                      className={
                        wearablesNavState === 'all' && showOrHideState
                          ? style.showOrHideList
                          : style.showOrHideList1
                      }
                      onMouseLeave={() => {
                        setShowOrHideState(false);
                      }}
                    >
                      {showOrHideState
                        ? showOrHide[wearablesNavState].map((item, index) => {
                          return (
                            <li
                              className={style.showOrHideItem}
                              key={index}
                              onClick={() => {
                                settingShowOrHide(item.type);
                              }}

                            >
                              {item.label}
                            </li>
                          );
                        })
                        : null}
                    </ul>
                  </div>

              }

            </div>
            <div style={{ marginTop: '22px', marginBottom: '50px' }}>{creatorsReander}</div>
          </div>
        </>
      );
    }

    if (routeTab === 'building') {
      return (
        <>
          {/* {buildState === 2 ? */}
          <>
            <div className={style.buildingContainer}>
              <div className={cn('main-content mt-8', style.content)} style={{ marginTop: "-20px" }}>{renderBuilding}
              </div>
            </div>
          </>
          : <></>
          {/* } */}
        </>
      )
      // return (
      //   <>
      //     <div className={style.buildingContainer}>
      //       <div className={cn('main-content mt-8', style.content)} style={{ marginTop: "-20px" }}>{renderBuilding}
      //       </div>
      //     </div>
      //   </>
      // )

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
    renderWerable,
    dataSource,
    dataBuildSource,
    reqBuilderData,
    tabState,
    routeTab,
    creatorsReander,
  ]);

  return (
    <>
      <Page className={cn('min-h-screen', style.anPage,)} meta={meta}
      >
        {/* joinBuilders === true?style.joinBuilders:'' */}
        <div
          onClick={() => {
            setManySetState(false);
          }}
          id='container'
          className={cn('', style.bigPic, addbuild === true ? style.join : '', joinBuilders === true ? style.join : '', emailBuilders === true ? style.join1 : '',)}
        >
          <div className=" relative" >
            <PageHeader
              className="relative z-10" active={'profile'} />
          </div>

          <div className={cn(' flex flex-col justify-center items-center', style.profileCon)}>
            <Profile
              avater={avatar}
              address={address}
              creatorsState={creatorsState}
              twitter={twitterAddress}
              home={websiteAddress}
              country={countryAddress}
              name={nickNameVal}
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
            <div style={{ width: "100%" }} className={cn('', addbuild === true ? style.joinBuildersFooter : '')}><Footer /></div>
          </div>
        </div>
        {creatorState ? (
          <Creator
            onClick={changeCreatorState}
            // token={refreshTK()}
            token={tokenWearable}
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
              {/* {
                    saveIcon === true ? <><img src='/images/saveIcon.gif'></img>
                    </> : <>Save</>
                  } */}
            </div>
          </div>
        ) : null}

        {/* {tabStateTR === true ? <>
        <JoinBuildersAdd
          turnBuild={turnBuild}
          nextBtnAdd={nextBtnAdd}
        />
      </> : ''} */}



      </Page>
      {joinBuilders === true ? <>
        <JoinBuilders
          turnOff={turnOff}
          stateVal={stateVal}
          editStateVal={editStateVal}
          clickHeader={dragHead}
        // nextBtn={nextBtn}

        />
      </> : ''}
      {emailBuilders === true ?
        <>
          <JoinBuildersWork
            turnOff={turnOff}
            retProps={retProps}
            emailState={emailStateVal}
            clickHeader={dragJoin}
          />
          {/* <JoinBuildersAdd
            turnBuild={turnBuild}
            nextBtnAdd={nextBtnAdd}
          /> */}
        </> : ''}
      {addbuild === true ?
        <>
          <AddBuildings
            id='addBuilding'
            Save={Save}
            saveIcon={saveIcon}
            buildAll={buildAll}
            buildInc={buildInc}
            closeBuild={closeBuild}
            clickHeader={drag}
          />
        </> : ''}
      <JoinModal
        emaileWearable={emaileWearable}
        addressWearable={addressWearable}
        show={showModal}
        setClose={(x) => {
          setShowModal(x);
        }}
        setcreaterState={(x) => {
          // console.log(x);

          setStatue(x)
        }}
        setEmail={(x) => {
          setEmailStateWearable(x)
        }}
        setbuildState={(x) => {
          setBuildStateVal(x)
        }}
        type={'Creators'}
      ></JoinModal>
    </>
  );
}

export default withRouter(ProfilePage);
