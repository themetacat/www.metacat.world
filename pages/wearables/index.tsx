import React from 'react';
import cn from 'classnames';

import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Footer from '../../components/footer';
import ModelList from '../../components/model-list';
import UserAvatar from '../../components/user-avatar';
import MeteInput from '../../components/meta-input-search';
import Status from '../../components/status';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import { getOkxWearableList } from '../../service';

import style from './index.module.css';
import { convert } from '../../common/utils';

export default function Wearables(props) {
  const meta = {
    title: `Wearables - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const [orginData, setOrigData] = React.useState(null);
  const [dataSource, setDataSource] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const requestData = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getOkxWearableList();
      const { code, data, msg } = res;
      setOrigData(convert(data));
      setDataSource(convert(data));
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [null]);

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
        return x.kol.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1;
      });
      setDataSource(dataToShow);
    }
  }, [searchText, orginData]);

  const onRetry = React.useCallback(() => {
    requestData();
  }, [requestData]);

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

    return <ModelList models={dataSource}></ModelList>;
  }, [dataSource, loading, error, onRetry]);

  React.useEffect(() => {
    requestData();
  }, [requestData]);

  return (
    <Page className={cn('min-h-screen flex flex-col', style.anPage)} meta={meta}>
      <div className="bg-black relative">
        <PageHeader className="relative z-10" active={'wearables'} />
        <div
          className={cn(
            'main-content flex flex-col justify-center items-center relative z-10 text-white mt-5',
            style.signBack,
          )}
        >
          <div className="flex justify-center items-center">
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
                { icon: '/images/icon/home.png', label: 'Home', address: 'https://www.okx.com/' },
                {
                  icon: '/images/v5/Twitter.png',
                  label: 'Twitter',
                  address: 'https://twitter.com/okx',
                },
              ]}
            ></UserAvatar>
          </div>
          <div className={cn(' text-center mt-4 mb-7', style.desc)}>
            Wearable Dao is a decentralized collaborative organization started by Metacat,
            MetaEstate, MetaLandscape and MetaFocus to design and produce Wearable Vox for the
            Metaverse.The current major business types of Wearable Dao are:Theme series of wearable
            design and production sales,cooperation with the company’s metaverse
            t-shirts,cooperation with artists,cooperation activities with various brands,meme
            series.
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
      <Footer />
    </Page>
  );
}
