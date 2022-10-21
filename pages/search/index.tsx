import React, { useEffect, useRef } from 'react';

import cn from 'classnames';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-hot-toast';

import { className } from 'babylonjs/index';

import { useRouter, withRouter } from 'next/router';

import { join } from 'path/posix';

import Page from '../../components/page';
// import PageHeader from '../../components/page-header';
import PageHeader from '../../components/top-navigation';
import Search from '../../components/searchHome';
import Footer from '../../components/footer';
import LearnCard from '../../components/learnCard';
import InfoCard from '../../components/info_card';
import Tab from '../../components/tab';
import ChangeEmail from '../../components/changeEmail';
import Tab4 from '../../components/tab4';
import Status from '../../components/status';
// import Card from '../../components/parcels-card';
import Card from '../../components/cardParcels';
import CardBuilding from '../../components/cardBuilding';
import DclCard from '../../components/parcels-dcl-card';
import Tab5 from '../../components/tab5';
import ParcelsTab from '../../components/parcels-tab';
import RentSet from '../../components/parcels_rent_set';
import Popup from '../../components/popup';
import store from '../../store/profile';
import EventDetail from '../../components/eventDetail';
import PieChart from '../../components/pie-chart';
import PieChartDece from '../../components/pie-chart-dece';
import ProfileDetail from '../../components/profiledetail';
import ProfileDetailDece from '../../components/profiledetail-dece';
import { state } from '../../components/wallet-btn';
import BaseBar from '../../components/parcel-base-bar';
import BaseBarDece from '../../components/parcel-basebardece';
import TrafficBar from '../../components/parcel-traffic_bar';
import JoinModal from '../../components/v2/join-modal';
// import Creator from '../../components/Creator';
import DaoModelList2 from '../../components/dao-model-list2';
import DaoWebglCard2 from '../../components/dao-webgl-graphic2';
import JoinBuilders from '../../components/join_builders';
import JoinBuildersAdd from '../../components/join_builders_add';
import AddBuildings from '../../components/addBuilding';
import JoinBuildersWork from '../../components/join_builders_works';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import { useWalletProvider } from '../../components/web3modal';

import { convert, getToken, setToken } from '../../common/utils';

import { getBaseInfo, refreshToken, getParcelList2, getSearchDetail } from '../../service';


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
    type: 'Voxels',
  },
  {
    label: 'Decentranland',
    icon: '/images/Decentraland.jpg',
    type: 'Decentraland',
  },
];
const TABDataCreater = [
  {
    label: 'Builder',
    type: 'Builder',
  },

]


