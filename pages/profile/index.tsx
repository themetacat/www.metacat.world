import React from 'react';

import cn from 'classnames';
import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Footer from '../../components/footer';
import Profile from '../../components/profile';
import Tab from '../../components/tab';
import Status from '../../components/status';
import Card from '../../components/card';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import { useWalletProvider } from '../../components/web3modal';

import { convert, getToken } from '../../common/utils';

import { getParcelList, getBaseInfo } from '../../service';

import style from './index.module.css';

const TAB = [
  {
    label: 'Cryptovoxel',
    icon: '/images/Crypto Voxel.jpg',
    type: 'voxel',
  },
];

export default function ProfilePage() {
  const meta = {
    title: `ProfileSetting - ${SITE_NAME}`,
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

  const web3 = useWalletProvider();

  const cls = cn('flex-1', style.bottomLine);

  const requestData = React.useCallback(
    async (token: string) => {
      try {
        const res = await getParcelList(token);
        const { data } = res;
        const { cryptovoxelsParcelList, decentralandparcelList } = convert(data);
        setDataSource(cryptovoxelsParcelList);
      } catch {
        setError(true);
      }
    },
    [null],
  );

  const requestPersonal = React.useCallback(
    async (token: string) => {
      const res = await getBaseInfo(token);
      const { data } = res;
      if (data) {
        const profile = convert(data.profile);
        const { address: addr, nickName: name, avatar: ava, links } = profile;
        const { twitterName, websiteUrl } = links;
        setAvatarUrl(ava);
        setAddress(addr);
        setNickName(name);
        setTwitterAddress(twitterName);
        setWebsiteAddress(websiteUrl);
      }
    },
    [null],
  );

  const onRetry = React.useCallback(async () => {
    const accessToken = getToken(web3.data.address, 'atk');
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

    if (dataSource.length === 0) {
      return <Status status="empty" />;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-7">
        {dataSource.map((card, idx) => {
          return <Card {...card} key={idx}></Card>;
        })}
      </div>
    );
  }, [error, dataSource, loading, onRetry]);

  React.useEffect(() => {
    const accessToken = getToken(web3.data.address, 'atk');
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
      <div className={cn('tab-list flex mt-5', style.allHeight)}>
        <div className={cls}></div>
        <div className="main-content flex px-0">
          {TAB.map((item, index) => {
            return (
              <Tab
                active={true}
                isMini={true}
                key={item.label}
                label={item.label}
                icon={item.icon}
              />
            );
          })}
          <div className={cls} />
        </div>
        <div className={cls} />
      </div>
      <div className={cn('main-content mt-8', style.content)}>{renderContent}</div>
      <Footer />
    </Page>
  );
}
