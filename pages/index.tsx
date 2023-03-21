import React, { useEffect, useState } from "react";
import cn from "classnames";
import "tailwindcss/tailwind.css";
import { v4 as uuid } from "uuid";
import { toast } from "react-hot-toast";
import Page from "../components/page";

import Rekv from "rekv";
import { Router, useRouter, withRouter } from "next/router";
import Tab4 from "../components/tab4";

import { SITE_NAME, META_DESCRIPTION } from "../common/const";
import style from "./index.module.css";
import DclCard from "../components/parcels-dcl-card";
import store from "../store/profile";
import WalletBtn from "../components/wallet-btn";
import Card from "../components/parcels-card";
import ParcelList from "../components/parcelList";
import Tab3 from "../components/tab3";
import ParcelsTab from "../components/parcels-tab";
import RentSet from "../components/parcels_rent_set";
import Popup from "../components/popup";
import Trafficreport from "../components/trafficreport";
import Status from "../components/status";
import { convert, getToken, setToken } from "../common/utils";

import { getBaseInfo, refreshToken, getParcelList2 } from "../service";

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
} from "../service/z_api";

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
    label: "Parcel List",
    type: "parcellist",
  },
  {
    label: "Traffic Report",
    type: "trafficreport",
  },
  {
    label: "My Wearables",
    type: "wearablelist",
  },
  {
    label: "My Buildings",
    type: "building",
  },
  // {
  //   label: 'SALES REPORT',
  // },
];
const TABData = [
  {
    label: "Voxels",
    icon: "/images/cvLogo.png",
    type: "cryptovoxels",
  },
  {
    label: "Decentraland",
    icon: "/images/Decentraland.jpg",
    type: "decentraland",
  },
];
const Nav = [
  {
    label: "All",
    state: 1,
    num: 0,
  },
];
export const state = new Rekv<IProfileData>(INITIAL_STATE);
const meta = {
  title: ` ${SITE_NAME}`,
  description: META_DESCRIPTION,
};

export default function PageNew(r) {
  const nav_Label = React.useRef(null);
  const router = useRouter();
  const [nav, setNav] = React.useState(Nav);
  const [tokenWearable, setTokenWearable] = React.useState(null);
  const s = store.useState(
    "rentOutState",
    "id",
    "status",
    "parcels_cardState",
    "type"
  );
  const [loading, setLoading] = React.useState(false);
  const [routeTab, setRouteTab] = React.useState(null);
  const [tabState, setTabState] = React.useState("cryptovoxels");
  const [showTab, setShowTab] = React.useState(TAB3[0].label);
  const [parcelsIds, setParcelsIds] = React.useState([]);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [dataSource, setDataSource] = React.useState([]);
  const [cardState, setCardState] = React.useState(false);
  const [dclDataSource, setDclDataSource] = React.useState([]);
  const [rent_set_state, set_rent_set_state] = React.useState(false);
  const cls = cn("flex-1", style.bottomLine);
  const [status, set_status] = React.useState("");
  const [error, setError] = React.useState(false);
  const [type, set_type] = React.useState(false);
  const [value, set_value] = React.useState("");
  const [label, setLabel] = React.useState("");
  const [cartData, setCartData] = React.useState([]);
  const [navLabel, setNavLabel] = React.useState("All");
  // const changeTab3 = React.useCallback(
  //   async (l, t) => {
  //     console.log(router);

  //     setTabState("cryptovoxels");
  //     setShowTab(l);
  //     setRouteTab(t);
  //     // router?.replace(`/profile?type=${t}`);
  //     // router?.replace(`/?type=${t}`);
  //   },
  //   [showTab]
  // );

 

  const refreshTK = React.useCallback(async () => {
    const rToken = getToken("rtk");
    if (rToken && window.localStorage.getItem("LoginType") === "metaMask") {
      const res = await refreshToken(rToken);
      const { code, data, msg } = res;
      if (code === 100003) {
        toast.error("Token timeout");
        window.location.href = "/";
        return null;
      }
      if (code !== 100000) {
        toast.error(msg);
        return null;
      }
      const { accessToken, refreshToken: rtk } = convert(data);
      console.log(accessToken, 333);

      setToken("atk", accessToken);
      setToken("rtk", rtk);
      state.setState({ accessToken, refreshToken: rtk });
      return accessToken;
    }
    return null;
  }, [null]);
  // const resultHandler = React.useCallback(
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

  //     toast.error(msg);

  //     return null;
  //   },
  //   [refreshTK]
  // );

useEffect(()=>{
  console.log(router);
  setRouteTab(r.router?.query?.type)
},[r.router?.query?.type])

  // const requestData = React.useCallback(
  //   async (token: string) => {
  //     setLoading(true);
  //     console.log(11111, token);

  //     try {
  //       const res = await getParcelList2(token);
  //       const data = resultHandler(res, requestData);
  //       setLoading(false);
  //       if (!data) {
  //         return;
  //       }
  //       setDataSource(data.parcelList);
  //       // changeNum(data.parcelList, nav_Label.current);
  //     } catch {
  //       setError(true);
  //     }
  //   },
  //   [resultHandler, tabState, nav_Label]
  // );

  // const reqDclData = React.useCallback(
  //   async (token: string) => {
  //     try {
  //       const res = await req_dcl_parcel_list(token);
  //       const data = resultHandler(res, reqDclData);
  //       setLoading(false);
  //       if (!data) {
  //         return;
  //       }
  //       setDclDataSource(data.parcelList);
  //       // changeNum(data.parcelList, nav_Label.current);
  //     } catch {
  //       setError(true);
  //     }
  //   },
  //   [resultHandler, tabState, nav_Label]
  // );

  React.useEffect(() => {
console.log(Router);

    setNavLabel("All");
    const accessToken = getToken("atk");
    console.log(accessToken, "accn",routeTab);

    setTokenWearable(accessToken);
    if (accessToken) {
      // if(routeTab === 'parcellist'){
      // setRouteTab('parcellist')
      // }else{
        // router?.replace(`/profile?type=parcellist`);
        // setRouteTab(router.query.type)
      // }

      // if (tabState === "cryptovoxels") requestData(accessToken);
      // if (tabState === "decentraland") reqDclData(accessToken);
    }

  }, [
    tokenWearable,
    router.query.type,
    navLabel,
    getToken,
    // requestData,
    routeTab,
    tabState,
  ]);


  
 
console.log(router);


  return (
    <Page meta={meta} className={cn("", style.page)}>
      <WalletBtn />

      {/* <div className={cn("", style.parselist)}>
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
      {routeTab === "parcellist" ? <ParcelList /> : null}
      {routeTab === "trafficreport" ? <Trafficreport /> : null} */}
    </Page>
  );
}
