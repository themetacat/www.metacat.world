import React from 'react';
import cn from 'classnames';
import dynamic from 'next/dynamic';

import toast, { Toaster } from 'react-hot-toast';

import Page from '../components/v2/page';
import Layout from '../components/v2/layout';
import { SITE_NAME, META_DESCRIPTION } from '../common/const';
import { convert, getToken, setToken } from '../common/utils';

import ViewMore from '../components/v2/view-more';
import FloorPriceCard from '../components/v2/floor-price-card';
import AvaterPopList from '../components/v2/avater-pop-list';
import CarouseSinglePic from '../components/v2/carousel-single-pic';
import EventCardLearn from '../components/v2/event-card-learn';
import JoinModal from '../components/v2/join-modal';

import { state } from '../components/v2/wallet-btn';

import { refreshToken, getBaseInfo } from '../service';

import { getTraffic, getFloorPrice, getBuildingsInfo, getWearablesInfo } from '../service/v2';

import {
  req_sales_amount_percent,
  req_sales_amount_stack,
  req_learn_article_list,
} from '../service/z_api';

import style from './index.module.css';

const Annular = dynamic(
  () => import(/* webpackPrefetch: true */ '../components/v2/analytics_annular'),
  { ssr: false },
);

const AllPillar = dynamic(() => import(/* webpackPrefetch: true */ '../components/v2/all_pillar'), {
  ssr: false,
});

const BaseBar = dynamic(() => import(/* webpackPrefetch: true */ '../components/v2/base-bar'), {
  ssr: false,
});