const TAB3 = [
  {
    label: '1111111',
    type: 'Place',
  },
  {
    label: 'Event',
    type: 'Event',
  },
  {
    label: 'Creator',
    type: 'Creator',
  },
  {
    label: 'Learn',
    type: 'Learn',
  },

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
function search(r) {
  const nav_Label = React.useRef(null);
  const meta = {
    title: `Search - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };
  const headerRef = React.useRef(null)
  const clientRef: any = useRef(null);
  const scrollRef: any = useRef(null);

  const router = useRouter();
  const s = store.useState('rentOutState', 'id', 'status', 'parcels_cardState', 'type');
  const [loading, setLoading] = React.useState(false);
  const [showCon, setSwitchShow] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [loadingDetail, setloadingDetail] = React.useState(false);
  const [fixedState, setFixedState] = React.useState(false);
  const [noWork, setNoWork] = React.useState(false);
  const [searchText, setSearchText] = React.useState(null);
  const [builderSat, setBuilderSat] = React.useState(false);
  const [dataSource, setDataSource] = React.useState([]);
  const [dataSourceTwo, setDataSourceTwo] = React.useState([]);
  const [dataSourceCreBuilder, setDataSourceCreBuilder] = React.useState([]);
  const [dataSourceLearn, setDataSourceLearn] = React.useState([]);
  const [dataSourceCreWear, setDataSourceCreWear] = React.useState([]);
  const [typeState, setTypeState] = React.useState('');
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
  const [showType, setShowType] = React.useState('Voxels');
  const [tabState, setTabState] = React.useState('Voxels');
  const [tabStateCreater, setTabStateCreater] = React.useState('Builder');
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
  const [routeTab, setRouteTab] = React.useState('Place');
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
  const [menuDataTwoArrCon, setMenuDataTwoArrCon] = React.useState([]);

  const [wearablesShowOrHideState, setWearablesShowOrHideState] = React.useState(false);
  const [joinBuilders, setJoinBuilders] = React.useState(false);
  const [emailBuilders, setEmailBuilders] = React.useState(false);
  const [wearablesShowOrHide, setWearablesShowOrHide] = React.useState(null);
  const [wearablesSleceteIdList, setWearablesSleceteIdList] = React.useState([]);
  const [stateVal, setStateVal] = React.useState([]);
  const [valueCount, setValueCount] = React.useState([]);
  const [valueCountCreater, setValueCountCreater] = React.useState([]);
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
  const [emptyStatus, setemptyStatus] = React.useState(false);
  const [pageNum, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const a1 = useRef(null)
  const Nav = [
    {
      label: 'All',
      state: 1,
      num: 0,
    },
  ];


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
      // console.log(l, 111, showTab, tabState);
      if (l === 'Creator') {
        setShowTab('Builder')
      }
      setTabState('Voxels')
      setTabStateCreater('Builder')

      // setTabState('Place');
      setShowTab(l);
      setRouteTab(t);
      // router.replace(`/profile?type=${t}`);
    },
    [showTab],
  );

  const onTabChange = React.useCallback(
    async (tab) => {
      if (tabState === tab) return;
      // setLoading(true);
      // console.log(tab);

      setTabState(tab);
      setParcelsIds([]);
      setSelectedIds([]);
      setCardState(false);
      store.setState(() => ({ parcels_cardState: false, id: null }));
      // console.log(tab, 99999999, tabState);
      // onSearchHandlerDetail('', pageNum, pageSize, '')//这掉接口
      // const res =  getSearchDetail(query, page, per_page, search_item);
      if (tab === 'Voxels') {
        // console.log(11);

        // setDataSource(orginData.parcelList);
        // store.setState(() => ({ type: 'cv' }));
      }
      if (tab === 'Decentraland') {
        // console.log(22);
        // const dataListDece = dclDataSource;
        // if (res.data.Place?.Decentranland !== []) {
        //   dataListDece?.push(...res.data.Place?.Decentranland)
        // setDclDataSource(dataListDece)
        // } else {
        //   setDclDataSource([])
        // }
      }
    },
    [orginData, tabState],
  );
  const onTabChangeCreater = React.useCallback(
    async (tab) => {
      // setShowType(tab);
      // console.log(tab);

      if (tabStateCreater === tab) return;
      // setLoading(true);
      setTabStateCreater(tab);
      // setParcelsIds([]);
      // setSelectedIds([]);
      // setCardState(false);
      // store.setState(() => ({ parcels_cardState: false, id: null }));
      if (tab === 'builder') {
        // setDataSource(orginData.parcelList);
        // store.setState(() => ({ type: 'cv' }));
      }
      if (tab === 'wearable') {
        // console.log("storestorestorestorestorestore");

        // setDclDataSource(orginData.parcelList);
        // store.setState(() => ({ type: 'dcl' }));
      }
    },
    [orginData, tabStateCreater],
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

  const onSearchHandlerDetail = async (query,
    page: number,
    per_page: number,
    search_item: string) => {
    setShowModal(true)
    const newPage = pageNum + 1
    // console.log(newPage);
    setPage(newPage)

    const res = await getSearchDetail(query, page, per_page, search_item);
    // console.log(res, "res");
    setShowModal(false)

    if (res.code === 100000) {
      const data = res.data?.menu_one;
      const dataCreater = res.data?.Creator?.menu_two;
      const countNum = res.data?.item_count;
      const MenuDataTwo = res.data?.Place?.menu_two;
      // const dataList  = dataSource;
      const arr = []
      Object.keys(data).forEach(key => {
        const obj = {
          label: data[key],
          type: data[key],
          count: countNum[data[key]],
        }
        arr.push(obj)
      })


      setValueCount(arr)


      const dataList = dataSource;
      if (res.data?.Place?.Voxels.length > 0) {
        dataList?.push(...res.data?.Place?.Voxels)
        setDataSource(dataList)
      }

      // console.log(dataList, "dataList");

      // console.log(dataSourceTwo,"dataSourceTwodataSourceTwo");

      // setDataSourceTwo(dataList)

      // setDataSource(res.data.Place.Voxels)

      const dataListBuilder = dataSourceCreBuilder;
      if (res.data?.Creator?.Builder.length > 0) {
        dataListBuilder?.push(...res.data?.Creator?.Builder)
        setDataSourceCreBuilder(dataListBuilder)
      }
      // setDataSourceCreBuilder(res.data.Creator.Builder)


      const dataListLearn = dataSourceLearn;
      if (res.data?.Learn?.data.length > 0) {
        dataListLearn?.push(...res.data?.Learn?.data)
        setDataSourceLearn(dataListLearn)
      }

      // setDataSourceLearn(res.data.Learn.data)
      // console.log(dataSourceLearn, 222523);

      // setDataSourceTwo(res.data.Place.Voxels)
      const dataListDece = dclDataSource;
      if (res.data.Place?.Decentranland.length > 0) {
        dataListDece?.push(...res.data.Place?.Decentranland)
        // console.log(dataListDece);

        setDclDataSource(dataListDece)
      }

      // setDclDataSource(res.data.Place.Decentranland)

      // console.log(dclDataSource, "dataSourcedataSourcedataSource");


      const MenuDataTwoArr = []
      const valCountCreater = []
      // for (const key in dataCreater) {
      //   // console.log(valueCount);
      //   const obj = {
      //     label: dataCreater[key],
      //     type: dataCreater[key],
      //     // count: countNum[data[key]],
      //   }

      //   valCountCreater.push(obj)
      //   // console.log(valCountCreater, "valCountCreater");
      // }
      if (dataCreater) {
        Object?.keys(dataCreater).forEach(key => {
          const obj = {
            label: dataCreater[key],
            type: dataCreater[key],
            // count: countNum[data[key]],
          }
          valCountCreater.push(obj)
        })
        setValueCountCreater(valCountCreater)
      }


      // for (const keys in MenuDataTwo) {
      //   const objMenuTwo = {
      //     label: MenuDataTwo[keys],
      //     type: MenuDataTwo[keys],
      //     // icon: MenuDataTwo[keys],
      //   }
      //   MenuDataTwoArr.push(objMenuTwo)
      //   // console.log(MenuDataTwoArr);

      // }
      if (MenuDataTwo) {
        Object?.keys(MenuDataTwo).forEach(keys => {
          const objMenuTwo = {
            label: MenuDataTwo[keys],
            type: MenuDataTwo[keys],
            // icon: MenuDataTwo[keys],
          }
          MenuDataTwoArr.push(objMenuTwo)
        })
        setMenuDataTwoArrCon(MenuDataTwoArr)
      }


      // for (const key in data) {
      //   // console.log(valueCount);
      //   const obj = {
      //     label: data[key],
      //     type: data[key],
      //     count: countNum[data[key]],
      //   }

      //   arr.push(obj)
      //   // console.log(arr);
      // }
      if (!res.data?.item_count && !res.data?.menu_one) {
        setemptyStatus(true)
      }

    }

  }

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
        // setDataSource(data.parcelList);
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
        // setDclDataSource(data.parcelList);
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
    if (accessToken && tabState === 'Voxels') {
      requestData(accessToken);
    }
    if (accessToken && tabState === 'Decentraland') {
      reqDclData(accessToken);
    }
    // if (accessToken && routeTab === 'building') {
    //   reqBuilderData(accessToken);
    // }
  }, [requestData, getToken, reqDclData]);



  const onSearchHandler = async (query,
    page: number,
    per_page: number,
    search_item: string,
    isCli: boolean) => {
    // console.log('打印了打印了', query);
    // setPage(1)
    // console.log('调用几遍');

    const newPage = page + 1
    // console.log(newPage, page);

    setPage(newPage)


    setShowModal(true)
    // console.log(newPage);
    // setPage(newPage)
    // console.log(router.query.q || query);

    const res = await getSearchDetail(router.query.q || query, page || 1, per_page || 20, search_item);
    // const data = res.data?.menu_one;
    // const countNum = res.data?.item_count;
    // const arr = []
    // Object.keys(data).forEach(key => {
    //   const obj = {
    //     label: data[key],
    //     type: data[key],
    //     count: countNum[data[key]],
    //   }
    //   arr.push(obj)
    // })
    // console.log(arr,'什么鬼数据');


    // setValueCount(arr)
    // // if (res.data?.menu_one.length !== 0) {
    // //   // console.log(33333, 2222);
    // //   setValueCount(res.data?.menu_one)
    // // } else {
    // //   // console.log(111111111111, 2222);
    // //   setValueCount([])
    // // }
    // // console.log(res, "res");

    // if (res.data?.Place?.menu_two.length > 0) {
    //   setMenuDataTwoArrCon(res.data?.Place?.menu_two)
    // }

    // if (res.data?.Creator?.menu_two.length > 0) {
    //   setValueCountCreater(res.data?.Creator?.menu_two)
    // }


    // if (res.data.Place?.Voxels.length > 0) {
    //   setDataSource(res.data.Place.Voxels)
    // }
    // if (res.data.Learn?.data.length > 0) {
    //   setDataSourceLearn(res.data?.Learn?.data)
    // }
    // if (res.data?.Creator?.Builder.length > 0) {
    //   setDataSourceCreBuilder(res.data?.Creator?.Builder)
    // }
    // if (res.data?.Place?.Decentranland.length > 0) {
    //   setDclDataSource(res.data?.Place?.Decentranland)

    // }


    // const res = getSearchDetail(query);
    setShowModal(false)
    if (res.code === 100000) {
      const data = res.data?.menu_one;
      const dataCreater = res.data?.Creator?.menu_two;
      const countNum = res.data?.item_count;
      const MenuDataTwo = res.data?.Place?.menu_two;
      // const dataList  = dataSource;
      const arr = []
      Object.keys(data).forEach(key => {
        const obj = {
          label: data[key],
          type: data[key],
          count: countNum[data[key]],
        }
        arr.push(obj)
      })


      setValueCount(arr)


      const dataList = isCli ? [] : dataSource;

      // console.log(dataList, page, res.data.Place.Voxels);


      if (res.data?.Place?.Voxels.length > 0) {
        dataList?.push(...res.data?.Place?.Voxels)
        // console.log(dataList);

        setDataSource(dataList)
      }

      // console.log(dataList, "dataList");

      // console.log(dataSourceTwo,"dataSourceTwodataSourceTwo");

      // setDataSourceTwo(dataList)

      // setDataSource(res.data.Place.Voxels)

      const dataListBuilder = dataSourceCreBuilder;
      if (res.data?.Creator?.Builder.length > 0) {
        dataListBuilder?.push(...res.data?.Creator?.Builder)
        setDataSourceCreBuilder(dataListBuilder)
      }
      // setDataSourceCreBuilder(res.data.Creator.Builder)


      const dataListLearn = dataSourceLearn;
      if (res.data?.Learn?.data.length > 0) {
        dataListLearn?.push(...res.data?.Learn?.data)
        setDataSourceLearn(dataListLearn)
      }

      // setDataSourceLearn(res.data.Learn.data)
      // console.log(dataSourceLearn, 222523);

      // setDataSourceTwo(res.data.Place.Voxels)
      const dataListDece = dclDataSource;
      if (res.data.Place?.Decentranland.length > 0) {
        dataListDece?.push(...res.data.Place?.Decentranland)
        // console.log(dataListDece);

        setDclDataSource(dataListDece)
      }

      // setDclDataSource(res.data.Place.Decentranland)

      // console.log(dclDataSource, "dataSourcedataSourcedataSource");


      const MenuDataTwoArr = []
      const valCountCreater = []
      // for (const key in dataCreater) {
      //   // console.log(valueCount);
      //   const obj = {
      //     label: dataCreater[key],
      //     type: dataCreater[key],
      //     // count: countNum[data[key]],
      //   }

      //   valCountCreater.push(obj)
      //   // console.log(valCountCreater, "valCountCreater");
      // }
      if (dataCreater) {
        Object?.keys(dataCreater).forEach(key => {
          const obj = {
            label: dataCreater[key],
            type: dataCreater[key],
            // count: countNum[data[key]],
          }
          valCountCreater.push(obj)
        })
        setValueCountCreater(valCountCreater)
      }


      // for (const keys in MenuDataTwo) {
      //   const objMenuTwo = {
      //     label: MenuDataTwo[keys],
      //     type: MenuDataTwo[keys],
      //     // icon: MenuDataTwo[keys],
      //   }
      //   MenuDataTwoArr.push(objMenuTwo)
      //   // console.log(MenuDataTwoArr);

      // }
      if (MenuDataTwo) {
        Object?.keys(MenuDataTwo).forEach(keys => {
          const objMenuTwo = {
            label: MenuDataTwo[keys],
            type: MenuDataTwo[keys],
            // icon: MenuDataTwo[keys],
          }
          MenuDataTwoArr.push(objMenuTwo)
        })
        setMenuDataTwoArrCon(MenuDataTwoArr)
      }


      // for (const key in data) {
      //   // console.log(valueCount);
      //   const obj = {
      //     label: data[key],
      //     type: data[key],
      //     count: countNum[data[key]],
      //   }

      //   arr.push(obj)
      //   // console.log(arr);
      // }
      // console.log(dataSource,dclDataSource);
      // console.log(res.data, res.data?.item_count && res.data?.menu_one);

      if ((res.data?.item_count && res.data?.menu_one).length === 0) {

        setemptyStatus(true)
        setloadingDetail(true)
      }

    }
  }



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

  const toTopic = React.useCallback((id, item) => {
    if (item?.name === 'WearableDAO') {
      window.open('/wearables/wearabledao?type=chinesered')
    }
    if (item.topic_id) {
      window.open(`/topic/${id}?type=buildings`);
    } else if (item.address) {
      window.open(`/topicNewBuilding?address=${item.address}`);
    }
  }, []);



  // console.log(dataSource, "1111111111111111", tabState, "2222222", dclDataSource);
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
    if (loadingDetail === true) {

      return <Status status="loadingDetail" />;
    }
    if (tabState === 'Voxels') {

      return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
          {dataSource.map((card) => { return (<Card {...card} key={uuid()} typeState={card.type} />); })}
          {showModal === false ?
            <><img src='/images/saveIcon.gif'></img> </>
            :
            <>
              {dataSourceTwo.map((card) => (<Card {...card} key={uuid()} typeState={card.type} />))}

            </>
          }
        </div>
      );
    }
    if (tabState === 'Decentraland') {
      // Decentranland
      return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
          {dclDataSource.map((card) => {
            return (<Card {...card} key={uuid()} typeState={card.type} />);
          })}
        </div>
      );
    }
  }, [
    error,
    dataSource,
    loading,
    onRetry,
    changeNum,
    valueCount,
    parcelsIds,
    setCardState,
    tabState,
    reqDclData,
  ]);
  const renderContentCreater = React.useMemo(() => {
    // console.log(tabStateCreater);

    // if (loading) {
    //   return <Status status="loadingDetail" />;
    // }
    // if (error) {
    //   return <Status retry={onRetry} status="error" />;
    // }
    // if (cartData.length === 0) {
    //   return <Status status="empty" />;
    // }
    if (tabStateCreater === 'Builder') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
          {dataSourceCreBuilder?.map((item, idx) => {
            return (
              <InfoCard cls={style.cls} {...item} key={idx}
                onClick={() => toTopic(idx, item)}
              ></InfoCard>
              // <Card
              //   {...card}
              //   parcelsIds={parcelsIds}
              //   state={cardState}
              //   key={uuid()}
              //   selectedIds={selectedIds}
              //   onClick={(id, ids) => {
              //     select(id, ids);
              //   }}
              // ></Card>
            );
          })}
        </div>
      );
    }
    if (tabStateCreater === 'wearable') {
      // console.log("切换了");

      return (
        <>
          <div>655555</div>
          {/* <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-7">
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
          </div> */}
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
    // setShowModal(true)
    // const res = getBaseInfo(tokenWearable);
    // res.then((resWeable) => {
    //   setaddressWerVal(resWeable.data.profile.address);
    //   setemailWearVal(resWeable.data.profile.email);

    // })
  }

  const renderWerable = React.useMemo(() => {
    // console.log(statue);

    if (loading) {
      return <Status status="loadingDetail" />;
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
      return <Status status="loadingDetail" />;
    }
    if (error) {
      return <Status retry={onRetry} status="error" />;
    }

    if (routeTab === 'Learn') {
      //   // console.log(dataBuildSource,6565656);

      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-5">

            {/* <div>Learn</div> */}
            {/* <LearnCard/> */}
            {/* 123 */}
            {
              dataSourceLearn?.map((item, idx) => {
                // console.log(card,8888888888);

                // console.log(dataSourceLearn,9999999);

                return (<LearnCard {...item} key={idx} />)
              })
            }
            {/* <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
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
          </div> */}
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
      // if (data) {
      //   const profile = convert(data.profile);
      //   const {
      //     address: addr,
      //     nickName: name,
      //     // avatar,
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
    setTabStateCreater('Builder')
    setTabState('Voxels')
    // const accessToken = getToken('atk');
    // console.log(accessToken);

    reqBuilderData(walletAddress)



  }, [addbuild, walletAddress,])
  // console.log(headerRef.current?.scrollHeight);
  // console.log(showCon);

  // console.log(searchText,999);
  // React.useEffect(() => {
  //   // onSearchHandler('', 1, 20, '',false)
  //   console.log(router.query.q,);

  // }, [])

  React.useEffect(() => {
    // console.log(router.query, router.query.q, searchText);

    // if (searchText !== null) {
    //   onSearchHandlerDetail('', pageNum, pageSize, '')
    // }
    if (!router.query.q) {
      setSearchText('');
      onSearchHandler('', 1, 20, '', false)
    } else {
      setDataSource([])
      setSearchText(router.query.q);
      onSearchHandler(router.query.q, 1, 20, '', false)
    }
  }, [router.query.q, searchText])
  // console.log(router.query.value,"router.query.value");

  React.useEffect(() => {

    // console.log(document.querySelector('body'));


    const scrollChange = () => {
      // console.log(document.getElementById('a1').scrollTop,"document.getElementById('countTatal').scrollTop");
      //     console.log(showCon);
      // console.log(window?.innerHeight,888);

      // console.log(document?.getElementById('countTatal')?.scrollTop, 11111);
      // console.log(document.querySelector('.myClassName')?.scrollTop, 2222);

      // console.log(window.scrollY);
      // const scrollHeight = document.getElementsByTagName('body')[0].scrollHeight
      // const clientHeight = document.querySelector('.myClassName').clientHeight
      // const scrollTop =document.querySelector('.myClassName')?.scrollTop
      // // console.log( scrollHeight,clientHeight,scrollTop);
      // // console.log( document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop);
      // console.log(clientHeight,scrollTop,scrollHeight);

      // console.log(window.scrollY);

      // const listener = () => {
      // console.log(151515151515);
      // if (document.querySelector('.myClassName')?.scrollTop && document.querySelector('.myClassName')?.scrollTop > 1900) {
      //   if (showCon === false) {

      //     setSwitchShow(true)
      //     if (!showModal) {
      //       dataSourceTwoDetail('', 2, 20, '')
      //     }

      //     onSearchHandlerDetail('', pageNum, 8, '')
      //   }

      // }
      // else {
      //   setSwitchShow(false)
      // }
      // };
      document.addEventListener('scroll', scrollChange);
      return () => document.removeEventListener('scroll', scrollChange);
    }


    window.addEventListener('scroll', scrollChange, true)
    // scrollChange()
    return () => {
      window.removeEventListener('scroll', scrollChange, false)
    }

  }, [])




  // const requestPersonal = React.useCallback(
  //   async (token: string) => {
  //     const res = await getBaseInfo(token);
  //     const data = resultHandler(res, requestPersonal);
  //     if (!data) {
  //       return;
  //     }
  //     const { profile } = data;
  //     state.setState({ profile });
  //   },
  //   [resultHandler],
  // );



  React.useEffect(() => {


    setSaveIcon(false)
    const a = getToken('address');

    if (a) {
      setWalletAddress(a);
    }
    // console.log(r.router.query.type,"r.router.query.type");

    setNavLabel('All')
    // req_building_list(walletAddress)
    // const accessToken = getToken('atk');
    // console.log(11111111111111,accessToken);

    // setTokenWearable(accessToken)
    // // setRouteTab(r.router.query.type);
    // reqWearablesData();
    // requestPersonal(accessToken);
    // requireBuilder(accessToken)
    // if (tabState === 'Voxels') requestData(accessToken);
    // if (tabState === 'Decentraland') reqDclData(accessToken);
    // if(routeTab === 'building')reqBuilderData(accessToken);
    watcher_store();
    watcher_store_status();
    watcher_cardState();
    // if (!accessToken) window.location.href = '/'; //判断登录状态跳转
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
    // r.router.query.q,
    routeTab,
    tabState,
    reqWearablesData,
  ]);


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
            token={refreshTK()}
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



  const randerCardList = React.useMemo(() => {
    // console.log(routeTab,tabState);

    const scroll = (e) => {
      // console.log(e,"222222");

      // // console.log('scrollscrollscrollscrollscrollscroll')
      // console.log(document.querySelector('.myClassName')?.scrollTop);
      // //   if(document.querySelector('.myClassName')?.scrollTop>868){
      // // console.log('触底')
      // //   }
      // const timeCount;
      // if (timeCount) {
      //   clearTimeout(timeCount);
      // }

      // timeCount = setTimeout(() => {
      // onSearchHandlerDetail('', pageNum, 20, '')
      // if (dataSource.length) {
      // console.log('触底')
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      // console.log(scrollTop, scrollHeight, scrollTop + scrollHeight, scrollHeight - scrollTop, clientHeight,e.target.scrollHeight);
      // console.log(scrollTop, clientHeight, scrollTop + clientHeight, scrollHeight, window.innerHeight, scrollTop + clientHeight >= scrollHeight - 1);
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        // if (showModal) {
        // console.log('这时候刷新');
        //  setTimeout(() => {
        // console.log(searchText, 'console.log(searchText);');
        if (searchText !== '') {

          // console.log('有没有');

          onSearchHandler(searchText, pageNum, 20, '', false)
        } else {

          onSearchHandlerDetail('', pageNum, 20, '')
        }
        //  }, 1000);

        // }
      } else {
        setShowModal(false)

        // }

        if (scrollTop + clientHeight >= scrollHeight - 20) {
          // console.log('滚动');

          //   setSwitchShow(true)
          //   if(!showModal){
          // onSearchHandlerDetail('', pageNum, 20, '')
          //   }
          // onSearchHandlerDetail('', pageNum, 20, '')
          // setDataSource(res.data.Place.Voxels)

        }
      }

      // }, 1000);


    }

    if (routeTab === 'Place') {
      return (
        <>
          <div className={cn('tab-list flex ', style.allHeight)}>
            {/* <div className={cls}>menuDataTwoArrCon</div> */}
            <div className={cn('main-content flex px-0', style.tabtext)}>
              {
                loadingDetail === true ? null :
                  <>
                    {(TABData).map((item) => {

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
                  </>
              }
              <div className={cls} />
            </div>
            <div className={cls} />
          </div>

          <div onScroll={scroll} className={cn('main-content myClassName', emptyStatus === true ? style.qqq : style.content,)} style={{ marginTop: "20px", marginBottom: "30px", paddingBottom: '2px' }}>
            {/* {
               !valueCount ?
            } */}
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
    if (routeTab === 'Event') {
      return (
        // <div>5555555</div>
        <div className={style.allHeight1}><EventDetail /><EventDetail /></div>
      )
      // if (showType === 'Voxels') {
      //   return (
      //     <>
      //       <div className={cn('tab-list flex mt-5', style.allHeight)}>
      //         <div className={cls}></div>
      //         <div className={cn('main-content flex px-0', style.tabtext)}>
      //           {REPORTTAB.map((item) => {
      //             return (
      //               <Tab4
      //                 active={tabState === item.type}
      //                 isMini={true}
      //                 key={item.label}
      //                 label={item.label}
      //                 icon={item.icon}
      //                 onClick={() => {
      //                   onTabChangeTR(item.type);
      //                 }}
      //               />
      //             );
      //           })}
      //           <div className={cls} />
      //         </div>
      //         <div className={cls} />
      //       </div>
      //       <div className={cn(style.content)}>
      //         <BaseChart>
      //           <BaseBar
      //             id={'parcel1'}
      //             labelText={'DAILY TRAFFIC OF ALL MY PARCELS '}
      //             dataHandlder={req_cv_parcel_traffic}
      //             barWidth={20}
      //             limit={21}
      //             textColor={style.nftColor}
      //             token={refreshTK()}
      //           ></BaseBar>
      //         </BaseChart>
      //         {/* <BaseChart className=" my-5">
      //           <TrafficBar
      //             id={'parcel3'}
      //             labelText={'DAILY TRAFFIC'}
      //             dataHandlder={req_cv_parcel_traffic_list}
      //             barWidth={20}
      //             limit={21}
      //             textColor={style.nftColor}
      //             token={refreshTK()}
      //           ></TrafficBar>
      //         </BaseChart> */}
      //         <BaseChart className=" my-5" type={true}>
      //           <PieChart
      //             id="piechart2"
      //             labelText={'PERCENTAGE OF PARCEL TRAFFIC '}
      //             dataHandlder={req_cv_parcel_traffic_daily}
      //             token={refreshTK()}
      //             textColor={style.nftColor}
      //             options={[
      //               {
      //                 label: 'Day',
      //                 value: 'day',
      //               },
      //               {
      //                 label: 'Week',
      //                 value: 'week',
      //               },
      //               {
      //                 label: 'Month',
      //                 value: 'month',
      //               },
      //             ]}
      //           ></PieChart>
      //         </BaseChart>
      //         <BaseChart className=" my-5" type={true}>
      //           <ProfileDetail
      //             label={'DETAILED TRAFFIC INFORMATION LIST OF PARCELS'}
      //             dataHandlder={req_cv_parcel_month_traffic_detail}
      //             token={refreshTK()}
      //             textColor={style.nftColor}
      //           ></ProfileDetail>
      //         </BaseChart>
      //       </div>
      //     </>
      //   );
      // }
      // if (showType === 'Decentraland') {
      //   return (
      //     <>
      //       <div className={cn('tab-list flex ', style.allHeight)}>
      //         <div className={cls}></div>
      //         <div className="main-content flex px-0">
      //           {REPORTTAB.map((item) => {
      //             return (
      //               <Tab4
      //                 active={tabState === item.type}
      //                 isMini={true}
      //                 key={item.label}
      //                 label={item.label}
      //                 icon={item.icon}
      //                 onClick={() => {
      //                   onTabChangeTR(item.type);
      //                 }}
      //               />
      //             );
      //           })}
      //           <div className={cls} />
      //         </div>
      //         <div className={cls} />
      //       </div>
      //       <div className={cn(style.content)}>
      //         <BaseChart>
      //           <BaseBarDece
      //             id={'parcel1'}
      //             labelText={'DAILY TRAFFIC OF ALL MY PARCELS '}
      //             dataHandlder={req_dece_parcel_traffic}
      //             barWidth={20}
      //             limit={21}
      //             textColor={style.deceColor}
      //             token={refreshTK()}
      //           ></BaseBarDece>
      //         </BaseChart>
      //         <BaseChart className=" my-5" type={true}>
      //           <PieChartDece
      //             id="piechart2"
      //             labelText={'PERCENTAGE OF PARCEL TRAFFIC '}
      //             dataHandlder={req_deceData_parcel_traffic_daily}
      //             token={refreshTK()}
      //             textColor={style.deceColor}
      //             options={[
      //               {
      //                 label: 'Day',
      //                 value: 'day',
      //               },
      //               {
      //                 label: 'Week',
      //                 value: 'week',
      //               },
      //               {
      //                 label: 'Month',
      //                 value: 'month',
      //               },
      //             ]}
      //           ></PieChartDece>
      //         </BaseChart>
      //         <BaseChart className=" my-5" type={true}>
      //           <ProfileDetailDece
      //             label={'DETAILED TRAFFIC INFORMATION LIST OF PARCELS'}
      //             dataHandlder={req_dece_parcel_traffic_list}
      //             token={refreshTK()}
      //             textColor={style.deceColor}
      //           ></ProfileDetailDece>
      //         </BaseChart>
      //       </div>
      //     </>
      //   );
      // }
    }
    if (routeTab === 'Creator') {
      return (
        <>
          {/* {institutions.map((item, idx) => {
          return <InfoCard cls={style.cls} {...item} key={idx} onClick={() => toTopic(idx, item)}></InfoCard>;
        })} */}
          <div className={cn('tab-list flex ', style.allHeight)}>
            {/* <div className={cls}>valueCountCreater || </div> */}
            <div className={cn('main-content flex px-0', style.tabtext)}>
              {(TABDataCreater).map((item) => {
                return (
                  <Tab4
                    active={tabStateCreater === item.type}
                    isMini={true}
                    key={item.label}
                    label={item.label}
                    onClick={() => {
                      onTabChangeCreater(item.type);
                    }}
                  />
                );
              })}
              <div className={cls} />
            </div>
            <div className={cls} />
          </div>

          <div onScroll={scroll} className={cn('main-content', style.content)} style={{ marginTop: "20px", marginBottom: "30px" }}>
            {renderContentCreater}
          </div>
        </>
      );
    }

    if (routeTab === 'Learn') {
      return (
        <>
          {/* {buildState === 2 ? */}
          <>
            <div className={style.buildingContainer}>
              <div onScroll={scroll} className={cn('main-content mt-8', style.content)} style={{ marginTop: "-20px" }}>{renderBuilding}
              </div>
            </div>
          </>
          : <></>
          {/* } */}
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
    loadingDetail,
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



  const dataSourceTwoDetail = async (query: string,
    page: number,
    per_page: number,
    search_item: string) => {
    const res = await getSearchDetail(searchText || query, page, per_page, search_item);
    // const dataList  = dataSourceTwo;
    // dataList.push(res.data.Place.Voxels)
    // setDataSourceTwo(dataList)
    // console.log(dataSourceTwo,"dataSourceTwodataSourceTwo");
    setShowModal(true)
    // setDataSourceTwo(res.data.Place.Voxels)
    setDataSource(res.data.Place.Voxels)

  }

  React.useEffect(() => {
    const listener = () => {
      if (
        document.getElementById('myClassName') && window.scrollY > 0
      ) {
        setFixedState(true);
      } else {
        setFixedState(false);
      }
    };
    document.addEventListener('scroll', listener);
    return () => document.removeEventListener('scroll', listener);
  }, []);



  return (
    <>
      <Page className={cn('min-h-screen ', style.anPage,)} meta={meta}
      >
        {/* joinBuilders === true?style.joinBuilders:'' */}
        {/* <div
          onClick={() => {
            setManySetState(false);
          }}
          id='container'
          className={cn('', style.bigPic)}
        > */}
        <div id='myClassName' className={cn("bg-black relative", fixedState ? style.a : null)} >
          <PageHeader className="relative z-10" active={'learn'} />
        </div>

        <div id='countTatal' ref={headerRef}
          className={cn(' flex flex-col justify-center items-center ', style.profileCon)}>


          <div className={cn('', showModal === false ? style.tablebg1 : style.tablebg)}>
            <div className={cn('', style.searchBoxVal)}>
              <Search text={searchText} onSearch={(val) => {
                // console.log('执行几遍');

                if (!router.query.q) {
                  setDataSource([])
                  onSearchHandler('', 1, pageSize, '', false)
                } else {
                  setSearchText(router.query.q);
                  // onSearchHandler(router.query.q, 1, pageSize, '',false)
                }
              }} ></Search>
            </div>



            <div className={cn(style.tableList)}>
              {valueCount.map((item) => {
                // console.log(valueCount,22222222);
                return (
                  <Tab5
                    label={item.label}
                    key={item.label}
                    active={routeTab === item.type}
                    count={item.count}
                    onClick={() => {
                      changeTab3(item.label, item.type);
                    }}
                  />
                  // <>{item}</>
                );
              })}
            </div>
          </div>
          {randerCardList}
          <div id='footer' style={{ width: "100%" }} className={cn('', addbuild === true ? style.joinBuildersFooter : '')}><Footer /></div>
        </div>
        {/* </div> */}


        {/* {wearablesShowOrHideState ? (
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
        ) : null} */}

        {/* {tabStateTR === true ? <>
        <JoinBuildersAdd
          turnBuild={turnBuild}
          nextBtnAdd={nextBtnAdd}
        />
      </> : ''} */}



      </Page>

    </>
  );
}

export default withRouter(search);
