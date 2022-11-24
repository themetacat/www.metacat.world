import React, { useEffect } from 'react';
import cn from 'classnames';

import { useRouter } from 'next/router';

import Link from 'next/link';
import { v4 as uuid } from 'uuid';
import dynamic from 'next/dynamic';

import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import Page from '../../components/page';
// import Layout from '../../components/layout';
import Layout from '../../components/layoutParcels';
import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import { convert, getToken, setToken } from '../../common/utils';

// import Tab from '../../components/home_tab';
import Tab from '../../components/hometabParcels';
import SecondTab from '../../components/tab2';
// import Card from '../../components/card';
import Card from '../../components/cardParcels';
import CardSpace from '../../components/cardSpaace';
import SwiperTag from '../../components/swiper-tag';
import SwiperTagParcels from '../../components/swiper-tagParcels';
// import PageHeader from '../../components/page-header';
import PageHeader from '../../components/top-navigation';
import SpaceBuilding from './spacebuildings';
import ScenceBuilding from './scencebuildings';
import PagiNation from '../../components/paginationParcels';
import Search from '../../components/search';
import PostGrid from '../../components/post-grid';
import Status from '../../components/status';
import TopJumper from '../../components/jump-to-top';
import TopicCardList from '../../components/topic-card-list';

import BaseChart from '../../components/base-chart';
import BaseBar from '../../components/base-bar';
import StackBar from '../../components/stack-bar';
import ChartLine from '../../components/chart-line';
import ChartLineToolTipSimple from '../../components/chart-line-tooltip-simple';
import ChartLineSandBox from '../../components/chart-line-sandbox';
import StackBarZ from '../../components/stack-bar-z';
import ChartLineToolTipSimpleSandbox from '../../components/chart-line-tooltip-simple-sandbox';
import { useWalletProvider } from '../../components/web3modal';
import StackBarZ2 from '../../components/stack-bar-z2';

import { state } from '../../components/wallet-btn';

import {
  getCVEventList,
  getCVParcelList,
  getDCLEventList,
  getDCLParcelList,
  getSomSpaceList,
  getTopicList,
  getOncyberParcelList,
  getCvParcelSoldTotalStats,
  getCvTrafficStats,
  getSandBoxParcelList,
  getCvParcelAvgPriceStats,
  getDclParcelAvgPriceStats,
  getDclParcelSoldSumStats,
  getDclParcelSoldTotalStats,
  getProtoParcelList,
  getHyperfyParcelList,
  getMozillaParcelList,
  getArtifexParcelList,
  getAriumParcelList,
  getRareParcelList,
  getSpatialParcelList,
  refreshToken,
  getBaseInfo,
  getMonaParcelList,
} from '../../service';


import {
  req_sandbox_avg_price_stats,
  req_sandbox_sold_total_stats,
  req_sandbox_sold_sun_stats,
  req_somniumspace__avg_price_stats,
  req_somniumspace_sold_total_stats,
  req_somniumspace_sold_sum_stats,
  req_ntfworlds_avg_price_stats,
  req_ntfworlds_sold_total_stats,
  req_ntfworlds_sold_sum_stats,
  req_webb_parcel_avg_price_stats,
  req_webb_sold_total_stats,
  req_webb_sold_sum_stats,
  req_otherside_avg_price,
  req_otherside_sales_num,
  req_otherside_sales_amount,
  req_netvrk_avg_price,
  req_netvrk_sales_num,
  req_netvrk_sales_amount,
  req_space_buildings_list,
  req_scence_list,
} from '../../service/z_api';

import style from './index.module.less';

const MapWithNoSSR = dynamic(() => import('../../components/map'), {
  ssr: false,
});

const DCLMapWithNoSSR = dynamic(() => import('../../components/decentraland-map'), {
  ssr: false,
});

const SandboxMap = dynamic(() => import('../../components/sandbox-map'), {
  ssr: false,
});

const SomniumMap = dynamic(() => import('../../components/somnium-map'), {
  ssr: false,
});

const OtherSideMap = dynamic(() => import('../../components/otherside-map'), {
  ssr: false,
});

const TAB = [
  {
    label: 'Voxels',
    icon: '/images/cvLogo.png',
    type: 'cryptovoxels',
    link: '/parcels?tab=cryptovoxels',
  },
  {
    label: 'Decentraland',
    icon: '/images/Decentraland.jpg',
    type: 'decentraland',
    link: '/parcels?tab=decentraland',
  },
  // {
  //   label: 'The Sandbox',
  //   icon: '/images/home-icon.svg',
  //   type: 'sandbox',
  // },
  {
    label: 'Oncyber',
    icon: 'https://oncyber.io/images/logo.png',
    type: 'oncyber',
    link: '/parcels?tab=oncyber',
  },
  {
    label: 'Mona',
    icon: 'https://monaverse.com/branding/mona-logo-white.svg',
    type: 'mona',
    link: '/parcels?tab=mona',
  },
  {
    label: 'Protoworld',
    icon: '/images/protoworld.png',
    type: 'protoworld',
    link: '/parcels?tab=protoworld',
  },
  {
    label: 'Somnium Space',
    icon: '/images/somniumspace.png',
    type: 'somniumspace',
    link: '/parcels?tab=somniumspace',
  },
  {
    label: 'RareRooms',
    icon: '/images/RareRoom.png',
    type: 'rarerooms',
    link: '/parcels?tab=rarerooms',
  },
  {
    label: 'The Sandbox',
    icon: '/images/home-icon.svg',
    type: 'sandbox',
    link: '/parcels?tab=sandbox',
  },
  {
    label: 'Spatial',
    icon: '/images/Spatial.png',
    type: 'spatial',
    link: '/parcels?tab=spatial',
  },
  {
    label: 'Hyperfy',
    icon: '/images/Hyperfy.png',
    type: 'hyperfy',
    link: '/parcels?tab=hyperfy',
  },
  {
    label: 'MozillaHubs',
    icon: '/images/MozillaHubs.png',
    type: 'mozillaHubs',
    link: '/parcels?tab=mozillaHubs',
  },
  {
    label: 'Arium',
    icon: '/images/Arium.png',
    type: 'arium',
    link: '/parcels?tab=arium',
  },
  {
    label: 'Artifex',
    icon: '/images/Artifex.png',
    type: 'artifex',
    link: '/parcels?tab=artifex',
  },
  // {
  //   label: 'NFT Worlds',
  //   icon: '/images/worlds.svg',
  //   type: 'nftworlds',
  // },
  // {
  //   label: 'Worldwide Webb',
  //   icon: '/images/unnamed.svg',
  //   type: 'worldwidewebb',
  // },
  // {
  //   label: 'Otherside',
  //   icon: '/images/osd.png',
  //   type: 'otherside',
  // },
  // {
  //   label: 'Netvrk',
  //   icon: '/images/netvrk_logomark.svg',
  //   type: 'netvrk',
  // },
];

const SUBTAB = [
  {
    label: 'Parcel',
    type: 'parcel',
  },
  {
    label: 'Space',
    type: 'space',
  },
  // {
  //   label: 'Heatmap',
  //   type: 'map',
  // },
  // {
  //   label: 'Analytics',
  //   type: 'analytics',
  // },
  // {
  //   label: 'Events',
  //   type: 'event',
  // },
];
const SUBTABDECE = [
  {
    label: 'Parcel',
    type: 'parcel',
  },
  {
    label: 'Scene',
    type: 'scene',
  },
  // {
  //   label: 'Heatmap',
  //   type: 'map',
  // },
  // {
  //   label: 'Analytics',
  //   type: 'analytics',
  // },
  // {
  //   label: 'Events',
  //   type: 'event',
  // },
];
const SUBTABSomSpace = [
  {
    label: 'Parcel',
    type: 'parcel',
  },
  {
    label: 'Scene',
    type: 'scene',
  },
];
const SUBTABMona = [
  {
    label: 'Parcel',
    type: 'parcel',
  },
  {
    label: 'Scene',
    type: 'scene',
  },
];

const SUBTABZ = [
  {
    label: 'Analytics',
    type: 'analytics',
  },
];
const SUBTABZ2 = [
  {
    label: 'Heatmap',
    type: 'map',
  },
  {
    label: 'Analytics',
    type: 'analytics',
  },
];

