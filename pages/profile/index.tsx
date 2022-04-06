import React from 'react';

import cn from 'classnames';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-hot-toast';

import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Footer from '../../components/footer';
import Profile from '../../components/profile';
import Tab from '../../components/tab';
import Status from '../../components/status';
import Card from '../../components/parcels-card';
import Tab3 from '../../components/tab3';
import ParcelsTab from '../../components/parcels-tab';
import RentSet from '../../components/parcels_rent_set';
import Popup from '../../components/popup';
import store from '../../store/profile';

import { state } from '../../components/wallet-btn';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import { useWalletProvider } from '../../components/web3modal';

import { convert, getToken, setToken } from '../../common/utils';

import { getBaseInfo, refreshToken, getParcelList2 } from '../../service';

import { req_parcels_cancel, req_parcels_leased } from '../../service/z_api';

import style from './index.module.css';

const TAB = [
  {
    label: 'Cryptovoxels',
    icon: '/images/Crypto Voxel.jpg',
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
    label: 'PARCEL LIST',
    active: true,
  },
  {
    label: 'TRAFFIC REPORT',
    active: false,
  },
  {
    label: 'SALES REPORT',
    active: false,
  },
];
export default function ProfilePage() {
  const nav_Label = React.useRef(null);
  const meta = {
    title: `Profile - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };
  const s = store.useState('rentOutState', 'id', 'status', 'parcels_cardState');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [dataSource, setDataSource] = React.useState([]);
  const [avatar, setAvatarUrl] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [nickName, setNickName] = React.useState('');
  const [twitterAddress, setTwitterAddress] = React.useState('');
  const [websiteAddress, setWebsiteAddress] = React.useState('');
  const [orginData, setOrginData] = React.useState({ parcelList: [] });
  const [tabState, setTabState] = React.useState('cryptovoxels');
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

  const [navLabel, setNavLabel] = React.useState('All');

  const Nav = [
    {
      label: 'All',
      state: 1,
      num: 0,
    },
    {
      label: 'For rent',
      state: 0,
      num: 0,
    },
    {
      label: 'Leased',
      state: 0,
      num: 0,
    },
    {
      label: 'Not for rent',
      state: 0,
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

  const onTabChange = React.useCallback(
    async (tab) => {
      setTabState(tab);
      if (orginData) {
        setDataSource(orginData.parcelList);
      }
    },
    [orginData],
  );

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
      try {
        const res = await getParcelList2(token);
        const data = resultHandler(res, requestData);
        if (!data) {
          return;
        }
        setOrginData(data);
        setDataSource(data.parcelList);
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
      const data = resultHandler(res, requestPersonal);
      if (!data) {
        return;
      }
      const { profile } = data;
      const { address: addr, nickName: name, avatar: ava, links } = profile;
      const { twitterName, websiteUrl } = links;
      setAvatarUrl(ava);
      setAddress(addr);
      setNickName(name);
      setTwitterAddress(twitterName);
      setWebsiteAddress(websiteUrl);
      state.setState({ profile });
    },
    [resultHandler],
  );
  const onRetry = React.useCallback(async () => {
    const accessToken = getToken('atk');
    if (accessToken) {
      requestData(accessToken);
    }
  }, [requestData, getToken]);

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
    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-7">
        {cartData.map((card) => {
          return (
            <Card
              {...card}
              parcelsIds={parcelsIds}
              state={cardState}
              key={uuid()}
              y
              selectedIds={selectedIds}
              onClick={(id, ids) => {
                select(id, ids);
              }}
            ></Card>
          );
        })}
      </div>
    );
  }, [error, dataSource, loading, onRetry, changeNum, parcelsIds, setCardState]);

  // 批量设置
  const manySet = React.useCallback(
    (current_manySetState) => {
      setManySetState(!current_manySetState);
      nav.forEach((item) => {
        if (item.state === 1) {
          if (item.label === 'All') {
            setManySetLabel(all_many_set);
          }
          if (item.label === 'For rent') {
            setManySetLabel(for_rent_many_set);
          }
          if (item.label === 'Leased') {
            setManySetLabel(leased);
          }
          if (item.label === 'Not for rent') {
            setManySetLabel(not_for_rent_many_set);
          }
        }
      });
    },
    [setManySetState, nav, setManySetLabel],
  );

  const manyChange = React.useCallback(
    (many_label, data, sta = true) => {
      const ids = [];
      if (many_label === 'Rent out several') {
        data.forEach((item) => {
          if (item.status === 'not_for_rent') {
            ids.push(item.parcelId);
          }
        });
      }
      if (many_label === 'Cancel lease for multiple' || many_label === 'Mark several as leased') {
        data.forEach((item) => {
          if (item.status === 'for_rent') {
            ids.push(item.parcelId);
          }
        });
      }
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

  const req_event = React.useCallback(async () => {
    if (selectedIds.length === 0) return;
    // 批量挂出
    if (label === 'Rent out several') {
      set_rent_set_state(true);
      setManySetState(false);
      setCardState(false);
      store.setState(() => ({ parcels_cardState: false }));
    }
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
      if (result.code === 100000) {
        store.setState(() => ({ rentOutState: false, status: 'Successfully cancelled!' }));
      } else {
        store.setState(() => ({ rentOutState: false, status: 'Failed!' }));
      }
      set_rent_set_state(true);
      setManySetState(false);
      setCardState(false);
      store.setState(() => ({ parcels_cardState: false }));
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
    const accessToken = getToken('atk');
    if (accessToken) {
      requestData(accessToken);
      requestPersonal(accessToken);
      watcher_store();
      watcher_store_status();
      watcher_cardState();
      return;
    }
    window.location.href = '/';
  }, [getToken, requestData, requestPersonal, watcher_store, nav_Label.current]);

  const tag1 = () => {
    if (label === 'Cancel lease for multiple') {
      return 'Cancel leased';
    }
    return 'Mark as leased';
  };
  const tag2 = () => {
    if (cardState) {
      return (
        <div className={style.succeedOrCancel}>
          <div className={style.info}>
            selected ({selectedIds.length}/{parcelsIds.length})
          </div>
          <div
            className={style.succeed}
            onClick={() => {
              req_event();
              if (selectedIds.length === 0) return;
              if (label === 'Rent out several') {
                store.setState(() => ({ parcels_cardState: false, rentOutState: true, id: null }));
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
      );
    }
    return <div></div>;
  };

  return (
    <Page className={cn('min-h-screen', style.anPage)} meta={meta}>
      <div
        onClick={() => {
          setManySetState(false);
        }}
      >
        <div className="bg-black relative">
          <PageHeader className="relative z-10" active={'profile'} />
        </div>

        <div className={cn('bg-black flex flex-col justify-center items-center')}>
          <Profile
            avater={avatar}
            address={address}
            twitter={twitterAddress}
            home={websiteAddress}
            name={nickName}
            classname="main-content"
          ></Profile>
        </div>
        {/* <div className={cn(style.tablebg)}>
          <div className={cn(style.tableList)}>
            {TAB3.map((item) => {
              return <Tab3 label={item.label} key={item.label} active={item.active} />;
            })}
          </div>
        </div> */}
        <div className={cn('tab-list flex mt-5', style.allHeight)}>
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
        </div>
        {/* 导航 */}
        <div className={style.nav}>
          <div className={style.nav_left}>
            {nav.map((item, index) => {
              return (
                <ParcelsTab
                  dataSource={dataSource}
                  label={item.label}
                  state={item.state}
                  num={item.num}
                  key={item.label}
                  onClick={() => {
                    changeNavTab(item.label, index);
                  }}
                />
              );
            })}
          </div>
          <div className={style.nav_right}>
            <div
              className={style.nav_right_item}
              onClick={(event) => {
                event.stopPropagation();
                manySet(manySetState);
              }}
            >
              <img src="/images/Settings.png" />
              <div>Batch setting</div>
              {manySetState ? (
                <div className={style.container}>
                  <div className={style.manySetList}>
                    {manySetLabel.map((item) => {
                      return (
                        <div
                          className={style.setItem}
                          key={item.label}
                          onClick={() => {
                            manyChange(item.label, cartData);
                            store.setState(() => ({ parcels_cardState: true }));
                          }}
                        >
                          {item.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>

            {/* <div className={style.nav_right_item}>
              <img src="/images/icon/kapian.png" className={style.left} />
              <div className={style.shuxian}></div>
              <img src="/images/icon/liebiao.png" className={style.right} />
            </div> */}
          </div>
        </div>
        {/* 导航结束 */}
        {/* 卡片开始 */}
        <div className={cn('main-content mt-8', style.content)}>{renderContent}</div>

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
        <Footer />
      </div>
    </Page>
  );
}
