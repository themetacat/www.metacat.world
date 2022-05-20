import React from 'react';
import cn from 'classnames';

import { useRouter } from 'next/router';

import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Footer from '../../components/footer';
import ModelList from '../../components/model-list';
import UserAvatar from '../../components/user-avatar';
import MeteInput from '../../components/meta-input-search';
import Status from '../../components/status';
import TopJumper from '../../components/jump-to-top';
import Tab from '../../components/tab';
import DaoModelList from '../../components/dao-model-list';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import { getDaoWearableList, getOkxWearableList } from '../../service';
import { req_pfp_list } from '../../service/z_api';

import style from './index.module.css';
import { convert } from '../../common/utils';

const TAB = [
  {
    label: 'WearableDao',
    type: 'wearabledao',
  },
  {
    label: 'PFP',
    type: 'pfp',
  },
];

export default function Wearables(props) {
  const meta = {
    title: `Wearables - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const [tabState, setTabState] = React.useState(props.query.type || 'wearabledao');
  const [orginData, setOrigData] = React.useState(null);
  const [dataSource, setDataSource] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const router = useRouter();

  const requestData = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      let res = null;
      if (tabState === 'okx') {
        res = await getOkxWearableList();
      }
      if (tabState === 'wearabledao') {
        res = await getDaoWearableList();
      }
      if (tabState === 'pfp') {
        res = await req_pfp_list();
      }
      const { code, data, msg } = res;
      setOrigData(convert(data));
      setDataSource(convert(data));
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [tabState]);

  const onSearchHandler = React.useCallback(
    (text: string) => {
      setSearchText(text);
    },
    [null],
  );

  const search = React.useCallback(() => {
    if (orginData) {
      if (searchText === '' || searchText === null) {
        setDataSource(orginData);
        return;
      }
      const dataToShow = orginData.filter((x) => {
        if (tabState === 'okx') {
          return (
            x.kol.name?.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1 ||
            x.artist.name?.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1
          );
        }
        return (
          x.artwork.name?.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1 ||
          x.artist.name?.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1
        );
      });
      setDataSource(dataToShow);
    }
  }, [searchText, orginData, tabState]);

  const onRetry = React.useCallback(() => {
    requestData();
  }, [requestData]);

  const onTabChange = React.useCallback(
    (type) => {
      requestData();
      setTabState(type);
      router.replace(`/wearables?type=${type}`);
    },
    [requestData],
  );

  const renderContent = React.useMemo(() => {
    if (loading) {
      return <Status status="loading" />;
    }

    if (error) {
      return <Status retry={onRetry} status="error" />;
    }

    if (dataSource && dataSource.length === 0) {
      return <Status status="empty" />;
    }
    if (tabState === 'okx') {
      return <ModelList models={dataSource}></ModelList>;
    }

    if (tabState === 'wearabledao') {
      return <DaoModelList models={dataSource} tabState={tabState}></DaoModelList>;
    }

    if (tabState === 'pfp') {
      return <DaoModelList models={dataSource} tabState={tabState}></DaoModelList>;
    }
  }, [dataSource, loading, error, onRetry, tabState]);

  React.useEffect(() => {
    requestData();
  }, [requestData]);

  const cls = cn('flex-1', style.bottomLine);

  return (
    <Page className={cn('min-h-screen flex flex-col', style.anPage)} meta={meta}>
      <div className="bg-black relative">
        <PageHeader className="relative z-10" active={'wearables'} />
        <div className={cn('tab-list flex mt-5', style.allHeight)}>
          <div className={cls}></div>
          <div className="main-content flex px-0">
            {TAB.map((item, index) => {
              return (
                <Tab
                  active={tabState === item.type}
                  key={item.label}
                  icon={null}
                  label={item.label}
                  isMini={true}
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
        <div
          className={cn(
            'main-content flex flex-col justify-center items-center relative z-10 text-white mt-5',
            style.signBack,
          )}
        >
          <div className="flex justify-center items-center">
            {tabState === 'okx' ? (
              <>
                <UserAvatar
                  avatar="/images/v5/WearableDao.png"
                  name="WearableDao"
                  contact={[
                    {
                      icon: '/images/v5/Twitter.png',
                      label: 'Twitter',
                      address: 'https://twitter.com/WearableDao',
                    },
                    {
                      icon: '/images/icon/discord.png',
                      label: 'Discord',
                      address: 'https://discord.gg/t3Wrb4JvDF',
                    },
                  ]}
                ></UserAvatar>
                <div className=" text-3xl mx-4 mb-3">{`&`}</div>
                <UserAvatar
                  avatar="/images/v5/OKX.png"
                  name="OKX"
                  contact={[
                    {
                      icon: '/images/icon/home.png',
                      label: 'Home',
                      address: 'https://www.okx.com/',
                    },
                    {
                      icon: '/images/v5/Twitter.png',
                      label: 'Twitter',
                      address: 'https://twitter.com/okx',
                    },
                  ]}
                ></UserAvatar>
              </>
            ) : null}
            {tabState === 'wearabledao' ? (
              <UserAvatar
                avatar="/images/v5/WearableDao.png"
                name="WearableDao"
                contact={[
                  {
                    icon: '/images/v5/Twitter.png',
                    label: 'Twitter',
                    address: 'https://twitter.com/WearableDao',
                  },
                  {
                    icon: '/images/icon/discord.png',
                    label: 'Discord',
                    address: 'https://discord.gg/t3Wrb4JvDF',
                  },
                ]}
              ></UserAvatar>
            ) : null}
            {tabState === 'pfp' ? (
              <UserAvatar
                avatar="/images/pfp.jpg"
                name="PFP"
                contact={[
                  {
                    icon: '/images/icon/home.png',
                    label: 'Home',
                    address: ' https://www.cryptovoxels.com/play?coords=N@409E,630N',
                  },
                  {
                    icon: '/images/v5/Twitter.png',
                    label: 'Twitter',
                    address: 'https://twitter.com/WearableDao',
                  },
                ]}
              ></UserAvatar>
            ) : null}
          </div>
          <div className={cn(' text-center mt-4 mb-7', style.desc)}>
            {tabState === 'okx'
              ? `For a new product launch held by OKX in metaverse, wearableDao customized a variety of
              3D wearables for invited KOLs.`
              : null}
            {tabState === 'wearabledao'
              ? `WearableDao was co-founded by MetaCat, MetaEstate and MetaLandscape to design and produce Wearables in Metaverse.`
              : null}
            {tabState === 'pfp'
              ? 'The PFP Metaverse Carnival, co-hosted by WearableDao, MetaEstate, MetaCat, MetaLandscape, and TingDao, will be grandly launched on May 20! The most interesting part of this event is that everyone can make their favorite NFTs into Wearables and wear them by participating in the event, so that NFTs can live.'
              : null}
          </div>
        </div>
      </div>
      <div className={cn('main-content flex flex-col justify-start items-center', style.content)}>
        <div className="flex justify-center items-center mb-5">
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
        {renderContent}
      </div>
      <TopJumper classname={style.jumper}></TopJumper>
      <Footer />
    </Page>
  );
}

export async function getServerSideProps({ query }) {
  return {
    props: {
      query,
    }, // will be passed to the page component as props
  };
}
