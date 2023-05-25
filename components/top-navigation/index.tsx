


import React, { useEffect } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';

import WalletBtn from '../wallet-btn';
import Search from '../searchHome';
import TwoNavigation from '../two_navigation';
import TwoNav from '../two_nav';
import style from './index.module.css';


import { getSearchDetail } from '../../service';
import { req_sales_amount_percent } from '../../service/z_api';




type Props = {
  active?: string;
  className?: string;
  iconImgLight?: any;

};
// 首页 二级页
const build = [
  {
    label: 'Builders',
    type: 'builders',
    link: '/creation/builders',
  },
  {
    label: 'Buildings',
    type: 'buildings',
    link: '/creation/buildings',
  },
  {
    label: 'Wearable',
    type: 'wearable',
    link: '/creation/wearable?tab=cryptovoxels&page=1',
  },
  // {
  //   label: 'Space Buildings',
  //   type: 'spacebuildings',
  //   link: '/build/spacebuildings',
  // },
];
const wearable = [
  {
    label: 'Creators',
    type: 'creators',
    link: '/wearables',
  },
  {
    label: 'WearableDAO',
    type: 'wearabledao',
    link: '/wearables/wearabledao?type=chinesered',
  },
];
const learnCon = [
  {
    label: 'Insight',
    type: 'Insight',
    link: '/learn?type=articles',
  },
  {
    label: 'Report',
    type: 'Report',
    link: '/learn?type=report',
  },
  {
    label: 'Others',
    type: 'Others',
    link: '/learn?type=others',
  },
];
const parcels = [
  {
    label: 'Voxels',
    type: 'voxelsParcels',
    link: '/parcels?tab=cryptovoxels',
    icon: '/images/cvLogo.png',
  },
  {
    label: 'Decentraland',
    type: 'decentraParcels',
    link: '/parcels?tab=decentraland',
    icon: '/images/Decentraland.jpg',
  },
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
    label: 'MoCA',
    icon: 'https://rooms.museumofcryptoart.com/_next/static/media/moca-logo.d31b8d61.svg',
    type: 'moca',
    link: '/parcels?tab=moca',
  },
  {
    label: 'Swivelmeta',
    icon: 'https://uploads-ssl.webflow.com/6264fde21ad96bbae92b6810/627e74272361a5f78c4beb54_Favicon%20Logo_SwivelMeta_32x32.png',
    type: 'swivelmeta',
    link: '/parcels?tab=swivelmeta',
  },
  {
    label: 'Muse',
    icon: 'https://www.muse.place/favicon-32x32.png',
    type: 'muse',
    link: '/parcels?tab=muse',
  },
  {
    label: 'Createra',
    icon: 'https://createra.fun/activities/news/official.jpg',
    type: 'createra',
    link: '/parcels?tab=createra',
  },
  {
    label: 'Viverse',
    icon: 'https://www.viverse.com/images/viverse-logo-newS.svg',
    type: 'viverse',
    link: '/parcels?tab=viverse',
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
    label: 'Rarerooms',
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
  {
    label: 'NiftyIsland',
    icon: '/images/NiftyIsland.png',
    type: 'niftyIsland',
    link: '/parcels?tab=niftyIsland',
  },
  {
    label: 'Substrata',
    icon: '/images/substrata.png',
    type: 'substrata',
    link: '/parcels?tab=substrata',
  },
  {
    label: 'PlayerOne',
    icon: '/images/PlayerOne.png',
    type: 'playerOne',
    link: '/parcels?tab=playerOne',
  },
  {
    label: 'W3rld',
    icon: 'https://pbs.twimg.com/profile_images/1603344186488623108/ed9A-3hx_400x400.jpg',
    type: 'w3rld',
    link: '/parcels?tab=w3rld',
  },
];
const eventList = [
  {
    label: 'Voxels',
    type: 'voxelsParcels',
    link: '/event?tab=cryptovoxels',
    icon: '/images/cvLogo.png',
  },
  {
    label: 'Decentraland',
    type: 'decentraParcels',
    link: '/event?tab=decentraland',
    icon: '/images/Decentraland.jpg',
  },
  {
    label: 'Somnium Space',
    icon: '/images/somniumspace.png',
    type: 'somniumspace',
    link: '/event?tab=somniumspace',
  },
];
const heatmapData = [
  {
    label: 'Otherside',
    icon: '/images/osd.png',
    type: 'otherside',
    link: '/heatmap?type=otherside',
  },
  {
    label: 'The Sandbox',
    icon: '/images/home-icon.svg',
    type: 'sandbox',
    link: '/heatmap?type=sandbox',
  },
  {
    label: 'Decentraland',
    icon: '/images/Decentraland.jpg',
    type: 'decentraland',
    link: '/heatmap?type=decentraland',
  },
  {
    label: 'Voxels',
    icon: '/images/cvLogo.png',
    type: 'cryptovoxels',
    link: '/heatmap?type=cryptovoxels',
  },
  {
    label: 'Somnium Space',
    icon: '/images/somniumspace.png',
    type: 'somniumspace',
    link: '/heatmap?type=somniumspace',
  },
  {
    label: 'SubStrata',
    icon: '/images/substrata.png',
    type: 'substrata',
    link: '/heatmap?type=substrata',
  },
  {
    label: 'Tz1and',
    icon: '/images/tz1and.png',
    type: 'tz1and',
    link: '/heatmap?type=tz1and',
  },
];
const analyticsData = [
  {
    label: 'Overview',
    icon: '/images/1.png',
    type: 'overview',
    link: '/analytics',
  },
  {
    label: 'Otherside',
    icon: '/images/osd.png',
    type: 'otherside',
    link: '/analytics?type=otherside',
  },
  {
    label: 'The Sandbox',
    icon: '/images/home-icon.svg',
    type: 'sandbox',
    link: '/analytics?type=sandbox',
  },
  {
    label: 'NFT Worlds',
    icon: '/images/worlds.svg',
    type: 'nftworlds',
    link: '/analytics?type=nftworlds',
  },
  {
    label: 'Decentraland',
    icon: '/images/Decentraland.jpg',
    type: 'decentraland',
    link: '/analytics?type=decentraland',
  },

  {
    label: 'Worldwide Webb',
    icon: '/images/unnamed.svg',
    type: 'worldwidewebb',
    link: '/analytics?type=worldwidewebb',
  },
  {
    label: 'Voxels',
    icon: '/images/cvLogo.png',
    type: 'cryptovoxels',
    link: '/analytics?type=cryptovoxels',
  },
  {
    label: 'Somnium Space',
    icon: '/images/somniumspace.png',
    type: 'somniumspace',
    link: '/analytics?type=somniumspace',
  },
  {
    label: 'Netvrk',
    icon: '/images/netvrk_logomark.svg',
    type: 'netvrk',
    link: '/analytics?type=netvrk',
  },
  {
    label: 'Aavegotchi',
    icon: 'https://www.aavegotchi.com/img/brand/sun.png',
    type: 'aavegotchi',
    link: '/analytics?type=aavegotchi',
  },
  {
    label: 'PlayerOne',
    icon: '/images/PlayerOne.png',
    type: 'playerOne',
    link: '/analytics?type=playerOne',
  },
 
 
];

