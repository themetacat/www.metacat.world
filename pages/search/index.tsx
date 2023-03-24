import React, { useEffect, useRef } from 'react';

import cn from 'classnames';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';


import { useRouter, withRouter } from 'next/router';


import Page from '../../components/page';
// import PageHeader from '../../components/page-header';
import PageHeader from '../../components/top-navigation';
import Search from '../../components/searchHome';
import Footer from '../../components/footer';
import LearnCard from '../../components/learnCard';
import SwiperTagSearch from '../../components/swiper-tagSearch';
import InfoCard from '../../components/info_card';
import Tab4 from '../../components/tab4';
import Tab from '../../components/hometabParcels';
import Status from '../../components/status';
// import Card from '../../components/parcels-card';
import Card from '../../components/cardParcels';
import Tab5 from '../../components/tab5';
import RentSet from '../../components/parcels_rent_set';
import Popup from '../../components/popup';
import store from '../../store/profile';
import EventDetail from '../../components/eventDetail';

import { state } from '../../components/wallet-btn';

import DaoModelList2 from '../../components/dao-model-listWearable';


import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import { useWalletProvider } from '../../components/web3modal';

import { convert, getToken, setToken } from '../../common/utils';

import { getBaseInfo, refreshToken, getParcelList2, getSearchDetail } from '../../service';


import {
  req_dcl_parcel_list,
  req_building_list,
  req_get_user_wearable,
  req_set_wearable_show_status,
  req_get_building_detail_info,
} from '../../service/z_api';



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
const TABobj = {
  Voxels: '/images/cvLogo.png',
  Decentranland: '/images/Decentraland.jpg',
  SomniumSpace: '/images/somniumspace.png',
  Oncyber: 'https://oncyber.io/images/logo.png',
  Mona: 'https://monaverse.com/branding/mona-logo-white.svg',
  Protoworld: '/images/protoworld.png',
  RareRooms: '/images/RareRoom.png',
  TheSandbox: '/images/home-icon.svg',
  Spatial: '/images/Spatial.png',
  Hyperfy: '/images/Hyperfy.png',
  MozillaHubs: '/images/MozillaHubs.png',
  Arium: '/images/Arium.png',
  Artifex: '/images/Artifex.png',
}
const TABDataEvent = [
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
  {
    label: 'Somnium Space',
    icon: '/images/somniumspace.png',
    type: 'somniumspace',
    link: '/heatmap?type=somniumspace',
  },
];
const TABDataCreater = [
  {
    label: 'Builder',
    type: 'Builder',
  },
  {
    label: 'Wearable',
    type: 'Wearable',
  },

]


const TAB3 = [
  {
    label: 'Place',
    type: 'Place',
  },
  {
    label: 'Event',
    type: 'Event',
  },
  {
    label: 'Creation',
    type: 'Creation',
  },
  {
    label: 'Learn',
    type: 'Learn',
  },

];