export default function Index(props) {
  const meta = {
    title: `Home - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const [builderCarouselList, setBuilderCarouselList] = React.useState([]);
  const [creatorCarouselList, setCreatorCarouselList] = React.useState([]);
  const [profile, setProfile] = React.useState(null);

  const [floorData, setFloorData] = React.useState([]);
  const [buildingData, setBuildingData] = React.useState([]);
  const [creatorData, setCreatorData] = React.useState([]);
  const [learnData, setLearnData] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [barColor, setBarColor] = React.useState([194, 157, 135]);

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

  const requestFloorData = React.useCallback(async () => {
    const res = await getFloorPrice();
    const { data } = res;
    setFloorData(convert(data));
  }, []);

  const requestBuildingData = React.useCallback(async () => {
    const res = await getBuildingsInfo();
    const { buildings, builder } = res.data;
    setBuilderCarouselList(buildings);
    setBuildingData(convert(builder));
  }, []);

  const requestWearableData = React.useCallback(async () => {
    const res = await getWearablesInfo();
    const { wearables, creator } = res.data;
    setCreatorCarouselList(wearables);
    setCreatorData(convert(creator));
  }, []);

  const requestPersonal = React.useCallback(
    async (token: string) => {
      const res = await getBaseInfo(token);
      const data = resultHandler(res, requestPersonal);
      if (!data) {
        return;
      }
      const { profile: pro } = data;
      state.setState({ profile: pro });
      setProfile(profile);
    },
    [resultHandler],
  );

  const requestLearnData = React.useCallback(async () => {
    // let lang = navigator.language.substring(0, 2); // ????????????????????????????????????
    // if (lang !== 'zh') {
    //   lang = 'en';
    // }
    const lang = 'en';
    const result = await req_learn_article_list(1, 3, lang);
    if (result?.code === 100000 && result.data.list.length !== 0) {
      setLearnData(result.data.list.slice(0, 3));
    }
  }, []);

  const jumpToUrl = React.useCallback((url) => {
    window.open(url);
  }, []);

  React.useEffect(() => {
    const accessToken = getToken('atk');
    if (accessToken) {
      requestPersonal(accessToken);
    }
  }, [requestPersonal]);

  React.useEffect(() => {
    if (
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
      )
    ) {
      // window.location.href="?????????url";
    } else {
      // window.location.href="pc???url";
      // console.log('pc');
      // window.location.href = "http://www.taobao.com";
    }
    requestFloorData();
    requestLearnData();
    requestBuildingData();
    requestWearableData();
  }, [null]);

  return (
    <Page meta={meta}>
      <Layout>
        <div>
          <div className="bg-black">
            <div className="main-content pb-12">
              <div className="flex justify-between items-end pt-12 pb-7">
                <span className="text-white font-bold text-2xl">Analytics</span>
                <ViewMore link="https://www.metacat.world/analytics"></ViewMore>
              </div>
              <div className="flex justify-between items-center">
                <FloorPriceCard items={floorData} title={'Floor Price'}></FloorPriceCard>
                <Annular
                  id="annular1"
                  labelText={'Parcel Sales Amount (USD)'}
                  dataHandlder={req_sales_amount_percent}
                  options={[
                    {
                      label: 'Month',
                      value: 'month',
                    },
                    {
                      label: 'Quarter',
                      value: 'quarter',
                    },
                    {
                      label: 'Year',
                      value: 'year',
                    },
                    {
                      label: 'All time',
                      value: 'all_time',
                    },
                  ]}
                  priceOptions={[
                    {
                      label: 'USD',
                      value: 'usd',
                    },
                    // {
                    //   label: 'ETH',
                    //   value: 'eth',
                    // },
                  ]}
                ></Annular>
              </div>
              <div className="flex justify-between items-center mt-6">
                <AllPillar
                  id="allpillar1"
                  labelText="Parcel Sales Amount"
                  dataHandlder={req_sales_amount_stack}
                  limit={5}
                  legend1={{ label: 'The Sandbox', color: [24, 147, 247] }}
                  legend2={{ label: 'NFT Worlds', color: [132, 193, 14] }}
                  legend3={{ label: 'Decentraland', color: [255, 107, 84] }}
                  legend4={{ label: 'Worldwide Webb', color: [229, 68, 155] }}
                  legend5={{ label: 'Voxels ', color: [244, 210, 191] }}
                  legend6={{ label: 'Somnium Space ', color: [250, 216, 23] }}
                  legend7={{ label: 'Otherside', color: [255, 248, 187] }}
                  legend8={{ label: 'Netvrk', color: [196, 148, 254] }}
                  options={[
                    {
                      label: 'Weekly',
                      value: 'weekly',
                    },
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly',
                      value: 'quarterly',
                    },
                    {
                      label: 'Yearly',
                      value: 'yearly',
                    },
                  ]}
                  priceOptions={[
                    {
                      label: 'USD',
                      value: 'usd',
                    },
                    {
                      label: 'ETH',
                      value: 'eth',
                    },
                  ]}
                ></AllPillar>
                <BaseBar
                  id={'basebar1'}
                  className="mt-5"
                  labelText={'Traffic'}
                  dataHandlder={getTraffic}
                  barWidth={18}
                ></BaseBar>
              </div>
            </div>
          </div>
          <div className={cn(' bg-black', style.building)}>
            <div className="main-content  pb-7">
              <div className="flex justify-start items-end pt-12 pb-7">
                <span className="text-white font-bold text-2xl">Buildings</span>
              </div>
              <div className=" mt-6 flex justify-between items-center mb-7">
                <CarouseSinglePic imgs={builderCarouselList}></CarouseSinglePic>
                <div className=" ml-28">
                  <AvaterPopList avaters={buildingData} type="buildings"></AvaterPopList>
                  <div className=" text-4xl font-medium text-white my-12 text-center">
                    About metaverse buildings, about metaverse builders.
                  </div>
                  <div className="flex justify-around items-center text-xl font-semibold">
                    <div
                      onClick={() => {
                        jumpToUrl('https://www.metacat.world/build/builders');
                      }}
                      className="event-hand py-4 px-7 bg-gradient-to-r from-mainDark02 to-mainLight02 bg-opacity-20 text-mainDark rounded-lg flex justify-center items-center"
                    >
                      EXPLORE BUILDERS
                    </div>
                    <div
                      onClick={() => {
                        jumpToUrl('https://forms.gle/LKgT89B884yk2gAK7');
                      }}
                      className="event-hand py-4 px-7 bg-gradient-to-r from-mainDark to-mainLight text-black rounded-lg flex justify-center items-center"
                    >
                      JOIN BUILDERS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(' bg-black')}>
            <div className="main-content  pb-7">
              <div className="flex justify-start items-end pt-12 pb-7">
                <span className="text-white font-bold text-2xl">Wearables</span>
              </div>
              <div className=" mt-6 flex justify-between items-center mb-7">
                <div className=" mr-28">
                  <AvaterPopList avaters={creatorData} type="wearables"></AvaterPopList>
                  <div className=" text-4xl font-medium text-white my-12 text-center">
                    About metaverse wearables, about wearable creators
                  </div>
                  <div className="flex justify-around items-center text-xl font-semibold">
                    <div
                      onClick={() => {
                        jumpToUrl('https://www.metacat.world/wearables');
                      }}
                      className="event-hand py-4 px-7 bg-gradient-to-r from-mainDark02 to-mainLight02 bg-opacity-20 text-mainDark rounded-lg flex justify-center items-center"
                    >
                      EXPLORE CREATORS
                    </div>
                    <div
                      className="event-hand py-4 px-7 bg-gradient-to-r from-mainDark to-mainLight text-black rounded-lg flex justify-center items-center"
                      onClick={() => {
                        setShowModal(true);
                      }}
                    >
                      JOIN CREATORS
                    </div>
                  </div>
                </div>
                <CarouseSinglePic imgs={creatorCarouselList}></CarouseSinglePic>
              </div>
            </div>
          </div>

          <div className={cn(' bg-black', style.learn)}>
            <div className="main-content  pb-12">
              <div className="flex justify-between items-end pt-12">
                <span className="text-white font-bold text-2xl">Learn</span>
                <ViewMore link="https://www.metacat.world/learn?type=articles"></ViewMore>
              </div>
              <div className="flex flex-col justify-between items-center">
                {learnData.map((item, idx) => {
                  return <EventCardLearn key={idx} className="mt-7" {...item} />;
                })}
              </div>
            </div>
          </div>
        </div>
        <JoinModal
          show={showModal}
          setClose={(x) => {
            setShowModal(x);
          }}
          type={'Creators'}
        ></JoinModal>

        <Toaster
          toastOptions={{
            duration: 2000,
            style: {
              background: 'linear-gradient(90deg, #00D0EC, #00ECB3)',
              color: 'black',
              borderRadius: '8px',
            },
          }}
        />
      </Layout>
    </Page>
  );
}

export async function getServerSideProps({ locale = 'en-US', query }) {
  return {
    props: {
      messages: {
        ...require(`../messages/common/${locale}.json`),
        ...require(`../messages/index/${locale}.json`),
      },
      now: new Date().getTime(),
      locale,
      query,
    },
  };
}
