import React from 'react';

import cn from 'classnames';

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

import { state } from '../../components/wallet-btn';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import { useWalletProvider } from '../../components/web3modal';

import { convert, getToken, setToken } from '../../common/utils';

import { getBaseInfo, refreshToken, getParcelList2 } from '../../service';

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
  const meta = {
    title: `Profile - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

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

  // 过滤数组 拿到每一项对应的数量
  const changeNum = React.useCallback(
    (data, label = 'All') => {
      if (label === 'All') {
        const all = data.filter((item) => {
          return true;
        });
        setCartData(all);
      }
      if (label === 'For rent') {
        const forRent = data.filter((item) => item.status === 'for_rent');
        setCartData(forRent);
      }
      if (label === 'Leased') {
        const leased = data.filter((item) => item.status === 'leased');
        setCartData(leased);
      }
      if (label === 'Not for rent') {
        const notForRent = data.filter((item) => item.status === 'not_for_rent');
        setCartData(notForRent);
      }
    },
    [Nav, setCartData],
  );

  const requestData = React.useCallback(
    async (token: string) => {
      try {
        const res = await getParcelList2(token);
        const data = resultHandler(res, requestData);
        changeNum(data.parcelList);
        if (!data) {
          return;
        }
        setOrginData(data);
        setDataSource(data.parcelList);
      } catch {
        setError(true);
      }
    },
    [resultHandler, tabState],
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
        {cartData.map((card, idx) => {
          return <Card {...card} key={idx}></Card>;
        })}
      </div>
    );
  }, [error, dataSource, loading, onRetry, changeNum]);

  const changeNavTab = React.useCallback(
    (index, label) => {
      changeNum(dataSource, label);
      const set_nav = Nav.map((item, i) => {
        if (index === i) return { ...item, state: 1 };
        return { ...item, state: 0 };
      });
      setNav(set_nav);
    },
    [Nav],
  );

  React.useEffect(() => {
    const accessToken = getToken('atk');
    if (accessToken) {
      requestData(accessToken);
      requestPersonal(accessToken);
      return;
    }
    window.location.href = '/';
  }, [getToken, requestData, requestPersonal]);

  return (
    <Page className={cn('min-h-screen', style.anPage)} meta={meta}>
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
      <div className={cn(style.tablebg)}>
        <div className={cn(style.tableList)}>
          {TAB3.map((item) => {
            return <Tab3 label={item.label} key={item.label} active={item.active} />;
          })}
        </div>
      </div>
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
                  changeNavTab(index, item.label);
                }}
              />
            );
          })}
        </div>
        <div className={style.nav_right}>
          <div className={style.nav_right_item}>
            <img src="/images/v5/settings.png" alt="" />
            <div>Batch setting</div>
          </div>
          <div className={style.nav_right_item}>
            <img src="/images/icon/kapian.png" className={style.left} />
            <div className={style.shuxian}></div>
            <img src="/images/icon/liebiao.png" className={style.right} />
          </div>
        </div>
      </div>
      {/* 导航结束 */}
      {/* 卡片开始 */}
      <div className={cn('main-content mt-8', style.content)}>{renderContent}</div>
      {/* 卡片结束 */}
      `` <Footer />
    </Page>
  );
}