function search(r) {
  const nav_Label = React.useRef(null);
  const meta = {
    title: `Search - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };
  const headerRef = React.useRef(null)


  const router = useRouter();
  const s = store.useState('rentOutState', 'id', 'status', 'parcels_cardState', 'type');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [loadingDetail, setloadingDetail] = React.useState(false);
  const [fixedState, setFixedState] = React.useState(false);
  const [searchText, setSearchText] = React.useState(null);
  const [dataSource, setDataSource] = React.useState([]);
  const [dataSourceTwo, setDataSourceTwo] = React.useState([]);
  const [dataSourceCreBuilder, setDataSourceCreBuilder] = React.useState([]);
  const [dataSourceLearn, setDataSourceLearn] = React.useState([]);
  const [dataSourceCreWear, setDataSourceCreWear] = React.useState([]);
  const [typeState, setTypeState] = React.useState('');
  const [dataBuildSource, setDataBuildSource] = React.useState([]);
  const [typeList, setTypeList] = React.useState([]);
  const [dclDataSource, setDclDataSource] = React.useState([]);
  const [somSpaceDataSource, setSomSpaceDataSource] = React.useState([]);
  const [oncyberDataSource, setOncyberDataSource] = React.useState([]);
  const [monaDataSource, setMonaDataSource] = React.useState([]);
  const [protoWorldDataSource, setProtoWorldDataSource] = React.useState([]);
  const [rareDataSource, setRareDataSource] = React.useState([]);
  const [sandBoxDataSource, setSandBoxDataSource] = React.useState([]);
  const [spatialDataSource, setSpatialDataSource] = React.useState([]);
  const [hyperfyDataSource, setHyperfyDataSource] = React.useState([]);
  const [mozillaHubsDataSource, setMozillaHubsDataSource] = React.useState([]);
  const [ariumDataSource, setAriumDataSource] = React.useState([]);
  const [artifexDataSource, setArtifexDataSource] = React.useState([]);
  const [avatar, setAvatarUrl] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [tabStateEvent, setTabStateEvent] = React.useState('Voxels');
  const [tabState, setTabState] = React.useState(null);
  const [tabStateCreater, setTabStateCreater] = React.useState(null);
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
  const [routeTab, setRouteTab] = React.useState(router?.query?.type);
  const [email, setEmail] = React.useState(null);
  const [addbuild, setAddbuild] = React.useState(false);

  const [showTab, setShowTab] = React.useState(TAB3[0].label);


  const [navLabel, setNavLabel] = React.useState('All');
  const wearablesState = React.useRef(null);
  // const [showOrHideStateConent, setShowOrHideStateConent] = React.useState(false);
  const [creatorsState, setCreatorsState] = React.useState(null);
  const [wearablesCreatorsData, setWearablesCreatorsData] = React.useState([]);
  // const [ownerData, setOwnerData] = React.useState([]);
  const [wearablesCreatorsOriginData, setWearablesCreatorsOriginData] = React.useState([]);
  const [wearablesShowData, setWearablesShowData] = React.useState([]);
  const [wearablesHideData, setWearablesHideData] = React.useState([]);
  const [menuDataTwoArrCon, setMenuDataTwoArrCon] = React.useState([]);

  const [wearablesShowOrHideState, setWearablesShowOrHideState] = React.useState(false);

  const [wearablesShowOrHide, setWearablesShowOrHide] = React.useState(null);
  const [wearablesSleceteIdList, setWearablesSleceteIdList] = React.useState([]);
  const [eventCvList, setEventCvList] = React.useState([]);
  const [eventDclList, setEventDclList] = React.useState([]);
  const [eventSomList, setEventSomList] = React.useState([]);
  // const [eventSomList, setEventSomList] = React.useState([]);
  const [valueCount, setValueCount] = React.useState([]);
  const [valueCountCreater, setValueCountCreater] = React.useState([]);
  const [valueCountEvent, setValueCountEvent] = React.useState([]);
  const [tabPercent, setTabPercent] = React.useState(0);

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
  const [subTabState, setSubTabState] = React.useState('Voxels');
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
      // console.log(l, 111, showTab, router.query.q);

      setShowTab(l);
      setRouteTab(t);
      if (l && router.query.q !== undefined) {
        router.replace(`/search?q=${router.query.q}&type=${l}`);
      } else {
        router.replace(`/search?type=${l}`)
      }
    },
    [showTab, router.query.q],
  );

  const onTabChange = React.useCallback(
    async (tab) => {
      if (tabState === tab) return;
      // setLoading(true);


      setParcelsIds([]);
      setSelectedIds([]);
      setCardState(false);
      store.setState(() => ({ parcels_cardState: false, id: null }));



      setTabState(tab);

      if (tab === 'Voxels') {

        // setDataSource(orginData.parcelList);
        // store.setState(() => ({ type: 'cv' }));
      }
      if (tab === 'Decentranland') {
        // const dataListDece = dclDataSource;
        // if (res.data.Place?.Decentranland !== []) {
        //   dataListDece?.push(...res.data.Place?.Decentranland)
        // setDclDataSource(dataListDece)
        // } else {
        // setDclDataSource(eventDclList)
        // }
      }
    },
    [tabState],
  );
  const onTabChangeEvent = React.useCallback(
    async (tab) => {
      if (tabStateEvent === tab) return;
      // setLoading(true);

      setTabStateEvent(tab);
      setParcelsIds([]);
      setSelectedIds([]);
      setCardState(false);
      store.setState(() => ({ parcels_cardState: false, id: null }));
      if (tab === 'Voxels') {

        // setDataSource(orginData.parcelList);
        // store.setState(() => ({ type: 'cv' }));
      }
      if (tab === 'Decentranland') {
        // const dataListDece = dclDataSource;
        // if (res.data.Place?.Decentranland !== []) {
        //   dataListDece?.push(...res.data.Place?.Decentranland)
        // setDclDataSource(dataListDece)
        // } else {
        //   setDclDataSource([])
        // }
      }
      if (tab === 'somniumspace') {
        //   setDclDataSource([])
      }
    },
    [tabStateEvent],
  );
  const onTabChangeCreater = React.useCallback(
    async (tab) => {
      // setShowType(tab);


      if (tabStateCreater === tab) return;

      // setLoading(true);
      setTabStateCreater(tab);
      setParcelsIds([]);
      setSelectedIds([]);
      setCardState(false);
      store.setState(() => ({ parcels_cardState: false, id: null }));
      if (tab === 'builder') {
        // setDataSource(orginData.parcelList);
        // store.setState(() => ({ type: 'cv' }));
      }
      if (tab === 'wearable') {

        // setDclDataSource(orginData.parcelList);
        // store.setState(() => ({ type: 'dcl' }));
      }
    },
    [tabStateCreater],
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
    typeVal: string) => {
    // setDataSource([])
    //             setDataSourceLearn([])
    //             setDataSourceCreWear([])
    //             setDataBuildSource([])
    //             setEventDclList([])
    //             setEventSomList([])
    //             setEventCvList([])
    setShowModal(true)
    setLoading(true)
    const newPage = pageNum + 1

    setPage(newPage)

    const res = await getSearchDetail(query, page, per_page, typeVal);
    setShowModal(false)
    setLoading(false)
    if (res.code === 100000) {
      const data = res.data?.menu_one;
      const dataCreater = res.data?.Creation?.menu_two;
      const dataEvent = res.data?.Event?.menu_two;
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

      const dataListBuilder = dataSourceCreBuilder;
      if (res.data?.Creation?.Builder?.length > 0) {
        dataListBuilder?.push(...res.data?.Creation?.Builder)
        setDataSourceCreBuilder(dataListBuilder)


      }
      const dataListWearable = dataSourceCreWear;
      if (res.data?.Creation?.Wearable?.length > 0) {
        dataListWearable?.push(...res.data?.Creation?.Wearable)
        // console.log(dataListWearable, page, "asdsadsad");

        setDataSourceCreWear(convert(dataListWearable))

      }

      const dataListLearn = dataSourceLearn;
      if (res.data?.Learn?.data?.length > 0) {
        dataListLearn?.push(...res.data?.Learn?.data)
        setDataSourceLearn(dataListLearn)

      }
      const dataListEventCv = eventCvList;
      if (res.data?.Event?.Voxels?.length > 0) {
        dataListEventCv?.push(...res.data?.Event?.Voxels)
        setEventCvList(dataListEventCv)

      }
      const dataListEventDcl = eventDclList;
      if (res.data?.Event?.Decentranland?.length > 0) {
        dataListEventDcl?.push(...res.data?.Event?.Decentranland)
        setEventDclList(dataListEventDcl)
      }
      const dataListEventSom = eventSomList;
      if (res.data?.Event?.SomniumSpace?.length > 0) {
        dataListEventSom?.push(...res.data?.Event?.SomniumSpace)
        setEventSomList(dataListEventSom)
      }

      const dataListDece = dclDataSource;
      if (res.data.Place?.Decentranland?.length > 0) {
        dataListDece?.push(...res.data.Place?.Decentranland)
        setDclDataSource(dataListDece)
      }
      const dataListSomSpace = somSpaceDataSource;
      if (res.data.Place?.SomniumSpace?.length > 0) {
        dataListSomSpace?.push(...res.data.Place?.SomniumSpace)
        setSomSpaceDataSource(dataListSomSpace)
      }
      const dataListOncyber = oncyberDataSource;
      if (res.data.Place?.Oncyber?.length > 0) {
        dataListOncyber?.push(...res.data.Place?.Oncyber)
        setOncyberDataSource(dataListOncyber)
      }
      const dataListMona = monaDataSource;
      if (res.data.Place?.Mona?.length > 0) {
        dataListMona?.push(...res.data.Place?.Mona)
        setMonaDataSource(dataListMona)
      }
      const dataListPro = protoWorldDataSource;
      if (res.data.Place?.Protoworld?.length > 0) {
        dataListPro?.push(...res.data.Place?.Protoworld)
        setProtoWorldDataSource(dataListPro)
      }
      const dataListRare = rareDataSource;
      if (res.data.Place?.RareRooms?.length > 0) {
        dataListRare?.push(...res.data.Place?.RareRooms)
        setRareDataSource(dataListRare)
      }
      const dataListsandBox = sandBoxDataSource;
      if (res.data.Place?.TheSandbox?.length > 0) {
        dataListsandBox?.push(...res.data.Place?.TheSandbox)
        setSandBoxDataSource(dataListsandBox)
      }
      const dataListSpatial = spatialDataSource;
      if (res.data.Place?.Spatial?.length > 0) {
        dataListSpatial?.push(...res.data.Place?.Spatial)
        setSpatialDataSource(dataListSpatial)
      }
      const dataListHyperfy = hyperfyDataSource;
      if (res.data.Place?.Hyperfy?.length > 0) {
        dataListHyperfy?.push(...res.data.Place?.Hyperfy)
        setHyperfyDataSource(dataListHyperfy)
      }
      const dataListMozillaHubs = mozillaHubsDataSource;
      if (res.data.Place?.MozillaHubs?.length > 0) {
        dataListMozillaHubs?.push(...res.data.Place?.MozillaHubs)
        setMozillaHubsDataSource(dataListMozillaHubs)
      }
      const dataLisArium = ariumDataSource;
      if (res.data.Place?.Arium?.length > 0) {
        dataLisArium?.push(...res.data.Place?.Arium)
        setAriumDataSource(dataLisArium)
      }
      const dataLisArtifex = artifexDataSource;
      if (res.data.Place?.Artifex?.length > 0) {
        dataLisArtifex?.push(...res.data.Place?.Artifex)
        setArtifexDataSource(dataLisArtifex)
      }


      const MenuDataTwoArr = []
      const valCountCreater = []
      const valCountEvent = []

      if (dataCreater) {
        Object?.keys(dataCreater).forEach(key => {
          const obj = {
            label: dataCreater[key],
            type: dataCreater[key],
          }
          valCountCreater.push(obj)
        })
        setValueCountCreater(valCountCreater)
      }



      if (dataEvent) {
        Object?.keys(dataEvent).forEach(key => {
          const objEvent = {
            label: dataEvent[key],
            type: dataEvent[key], icon: TABobj[dataEvent[key]],
          }
          valCountEvent.push(objEvent)

        })
        setValueCountEvent(valCountEvent)
      }

      if (MenuDataTwo) {
        Object?.keys(MenuDataTwo).forEach(keys => {
          const objMenuTwo = {
            label: MenuDataTwo[keys],
            type: MenuDataTwo[keys],
            icon: TABobj[MenuDataTwo[keys]],
          }
          MenuDataTwoArr.push(objMenuTwo)
        })
        setMenuDataTwoArrCon(MenuDataTwoArr)
      }


      if (!res.data?.item_count && !res.data?.menu_one) {
        setemptyStatus(true)
      }

    }

  }

  // const resultHandlerBu = React.useCallback(
  //   (res, callback) => {
  //     const { code, msg, data } = res;
  //     if (code === 100000) {
  //       return convert(data);
  //     }
  //     if (code === 100003) {
  //       refreshTK().then((token) => {
  //         if (token && callback) {
  //           callback(token);
  //         }
  //       });
  //       return null;
  //     }


  //     return null;
  //   },
  //   [refreshTK],
  // );

  const changeNavTab = React.useCallback(
    (nav_label, index = 0) => {

      // setNavLabel(navLabel);
      setNavLabel(nav_label);
      setCardState(false);
      setManySetState(false);
      nav_Label.current = nav_label;
      // changeNum(dataSource, nav_label);

      const set_nav = Nav.map((item, i) => {
        if (index === i) return { ...item, state: 1 };
        return { ...item, state: 0 };
      });
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
      setStatue(res.data.profile.creator_status)
      setBuildState(buildNum)
      setWalletAddress(wallet)
      // setCreaterStateVal(res.data.profile.creator_status)
      setEmailStateWearable(res.data.profile.email)


      setEmailStateVal(emailState)

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
    window.location.reload()
    // const accessToken = getToken('atk');
    // if (accessToken && tabState === 'Voxels') {
    //   requestData(accessToken);
    // }
    // if (accessToken && tabState === 'Decentraland') {
    //   reqDclData(accessToken);
    // }
    // if (accessToken && routeTab === 'building') {
    //   reqBuilderData(accessToken);
    // }
  }, [requestData, getToken, reqDclData]);



  const onSearchHandler = React.useCallback(async (query,
    page: number,
    per_page: number,
    typeVal: string,
    isCli: boolean) => {
    // setPage(1)
    // console.log('调用几遍',);

    const newPage = page + 1
    setPage(newPage)

    setShowModal(true)
    setLoading(true)
    // setPage(newPage)

    const res = await getSearchDetail(router.query.q || query, page || 1, per_page || 20, typeVal);

    setShowModal(false)
    setLoading(false)
    if (res.code === 100000) {

      const data = res.data?.menu_one;
      const dataCreater = res.data?.Creation?.menu_two;
      const countNum = res.data?.item_count;
      const dataEvent = res.data?.Event?.menu_two;
      const MenuDataTwo = res.data?.Place?.menu_two;

      const MenuDataTwoArr = []
      const valCountCreater = []
      const valCountEvent = []
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


      // setRouteTab(arr[0]?.type)
      if (MenuDataTwo) {

        Object?.keys(MenuDataTwo).forEach(keys => {
          const objMenuTwo = {
            label: MenuDataTwo[keys],
            type: MenuDataTwo[keys],
            icon: TABobj[MenuDataTwo[keys]],
          }
          MenuDataTwoArr.push(objMenuTwo)
        })
        setMenuDataTwoArrCon(MenuDataTwoArr)

      }



      // setTabStateCreater('Builder')
      // setTabState('Voxels')
      // setTabStateEvent('Voxels')
      // setRouteTab('Place')
      const dataList = isCli ? [] : dataSource;

      if (res.data?.Place?.Voxels?.length > 0) {
        dataList?.push(...res.data?.Place?.Voxels)

        setDataSource(dataList)
      }

      const dataListBuilder = dataSourceCreBuilder;
      if (res.data?.Creation?.Builder?.length > 0) {
        dataListBuilder?.push(...res.data?.Creation?.Builder)
        setDataSourceCreBuilder(dataListBuilder)
      }

      const dataListWearable = dataSourceCreWear;
      if (res.data?.Creation?.Wearable?.length > 0) {
        dataListWearable?.push(...res.data?.Creation?.Wearable)
        setDataSourceCreWear(convert(dataListWearable))
      }

      const dataListEventCv = eventCvList;
      if (res.data?.Event?.Voxels?.length > 0) {
        dataListEventCv?.push(...res.data?.Event?.Voxels)

        setEventCvList(dataListEventCv)
      }
      const dataListEventDcl = eventDclList;
      if (res.data?.Event?.Decentranland?.length > 0) {
        dataListEventDcl?.push(...res.data?.Event?.Decentranland)
        setEventDclList(dataListEventDcl)
      }


      const dataListEventSom = eventSomList;
      if (res.data?.Event?.SomniumSpace?.length > 0) {
        dataListEventSom?.push(...res.data?.Event?.SomniumSpace)
        setEventSomList(dataListEventSom)
      }


      const dataListLearn = dataSourceLearn;
      if (res.data?.Learn?.data?.length > 0) {
        dataListLearn?.push(...res.data?.Learn?.data)
        setDataSourceLearn(dataListLearn)
      }

      const dataListDece = dclDataSource;
      if (res.data.Place?.Decentranland?.length > 0) {
        dataListDece?.push(...res.data.Place?.Decentranland)

        setDclDataSource(dataListDece)
      }
      const dataListSomSpace = somSpaceDataSource;
      if (res.data.Place?.SomniumSpace?.length > 0) {
        dataListSomSpace?.push(...res.data.Place?.SomniumSpace)
        setSomSpaceDataSource(dataListSomSpace)
      }
      const dataListOncyber = oncyberDataSource;
      if (res.data.Place?.Oncyber?.length > 0) {
        dataListOncyber?.push(...res.data.Place?.Oncyber)
        setOncyberDataSource(dataListOncyber)
      }
      const dataListMona = monaDataSource;
      if (res.data.Place?.Mona?.length > 0) {
        dataListMona?.push(...res.data.Place?.Mona)
        setMonaDataSource(dataListMona)
      }
      const dataListPro = protoWorldDataSource;
      if (res.data.Place?.Protoworld?.length > 0) {
        dataListPro?.push(...res.data.Place?.Protoworld)
        setProtoWorldDataSource(dataListPro)
      }

      const dataListRare = rareDataSource;
      if (res.data.Place?.RareRooms?.length > 0) {
        dataListRare?.push(...res.data.Place?.RareRooms)
        setRareDataSource(dataListRare)
      }

      const dataListsandBox = sandBoxDataSource;
      if (res.data.Place?.TheSandbox?.length > 0) {
        dataListsandBox?.push(...res.data.Place?.TheSandbox)
        setSandBoxDataSource(dataListsandBox)
      }

      const dataListSpatial = spatialDataSource;
      if (res.data.Place?.Spatial?.length > 0) {
        dataListSpatial?.push(...res.data.Place?.Spatial)
        setSpatialDataSource(dataListSpatial)
      }

      const dataListHyperfy = hyperfyDataSource;
      if (res.data.Place?.Hyperfy?.length > 0) {
        dataListHyperfy?.push(...res.data.Place?.Hyperfy)
        setHyperfyDataSource(dataListHyperfy)
      }
      const dataListMozillaHubs = mozillaHubsDataSource;
      if (res.data.Place?.MozillaHubs?.length > 0) {
        dataListMozillaHubs?.push(...res.data.Place?.MozillaHubs)
        setMozillaHubsDataSource(dataListMozillaHubs)
      }
      const dataLisArium = ariumDataSource;
      if (res.data.Place?.Arium?.length > 0) {
        dataLisArium?.push(...res.data.Place?.Arium)
        setAriumDataSource(dataLisArium)
      }
      const dataLisArtifex = artifexDataSource;
      if (res.data.Place?.Artifex?.length > 0) {
        dataLisArtifex?.push(...res.data.Place?.Artifex)
        setArtifexDataSource(dataLisArtifex)
      }

      // setDclDataSource(res.data.Place.Decentranland)

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

      if (dataEvent) {
        Object?.keys(dataEvent).forEach(key => {
          const objEvent = {
            label: dataEvent[key],
            type: dataEvent[key], icon: TABobj[dataEvent[key]],
          }
          valCountEvent.push(objEvent)
          // console.log(objEvent);

        })
        // setTabStateEvent(dataEvent[0])
        setValueCountEvent(valCountEvent)

      }


      if ((res.data?.item_count && res.data?.menu_one).length === 0) {

        setemptyStatus(true)
        setloadingDetail(true)
      } else {
        setloadingDetail(false)
      }

    }
  }, [router.query.q]);


  const requireBuilder = React.useCallback(
    async (token) => {
      const res = await req_get_building_detail_info(token);
      const data = resultHandler(res, requireBuilder);
    },
    [resultHandler],
  );

  const toTopic = React.useCallback((id, item) => {

    if (item?.name === 'WearableDAO') {
      window.open('/wearables/wearabledao?type=chinesered')
    }
    if (item.topic_id) {
      window.open(`/topic/${item.topic_id}?type=buildings`);
    } else if (item.address) {
      window.open(`/topicNewBuilding?address=${item.address}`);
    }
  }, []);



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
          {dataSource?.map((card) => { return (<Card {...card} key={uuid()} typeState={card.type} />); })}
          {showModal === true ?
            <><img src='/images/saveIcon.gif'></img> </>
            :
            <>
              {dataSourceTwo?.map((card) => (<Card {...card} key={uuid()} typeState={card.type} />))}

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
    dclDataSource,
    loading,
    onRetry,
    loadingDetail,
    changeNum,
    valueCount,
    parcelsIds,
    setCardState,
    tabState,
    reqDclData,
  ]);
  const onClinkCvDetail = (card) => {
    if (card.status === 'Entry') {
      window.open(card.event_parcel_url);
    }
  }
  const onClinkDclDetail = (card) => {
    if (card.status === 'Entry') {
      window.open(card.event_parcel_url);
    }
  }
  const onClinkSomDetail = (card) => {
    if (card.status === 'Entry') {
      window.open(card.event_parcel_url);
    }

  }
  const renderContentEvent = React.useMemo(() => {

    if (loading) {
      return <Status status="loading" />;
    }
    if (error) {
      return <Status retry={onRetry} status="error" />;
    }
    if (loadingDetail === true) {

      return <Status status="loadingDetail" />;
    }
    if (tabStateEvent === 'Voxels') {

      return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 ">
          {eventCvList?.map((card, idx) => {
            return < EventDetail key={idx} {...card} onClinkDetail={() => {
              onClinkCvDetail(card)
            }} />;
          })}
        </div>
      );
    }
    if (tabStateEvent === 'Decentraland') {
      // Decentranland
      return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 ">
          {eventDclList?.map((card, idx) => {
            return (< EventDetail key={idx} {...card} onClinkDetail={() => {
              onClinkDclDetail(card)
            }} />);
          })}
        </div>
      );
    }
    if (tabStateEvent === 'somniumspace') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 ">
          {eventSomList?.map((card, idx) => {
            return (< EventDetail key={idx} {...card} onClinkDetail={() => {
              onClinkSomDetail(card)
            }} />);
          })}
        </div>
      );
    }
  }, [
    error,
    loading,
    onRetry,
    eventCvList,
    eventDclList,
    loadingDetail,
    eventSomList,
    changeNum,
    valueCount,
    parcelsIds,
    setCardState,
    tabState,
    reqDclData,
  ]);
  const renderContentCreater = React.useMemo(() => {

    if (tabStateCreater === 'Builder') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
          {dataSourceCreBuilder?.map((item, idx) => {
            return (
              <InfoCard cls={style.cls} {...item} key={idx}
                onClick={() => toTopic(idx, item)}
              ></InfoCard>
            );
          })}
        </div>
      );
    }
    if (tabStateCreater === ' Wearable') {
      return (
        <>55555
          {/* <DaoModelList2
                models={dataSourceCreWear}
                type={'topic'}
                address={router.query.id}
              ></DaoModelList2> */}
        </>
      );
    }
  }, [
    error,
    loading,
    onRetry,
    changeNum,
    parcelsIds,
    loadingDetail,
    tabStateCreater,
    setCardState,
    tabState,
    reqDclData,
  ]);


  const renderWerable = React.useMemo(() => {

    if (loading) {
      return <Status status="loadingDetail" />;
    }
    if (error) {
      return <Status retry={onRetry} status="error" />;
    }
    if (statue === 1) {
      return <Status status="emptyWerable" />;

    }

  }, [statue,
    error,
    loadingDetail,
    loading,
    onRetry])

  const renderBuilding = React.useMemo(() => {

    // if (loading) {
    //   return <Status status="loadingDetail" />;
    // }
    if (error) {
      return <Status retry={onRetry} status="error" />;
    }

    if (routeTab === 'Learn') {

      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-5">

            {/* <div>Learn</div> */}
            {/* <LearnCard/> */}
            {/* 123 */}
            {
              dataSourceLearn?.map((item, idx) => {
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
    changeNum,
    parcelsIds,
    setCardState,
    tabState,
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
      changeNum(dataSource, nav_Label.current);
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

  // useEffect(() => {
  // //   //   console.log(menuDataTwoArrCon);
  // //   console.log(router?.query?.type);
  // //   router.replace(`/search?q=${value}&type=${routeTab}`);
  // if(router?.query?.type === undefined ||router?.query?.type ==='Place'){
  //   setRouteTab('Place')
  // }else{
  //   setRouteTab(router?.query?.type)
  // }


  // }, [router?.query?.type])
  useEffect(() => {
    // console.log(router?.query?.type.toLowerCase(), 111111);
    setRouteTab(router?.query?.type)
  }, [router?.query?.type])

  // console.log(routeTab, 55555, router?.query?.q);


  useEffect(() => {
    //  if (window.location.search) return;
    const res = getSearchDetail(router?.query?.q, 1, 20, '');

    res.then((resPlace) => {
      // console.log(!resPlace.data?.Learn?.data);
      if (router?.query?.type !== undefined) {
        // console.log('_____________');
        setRouteTab(router?.query?.type)
        if (!resPlace.data?.Learn && router?.query?.type !== undefined) {
          setRouteTab(resPlace?.data?.menu_one[0])
          // router.replace(`/search?q=${router?.query?.q}&type=${resPlace?.data?.menu_one[0]}`);
        }
        if (!resPlace.data?.Event && router?.query?.type !== undefined) {
          setRouteTab(resPlace?.data?.menu_one[0])
        }
        if (!resPlace.data?.Creation && router?.query?.type !== undefined) {
          setRouteTab(resPlace?.data?.menu_one[0])
        }
        if (!resPlace.data?.Place && router?.query?.type !== undefined) {
          setRouteTab(resPlace?.data?.menu_one[0])
        }

      } else {
        // console.log('_____________88888');
        setRouteTab(resPlace?.data?.menu_one[0])
        // setRouteTab(router?.query?.type)
      }

      setTabState(resPlace?.data?.Place?.menu_two[0]);
      setTabStateEvent(resPlace.data.Event?.menu_two[0])
      setTabStateCreater(resPlace.data.Creation?.menu_two[0])

      setDataSourceLearn(resPlace.data?.Learn?.data)
      setDataSourceCreBuilder(resPlace.data?.Creation?.Builder)
      // setDataSource(resPlace.data?.Place?.Voxels)
      setDclDataSource(resPlace.data?.Place?.Decentranland)
      setOncyberDataSource(resPlace?.data?.Place?.Oncyber)
      setMonaDataSource(resPlace?.data?.Place?.Mona)
      setProtoWorldDataSource(resPlace?.data?.Place?.Protoworld)
      setSomSpaceDataSource(resPlace?.data?.Place?.SomniumSpace)
      setRareDataSource(resPlace?.data?.Place?.RareRooms)
      setSandBoxDataSource(resPlace?.data?.Place?.TheSandbox)
      setSpatialDataSource(resPlace?.data?.Place?.Spatial)
      setHyperfyDataSource(resPlace?.data?.Place?.Hyperfy)
      setMozillaHubsDataSource(resPlace?.data?.Place?.MozillaHubs)
      setAriumDataSource(resPlace?.data?.Place?.Arium)
      setArtifexDataSource(resPlace?.data?.Place?.Artifex)
      setDataSourceCreBuilder(resPlace.data?.Creation?.Builder)
      setDataSourceCreWear(resPlace.data?.Creation?.Wearable)
      setEventCvList(resPlace.data?.Event?.Voxels)
      setEventDclList(resPlace.data?.Event?.Decentranland)
      setEventSomList(resPlace.data?.Event?.SomniumSpace)

    })
  }, [router?.query?.q,])



  // React.useEffect(() => {
  //   if (window.location.search) return;
  //   onSearchHandler('', 1, 20, '', false)
  // }, [])

  React.useEffect(() => {
    // console.log('执行', router?.query?.q,window.location.search);
    // if(router?.query?.q===undefined)return ;
    if (window.location.search && router?.query?.q !== undefined) {
      // console.log('ni?');

      setDataSource([])
      setDataSourceLearn([])
      setDataSourceCreBuilder([])
      setDataSourceCreWear([])
      setDataBuildSource([])
      setEventDclList([])
      setEventSomList([])
      setDclDataSource([])
      setSomSpaceDataSource([])
      setMonaDataSource([])
      setProtoWorldDataSource([])
      setRareDataSource([])
      setSandBoxDataSource([])
      setSpatialDataSource([])
      setHyperfyDataSource([])
      setMozillaHubsDataSource([])
      setAriumDataSource([])
      setArtifexDataSource([])
      setOncyberDataSource([])
      setEventCvList([])
      setSearchText(router.query.q);
      onSearchHandler(router.query.q, 1, 20, '', false)

    } else {

      // console.log('没有啊！！！！！');
      setDataSource([])
      setDataSourceLearn([])
      setDataSourceCreBuilder([])
      setDataSourceCreWear([])
      setDataBuildSource([])
      setEventDclList([])
      setEventSomList([])
      setDclDataSource([])
      setSomSpaceDataSource([])
      setMonaDataSource([])
      setProtoWorldDataSource([])
      setRareDataSource([])
      setSandBoxDataSource([])
      setSpatialDataSource([])
      setHyperfyDataSource([])
      setMozillaHubsDataSource([])
      setAriumDataSource([])
      setArtifexDataSource([])
      setOncyberDataSource([])
      setEventCvList([])
      setSearchText('');
      onSearchHandler('', 1, 20, '', false)
    }
  }, [router?.query?.q])


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


    const scroll = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;

      if (scrollTop + clientHeight >= scrollHeight - 20) {

        if (searchText !== '') {

          onSearchHandler(searchText, pageNum, 20, '', false)
        } else {
          onSearchHandlerDetail('', pageNum, 20, '')
        }
      } else {
        setShowModal(false)

        // if (scrollTop + clientHeight >= scrollHeight - 20) {


        // }
      }



    }

    if (routeTab === 'Place') {

      return (
        <>

          <div className={cn('flex ', style.allHeight)}>
            {/* <div className={cls}>menuDataTwoArrCon||TABData</div> */}
            <div className={cn('main-content', style.tabtext)}>
              <div className="main-content">
                <SwiperTagSearch onActive={onTabChange} typeList={menuDataTwoArrCon} label={tabState} />
              </div>
              <div className={cls} />
            </div>
          </div>
          <div onScroll={scroll} className={cn('main-content myClassName', emptyStatus === true ? style.qqq : style.content,)} style={{ marginTop: "20px", marginBottom: "30px", paddingBottom: '2px' }}>

            {loading ? <Status status="loading" /> : null}
            {error ? <Status retry={onRetry} status="error" /> : null}
            {tabState === 'Voxels' ?
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                {dataSource?.map((card) => { return (<Card {...card} key={uuid()} typeState={card.type} />); })}
              </div>
              : null
            }
            {tabState === 'Decentranland' ?
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                {dclDataSource?.map((card) => {
                  return (<Card {...card} key={uuid()} typeState={card.type} />);
                })}
              </div>
              : null
            }
            {tabState === 'SomniumSpace' ?
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                {somSpaceDataSource?.map((card) => {
                  return (<Card {...card} key={uuid()} typeState={card.type} />);
                })}
              </div>
              : null
            }
            {tabState === 'Oncyber' ?
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                {oncyberDataSource?.map((card) => {
                  return (<Card {...card} key={uuid()} typeState={card.type} />);
                })}
              </div>
              : null
            }
            {tabState === 'Mona' ?
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                {monaDataSource?.map((card) => {
                  return (<Card {...card} key={uuid()} typeState={card.type} />);
                })}
              </div>
              : null
            }
            {tabState === 'Protoworld' ?
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                {protoWorldDataSource?.map((card) => {
                  return (<Card {...card} key={uuid()} typeState={card.type} />);
                })}
              </div>
              : null
            }
            {tabState === 'RareRooms' ?
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                {rareDataSource.map((card) => {
                  return (<Card {...card} key={uuid()} typeState={card.type} />);
                })}
              </div>
              : null
            }
            {tabState === 'TheSandbox' ?
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                {sandBoxDataSource?.map((card) => {
                  return (<Card {...card} key={uuid()} typeState={card.type} />);
                })}
              </div>
              : null
            }
            {tabState === 'Spatial' ?
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                {spatialDataSource.map((card) => {
                  return (<Card {...card} key={uuid()} typeState={card.type} />);
                })}
              </div>
              : null
            }
            {tabState === 'Hyperfy' ?
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                {hyperfyDataSource?.map((card) => {
                  return (<Card {...card} key={uuid()} typeState={card.type} />);
                })}
              </div>
              : null
            }
            {tabState === 'MozillaHubs' ?
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                {mozillaHubsDataSource?.map((card) => {
                  return (<Card {...card} key={uuid()} typeState={card.type} />);
                })}
              </div>
              : null
            }
            {tabState === 'Arium' ?
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                {ariumDataSource?.map((card) => {
                  return (<Card {...card} key={uuid()} typeState={card.type} />);
                })}
              </div>
              : null
            }
            {tabState === 'Artifex' ?
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                {artifexDataSource?.map((card) => {
                  return (<Card {...card} key={uuid()} typeState={card.type} />);
                })}
              </div>
              : null
            }
            {/* {loadingDetail === true || emptyStatus === true ?
              <Status status="loadingDetail" />
              : null
            } */}
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
        //   // <div>5555555</div>
        //   <div className={style.allHeight1}><EventDetail /><EventDetail /></div>

        <>

          <div className={cn('tab-list flex ', style.allHeight)}>
            {/* <div className={cls}>valueCountEvent||</div> */}
            <div className={cn('main-content flex px-0', style.tabtext)}>
              {(valueCountEvent || TABDataEvent).map((item) => {
                return (
                  <Tab4
                    active={tabStateEvent === item.type}
                    isMini={true}
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => {
                      onTabChangeEvent(item.type);
                    }}
                  />
                );
              })}
              <div className={cls} />
            </div>
            <div className={cls} />
          </div>

          <div onScroll={scroll} className={cn('main-content', style.content)} style={{ marginTop: "20px", marginBottom: "30px" }}>
            {/* {renderContentEvent} */}
            {/* {tabStateEvent} */}
            {
              tabStateEvent === 'Voxels' ?
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 ">
                  {eventCvList?.map((card, idx) => {
                    return < EventDetail key={idx} {...card} onClinkDetail={() => {
                      onClinkCvDetail(card)
                    }} />;
                  })}
                </div>
                : null
            }
            {
              tabStateEvent === 'Decentranland' ?
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 ">
                  {eventDclList?.map((card, idx) => {
                    return (< EventDetail key={idx} {...card} onClinkDetail={() => {
                      onClinkDclDetail(card)
                    }} />);
                  })}
                </div>
                : null
            }
            {
              tabStateEvent === 'SomniumSpace' ?
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 ">
                  {eventSomList?.map((card, idx) => {
                    return (< EventDetail key={idx} {...card} onClinkDetail={() => {
                      onClinkSomDetail(card)
                    }} />);
                  })}
                </div>
                : null
            }

            {/* {loadingDetail === true ?
              <Status status="loadingDetail" />
              : null
            } */}
          </div>

        </>
      )
    }
    if (routeTab === 'Creation') {
      // console.log(dataSourceCreWear)
      return (
        <>
          {/* {institutions.map((item, idx) => {
          return <InfoCard cls={style.cls} {...item} key={idx} onClick={() => toTopic(idx, item)}></InfoCard>;
        })} */}
          <div className={cn('tab-list flex ', style.allHeight)}>
            {/* <div className={cls}> </div> */}
            <div className={cn('main-content flex px-0', style.tabtext)}>
              {(valueCountCreater)?.map((item) => {

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

          <div onScroll={scroll} className={cn('main-content h-full', style.content)} style={{ marginTop: "20px", marginBottom: "30px" }}>
            {/* {renderContentCreater} */}
            {tabStateCreater === 'Builder' ?
              <>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
                  {dataSourceCreBuilder?.map((item, idx) => {
                    return (
                      <InfoCard cls={style.cls} {...item} key={idx}
                        onClick={() => toTopic(idx, item)}
                      ></InfoCard>
                    );
                  })}
                </div>
              </> : null}
            {tabStateCreater === 'Wearable' ? <>
              <DaoModelList2
                models={dataSourceCreWear}
                type={'topic'}
                address={router.query.id}
              ></DaoModelList2>
            </> : null}
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
    menuDataTwoArrCon,
    selectedIds,
    rent_set_state,
    loading,
    error,
    s,
    cartData,
    manySetLabel,
    loadingDetail,
    renderContent,
    renderContentEvent,
    renderBuilding,
    renderWerable,
    dataSource,
    dataBuildSource,
    tabState,
    tabStateCreater,
    routeTab,
    creatorsReander,
  ]);


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
      <Page className={cn('min-h-screen detailName', style.anPage,)} meta={meta}
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
          <PageHeader className="relative z-10" />
        </div>

        <div id='countTatal' ref={headerRef}
          className={cn(' flex flex-col justify-center items-center ', style.profileCon)}>


          <div className={cn('', showModal === false ? style.tablebg1 : style.tablebg)}>
            <div className={cn('', style.searchBoxVal)}>
              <Search setTypeVal={routeTab} text={searchText} onSearch={(val) => {
                // console.log(!router.query.q,'执行几遍', router.query.q);
                setDataSource([])
                // setRouteTab(valueCount[0]?.type)
                setDataSource([])
                // setRouteTab('Place')
                setDataSourceLearn([])
                setDataSourceCreBuilder([])
                setDataSourceCreWear([])
                setDclDataSource([])
                setSomSpaceDataSource([])
                setMonaDataSource([])
                setProtoWorldDataSource([])
                setRareDataSource([])
                setSandBoxDataSource([])
                setHyperfyDataSource([])
                setMozillaHubsDataSource([])
                setAriumDataSource([])
                setArtifexDataSource([])
                setSpatialDataSource([])
                setOncyberDataSource([])
                setDataBuildSource([])
                setEventDclList([])
                setEventSomList([])
                setEventCvList([])
                setSearchText(val);
              }} ></Search>
            </div>



            <div className={cn(style.tableList)}>

              <>
                {valueCount?.map((item) => {


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
                  );
                })}
              </>

            </div>
          </div>
          {/* { */}

          {/* // } */}
          {
            loadingDetail === true ? <div style={{ height: "500px", width: "1200px", margin: "0px auto" }}><Status status="loadingDetail" /></div> : null}
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