export default function Index(props) {
  const router = useRouter();
  const headerRef = React.useRef(null)

  const meta = {
    title: `Parcels - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [tabState, setTabState] = React.useState(props.query.tab || 'cryptovoxels');
  const [subTabState, setSubTabState] = React.useState(props.query.subTab || 'parcel');
  // const [subSpaceState, setSubSpaceState] = React.useState(props.query.subTab || 'space');
  const [totalPage, setTotalPage] = React.useState(1);
  const [noData, setNoData] = React.useState(false);
  const [offsetWidthNum, setOffsetWidthNum] = React.useState(0);
  const [searchText, setSearchText] = React.useState(props.query.search || '');
  const [typeState, setTypeState] = React.useState(props.query.type || 'All');
  const [typeList, setTypeList] = React.useState([]);
  const [typeListMona, setTypeListMona] = React.useState([]);
  const [typeListOncyber, setTypeListOncyber] = React.useState([]);
  const [typeListProto, setTypeListProto] = React.useState([]);
  const [typeListRare, setTypeListRare] = React.useState([]);
  const [typeListSandBox, setTypeListSandBox] = React.useState([]);
  const [typeListSpatial, setTypeListSpatial] = React.useState([]);
  const [typeListHyperfy, setTypeListHyperfy] = React.useState([]);
  const [typeListMozilla, setTypeListMozilla] = React.useState([]);
  const [typeListArium, setTypeListArium] = React.useState([]);
  const [typeListArtifex, setTypeListArtifex] = React.useState([]);
  const [typeListsomniumspace, setTypeListSomniumspace] = React.useState([]);
  const [topicList, setTopicList] = React.useState([]);
  const [fixedState, setFixedState] = React.useState(false);
  const [fixedStatePage, setFixedStatePage] = React.useState(false);
  const nextCursor = React.useRef(1);
  const [findIndex, setFindIndex] = React.useState(1);
  const [isSwiper, setSwiper] = React.useState(null);

  const [dataSource, setDataSource] = React.useState([]);
  const [dataSourceSomSpace, setDataSourceSomSpace] = React.useState([]);
  const [dataSourceMona, setDataSourceMona] = React.useState([]);
  const [dataSourceOrcyber, setDataSourceOrcyber] = React.useState([]);
  const [dataSourceProto, setDataSourceProto] = React.useState([]);
  const [dataSourceRare, setDataSourceRare] = React.useState([]);
  const [dataSourceSpatial, setDataSourceSpatial] = React.useState([]);
  const [dataSourceHyperfy, setDataSourceHyperfy] = React.useState([]);
  const [dataSourceMozilla, setDataSourceMozilla] = React.useState([]);
  const [dataSourceArium, setDataSourceArium] = React.useState([]);
  const [dataSourceArtifex, setDataSourceArtifex] = React.useState([]);
  const [dataSourceSandbox, setDataSourceSandbox] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const [percent, setPercent] = React.useState(0);
  const [tabPercent, setTabPercent] = React.useState(0);

  const web3 = useWalletProvider();

  const requestData = async ({
    tab,
    subTab,
    page,
    query = '',
    type,
    needUpdateTypeList = false,
  }): Promise<any[]> => {
    let data = [];
    setLoading(true);
    setError(false);

    // console.log(tab, 11,
    //   subTab, 22,
    //   type);


    // setSearchText('')
    try {
      if (tab === 'cryptovoxels') {
        if (subTab === 'parcel') {
          const res = await getCVParcelList(page, 40, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          const typeArray = Object.keys(type_total).map((key) => {
            const value = type_total[key];
            return { name: key, value };
          });


          // setPageNumber(currentPage);
          setTotalPage(total_page);

          if (needUpdateTypeList) {
            setTypeList(typeArray);
          }
          data = parcel_list;
        } else if (subTab === 'event') {
          const res = await getCVEventList(nextCursor.current, 10);
          const { cursor, count, event_list } = res.data;
          nextCursor.current = cursor;

          if (event_list.length === 0) {
            setNoData(true);
          } else {
            setNoData(false);
          }

          data = event_list;
        } else if (subTab === 'space') {
          const res = await req_space_buildings_list(page, 40, query, type);

          // let { page, count } = res;
          setTotalPage(res.total_page);
          // setTotalPage(res.page);
          data = res.data;
          // const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          // const typeArray = Object.keys(type_total).map((key) => {
          //   const value = type_total[key];
          //   return { name: key, value };
          // });
          // setTotalPage(total_page);

          // if (needUpdateTypeList) {
          //   setTypeList(typeArray);
          // }
          // data = parcel_list;
        }
      } else if (tab === 'decentraland') {
        if (subTab === 'parcel') {
          const res = await getDCLParcelList(page, 40, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          // setPageNumber(currentPage);
          setTotalPage(total_page);

          const typeArray = Object.keys(type_total).map((key) => {
            const value = type_total[key];
            return { name: key, value };
          });

          if (needUpdateTypeList) {
            setTypeList(typeArray);
          }
          data = parcel_list;


        } else if (subTab === 'event') {
          const res = await getDCLEventList(nextCursor.current, 10);
          const { cursor, event_list } = res.data;
          nextCursor.current = cursor;

          if (event_list.length === 0) {
            setNoData(true);
          } else {
            setNoData(false);
          }

          data = event_list;
        } else if (subTab === 'scene') {
          const res = await req_scence_list(page, 40, query, type);

          // let { page, count } = res;
          setTotalPage(res.total_page);
          data = res.data;
          //  const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          //  const typeArray = Object.keys(type_total).map((key) => {
          //    const value = type_total[key];
          //    return { name: key, value };
          //  });
          //  setTotalPage(total_page);

          //  if (needUpdateTypeList) {
          //    setTypeList(typeArray);
          //  }
          //  data = parcel_list;
        }
      } else if (tab === 'somniumspace') {
        if (subTab === 'parcel') {


          const res = await getSomSpaceList(page, 40, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;
          // console.log(res.data.parcel_list);

          // setPageNumber(currentPage);
          setTotalPage(total_page);
          setPageNumber(currentPage);
          setTypeListSomniumspace(type_total)
          setDataSourceSomSpace(res.data.parcel_list)


        }
      } else if (tab === 'mona') {
        if (subTab === 'parcel') {
          const res = await getMonaParcelList(page, 40, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          // const typeArray = type_total.map((item) => {
          //   const name = item.name;
          //   const count = item.name;
          //   return { name, count };


          // });
          setDataSourceMona(res.data.parcel_list)

          setTypeListMona(type_total)
          setPageNumber(currentPage);
          setTotalPage(total_page);

          // if (needUpdateTypeList) {
          //   setTypeList(type_total);
          // }
          // data = parcel_list;
        }

      } else if (tab === 'oncyber') {
        if (subTab === 'parcel') {
          const res = await getOncyberParcelList(page, 40, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          // const typeArray = type_total.map((item) => {
          //   const name = item.name;
          //   const count = item.name;
          //   return { name, count };


          // });
          setDataSourceOrcyber(res.data.parcel_list)

          setTypeListOncyber(type_total)
          setPageNumber(currentPage);
          setTotalPage(total_page);

          // if (needUpdateTypeList) {
          //   setTypeList(type_total);
          // }
          // data = parcel_list;
        }

      } else if (tab === 'protoworld') {
        if (subTab === 'parcel') {
          const res = await getProtoParcelList(page, 40, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          // const typeArray = type_total.map((item) => {
          //   const name = item.name;
          //   const count = item.name;
          //   return { name, count };


          // });
          setDataSourceProto(res.data.parcel_list)

          setTypeListProto(type_total)
          setPageNumber(currentPage);
          setTotalPage(total_page);

          // if (needUpdateTypeList) {
          //   setTypeList(type_total);
          // }
          // data = parcel_list;
        }

      } else if (tab === 'rarerooms') {
        if (subTab === 'parcel') {
          const res = await getRareParcelList(page, 40, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          // const typeArray = type_total.map((item) => {
          //   const name = item.name;
          //   const count = item.name;
          //   return { name, count };


          // });
          setDataSourceRare(res.data.parcel_list)

          setTypeListRare(type_total)
          setPageNumber(currentPage);
          setTotalPage(total_page);

          // if (needUpdateTypeList) {
          //   setTypeList(type_total);
          // }
          // data = parcel_list;
        }
      } else if (tab === 'sandbox') {
        if (subTab === 'parcel') {
          const res = await getSandBoxParcelList(page, 40, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          // const typeArray = type_total.map((item) => {
          //   const name = item.name;
          //   const count = item.name;
          //   return { name, count };


          // });
          setDataSourceSandbox(res.data.parcel_list)

          setTypeListSandBox(type_total)
          setPageNumber(currentPage);
          setTotalPage(total_page);

          // if (needUpdateTypeList) {
          //   setTypeList(type_total);
          // }
          // data = parcel_list;
        }
      } else if (tab === 'spatial') {
        if (subTab === 'parcel') {
          const res = await getSpatialParcelList(page, 40, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          // const typeArray = type_total.map((item) => {
          //   const name = item.name;
          //   const count = item.name;
          //   return { name, count };


          // });
          setDataSourceSpatial(res.data.parcel_list)

          setTypeListSpatial(type_total)
          setPageNumber(currentPage);
          setTotalPage(total_page);

          // if (needUpdateTypeList) {
          //   setTypeList(type_total);
          // }
          // data = parcel_list;
        }

      } else if (tab === 'hyperfy') {
        if (subTab === 'parcel') {
          const res = await getHyperfyParcelList(page, 40, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          // const typeArray = type_total.map((item) => {
          //   const name = item.name;
          //   const count = item.name;
          //   return { name, count };


          // });
          setDataSourceHyperfy(res.data.parcel_list)

          setTypeListHyperfy(type_total)
          setPageNumber(currentPage);
          setTotalPage(total_page);

          // if (needUpdateTypeList) {
          //   setTypeList(type_total);
          // }
          // data = parcel_list;
        }

      } else if (tab === 'mozillaHubs') {
        if (subTab === 'parcel') {
          const res = await getMozillaParcelList(page, 40, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          // const typeArray = type_total.map((item) => {
          //   const name = item.name;
          //   const count = item.name;
          //   return { name, count };


          // });
          setDataSourceMozilla(res.data.parcel_list)

          setTypeListMozilla(type_total)
          setPageNumber(currentPage);
          setTotalPage(total_page);

          // if (needUpdateTypeList) {
          //   setTypeList(type_total);
          // }
          // data = parcel_list;
        }
      } else if (tab === 'arium') {
        if (subTab === 'parcel') {
          const res = await getAriumParcelList(page, 40, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          // const typeArray = type_total.map((item) => {
          //   const name = item.name;
          //   const count = item.name;
          //   return { name, count };


          // });
          setDataSourceArium(res.data.parcel_list)

          setTypeListArium(type_total)
          setPageNumber(currentPage);
          setTotalPage(total_page);

          // if (needUpdateTypeList) {
          //   setTypeList(type_total);
          // }
          // data = parcel_list;
        }

      } else if (tab === 'artifex') {
        if (subTab === 'parcel') {
          const res = await getArtifexParcelList(page, 40, query, type);
          const { parcel_list, total_page, type_total, page: currentPage } = res.data;

          // const typeArray = type_total.map((item) => {
          //   const name = item.name;
          //   const count = item.name;
          //   return { name, count };


          // });
          setDataSourceArtifex(res.data.parcel_list)

          setTypeListArtifex(type_total)
          setPageNumber(currentPage);
          setTotalPage(total_page);

          // if (needUpdateTypeList) {
          //   setTypeList(type_total);
          // }
          // data = parcel_list;
        }
      }
    } catch (err) {
      setError(true);
    }

    setLoading(false);
    // console.log(convert(data));

    return convert(data);
  };


  React.useEffect(() => {
    setOffsetWidthNum(headerRef?.current?.clientWidth)

    const listener = () => {
      if (
        document.querySelector('.myClassName') &&
        document.querySelector('.myClassName').getBoundingClientRect().top <= 10 &&
        window.scrollY > 0
      ) {
        setFixedState(true);
      } else {
        setFixedState(false);
      }
    };
    document.addEventListener('scroll', listener);
    return () => document.removeEventListener('scroll', listener);
  }, [fixedState, offsetWidthNum]);

  const onTabChange = async (tab) => {

    let subIndex;
    if (tabState === 'cryptovoxels') {
      subIndex = SUBTAB.findIndex((item) => item.type === subTabState);
    } else if (tabState === 'decentraland') {
      subIndex = SUBTABDECE.findIndex((item) => item.type === subTabState);
    } else if (tabState === 'somniumspace') {
      subIndex = SUBTABSomSpace.findIndex((item) => item.type === subTabState);
    }
    else if (tabState === 'mona') {
      subIndex = SUBTABSomSpace.findIndex((item) => item.type === subTabState);
    }
    else if (tabState === 'protoworld') {
      subIndex = SUBTABSomSpace.findIndex((item) => item.type === subTabState);
    }
    else if (tabState === 'rarerooms') {
      subIndex = SUBTABSomSpace.findIndex((item) => item.type === subTabState);
    }
    else if (tabState === 'spatial') {
      subIndex = SUBTABSomSpace.findIndex((item) => item.type === subTabState);
    }
    else if (tabState === 'hyperfy') {
      subIndex = SUBTABSomSpace.findIndex((item) => item.type === subTabState);
    }
    else if (tabState === 'arium') {
      subIndex = SUBTABSomSpace.findIndex((item) => item.type === subTabState);
    }
    else if (tabState === 'artifex') {
      subIndex = SUBTABSomSpace.findIndex((item) => item.type === subTabState);
    }
    else if (tabState === 'mozillaHubs') {
      subIndex = SUBTABSomSpace.findIndex((item) => item.type === subTabState);
    }
    else if (tabState === 'sandbox') {
      subIndex = SUBTABSomSpace.findIndex((item) => item.type === subTabState);
    }
    else if (tabState === 'oncyber') {
      subIndex = SUBTABSomSpace.findIndex((item) => item.type === subTabState);
    }

    subIndex = subIndex === -1 ? 0 : subIndex;
    setTabState(tab);
    let sub = '';
    if (tab === 'cryptovoxels') {
      sub = SUBTAB[subIndex]?.type;
      setSubTabState(SUBTAB[subIndex]?.type);
      router.replace(`/parcels?tab=cryptovoxels`);
      // router.replace(`/parcels?tab=cryptovoxels&subTab=${SUBTAB[subIndex]?.type}`);
    } else if (tab === 'decentraland') {
      sub = SUBTAB[subIndex]?.type;
      setSubTabState(SUBTABDECE[subIndex]?.type);
      router.replace(`/parcels?tab=decentraland`);
      // router.replace(`/parcels?tab=decentraland&subTab=${SUBTABDECE[subIndex]?.type}`);
    } else if (tab === 'somniumspace') {
      sub = SUBTAB[subIndex]?.type;
      setSubTabState(SUBTABSomSpace[subIndex]?.type);
      router.replace(`/parcels?tab=somniumspace`);
      // router.replace(`/parcels?tab=decentraland&subTab=${SUBTABDECE[subIndex]?.type}`);
    } else if (tab === 'mona') {


      sub = SUBTAB[subIndex]?.type;
      setSubTabState(SUBTABMona[subIndex]?.type);

      router.replace(`/parcels?tab=mona`);
      // router.replace(`/parcels?tab=decentraland&subTab=${SUBTABDECE[subIndex]?.type}`);

    } else if (tab === 'protoworld') {


      sub = SUBTAB[subIndex]?.type;
      setSubTabState(SUBTABMona[subIndex]?.type);

      router.replace(`/parcels?tab=protoworld`);
      // router.replace(`/parcels?tab=decentraland&subTab=${SUBTABDECE[subIndex]?.type}`);

    } else if (tab === 'rarerooms') {


      sub = SUBTAB[subIndex]?.type;
      setSubTabState(SUBTABMona[subIndex]?.type);

      router.replace(`/parcels?tab=rarerooms`);
      // router.replace(`/parcels?tab=decentraland&subTab=${SUBTABDECE[subIndex]?.type}`);

    } else if (tab === 'spatial') {


      sub = SUBTAB[subIndex]?.type;
      setSubTabState(SUBTABMona[subIndex]?.type);

      router.replace(`/parcels?tab=spatial`);
      // router.replace(`/parcels?tab=decentraland&subTab=${SUBTABDECE[subIndex]?.type}`);

    } else if (tab === 'hyperfy') {


      sub = SUBTAB[subIndex]?.type;
      setSubTabState(SUBTABMona[subIndex]?.type);

      router.replace(`/parcels?tab=hyperfy`);
      // router.replace(`/parcels?tab=decentraland&subTab=${SUBTABDECE[subIndex]?.type}`);

    } else if (tab === 'mozillaHubs') {


      sub = SUBTAB[subIndex]?.type;
      setSubTabState(SUBTABMona[subIndex]?.type);

      router.replace(`/parcels?tab=mozillaHubs`);
      // router.replace(`/parcels?tab=decentraland&subTab=${SUBTABDECE[subIndex]?.type}`);

    } else if (tab === 'arium') {


      sub = SUBTAB[subIndex]?.type;
      setSubTabState(SUBTABMona[subIndex]?.type);

      router.replace(`/parcels?tab=arium`);
      // router.replace(`/parcels?tab=decentraland&subTab=${SUBTABDECE[subIndex]?.type}`);

    } else if (tab === 'artifex') {


      sub = SUBTAB[subIndex]?.type;
      setSubTabState(SUBTABMona[subIndex]?.type);

      router.replace(`/parcels?tab=artifex`);
      // router.replace(`/parcels?tab=decentraland&subTab=${SUBTABDECE[subIndex]?.type}`);
    }
    else if (tab === 'oncyber') {
      sub = SUBTAB[subIndex]?.type;
      setSubTabState(SUBTABMona[subIndex]?.type);
      router.replace(`/parcels?tab=oncyber`);
      // router.replace(`/parcels?tab=decentraland&subTab=${SUBTABDECE[subIndex]?.type}`);
    }
    else if (tab === 'sandbox') {
      sub = SUBTAB[subIndex]?.type;
      setSubTabState(SUBTABMona[subIndex]?.type);
      router.replace(`/parcels?tab=sandbox`);
      // router.replace(`/parcels?tab=decentraland&subTab=${SUBTABDECE[subIndex]?.type}`);
    }
    else if (
      tab === 'nftworlds' ||
      tab === 'worldwidewebb' ||
      // tab === 'otherside' ||
      tab === 'netvrk'
    ) {
      sub = SUBTABZ[0].type;
      setSubTabState(SUBTABZ[0].type);
    } else if (tab === 'otherside') {
      if (SUBTABZ2.find((item) => item.type === subTabState)) {
        sub = SUBTABZ2.find((item) => item.type === subTabState).type;
        setSubTabState(sub);
      } else if (SUBTABZ2.find((item) => item.type !== subTabState)) {
        sub = SUBTABZ2[0].type;
        setSubTabState(SUBTABZ2[0].type);
      }
    } else {
      return;
    }
    // if (subTabState === 'map') {
    //   sub = 'parcel';
    //   setSubTabState(sub);
    // }
    setSearchText('');
    setTypeState('All');
    nextCursor.current = 1;
    const data = await requestData({
      tab,
      subTab: sub,
      page: 1,
      query: '',
      type: 'All',
      needUpdateTypeList: true,
    });
    setDataSource(data);
    // setDataSourceMona(data);
  };
  // const onSubTabChange = React.useCallback(
  //   async (subTab) => {
  //     setSubTabState(subTab);
  //     let subIndexData;
  //     // console.log(subTab, tabState, subIndexData)
  //     // setTabState(subTab);
  //     if (tabState === 'cryptovoxels') {
  //       if (subTab === 'parcel') {
  //         subIndexData = SUBTAB.findIndex((item) => item.type === subTab);
  //       } else if (subTab === 'space') {
  //         subIndexData = SUBTAB.findIndex((item) => item.type === subTab);
  //       }
  //       // console.log(subIndexData, tabState);
  //       subIndexData = subIndexData === -1 ? 0 : subIndexData;
  //     } else {
  //       if (subTab === 'parcel') {
  //         subIndexData = SUBTABDECE.findIndex((item) => item.type === subTab);
  //       } else if (subTab === 'scene') {
  //         subIndexData = SUBTABDECE.findIndex((item) => item.type === subTab);
  //       }
  //       // console.log(subIndexData, tabState);
  //       subIndexData = subIndexData === -1 ? 0 : subIndexData;
  //     }

  //     let sub = '';

  //     if (tabState === 'cryptovoxels') {
  //       sub = subTabState;
  //       // console.log(SUBTAB[subIndexData].type,);

  //       setSubTabState(SUBTAB[subIndexData].type);
  //       router.replace(`/parcels?tab=cryptovoxels&subTab=${SUBTAB[subIndexData].type}`);
  //     } else if (tabState === 'decentraland') {
  //       sub = subTabState;
  //       // console.log(SUBTABDECE[subIndexData].type);
  //       setSubTabState(SUBTABDECE[subIndexData].type);
  //       router.replace(`/parcels?tab=decentraland&subTab=${SUBTABDECE[subIndexData].type}`);
  //     }

  //     setSearchText('');
  //     setTypeState('');
  //     setTypeState('All');
  //     // console.log(sub);
  //     const data = await requestData({
  //       tab: tabState,
  //       subTab,
  //       page: 1,
  //       query: '',
  //       type: '',
  //       needUpdateTypeList: true,
  //     });
  //     setDataSource(data);
  //   },
  //   [tabState, searchText, typeState],
  // );

  const onTypeChangeHandler = React.useCallback(
    async (type: string,
      // page,
      // query = '',
    ) => {

      setTypeState(type);
      // setSubTabState('')
      // if (searchText !=='') {
      //   setSearchText('')
      //   const data = await requestData({
      //     tab: tabState,
      //     subTab: '',
      //     page: 1,
      //     query: '',
      //     type,
      //   });

      //   setDataSource(data);
      // }else{

      // }
      // setSearchText('')
      // const requestNumber = number + 1;
      // setPageNumber(requestNumber)
      if (type === 'Free Space') {
        const data = await requestData({
          tab: tabState,
          subTab: 'space',
          page: 1,
          query: searchText,
          type: '',
          needUpdateTypeList: true,
        });
        // console.log(data);
        setDataSource(data);
      } else if (type === 'Scene') {

        const data = await requestData({
          tab: tabState,
          subTab: 'scene',
          page: 1,
          query: searchText,
          type: '',
          needUpdateTypeList: true,
        });
        // console.log(data);

        setDataSource(data);
      }
      else {
        // onSubTabChange('parcel')
        const data = await requestData({
          tab: tabState,
          subTab: subTabState,
          page: 1,
          query: searchText,
          type,
        });

        setDataSource(data);
        // setDataSourceMona(data);
      }

    },
    [tabState, subTabState, searchText],
  );

  useEffect(() => {
    onTypeChangeHandler('All')
  
  }, [])
  const onPageChangeHandler =
    async (number: number,) => {
      // console.log(searchText);


      const requestNumber = number + 1;
      const data = await requestData({
        tab: tabState,
        subTab: subTabState,
        page: requestNumber,
        query: searchText,
        type: typeState,
      });
      setPageNumber(requestNumber);
      setDataSource(data);

      // setDataSourceSomSpace(data);
    }


  const onSearchHandler = React.useCallback(
    async (text: string) => {
      // console.log(text);
      // router.replace(`/parcels?tab=decentraland?q=${text}`);
      setSearchText(text);
      const data = await requestData({
        tab: tabState,
        subTab: subTabState,
        query: text,
        page: 1,
        type: typeState,
        needUpdateTypeList: true,
      });
      // console.log(data,"data");

      setDataSource(data);
    },
    [tabState, subTabState, typeState],
  );

  const onSearchSpace = React.useCallback(
    async (text: string) => {
      // console.log(tabState, subTabState);

      setSearchText(text);
      const data = await requestData({
        tab: tabState,
        subTab: 'space',
        query: text,
        page: 1,
        type: typeState,
        needUpdateTypeList: true,
      });
      // console.log(data);

      setDataSource(data);
    },
    [tabState, subTabState, typeState],
  );

  const onSearchScene = React.useCallback(
    async (text: string) => {
      // console.log(tabState, subTabState);

      setSearchText(text);
      const data = await requestData({
        tab: tabState,
        subTab: 'scene',
        query: text,
        page: 1,
        type: typeState,
        needUpdateTypeList: true,
      });

      setDataSource(data);
    },
    [tabState, subTabState, typeState],
  );

  const loadMore = React.useCallback(
    async (defaultPage?: number) => {
      if (dataSource.length === 0) return;
      const list = await requestData({
        tab: tabState,
        subTab: subTabState,
        page: defaultPage || 1,
        query: searchText,
        type: typeState,
      });
      if (list.length === 0) {
        setHasMore(false);
        return;
      }
      setDataSource([...dataSource, ...list]);
      setDataSource([...dataSource, ...list]);
      setPageNumber((defaultPage || pageNumber) + 1);
      setHasMore(true);
    },
    [pageNumber, hasMore, tabState, subTabState, searchText, typeState, dataSource],
  );

  const onRetry = React.useCallback(async () => {
    const data = await requestData({
      tab: tabState,
      subTab: subTabState,
      page: pageNumber,
      query: searchText,
      type: typeState,
      needUpdateTypeList: true,
    });
    setDataSource(data);
  }, [tabState, subTabState, pageNumber, searchText, typeState]);




  const renderContent = React.useMemo(() => {
    // console.log(tabState);

    if (subTabState === 'parcel') {
      if (loading) {
        return <Status status="loading" />;
      }

      if (error) {
        return <Status retry={onRetry} status="error" />;
      }

      if (dataSource.length === 0 && (tabState === 'cryptovoxels' || tabState === 'decentraland')) {
        return <Status status="empty" />;
      }
      if (tabState === 'cryptovoxels' || tabState === 'decentraland') {
        return (
          <>
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5',
                style.bottomContent,
              )}
            >
              {
                typeState === 'Free Space' || typeState === 'Scene' ?
                  <>
                    {dataSource.map((card, idx) => {
                      return <CardSpace {...card} typeState={typeState} key={idx}></CardSpace>;
                    })}
                  </>
                  : <>
                    {dataSource.map((card, idx) => {
                      return <Card {...card} typeState={typeState} key={uuid()}></Card>;
                    })}
                  </>
              }


            </div>
            <div className={style.pagiNation}>
              <PagiNation
                total={totalPage}
                pageNumber={pageNumber - 1}
                pageSize={9}
                pageChange={onPageChangeHandler}
              />
            </div>
          </>
        );
      }
      if (tabState === 'somniumspace') {
        return (
          <>
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5',
                style.bottomContent,
              )}
            >
              {dataSourceSomSpace.map((card, idx) => {
                return <Card {...card} typeState={typeState} key={uuid()}></Card>;
              })}
            </div>
            <div className={style.pagiNation}>
              <PagiNation
                total={totalPage}
                pageNumber={pageNumber - 1}
                pageSize={9}
                pageChange={onPageChangeHandler}
              />
            </div>
          </>
        )
      }
      if (tabState === 'mona') {
        return (
          <>
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5',
                style.bottomContent,
              )}
            >
              {dataSourceMona.map((card, idx) => {

                return <Card {...card} typeState={typeState} key={uuid()}></Card>;
              })}
            </div>
            <div className={style.pagiNation}>
              <PagiNation
                total={totalPage}
                pageNumber={pageNumber - 1}
                pageSize={9}
                pageChange={onPageChangeHandler}
              />
            </div>
          </>
        )
      }
      if (tabState === 'oncyber') {
        return (
          <>
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5',
                style.bottomContent,
              )}
            >
              {dataSourceOrcyber.map((card, idx) => {

                return <Card {...card} typeState={typeState} key={uuid()}></Card>;
              })}
            </div>
            <div className={style.pagiNation}>
              <PagiNation
                total={totalPage}
                pageNumber={pageNumber - 1}
                pageSize={9}
                pageChange={onPageChangeHandler}
              />
            </div>
          </>
        )
      }
      if (tabState === 'protoworld') {
        return (
          <>
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5',
                style.bottomContent,
              )}
            >
              {dataSourceProto.map((card, idx) => {

                return <Card {...card} typeState={typeState} key={uuid()}></Card>;
              })}
            </div>
            <div className={style.pagiNation}>
              <PagiNation
                total={totalPage}
                pageNumber={pageNumber - 1}
                pageSize={9}
                pageChange={onPageChangeHandler}
              />
            </div>
          </>
        )
      }
      if (tabState === 'rarerooms') {
        return (
          <>
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5',
                style.bottomContent,
              )}
            >
              {dataSourceRare.map((card, idx) => {
                return <Card {...card} typeState={typeState} key={uuid()}></Card>;
              })}
            </div>
            <div className={style.pagiNation}>
              <PagiNation
                total={totalPage}
                pageNumber={pageNumber - 1}
                pageSize={9}
                pageChange={onPageChangeHandler}
              />
            </div>
          </>
        )
      }
      if (tabState === 'spatial') {
        return (
          <>
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5',
                style.bottomContent,
              )}
            >
              {dataSourceSpatial.map((card, idx) => {
                return <Card {...card} typeState={typeState} key={uuid()}></Card>;
              })}
            </div>
            <div className={style.pagiNation}>
              <PagiNation
                total={totalPage}
                pageNumber={pageNumber - 1}
                pageSize={9}
                pageChange={onPageChangeHandler}
              />
            </div>
          </>
        )
      }
      if (tabState === 'hyperfy') {
        return (
          <>
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5',
                style.bottomContent,
              )}
            >
              {dataSourceHyperfy.map((card, idx) => {
                return <Card {...card} typeState={typeState} key={uuid()}></Card>;
              })}
            </div>
            <div className={style.pagiNation}>
              <PagiNation
                total={totalPage}
                pageNumber={pageNumber - 1}
                pageSize={9}
                pageChange={onPageChangeHandler}
              />
            </div>
          </>
        )
      }
      if (tabState === 'mozillaHubs') {
        return (
          <>
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5',
                style.bottomContent,
              )}
            >
              {dataSourceMozilla.map((card, idx) => {
                return <Card {...card} typeState={typeState} key={uuid()}></Card>;
              })}
            </div>
            <div className={style.pagiNation}>
              <PagiNation
                total={totalPage}
                pageNumber={pageNumber - 1}
                pageSize={9}
                pageChange={onPageChangeHandler}
              />
            </div>
          </>
        )
      }
      if (tabState === 'arium') {
        return (
          <>
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5',
                style.bottomContent,
              )}
            >
              {dataSourceArium.map((card, idx) => {
                return <Card {...card} typeState={typeState} key={uuid()}></Card>;
              })}
            </div>
            <div className={style.pagiNation}>
              <PagiNation
                total={totalPage}
                pageNumber={pageNumber - 1}
                pageSize={9}
                pageChange={onPageChangeHandler}
              />
            </div>
          </>
        )
      }
      if (tabState === 'artifex') {
        return (
          <>
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5',
                style.bottomContent,
              )}
            >
              {dataSourceArtifex.map((card, idx) => {
                return <Card {...card} typeState={typeState} key={uuid()}></Card>;
              })}
            </div>
            <div className={style.pagiNation}>
              <PagiNation
                total={totalPage}
                pageNumber={pageNumber - 1}
                pageSize={9}
                pageChange={onPageChangeHandler}
              />
            </div>
          </>
        )
      }
      if (tabState === 'sandbox') {
        return (
          <>
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5',
                style.bottomContent,
              )}
            >
              {dataSourceSandbox.map((card, idx) => {
                return <Card {...card} typeState={typeState} key={uuid()}></Card>;
              })}
            </div>
            <div className={style.pagiNation}>
              <PagiNation
                total={totalPage}
                pageNumber={pageNumber - 1}
                pageSize={9}
                pageChange={onPageChangeHandler}
              />
            </div>
          </>
        )
      }
    }
    if (subTabState === 'scene') {
      // console.log(dataSource)
      if (loading) {
        return <Status status="loading" />;
      }

      if (error) {
        return <Status retry={onRetry} status="error" />;
      }

      if (dataSource.length === 0) {
        return null;
      }
      return (
        <>
          <div
            className={cn(
              'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5  ',
              style.bottomContent,
            )}
          >
            {dataSource.map((card, idx) => {
              // return <Card {...card}  key={uuid()}></Card>;
              return <CardSpace {...card} key={idx}></CardSpace>;
            })}
          </div>
          <div className={style.pagiNation}>
            <PagiNation
              total={totalPage}
              pageNumber={pageNumber - 1}
              pageSize={9}
              pageChange={onPageChangeHandler}
            />
          </div>
        </>
      );
    }
    if (subTabState === 'space') {
      if (loading) {
        return <Status status="loading" />;
      }

      if (error) {
        return <Status retry={onRetry} status="error" />;
      }

      if (dataSource.length === 0) {
        return null;
      }
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-7">
            {dataSource.map((card, idx) => {
              // return <Card {...card} key={uuid()}></Card>;
              return <CardSpace {...card} key={idx}></CardSpace>;
            })}
          </div>
          <div className={style.pagiNation}>
            <PagiNation
              total={totalPage}
              pageNumber={pageNumber - 1}
              pageSize={9}
              pageChange={onPageChangeHandler}
            />
          </div>
        </>
      );
    }
    if (subTabState === 'event') {
      if (error) {
        return (
          <div className="grid grid-cols-1 gap-8 my-7">
            <PostGrid loadMore={loadMore} hasMore={hasMore} events={dataSource} />

            <Status retry={onRetry} status="error" />
          </div>
        );
      }

      if (dataSource.length === 0) {
        return <Status status="empty" />;
      }

      return (
        <div className="grid grid-cols-1 gap-8 my-7">
          <PostGrid loadMore={loadMore} hasMore={hasMore} events={dataSource} />
        </div>
      );
    }
    if (subTabState === 'map') {
      return (
        <div className={style.mapContanier}>
          <div className={cn(' flex justify-center items-center', style.mapBack)}>
            {tabState === 'cryptovoxels' ? (
              <MapWithNoSSR
                zoomControl={false}
                zoomLimit={[6, 6]}
                initZoom={6}
                clickToJump={true}
                dragging={false}
                loadFinish={null}
              ></MapWithNoSSR>
            ) : null}
            {tabState === 'decentraland' ? (
              <DCLMapWithNoSSR
                zoomControl={false}
                zoomLimit={[6, 6]}
                initZoom={6}
                clickToJump={true}
                changeTypeControl={false}
                dragging={false}
                loadFinish={null}
              ></DCLMapWithNoSSR>
            ) : null}
            {tabState === 'sandbox' ? (
              <SandboxMap
                zoomControl={false}
                zoomLimit={[6, 6]}
                initZoom={6}
                clickToJump={true}
                changeTypeControl={false}
                dragging={false}
                loadFinish={null}
              ></SandboxMap>
            ) : null}
            {tabState === 'somniumspace' ? (
              <SomniumMap
                zoomControl={false}
                zoomLimit={[6, 6]}
                initZoom={6}
                clickToJump={true}
                changeTypeControl={true}
                dragging={false}
                loadFinish={null}
              ></SomniumMap>
            ) : null}
            {tabState === 'otherside' ? (
              <OtherSideMap
                zoomControl={false}
                zoomLimit={[6, 6]}
                initZoom={6}
                clickToJump={true}
                changeTypeControl={true}
                dragging={false}
                loadFinish={null}
              ></OtherSideMap>
            ) : null}
          </div>
        </div>
      );
    }
    if (subTabState === 'analytics') {
      if (tabState === 'cryptovoxels') {
        return (
          <div className={cn('main-content')}>
            <BaseChart className=" my-5">
              <BaseBar
                id={'basebar1'}
                labelText={'MONTHLY TRAFFIC'}
                dataHandlder={getCvTrafficStats}
                limit={15}
                barWidth={25}
              ></BaseBar>
            </BaseChart>
            <BaseChart className=" mb-5">
              <ChartLine
                id={'chartline1'}
                labelText={'AVERAGE PARCEL PRICE'}
                dataHandlder={getCvParcelAvgPriceStats}
                options={[
                  {
                    label: 'Daily price',
                    value: 'daily',
                  },
                  {
                    label: 'Monthly price',
                    value: 'monthly',
                  },
                  {
                    label: 'Quarterly price',
                    value: 'quarterly',
                  },
                ]}
                priceOptions={[
                  {
                    label: 'ETH',
                    value: 'eth',
                  },
                  {
                    label: 'USD',
                    value: 'usd',
                  },
                ]}
                limit={15}
                tabState={tabState}
              ></ChartLine>
            </BaseChart>
            <BaseChart className=" mb-5">
              <StackBar
                id={'stackbar'}
                className="mt-5"
                labelText={'NUMBER OF PARCEL SALES'}
                dataHandler={getCvParcelSoldTotalStats}
                barWidth={18}
                limit={15}
                options={[
                  {
                    label: 'Daily',
                    value: 'daily',
                  },
                  {
                    label: 'Monthly',
                    value: 'monthly',
                  },
                  {
                    label: 'Quarterly',
                    value: 'quarterly',
                  },
                ]}
              ></StackBar>
            </BaseChart>
          </div>
        );
      }
      if (tabState === 'decentraland') {
        return (
          <div className={cn('main-content')}>
            <BaseChart className=" my-5">
              <ChartLine
                id={'dcl-chartline-1'}
                labelText={'AVERAGE PARCEL PRICE'}
                dataHandlder={getDclParcelAvgPriceStats}
                legend1={{ label: 'Separate Land', color: [33, 212, 115] }}
                legend2={{ label: 'Land in Estate', color: [255, 172, 95] }}
                keyTypes={['land', 'estate']}
                options={[
                  {
                    label: 'Daily price',
                    value: 'daily',
                  },
                  {
                    label: 'Monthly price',
                    value: 'monthly',
                  },
                  {
                    label: 'Quarterly price',
                    value: 'quarterly',
                  },
                ]}
                priceOptions={[
                  {
                    label: 'USD',
                    value: 'usd',
                  },
                  {
                    label: 'MANA',
                    value: 'mana',
                  },
                ]}
                limit={15}
              ></ChartLine>
            </BaseChart>
            <BaseChart className=" my-5">
              <ChartLineToolTipSimple
                id={'dcl-chartline-2'}
                labelText={'NUMBER OF PARCEL SALES'}
                dataHandlder={getDclParcelSoldTotalStats}
                legend1={{ label: 'Land', color: [33, 212, 115] }}
                legend2={{ label: 'Estate', color: [255, 172, 95] }}
                keyTypes={['land', 'estate']}
                options={[
                  {
                    label: 'Daily',
                    value: 'daily',
                  },
                  {
                    label: 'Monthly',
                    value: 'monthly',
                  },
                ]}
                limit={15}
              ></ChartLineToolTipSimple>
            </BaseChart>
            <BaseChart className=" mb-5">
              <>
                <span className="hidden"></span>
                <StackBarZ2
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={getDclParcelSoldSumStats}
                  limit={15}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
                  options={[
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly',
                      value: 'quarterly',
                    },
                  ]}
                  optionsPrice={[
                    {
                      label: 'USD',
                      value: 'usd',
                    },
                    {
                      label: 'MANA',
                      value: 'mana',
                    },
                  ]}
                ></StackBarZ2>
              </>
            </BaseChart>
          </div>
        );
      }
      if (tabState === 'sandbox') {
        return (
          <div className={cn('main-content')}>
            <>
              <BaseChart className=" my-5">
                <ChartLineSandBox
                  id={'chartline1'}
                  labelText={'AVERAGE PARCEL PRICE'}
                  dataHandlder={req_sandbox_avg_price_stats}
                  limit={15}
                  options={[
                    {
                      label: 'Daily price',
                      value: 'daily',
                    },
                    {
                      label: 'Monthly price',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly price',
                      value: 'quarterly',
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
                  tabState={tabState}
                ></ChartLineSandBox>
              </BaseChart>
              <BaseChart className=" my-5">
                <ChartLineToolTipSimpleSandbox
                  id={'dcl-chartline-2'}
                  labelText={'NUMBER OF PARCEL SALES'}
                  dataHandlder={req_sandbox_sold_total_stats}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
                  limit={15}
                  options={[
                    {
                      label: 'Daily',
                      value: 'daily',
                    },
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                  ]}
                  tabState={tabState}
                ></ChartLineToolTipSimpleSandbox>
              </BaseChart>
              <BaseChart className=" my-5">
                <StackBarZ
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={req_sandbox_sold_sun_stats}
                  legend1={{ label: 'Land', color: [255, 207, 95] }}
                  keyTypes={['land', 'estate']}
                  barWidth={18}
                  isEth={true}
                  showMarkerType="sandbox"
                  limit={15}
                  options={[
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly',
                      value: 'quarterly',
                    },
                  ]}
                  optionsPrice={[
                    {
                      label: 'USD',
                      value: 'usd',
                    },
                    {
                      label: 'ETH',
                      value: 'eth',
                    },
                  ]}
                  tabState={tabState}
                ></StackBarZ>
              </BaseChart>
            </>
          </div>
        );
      }
      if (tabState === 'nftworlds') {
        return (
          <div className={cn('main-content')}>
            <>
              <BaseChart className=" my-5">
                <ChartLineSandBox
                  id={'chartline1'}
                  labelText={'AVERAGE PARCEL PRICE'}
                  dataHandlder={req_ntfworlds_avg_price_stats}
                  limit={15}
                  options={[
                    {
                      label: 'Daily price',
                      value: 'daily',
                    },
                    {
                      label: 'Monthly price',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly price',
                      value: 'quarterly',
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
                  tabState={tabState}
                ></ChartLineSandBox>
              </BaseChart>
              <BaseChart className=" my-5">
                <ChartLineToolTipSimpleSandbox
                  id={'dcl-chartline-2'}
                  labelText={'NUMBER OF PARCEL SALES'}
                  dataHandlder={req_ntfworlds_sold_total_stats}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
                  limit={15}
                  options={[
                    {
                      label: 'Daily',
                      value: 'daily',
                    },
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                  ]}
                  tabState={tabState}
                ></ChartLineToolTipSimpleSandbox>
              </BaseChart>
              <BaseChart className=" my-5">
                <StackBarZ
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={req_ntfworlds_sold_sum_stats}
                  legend1={{ label: 'Land', color: [255, 207, 95] }}
                  keyTypes={['land', 'estate']}
                  barWidth={18}
                  isEth={true}
                  showMarkerType="sandbox"
                  limit={15}
                  options={[
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly',
                      value: 'quarterly',
                    },
                  ]}
                  optionsPrice={[
                    {
                      label: 'USD',
                      value: 'usd',
                    },
                    {
                      label: 'ETH',
                      value: 'eth',
                    },
                  ]}
                  tabState={tabState}
                ></StackBarZ>
              </BaseChart>
            </>
          </div>
        );
      }
      if (tabState === 'worldwidewebb') {
        return (
          <div className={cn('main-content')}>
            <>
              <BaseChart className=" my-5">
                <ChartLineSandBox
                  id={'chartline1'}
                  labelText={'AVERAGE PARCEL PRICE'}
                  dataHandlder={req_webb_parcel_avg_price_stats}
                  limit={15}
                  options={[
                    {
                      label: 'Daily price',
                      value: 'daily',
                    },
                    {
                      label: 'Monthly price',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly price',
                      value: 'quarterly',
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
                  tabState={tabState}
                ></ChartLineSandBox>
              </BaseChart>
              <BaseChart className=" my-5">
                <ChartLineToolTipSimpleSandbox
                  id={'dcl-chartline-2'}
                  labelText={'NUMBER OF PARCEL SALES'}
                  dataHandlder={req_webb_sold_total_stats}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
                  limit={15}
                  options={[
                    {
                      label: 'Daily',
                      value: 'daily',
                    },
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                  ]}
                  tabState={tabState}
                ></ChartLineToolTipSimpleSandbox>
              </BaseChart>
              <BaseChart className=" my-5">
                <StackBarZ
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={req_webb_sold_sum_stats}
                  legend1={{ label: 'Land', color: [255, 207, 95] }}
                  keyTypes={['land', 'estate']}
                  barWidth={18}
                  isEth={true}
                  showMarkerType="sandbox"
                  limit={15}
                  options={[
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly',
                      value: 'quarterly',
                    },
                  ]}
                  optionsPrice={[
                    {
                      label: 'USD',
                      value: 'usd',
                    },
                    {
                      label: 'ETH',
                      value: 'eth',
                    },
                  ]}
                  tabState={tabState}
                ></StackBarZ>
              </BaseChart>
            </>
          </div>
        );
      }
      if (tabState === 'somniumspace') {
        return (
          <div className={cn('main-content')}>
            <>
              <BaseChart className=" my-5">
                <ChartLineSandBox
                  id={'chartline1'}
                  labelText={'AVERAGE PARCEL PRICE'}
                  dataHandlder={req_somniumspace__avg_price_stats}
                  limit={15}
                  options={[
                    {
                      label: 'Daily price',
                      value: 'daily',
                    },
                    {
                      label: 'Monthly price',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly price',
                      value: 'quarterly',
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
                  tabState={tabState}
                ></ChartLineSandBox>
              </BaseChart>
              <BaseChart className=" my-5">
                <ChartLineToolTipSimpleSandbox
                  id={'dcl-chartline-2'}
                  labelText={'NUMBER OF PARCEL SALES'}
                  dataHandlder={req_somniumspace_sold_total_stats}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
                  limit={15}
                  options={[
                    {
                      label: 'Daily',
                      value: 'daily',
                    },
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                  ]}
                  tabState={tabState}
                ></ChartLineToolTipSimpleSandbox>
              </BaseChart>
              <BaseChart className=" my-5">
                <StackBarZ
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={req_somniumspace_sold_sum_stats}
                  legend1={{ label: 'Land', color: [255, 207, 95] }}
                  keyTypes={['land', 'estate']}
                  barWidth={18}
                  isEth={true}
                  showMarkerType="sandbox"
                  limit={15}
                  options={[
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly',
                      value: 'quarterly',
                    },
                  ]}
                  optionsPrice={[
                    {
                      label: 'USD',
                      value: 'usd',
                    },
                    {
                      label: 'ETH',
                      value: 'eth',
                    },
                  ]}
                  tabState={tabState}
                ></StackBarZ>
              </BaseChart>
            </>
          </div>
        );
      }
      if (tabState === 'otherside') {
        return (
          <div className={cn('main-content')}>
            <>
              <BaseChart className=" my-5">
                <ChartLineSandBox
                  id={'chartline1'}
                  labelText={'AVERAGE PARCEL PRICE'}
                  dataHandlder={req_otherside_avg_price}
                  limit={15}
                  options={[
                    {
                      label: 'Daily price',
                      value: 'daily',
                    },
                    {
                      label: 'Monthly price',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly price',
                      value: 'quarterly',
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
                  tabState={tabState}
                ></ChartLineSandBox>
              </BaseChart>
              <BaseChart className=" my-5">
                <ChartLineToolTipSimpleSandbox
                  id={'dcl-chartline-2'}
                  labelText={'NUMBER OF PARCEL SALES'}
                  dataHandlder={req_otherside_sales_num}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
                  limit={15}
                  options={[
                    {
                      label: 'Daily',
                      value: 'daily',
                    },
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                  ]}
                  tabState={tabState}
                ></ChartLineToolTipSimpleSandbox>
              </BaseChart>
              <BaseChart className=" my-5">
                <StackBarZ
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={req_otherside_sales_amount}
                  legend1={{ label: 'Land', color: [255, 207, 95] }}
                  keyTypes={['land', 'estate']}
                  barWidth={18}
                  isEth={true}
                  showMarkerType="sandbox"
                  limit={15}
                  options={[
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly',
                      value: 'quarterly',
                    },
                  ]}
                  optionsPrice={[
                    {
                      label: 'USD',
                      value: 'usd',
                    },
                    {
                      label: 'ETH',
                      value: 'eth',
                    },
                  ]}
                  tabState={tabState}
                ></StackBarZ>
              </BaseChart>
            </>
          </div>
        );
      }
      if (tabState === 'netvrk') {
        return (
          <div className={cn('main-content')}>
            <>
              <BaseChart className=" my-5">
                <ChartLineSandBox
                  id={'chartline1'}
                  labelText={'AVERAGE PARCEL PRICE'}
                  dataHandlder={req_netvrk_avg_price}
                  limit={15}
                  options={[
                    {
                      label: 'Daily price',
                      value: 'daily',
                    },
                    {
                      label: 'Monthly price',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly price',
                      value: 'quarterly',
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
                  tabState={tabState}
                ></ChartLineSandBox>
              </BaseChart>
              <BaseChart className=" my-5">
                <ChartLineToolTipSimpleSandbox
                  id={'dcl-chartline-2'}
                  labelText={'NUMBER OF PARCEL SALES'}
                  dataHandlder={req_netvrk_sales_num}
                  legend1={{ label: 'Land', color: [33, 212, 115] }}
                  legend2={{ label: 'Estate', color: [255, 172, 95] }}
                  keyTypes={['land', 'estate']}
                  limit={15}
                  options={[
                    {
                      label: 'Daily',
                      value: 'daily',
                    },
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                  ]}
                  tabState={tabState}
                ></ChartLineToolTipSimpleSandbox>
              </BaseChart>
              <BaseChart className=" my-5">
                <StackBarZ
                  id={'stackbar1'}
                  labelText={'MONTHLY PARCEL SALES AMOUNT'}
                  dataHandler={req_netvrk_sales_amount}
                  legend1={{ label: 'Land', color: [255, 207, 95] }}
                  keyTypes={['land', 'estate']}
                  barWidth={18}
                  isEth={true}
                  showMarkerType="sandbox"
                  limit={15}
                  options={[
                    {
                      label: 'Monthly',
                      value: 'monthly',
                    },
                    {
                      label: 'Quarterly',
                      value: 'quarterly',
                    },
                  ]}
                  optionsPrice={[
                    {
                      label: 'USD',
                      value: 'usd',
                    },
                    {
                      label: 'ETH',
                      value: 'eth',
                    },
                  ]}
                  tabState={tabState}
                ></StackBarZ>
              </BaseChart>
            </>
          </div>
        );
      }
    }
  }, [
    error,
    dataSource,
    hasMore,
    loadMore,
    loading,
    totalPage,
    pageNumber,
    onPageChangeHandler,
    onRetry,
  ]);

  const init = React.useCallback(async () => {
    const data = await requestData({
      tab: tabState,
      subTab: subTabState,
      page: 1,
      query: searchText,
      type: typeState,
      needUpdateTypeList: true,
    });
    setDataSource(data);
  }, [props.query]);

  const initTopic = React.useCallback(async () => {
    try {
      setTopicList([]);
      const res = await getTopicList();
      const { list } = res.data;
      setTopicList(convert(list));
    } catch (err) {
      setError(true);
    }
  }, [null]);

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

  useEffect(() => {
    
    if (router) {
      // if( router.query.tab !=='decentraland'&& router.query.tab !=='cryptovoxels'&& router.query.tab !== 'oncyber'){
        let index = TAB.findIndex(item => {
          return item.type === router.query.tab
        })
        setFindIndex(index)
        isSwiper?.slideTo(index)
      // }
    
    }
    const tab = router.query.tab || 'cryptovoxels';
    const subTab = router.query.subTab || 'parcel';
    setTabState(tab);
    setSubTabState(subTab);
    onTabChange(tab);
  }, [router.query.tab,isSwiper]);


  const requestPersonal = React.useCallback(
    async (token: string) => {
      const res = await getBaseInfo(token);
      const data = resultHandler(res, requestPersonal);
      if (!data) {
        return;
      }
      const { profile } = data;
      state.setState({ profile });
    },
    [resultHandler],
  );

  React.useEffect(() => {
    setTypeState('All');
    // onTabChange('All')
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
      // window.location.href="移动端url";
    } else {
      // window.location.href="pc端url";
      // console.log('pc');
      // window.location.href = "http://www.taobao.com";
    }
    initTopic();
    init();
  }, [null]);
  const cls = cn('flex-1', style.bottomLine);
  return (
    <Page meta={meta}>
      <Layout>
        {/* {topicList.length > 0 ? (
          <>
            <div
              className={cn(
                'main-content flex justify-between items-center mt-5 text-white font-semibold',
                style.builders,
              )}
            >
              <div>BUILDERS</div>

              <div className={cn('flex items-center font-normal', style.more)}>
                <Link href={'/builders'}>more</Link>
                <img src="/images/tab-right.png"></img>
              </div>
            </div>
            <TopicCardList topics={topicList}></TopicCardList>
          </>
        ) : null} */}
        {/* <div className={cn(' bg-black', style.cls)}></div> */}
        <div className={style.containerBox} ref={headerRef}>
          <div className={cn('  myClassName', fixedState ? style.fix1 : null)} style={{ zIndex: "99999" }}>
            <PageHeader className="relative" active={'/parcels'} />
          </div>
          <div
            className={cn(
              'tab-list flex myClassName main-content relative',
              style.allHeight
              // fixedState ? style.aboslute : style.allHeight,
            )}
          >

            {fixedState === true ? <div className={offsetWidthNum <= 1200 ? style.headNumx : style.headNum}></div> : null}
            <div className={cn("flex px-0 relative", style.boxContainer)}>
              {/* <SwiperTagParcels {...typeListProto} onActive={onTypeChangeHandler} tags={typeListProto} label={typeState} /> */}
              <div
                className={cn(
                  'p absolute z-40 flex justify-start items-center',
                  {
                    hidden: tabPercent <= 0,
                  },
                  style.per,
                )}
              >
                <img className={style.icon} src="/images/tab-left.png"></img>
              </div>
              <Swiper
                modules={[Navigation]}
                spaceBetween={1}
                loop={true}
                centeredSlides={true}   
                onSwiper={(swiper)=>{
                  
                  setSwiper(swiper)
                }}
                slideToClickedSlide={true} 
                slidesPerView="auto"
                className={cn('w-full')}
                navigation={{
                  prevEl: '.p',
                  nextEl: '.n',
                }}
                onProgress={(swiper, progress) => {
                  setTabPercent(progress);
                }}
              >
                {TAB.map((item, index) => {
                  return (
                    <SwiperSlide
                      className={cn(
                        'box-border w-12 font-semibold text-white ',
                        style.baseCON,
                        tabState === item.type ? style.active : null,
                      )}
                      key={index}
                      onClick={() => {
                        onTabChange(item.type);
                      }}
                    >
                      <Tab
                        active={tabState === item.type}
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        isMini={true}
                      //          id="switch"
                      // className={style.aboslute}
                      // fixedS={fixedState}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <div
                className={cn(
                  'n absolute z-40  flex justify-end items-center',
                  {
                    hidden: tabPercent >= 1,
                  },
                  style.next,
                )}
              >
                <img className={style.icon} src="/images/tab-right.png"></img>
              </div>
              <div className={cls} />
            </div>
            <div className={cn('', style.boxCon, fixedState === true ? style.boxCon1 : null,
              offsetWidthNum <= 1200 ? style.boxCon2 : null)} >

              {/* {typeState === 'Free Space' ? (
                <Search text={searchText} onSearch={onSearchSpace}></Search>
              ) : null}
              {typeState === 'Scene' ? (
                <Search text={searchText} onSearch={onSearchScene}></Search>
              ) : null}
              {typeState !== 'Free Space' && typeState !== 'Scene' ?
                <Search text={searchText} onSearch={onSearchHandler}></Search>
                : null} */}
            </div>
          </div>
        </div>
        <div className="main-content">
          {/* <div className={cn('flex justify-between items-center ', style.contentHeader)}> */}
          {/* <div className="flex">
              {tabState === 'cryptovoxels'
                ? SUBTAB.map((item, index) => {
                    if (item) {
                      return (
                        <SecondTab
                          label={item.label}
                          key={item.label}
                          onClick={() => {
                            onSubTabChange(item.type);
                          }}
                          active={subTabState === item.type}
                        />
                      );
                    }
                    return null;
                  })
                : null}
              {tabState === 'decentraland'
                ? SUBTABDECE.map((item, index) => {
                    if (item) {
                      return (
                        <SecondTab
                          label={item.label}
                          key={item.label}
                          onClick={() => {
                            onSubTabChange(item.type);
                          }}
                          active={subTabState === item.type}
                        />
                      );
                    }
                    return null;
                  })
                : null}
              {tabState === 'nftworlds' ||
              tabState === 'worldwidewebb' ||
              // tabState === 'otherside' ||
              tabState === 'netvrk'
                ? SUBTABZ.map((item, index) => {
                    if (item) {
                      return (
                        <SecondTab
                          label={item.label}
                          key={item.label}
                          onClick={() => {
                            onSubTabChange(item.type);
                          }}
                          active={subTabState === item.type}
                        />
                      );
                    }
                    return null;
                  })
                : null}

              {tabState === 'sandbox' || tabState === 'somniumspace' || tabState === 'otherside'
                ? SUBTABZ2.map((item, index) => {
                    if (item) {
                      return (
                        <SecondTab
                          label={item.label}
                          key={item.label}
                          onClick={() => {
                            onSubTabChange(item.type);
                          }}
                          active={subTabState === item.type}
                        />
                      );
                    }
                    return null;
                  })
                : null}
            </div>
            {subTabState === 'parcel' ? (
              <Search text={searchText} onSearch={onSearchHandler}></Search>
            ) : null}
            {subTabState === 'space' ? (
              <Search text={searchText} onSearch={onSearchSpace}></Search>
            ) : null}
            {subTabState === 'scene' ? (
              <Search text={searchText} onSearch={onSearchScene}></Search>
            ) : null}
          </div> */}


          <div className={cn('', style.content)}>
            {/* {subTabState === 'parcel' && ( */}
            {tabState === 'cryptovoxels' || tabState === 'decentraland' ? (
              <div style={{ marginTop: "20px" }}>
                <SwiperTagParcels {...typeList} onActive={onTypeChangeHandler} tags={typeList} label={typeState} />
              </div>
            ) : ''}
            {tabState === 'mona' ? (
              <div style={{ marginTop: "20px" }}>
                <SwiperTagParcels {...typeListMona} onActive={onTypeChangeHandler} tags={typeListMona} label={typeState} />
              </div>
            ) : ''}
            {tabState === 'oncyber' ? (
              <div style={{ marginTop: "20px" }}>
                <SwiperTagParcels {...typeListOncyber} onActive={onTypeChangeHandler} tags={typeListOncyber} label={typeState} />
              </div>
            ) : ''}
            {tabState === 'protoworld' ? (
              <div style={{ marginTop: "20px" }}>
                <SwiperTagParcels {...typeListProto} onActive={onTypeChangeHandler} tags={typeListProto} label={typeState} />
              </div>
            ) : ''}
            {tabState === 'rarerooms' ? (
              <div style={{ marginTop: "20px" }}>
                <SwiperTagParcels {...typeListRare} onActive={onTypeChangeHandler} tags={typeListRare} label={typeState} />
              </div>
            ) : ''}
            {tabState === 'spatial' ? (
              <div style={{ marginTop: "20px" }}>
                <SwiperTagParcels {...typeListSpatial} onActive={onTypeChangeHandler} tags={typeListSpatial} label={typeState} />
              </div>
            ) : ''}
            {tabState === 'hyperfy' ? (
              <div style={{ marginTop: "20px" }}>
                <SwiperTagParcels {...typeListHyperfy} onActive={onTypeChangeHandler} tags={typeListHyperfy} label={typeState} />
              </div>
            ) : ''}
            {tabState === 'mozillaHubs' ? (
              <div style={{ marginTop: "20px" }}>
                <SwiperTagParcels {...typeListMozilla} onActive={onTypeChangeHandler} tags={typeListMozilla} label={typeState} />
              </div>
            ) : ''}
            {tabState === 'arium' ? (
              <div style={{ marginTop: "20px" }}>
                <SwiperTagParcels {...typeListArium} onActive={onTypeChangeHandler} tags={typeListArium} label={typeState} />
              </div>
            ) : ''}
            {tabState === 'artifex' ? (
              <div style={{ marginTop: "20px" }}>
                <SwiperTagParcels {...typeListArtifex} onActive={onTypeChangeHandler} tags={typeListArtifex} label={typeState} />
              </div>
            ) : ''}
            {tabState === 'sandbox' ? (
              <div style={{ marginTop: "20px" }}>
                <SwiperTagParcels {...typeListSandBox} onActive={onTypeChangeHandler} tags={typeListSandBox} label={typeState} />
              </div>
            ) : ''}
            {tabState === 'somniumspace' ? (
              <div style={{ marginTop: "20px" }}>
                <SwiperTagParcels {...typeListsomniumspace} onActive={onTypeChangeHandler} tags={typeListsomniumspace} label={typeState} />
              </div>
            ) : ''}
            {subTabState === 'space' && dataSource.length === 0 && <SpaceBuilding />}
            {subTabState === 'scene' && dataSource.length === 0 && <ScenceBuilding />}

            {subTabState === 'analytics' && (
              <a href={`/analytics?type=${tabState}`}>
                <div
                  className={cn(
                    'main-content flex justify-between items-center mt-5font-normal',
                    style.analytics,
                  )}
                >
                  <div>For more data, to Metaverse Analytics </div>

                  <div className={cn('flex items-center font-normal', style.analyticsMore)}>
                    GET MORE
                    <img className="ml-2" src="/images/tab-right.png"></img>
                  </div>
                </div>
              </a>
            )}
            {renderContent}
            {/* {console.log(dataSourceSomSpace, "datae")} */}

            {/* {loading?<><Status status="loading" /></>:null}
            {error?<><Status retry={onRetry} status="error" /></>:null}
            {dataSource.length === 0?<><Status status="empty" /></>:null}
            {tabState === 'cryptovoxels' || tabState === 'decentraland' ?
              <>
                <div
                  className={cn(
                    'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5',
                    style.bottomContent,
                  )}
                >
                  {
                    typeState === 'Free Space' || typeState === 'Scene' ?
                      <>
                        {dataSource.map((card, idx) => {
                          return <CardSpace {...card} typeState={typeState} key={idx}></CardSpace>;
                        })}
                      </>
                      : <>
                        {dataSource.map((card, idx) => {
                          return <Card {...card} typeState={typeState} key={uuid()}></Card>;
                        })}
                      </>
                  }


                </div>
                <div className={style.pagiNation}>
                  <PagiNation
                    total={totalPage}
                    pageNumber={pageNumber - 1}
                    pageSize={9}
                    pageChange={onPageChangeHandler}
                  />
                </div>
              </> : null
            }
            {tabState === 'somniumspace' ? 11111 : null} */}

          </div>
        </div>
        {subTabState === 'event' ? <TopJumper></TopJumper> : null}
      </Layout>
    </Page>
  );
}




export async function getServerSideProps({ locale = 'en-US', query }) {
  return {
    props: {
      messages: {
        ...require(`../../messages/common/${locale}.json`),
        ...require(`../../messages/index/${locale}.json`),
      },
      now: new Date().getTime(),
      locale,
      query,
    },
  };
}
