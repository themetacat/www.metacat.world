import React from 'react'
import cn from "classnames";
import "tailwindcss/tailwind.css";
import { v4 as uuid } from 'uuid';
import { toast } from 'react-hot-toast';
import Page from "../../components/page";

import Rekv from "rekv";
import { useRouter, withRouter } from 'next/router';
import Tab4 from '../../components/tab4'

import { SITE_NAME, META_DESCRIPTION } from "../../common/const";
import style from "./index.module.css";
import DclCard from '../../components/parcels-dcl-card';
import store from '../../store/profile';
import WalletBtn from "../../components/wallet-btn";
import Card from '../../components/parcels-card';
import Tab3 from '../../components/tab3';
import ParcelsTab from '../../components/parcels-tab'
import RentSet from '../../components/parcels_rent_set';
import Popup from '../../components/popup';
import Status from '../../components/status'
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
const Nav = [
  {
    label: 'All',
    state: 1,
    num: 0,
  },
];

interface IProfileData {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  profile: {
    nickName: string;
    address: string;
    avatar: string;
  };
}

const INITIAL_STATE: IProfileData = {
  accessToken: null,
  idToken: null,
  refreshToken: null,
  profile: {
    nickName: null,
    address: null,
    avatar: null,
  },
};
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
export const state = new Rekv<IProfileData>(INITIAL_STATE);
export default function ParcelList() {
  const nav_Label = React.useRef(null);
  const router = useRouter();
  const [nav, setNav] = React.useState(Nav);
  const [tokenWearable, setTokenWearable] = React.useState(null);
  const s = store.useState('rentOutState', 'id', 'status', 'parcels_cardState', 'type');
  const [loading, setLoading] = React.useState(false);
  const [routeTab, setRouteTab] = React.useState( 'parcellist');
  const [tabState, setTabState] = React.useState('cryptovoxels');
  const [showTab, setShowTab] = React.useState(TAB3[0].label);
  const [parcelsIds, setParcelsIds] = React.useState([]);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [dataSource, setDataSource] = React.useState([]);
  const [cardState, setCardState] = React.useState(false);
  const [dclDataSource, setDclDataSource] = React.useState([]);
  const [rent_set_state, set_rent_set_state] = React.useState(false);
  const cls = cn('flex-1', style.bottomLine);
  const [status, set_status] = React.useState('');
  const [error, setError] = React.useState(false);
  const [type, set_type] = React.useState(false);
  const [value, set_value] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [cartData, setCartData] = React.useState([]);
  const [navLabel, setNavLabel] = React.useState('All');
  const changeTab3 = React.useCallback(
    async (l, t) => {
      setTabState('cryptovoxels');
      setShowTab(l);
      setRouteTab(t);
      // router?.replace(`/profile?type=${t}`);
      // router?.replace(`/type=${t}`);
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
        // setDataSource(orginData.parcelList);
        store.setState(() => ({ type: 'cv' }));
      }
      if (tab === 'decentraland') {
        // setDataSource(orginData.parcelList);
        store.setState(() => ({ type: 'dcl' }));
      }
    },
    [tabState],
  );
  const changeNavTab = React.useCallback(
    (nav_label, index = 0) => {
      // console.log(nav_label,222222222222222);

      // setNavLabel(navLabel);
      setNavLabel(nav_label);
      setCardState(false);
      // setManySetState(false);
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
    [Nav, setCardState,  setNavLabel, setNav, dataSource, cartData],
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

  const refreshTK = React.useCallback(async () => {
 
    const rToken = getToken('rtk');
    if (rToken&&window.localStorage.getItem("LoginType")==='metaMask') {
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
     console.log(accessToken,333);
     
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

   
  // useEffect(()=>{
    
  //   const accessToken = getToken('atk');
  //   console.log(accessToken,
  //     getParcelList2(accessToken))
    
  // })


  const requestData = React.useCallback(
    async (token: string) => {
      setLoading(true);
      console.log(11111,token);
      
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
  React.useEffect(() => {


    // setSaveIcon(false)
    // const a = getToken('address');
    // if (a) {
    //   setWalletAddress(a);
    // }

    setNavLabel('All')
    // req_building_list(walletAddress)
    const accessToken = getToken('atk');
    // console.log(accessToken,"accn");
    
    setTokenWearable(accessToken)
    if(accessToken){
      // window.location.reload()
      if (tabState === 'cryptovoxels') requestData(accessToken);
      if (tabState === 'decentraland') reqDclData(accessToken);
    }
    // setRouteTab(r.router.query.type);
    // reqWearablesData();
    // requestPersonal(accessToken);
    // requireBuilder(accessToken)
  
    // if(routeTab === 'building')reqBuilderData(accessToken);
    // watcher_store();
    // watcher_store_status();
    // watcher_cardState();
    // if (!accessToken) window.location.href = '/';
  }, [
    tokenWearable,
    navLabel,
    getToken,
    requestData,
    // builderSat,
    // buildState,
    // statue,
    // walletAddress,
    // requestPersonal,
    // watcher_store,
    // dataBuildSource,
    // reqBuilderData,
    // addressWearable,
    reqDclData,
    // r.router.query.type,
    routeTab,
    tabState,
    // reqWearablesData,
  ]);

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
        <div className={cn("grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5",style.dataSourceCard)}>
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
           <div className={cn("grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5",style.dataSourceCard)}>
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
  const tag1 = () => {
    if (label === 'Cancel lease for multiple') return 'Cancel leased';
    return 'Mark as leased';
  };
  const req_event = React.useCallback(async () => {
    if (selectedIds.length === 0) return;
    // 批量挂出
    if (label === 'Rent out several') {
      set_rent_set_state(true);
      // setManySetState(false);
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
        } else if (result.code === 100003) {
          const tokenNew = await refreshTK();
          const resultNew = await req_parcels_leased(tokenNew, selectedIds.join(','));
          if (resultNew.code === 100000) {
            store.setState(() => ({ rentOutState: false, status: 'Successfully marked!' }));
          } else {
            store.setState(() => ({ rentOutState: false, status: 'Failed!' }));
          }

        }
        set_rent_set_state(true);
        // setManySetState(false);
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
        // setManySetState(false);
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
        // setManySetState(false);
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
        // setManySetState(false);
        setCardState(false);
        store.setState(() => ({ parcels_cardState: false }));
      }
    }
  }, [selectedIds, setCardState, set_rent_set_state]);

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
  const close_rent_set = React.useCallback(
    (current_state) => {
      manyChange(label, cartData, false);
      set_rent_set_state(current_state);
      // setManySetState(false);
      setSelectedIds([]);
      store.setState(() => ({ rentOutState: false }));
    },
    [rent_set_state, manyChange],
  );
  const randerCardList = React.useMemo(() => {
    if (routeTab === 'parcellist') {
      return (
        <>
        <div style={{width:"1200px",margin:"0 auto"}}>
          <div className={cn('tab-list flex ', style.allHeight)}>
            <div className={cls}></div>
            <div className={cn('main-content  flex px-0', style.tabtext)}>
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
                      // dataSource={tabState === 'cryptovoxels' ? dataSource : dclDataSource}
                      // label={item.label}
                      // state={item.state}
                      // num={item.num}
                      // key={item.label}
                      // onClick={() => {
                      //   changeNavTab(item.label, index);
                      // }}
                    />
                  </>
                );
              })}
            </div>
          </div>
          {/* 导航结束 */}
          {/* 卡片开始 */}
          <div className={cn('main-content mt-8', style.content)} >
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
          </div>
        </>
      );
    }
    // if (routeTab === 'trafficreport') {
    //   if (showType === 'cryptovoxels') {
    //     return (
    //       <>
    //         <div className={cn('tab-list flex mt-5', style.allHeight)}>
    //           <div className={cls}></div>
    //           <div className={cn('main-content flex px-0', style.tabtext)}>
    //             {REPORTTAB.map((item) => {
    //               return (
    //                 <Tab4
    //                   active={tabState === item.type}
    //                   isMini={true}
    //                   key={item.label}
    //                   label={item.label}
    //                   icon={item.icon}
    //                   onClick={() => {
    //                     onTabChangeTR(item.type);
    //                   }}
    //                 />
    //               );
    //             })}
    //             <div className={cls} />
    //           </div>
    //           <div className={cls} />
    //         </div>
    //         <div className={cn(style.content)}>
    //           <BaseChart>
    //             <BaseBar
    //               id={'parcel1'}
    //               labelText={'DAILY TRAFFIC OF ALL MY PARCELS '}
    //               dataHandlder={req_cv_parcel_traffic}
    //               barWidth={20}
    //               limit={21}
    //               textColor={style.nftColor}
    //               // token={refreshTK()}
    //               token={tokenWearable}
    //             ></BaseBar>
    //           </BaseChart>

    //           <BaseChart className=" my-5" type={true}>
    //             <PieChart
    //               id="piechart2"
    //               labelText={'PERCENTAGE OF PARCEL TRAFFIC '}
    //               dataHandlder={req_cv_parcel_traffic_daily}
              
    //               token={tokenWearable}
    //               textColor={style.nftColor}
    //               options={[
    //                 {
    //                   label: 'Day',
    //                   value: 'day',
    //                 },
    //                 {
    //                   label: 'Week',
    //                   value: 'week',
    //                 },
    //                 {
    //                   label: 'Month',
    //                   value: 'month',
    //                 },
    //               ]}
    //             ></PieChart>
    //           </BaseChart>
    //           <BaseChart className=" my-5" type={true}>
    //             <ProfileDetail
    //               label={'DETAILED TRAFFIC INFORMATION LIST OF PARCELS'}
    //               dataHandlder={req_cv_parcel_month_traffic_detail}
    //               // token={refreshTK()}
    //               token={tokenWearable}
    //               textColor={style.nftColor}
    //             ></ProfileDetail>
    //           </BaseChart>
    //         </div>
    //       </>
    //     );
    //   }
    //   if (showType === 'decentraland') {
    //     return (
    //       <>
    //         <div className={cn('tab-list flex ', style.allHeight)}>
    //           <div className={cls}></div>
    //           <div className="main-content flex px-0">
    //             {REPORTTAB.map((item) => {
    //               return (
    //                 <Tab4
    //                   active={tabState === item.type}
    //                   isMini={true}
    //                   key={item.label}
    //                   label={item.label}
    //                   icon={item.icon}
    //                   onClick={() => {
    //                     onTabChangeTR(item.type);
    //                   }}
    //                 />
    //               );
    //             })}
    //             <div className={cls} />
    //           </div>
    //           <div className={cls} />
    //         </div>
    //         <div className={cn(style.content)}>
    //           <BaseChart>
    //             <BaseBarDece
    //               id={'parcel1'}
    //               labelText={'DAILY TRAFFIC OF ALL MY PARCELS '}
    //               dataHandlder={req_dece_parcel_traffic}
    //               barWidth={20}
    //               limit={21}
    //               textColor={style.deceColor}
           
    //               token={tokenWearable}
    //             ></BaseBarDece>
    //           </BaseChart>
    //           <BaseChart className=" my-5" type={true}>
    //             <PieChartDece
    //               id="piechart2"
    //               labelText={'PERCENTAGE OF PARCEL TRAFFIC '}
    //               dataHandlder={req_deceData_parcel_traffic_daily}
  
    //               token={tokenWearable}
    //               textColor={style.deceColor}
    //               options={[
    //                 {
    //                   label: 'Day',
    //                   value: 'day',
    //                 },
    //                 {
    //                   label: 'Week',
    //                   value: 'week',
    //                 },
    //                 {
    //                   label: 'Month',
    //                   value: 'month',
    //                 },
    //               ]}
    //             ></PieChartDece>
    //           </BaseChart>
    //           <BaseChart className=" my-5" type={true}>
    //             <ProfileDetailDece
    //               label={'DETAILED TRAFFIC INFORMATION LIST OF PARCELS'}
    //               dataHandlder={req_dece_parcel_traffic_list}
        
    //               token={tokenWearable}
    //               textColor={style.deceColor}
    //             ></ProfileDetailDece>
    //           </BaseChart>
    //         </div>
    //       </>
    //     );
    //   }
    // }
    // if (routeTab === 'wearablelist') {
    //   return (
    //     <>
    //       {statue === 1 ? <>
    //         <div className={style.createrCont}>
    //           <span className={style.join}>Join Creators to show your works</span>
    //           <span className={style.apply} onClick={addWorkWerable}>Apply</span>
    //         </div>
    //       </> : null}
    //       {statue === 2 ? <>
    //         <div className={style.createrCont}>
    //           <span className={style.join}>Waiting to become a creator</span>
    //         </div>
    //       </> : null}
    //       <div className={style.wearablesContainer}>
    //         <div className={style.title}>
    //           <div className={style.wearables}></div>
    //           <div className={style.texteated}>Wearables Created</div>
    //         </div>
    //         <div className={style.wearablesNav}>
    //           <div className={style.left}>
    //             {wearablesNav.map((item, index) => {
                  
    //               return (
    //                 <>
    //                   <div
    //                     onClick={() => {
    //                       setWearablesNavState(item.type);
    //                       wearablesState.current = item.type;
    //                       setShowOrHideState(false);
    //                       if (item.type === 'all') {
    //                         setWearablesCreatorsData(wearablesCreatorsOriginData);
    //                       }
    //                       if (item.type === 'shown') {
    //                         setWearablesCreatorsData(wearablesShowData);
    //                       }
    //                       if (item.type === 'hidden') {
    //                         setWearablesCreatorsData(wearablesHideData);
    //                       }
    //                     }}
    //                     className={cn(
    //                       style.wearablesNavItem,
    //                       wearablesNavState === item.type ? style.wearableNavAction : null,
    //                     )}
    //                     key={uuid()}
    //                   >
    //                     <div>
    //                       {item.label}
    //                       <span style={{ marginLeft: '2px' }}>
    //                         {item.type === 'all' ? wearablesCreatorsOriginData.length : null}
    //                         {item.type === 'shown' ? wearablesShowData.length : null}
    //                         {item.type === 'hidden' ? wearablesHideData.length : null}
    //                       </span>
    //                     </div>
    //                   </div>
    //                 </>
    //               );
    //             })}
    //           </div>
    //           {
    //             statue === 1 || statue === 2 ? null :
    //               <div
    //                 className={style.right}
    //                 onClick={() => {
    //                   setShowOrHideState(!showOrHideState);
    //                 }}
    //                 onMouseLeave={() => {
    //                   setTimeout(() => {
    //                     setShowOrHideState(false);
    //                   }, 2000);
    //                 }}
    //               >
    //                 <img src="/images/Settings.png" />
    //                 <div>Batch setting</div>
    //                 <ul
    //                   className={
    //                     wearablesNavState === 'all' && showOrHideState
    //                       ? style.showOrHideList
    //                       : style.showOrHideList1
    //                   }
    //                   onMouseLeave={() => {
    //                     setShowOrHideState(false);
    //                   }}
    //                 >
    //                   {showOrHideState
    //                     ? showOrHide[wearablesNavState].map((item, index) => {
    //                       return (
    //                         <li
    //                           className={style.showOrHideItem}
    //                           key={index}
    //                           onClick={() => {
    //                             settingShowOrHide(item.type);
    //                           }}

    //                         >
    //                           {item.label}
    //                         </li>
    //                       );
    //                     })
    //                     : null}
    //                 </ul>
    //               </div>

    //           }

    //         </div>
    //         <div style={{ marginTop: '22px', marginBottom: '50px' }}>{creatorsReander}</div>
    //       </div>
    //     </>
    //   );
    // }

    // if (routeTab === 'building') {
    //   return (
    //     <>
    //       <>
    //         <div className={style.buildingContainer}>
    //           <div className={cn('main-content mt-8', style.content)} style={{ marginTop: "-20px" }}>{renderBuilding}
    //           </div>
    //         </div>
    //       </>
    //       : <></>
    //     </>
    //   )

    // }
  }, [
    showTab,
    // status,
    // type,
    // value,
    // selectedIds,
    // rent_set_state,
    // s,
    // cartData,
    // manySetLabel,
    renderContent,
    // renderBuilding,
    // renderWerable,
    dataSource,
    // dataBuildSource,
    // reqBuilderData,
    tabState,
    routeTab,
    // creatorsReander,
  ]);
  return (
    <>
    {/* <div  className={cn("", style.parselist)}> */}
    {/* <div className={cn(style.tableList)}>
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
             </div> */}
             <div className={style.randerCardList}>
             {randerCardList}
             </div>
             {/* </div> */}
             </>
  )
}