// const routerTab = [
//    "Place"
//   ,
//    "Event"
//   ,
//    "Creation"
//   , "Learn"

// ]



export default function PageHeader({ active, className, iconImgLight }: Props) {
  const headerRef = React.useRef(null)
  const [buildState, setBuildState] = React.useState(false);
  const [heatmapState, setHeatmapState] = React.useState(false);
  const [analyticState, setAnalyticState] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [ParcelsState, setParcelsState] = React.useState(false);
  const [EventState, setEventState] = React.useState(false);
  const [wearableState, setWearableState] = React.useState(false);
  const [learnState, setLearnState] = React.useState(false);
  const [showStateVal, setShowStateVal] = React.useState(null);
  const [offsetWidthNum, setOffsetWidthNum] = React.useState(0);
  const [offsetHeighthNum, setOffsetHeightNum] = React.useState(0);
  const [darkLight, setDarkLight] = React.useState(false);
  useEffect(() => {
    const darkBackColor = window.localStorage.getItem("darkLight") === "true";

    setDarkLight(darkBackColor)
  }, [darkLight])
  const jumpToData = React.useCallback(() => {
    window.open('https://www.k1ic.com/cvb-zh.html');
  }, []);

  // console.log(searchText,999999999999999);

  // const onSearchHandler = (query: string,
  //   page: number,
  //   per_page: number,
  //   search_item: string) => {
  //   // console.log(888);
  //   // const res = getSearchDetail(searchText ||query, page, per_page, search_item);
  //   // console.log(res, "res");
  // }

  // const onSearchHandler = React.useCallback(
  //   async (query = '', text: string) => {
  //     console.log("66666666666");

  //     setSearchText(text);
  //     // console.log(showStateVal,'sasd');
  //     // console.log(getSearchDetail('metaverse'),"metaverse");
  //     const res = await getSearchDetail("metaverse");
  //     console.log(res, "res");

  //     // const { parcel_list, total_page, type_total, page: currentPage } = res.data;
  //     // const data = await requestData({
  //     //   tab: tabState,
  //     //   subTab: subTabState,
  //     //   query: text,
  //     //   page: 1,
  //     //   type: typeState,
  //     //   needUpdateTypeList: true,
  //     // });

  //     // setDataSource(data);
  //   },
  //   []
  // );
  const btnDark = () => {
    if (darkLight === false) {
      window.localStorage.setItem("darkLight", 'true')
      setDarkLight(true)
      iconImgLight(true)
    } else {
      window.localStorage.setItem("darkLight", 'false')
      setDarkLight(false)
      iconImgLight(false)
    }
  }

  useEffect(() => {


    setOffsetWidthNum(headerRef?.current?.clientWidth)
    setOffsetHeightNum(window.screen.availHeight)
    // console.log(offsetWidthNum, 8898,);
    // console.log(offsetWidthNum <= 1200);
  }, [offsetHeighthNum, darkLight])
  return (
    <header
      className={cn('w-full flex flex-glow items-start ',
        style.head,
      )}
      ref={headerRef}
    >
      <div
        className={cn(
          ' flex items-center  w-full flex-flow',
          darkLight === true ? style.header1 : style.header,
        )}
      >
        <div className={cn(" flex-flow", style.one,)}>
          {/* <img className={cn('mr-4 bg-white', style.logo)} src="/images/1.png"></img> */}
          <Link href="/" prefetch>
            <img className={cn('flex-flow', style.metaImg)} src={darkLight === false ? "/images/imgConent/meta1.png" : '/images/imgConent/meta2.png'}></img>
          </Link>
        </div>
        <div className={cn("flex flex-flow", style.headerTop, offsetWidthNum <= 1200 ? style.headsa : null, showStateVal === true ? style.showStateVal : null
        )}>
          <div
            className={cn(
              'text-xl  text-gray-400 cursor-pointer  pointer-events-auto',
              active === '/' ? style.active1 : null, style.nameCon, style.rightCon1
            )}
          >
            <Link href="/" prefetch>
              <span className={cn('', active === '/' && darkLight === true ? style.active1 : null, darkLight === true ? style.rightConHover : null)}>Home</span>
            </Link>
          </div>
          {/* <div
          className={cn(
            'text-xl font-medium text-gray-400 mr-14 cursor-pointer  pointer-events-auto',
            active === 'rent' ? style.active : null,
          )}
        >
          <Link href="/rent">Rent</Link>
        </div> */}
          <div
            className={cn(
              'text-xl flex text-gray-400 relative cursor-pointer pointer-events-auto',
              active === 'analytics' ? style.active : null,
              // analyticState === true ? style.active : null,
              style.z, style.nameCon, style.rightCon,

            )}
            // onClick={analyticsDataSet}
            onMouseEnter={() => {
              setAnalyticState(true);
            }}
            onMouseLeave={() => {
              setAnalyticState(false);
            }}
          >

            <Link href={'/analytics'} prefetch>
              <span className={cn('', analyticState === true && darkLight === true ? style.active1 : null, active === 'analytics' && darkLight === true ? style.active1 : null, darkLight === true ? style.rightConHover : null)} >Analytics</span>

            </Link>

            <img src={analyticState === true ? '/images/Frame-up.png' : '/images/Frame-down.png'} style={{ width: "12px", height: "15px", marginTop: "8px", marginLeft: "5.67px" }}></img>
            {/* {
              analyticState === true? <img src= style={{ width: "10px", height: "11px", marginTop: "6px", marginLeft: "10.67px" }}></img> : null
            } */}

            {analyticState ? (
              <TwoNav
                iconImgLight={darkLight}
                options={analyticsData}
                className={style.cn1}
                location={darkLight === true ? style.locationAnalyticState : style.location4}
              ></TwoNav>
            ) : null}
          </div>

          <div
            className={cn(
              'text-xl flex text-gray-400 relative  active:text-white cursor-pointer pointer-events-auto',
              active === 'heatmap' ? style.active : null, style.nameCon, style.rightCon
            )}
            // onClick={heatmapDataSet}
            onMouseEnter={() => {
              setHeatmapState(true);
            }}
            onMouseLeave={() => {
              setHeatmapState(false);
            }}
          >
            <Link href={'/heatmap?type=cryptovoxels'} prefetch>
              <span className={cn('', heatmapState === true && darkLight === true ? style.active1 : null, active === 'heatmap' && darkLight === true ? style.active1 : null, darkLight === true ? style.rightConHover : null)}>Heatmap</span>

            </Link>
            <img src={heatmapState === true ? '/images/Frame-up.png' : '/images/Frame-down.png'} style={{ width: "12px", height: "15px", marginTop: "8px", marginLeft: "5.67px" }}></img>
            {/* {
              heatmapState === false ? <img src='/images/icon/shang.png' style={{ width: "15px", height: "20px", marginTop: "8px", marginLeft: "5.67px" }}></img> : null
            }
            {
              heatmapState === true ? <img src='/images/icon/xia.png' style={{ width: "10px", height: "11px", marginTop: "6px", marginLeft: "10.67px" }}></img> : null
            } */}
            {heatmapState ? (
              <TwoNav iconImgLight={darkLight} options={heatmapData} className={style.cn} location={darkLight === true ?style.location3State:style.location3}></TwoNav>
            ) : null}
          </div>

          <div
            className={cn(
              'text-xl flex text-gray-400 relative cursor-pointer  pointer-events-auto',
              active === '/parcels' ? style.active : null,
              style.z, style.nameCon, style.rightCon
            )}
            onMouseEnter={() => {
              setParcelsState(true);
            }}
            onMouseLeave={() => {
              setParcelsState(false);
            }}
          // onClick={placeDataSet}
          >
            <Link href="/parcels?tab=cryptovoxels" prefetch>
              <span className={cn('', ParcelsState === true && darkLight === true ? style.active1 : null, active === '/parcels' && darkLight === true ? style.active1 : null, darkLight === true ? style.rightConHover : null)}>Place</span>
            </Link>
            <img src={ParcelsState === true ? '/images/Frame-up.png' : '/images/Frame-down.png'} style={{ width: "12px", height: "15px", marginTop: "8px", marginLeft: "5.67px" }}></img>
            {/* {
              ParcelsState === false ? <img src='/images/icon/shang.png' style={{ width: "15px", height: "20px", marginTop: "8px", marginLeft: "5.67px" }}></img> : null
            }
            {
              ParcelsState === true ? <img src='/images/icon/xia.png' style={{ width: "10px", height: "11px", marginTop: "6px", marginLeft: "10.67px" }}></img> : null
            } */}

            {ParcelsState ? (
              // <TwoNav
              //   options={parcels}
              //   className={style.cn}
              //   location={style.parcels}
              // ></TwoNav>
              <TwoNavigation
                iconImgLight={darkLight}
                options={parcels}
                className={style.cn}
                location={darkLight === true ?style.parcels1: style.parcels}
              ></TwoNavigation>
            ) : null}
          </div>

          <div
            className={cn(
              'text-xl flex text-gray-400 relative cursor-pointer  pointer-events-auto',
              active === '/event' ? style.active : null,
              style.z, style.nameCon, style.rightCon
            )}
            onMouseEnter={() => {
              setEventState(true);
            }}
            onMouseLeave={() => {
              setEventState(false);
            }}
          // onClick={placeDataSet}  
          >
            <Link href="/event?tab=cryptovoxels" prefetch>
              <span className={cn('', EventState === true && darkLight === true ? style.active1 : null, active === '/event' && darkLight === true ? style.active1 : null, darkLight === true ? style.rightConHover : null)}>Event</span>
            </Link>
            <img src={EventState === true ? '/images/Frame-up.png' : '/images/Frame-down.png'} style={{ width: "12px", height: "15px", marginTop: "8px", marginLeft: "5.67px" }}></img>

            {/* {
              EventState === false ? <img src='/images/icon/shang.png' style={{ width: "15px", height: "20px", marginTop: "8px", marginLeft: "5.67px" }}></img> : null
            }
            {
              EventState === true ? <img src='/images/icon/xia.png' style={{ width: "10px", height: "11px", marginTop: "6px", marginLeft: "10.67px" }}></img> : null
            } */}

            {EventState ? (
              // <TwoNav
              //   options={parcels}
              //   className={style.cn}
              //   location={style.parcels}
              // ></TwoNav>
              <TwoNavigation
              iconImgLight={darkLight}
                options={eventList}
                className={style.cn}
                location={darkLight === true ?style.eventListState:style.eventList}
              ></TwoNavigation>
            ) : null}
          </div>

          <div
            className={cn(
              'text-xl flex  text-gray-400  relative active:text-white cursor-pointer pointer-events-auto',
              active === 'Build' ? style.active : null,
              style.z, style.nameCon, style.rightCon
            )}
            // onClick={() => {
            //   setBuildState(!buildState);
            // }}
            onMouseEnter={() => {
              setBuildState(true);
            }}
            onMouseLeave={() => {
              setBuildState(false);
            }}
          >
            <Link href='/creation/builders' prefetch>
              <span className={cn('', buildState === true && darkLight === true ? style.active1 : null, active === 'Build' && darkLight === true ? style.active1 : null, darkLight === true ? style.rightConHover : null)}>Creation</span>
            </Link>
            <img src={buildState === true ? '/images/Frame-up.png' : '/images/Frame-down.png'} style={{ width: "12px", height: "15px", marginTop: "8px", marginLeft: "5.67px" }}></img>
            {/* {
              buildState === false ? <img src='/images/icon/shang.png' style={{ width: "15px", height: "20px", marginTop: "8px", marginLeft: "5.67px" }}></img> : null
            }
            {
              buildState === true ? <img src='/images/icon/xia.png' style={{ width: "10px", height: "11px", marginTop: "6px", marginLeft: "10.67px" }}></img> : null
            } */}

            {buildState ? (
              <TwoNavigation
              iconImgLight={darkLight}
                options={build}
                className={style.cn}
                location={darkLight === true ?style.locationState:style.location}
              ></TwoNavigation>
            ) : null}
          </div>

          {/* <div
            className={cn(
              'text-xl flex  text-gray-400  relative  active:text-white cursor-pointer pointer-events-auto',
              active === 'wearables' ? style.active : null,
              style.z, style.nameCon, style.rightCon
            )}
            // onClick={() => {
            //   setWearableState(!wearableState);
            // }}
            onMouseEnter={() => {
              setWearableState(true);
            }}
            onMouseLeave={() => {
              setWearableState(false);
            }}
          >
            <Link href={'/wearables'} prefetch>
              <span className={cn('', wearableState === true ? style.active : null, active === 'wearables' ? style.active : null,)}>Wearables</span>
            </Link>
            {
              wearableState === false ? <img src='/images/icon/shang.png' style={{ width: "15px", height: "20px", marginTop: "4px", marginLeft: "5.67px" }}></img> : <img src='/images/icon/xia.png' style={{ width: "10px", height: "11px", marginTop: "6px", marginLeft: "10.67px" }}></img>
            }
            {wearableState ? (
              <TwoNavigation
                options={wearable}
                className={style.cn2}
                location={style.location2}
              ></TwoNavigation>
            ) : null}
          </div> */}
          <div
            className={cn(
              'text-xl flex text-gray-400 relative  active:text-white cursor-pointer pointer-events-auto',
              active === 'learn' ? style.active : null,
              style.nameCon
            )}
            onMouseEnter={() => {
              setLearnState(true);
            }}
            onMouseLeave={() => {
              setLearnState(false);
            }}
          >
            <Link href={'/learn?type=articles'} prefetch>
              <span className={cn('', learnState === true && darkLight === true ? style.active1 : null, active === 'learn' && darkLight === true ? style.active1 : null, darkLight === true ? style.rightConHover : null)}>Learn</span>
            </Link>

            <img src={learnState === true ? '/images/Frame-up.png' : '/images/Frame-down.png'} style={{ width: "12px", height: "15px", marginTop: "8px", marginLeft: "5.67px" }}></img>
            {/* {
              learnState === false ? <img src='/images/icon/shang.png' style={{ width: "15px", height: "20px", marginTop: "4px", marginLeft: "5.67px" }}></img> : null
            }
            {
              learnState === true ? <img src='/images/icon/xia.png' style={{ width: "10px", height: "11px", marginTop: "6px", marginLeft: "10.67px" }}></img> : null
            } */}

            {learnState ? (
              <TwoNavigation
              iconImgLight={darkLight}
                options={learnCon}
                className={style.cn2}
                location={darkLight === true ?style.locationLearnState:style.locationLearn}
              ></TwoNavigation>
            ) : null}
          </div>
          {/* <div
          className={cn(
            'text-xl font-medium text-gray-400   mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'learn' ? style.active : null,
          )}
        >
          <Link href={'/demo'} prefetch>
            demo
          </Link>
        </div> */}
          {/* <div
          className={cn(
            'text-xl font-medium text-gray-400   mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'learn' ? style.active : null,
          )}
        >
          <Link href={'/demo'} prefetch>
            demo
          </Link>
        </div> */}

        </div>
        {showStateVal === true ?
          <div
            className={cn(
              'text-xl font-medium text-gray-400  active:text-white cursor-pointer pointer-events-auto',
              active === 'builders' ? style.active : null,
              showStateVal === true ? style.connectBox1 : style.connectBox
            )}
          >

            <div className={cn('', style.imgIcon, offsetWidthNum <= 1200 ? style.imgIconNum : null)}> <Search setTypeVal={'Place' || 'Event' || 'Creation' || 'Learn'} text={searchText} showState={(x) => { setShowStateVal(x) }}  ></Search></div>

            <div onClick={() => { setShowStateVal(false) }} className={cn('', style.closePop)}><img src='/images/close-pop.png'></img></div>
          </div>
          : <div onClick={() => { setShowStateVal(true) }} className={cn('', style.frame)}>  <img src='/images/Frame.png'></img></div>}
        {/* <div className={cn('', style.frame)}>  <img src='/images/Frame.png'></img></div> */}
        {
          darkLight === true ? <img onClick={btnDark} className={cn('', style.iconImgSun)} src="/images/moon.png" alt="" /> : <img onClick={btnDark} className={cn('', style.iconImg)} src="/images/sunLight.png" alt="" />
        }
        <div className={cn('', style.wallbtn)}><WalletBtn></WalletBtn></div>
        <Toaster
          toastOptions={{
            duration: 2000,
            style: {
              background: 'rgba(0, 208, 236, 1)',
              color: 'black',
              borderRadius: 0,
              justifyContent: "end"
            },
          }}
        />
      </div>

    </header>
  );
}