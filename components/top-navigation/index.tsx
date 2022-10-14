import React, { useEffect } from 'react';
import Link from 'next/link';
import cn from 'classnames';

import { Toaster } from 'react-hot-toast';

import WalletBtn from '../wallet-btn';
import Search from '../searchHome';
import TwoNavigation from '../two_navigation';
import TwoNav from '../two_nav';
import style from './index.module.css';

type Props = {
  active?: string;
  className?: string;

};
// 首页 二级页
const build = [
  {
    label: 'Builders',
    type: 'builders',
    link: '/creater/builders',
  },
  {
    label: 'Buildings',
    type: 'buildings',
    link: '/creater/buildings',
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
];



export default function PageHeader({ active, className }: Props) {
  const headerRef = React.useRef(null)
  const [buildState, setBuildState] = React.useState(false);
  const [heatmapState, setHeatmapState] = React.useState(false);
  const [analyticState, setAnalyticState] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [ParcelsState, setParcelsState] = React.useState(false);
  const [wearableState, setWearableState] = React.useState(false);
  const [learnState, setLearnState] = React.useState(false);
  const [showStateVal, setShowStateVal] = React.useState(null);
  const [offsetWidthNum, setOffsetWidthNum] = React.useState(0);
  const jumpToData = React.useCallback(() => {
    window.open('https://www.k1ic.com/cvb-zh.html');
  }, []);

  const analyticsDataSet = () => {
    setAnalyticState(!analyticState)
  }
  const heatmapDataSet = () => {
    setHeatmapState(!heatmapState)
  }
  const placeDataSet = () => {
    setParcelsState(!ParcelsState)
  }

  const onSearchHandler = React.useCallback(
    async (text: string) => {
      setSearchText(text);
      // console.log(showStateVal,'sasd');

      // const data = await requestData({
      //   tab: tabState,
      //   subTab: subTabState,
      //   query: text,
      //   page: 1,
      //   type: typeState,
      //   needUpdateTypeList: true,
      // });

      // setDataSource(data);
    },
    []
  );
  useEffect(() => {

    setOffsetWidthNum(headerRef?.current?.clientWidth)
    // console.log(offsetWidthNum, 8898,);
    // console.log(offsetWidthNum <= 1200);
  }, [])
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
          style.header,
        )}
      >
        <div className={cn(" flex-flow", style.one, )}>
          {/* <img className={cn('mr-4 bg-white', style.logo)} src="/images/1.png"></img> */}
          <Link href="/" prefetch>
            <img className={cn('flex-flow', style.metaImg)} src="/images/imgConent/meta1.png"></img>
          </Link>
        </div>
        <div className={cn("flex flex-flow", style.headerTop, offsetWidthNum <= 1200 ? style.headsa : null, showStateVal === true ? style.showStateVal : null
        )}>
          <div
            className={cn(
              'text-xl  text-gray-400 cursor-pointer hover:text-white pointer-events-auto',
              active === '/' ? style.active : null, style.nameCon, style.rightCon1
            )}
          >
            <Link href="/" prefetch>
              <span className={cn('', active === '/' ? style.active : null,)}>Home</span>
            </Link>
          </div>
          {/* <div
          className={cn(
            'text-xl font-medium text-gray-400 mr-14 cursor-pointer hover:text-white pointer-events-auto',
            active === 'rent' ? style.active : null,
          )}
        >
          <Link href="/rent">Rent</Link>
        </div> */}
          <div
            className={cn(
              'text-xl flex text-gray-400 relative hover:text-white  active:text-white cursor-pointer pointer-events-auto',
              active === 'analytics' ? style.active : null,
              // analyticState === true ? style.active : null,
              style.z, style.nameCon, style.rightCon
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
              <span className={cn('', analyticState === true ? style.active : null, active === 'analytics' ? style.active : null,)}>Analytics</span>

            </Link>

            {
              analyticState === false ? <img src='/images/icon/shang.png' style={{ width: "15px", height: "20px", marginTop: "4px", marginLeft: "5.67px" }}></img> : null
            }
            {
              analyticState === true ? <img src='/images/icon/xia.png' style={{ width: "10px", height: "11px", marginTop: "6px", marginLeft: "10.67px" }}></img> : null
            }

            {analyticState ? (
              <TwoNav
                options={analyticsData}
                className={style.cn1}
                location={style.location4}
              ></TwoNav>
            ) : null}
          </div>

          <div
            className={cn(
              'text-xl flex text-gray-400 relative hover:text-white active:text-white cursor-pointer pointer-events-auto',
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
              <span className={cn('', heatmapState === true ? style.active : null, active === 'heatmap' ? style.active : null,)}>Heatmap</span>

            </Link>
            {
              heatmapState === false ? <img src='/images/icon/shang.png' style={{ width: "15px", height: "20px", marginTop: "4px", marginLeft: "5.67px" }}></img> : null
            }
            {
              heatmapState === true ? <img src='/images/icon/xia.png' style={{ width: "10px", height: "11px", marginTop: "6px", marginLeft: "10.67px" }}></img> : null
            }
            {heatmapState ? (
              <TwoNav options={heatmapData} className={style.cn} location={style.location3}></TwoNav>
            ) : null}
          </div>

          <div
            className={cn(
              'text-xl flex text-gray-400 relative cursor-pointer hover:text-white pointer-events-auto',
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
              <span className={cn('', ParcelsState === true ? style.active : null, active === '/parcels' ? style.active : null,)}>Place</span>
            </Link>

            {
              ParcelsState === false ? <img src='/images/icon/shang.png' style={{ width: "15px", height: "20px", marginTop: "4px", marginLeft: "5.67px" }}></img> : null
            }
            {
              ParcelsState === true ? <img src='/images/icon/xia.png' style={{ width: "10px", height: "11px", marginTop: "6px", marginLeft: "10.67px" }}></img> : null
            }

            {ParcelsState ? (
              // <TwoNav
              //   options={parcels}
              //   className={style.cn}
              //   location={style.parcels}
              // ></TwoNav>
              <TwoNavigation
                options={parcels}
                className={style.cn}
                location={style.parcels}
              ></TwoNavigation>
            ) : null}
          </div>

          <div
            className={cn(
              'text-xl flex  text-gray-400 hover:text-white relative active:text-white cursor-pointer pointer-events-auto',
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
            <Link href='/creater/builders' prefetch>
              <span className={cn('', buildState === true ? style.active : null, active === 'Build' ? style.active : null,)}>Creator</span>
            </Link>

            {
              buildState === false ? <img src='/images/icon/shang.png' style={{ width: "15px", height: "20px", marginTop: "4px", marginLeft: "5.67px" }}></img> : null
            }
            {
              buildState === true ? <img src='/images/icon/xia.png' style={{ width: "10px", height: "11px", marginTop: "6px", marginLeft: "10.67px" }}></img> : null
            }

            {buildState ? (
              <TwoNavigation
                options={build}
                className={style.cn}
                location={style.location}
              ></TwoNavigation>
            ) : null}
          </div>

          {/* <div
            className={cn(
              'text-xl flex  text-gray-400 hover:text-white relative  active:text-white cursor-pointer pointer-events-auto',
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
              'text-xl flex text-gray-400 relative hover:text-white active:text-white cursor-pointer pointer-events-auto',
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
              <span className={cn('', active === 'learn' ? style.active : null)}>Learn</span>
            </Link>


            {
              learnState === false ? <img src='/images/icon/shang.png' style={{ width: "15px", height: "20px", marginTop: "4px", marginLeft: "5.67px" }}></img> : null
            }
            {
              learnState === true ? <img src='/images/icon/xia.png' style={{ width: "10px", height: "11px", marginTop: "6px", marginLeft: "10.67px" }}></img> : null
            }

            {learnState ? (
              <TwoNavigation
                options={learnCon}
                className={style.cn2}
                location={style.locationLearn}
              ></TwoNavigation>
            ) : null}
          </div>
          {/* <div
          className={cn(
            'text-xl font-medium text-gray-400 hover:text-white  mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'learn' ? style.active : null,
          )}
        >
          <Link href={'/demo'} prefetch>
            demo
          </Link>
        </div> */}
          {/* <div
          className={cn(
            'text-xl font-medium text-gray-400 hover:text-white  mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'learn' ? style.active : null,
          )}
        >
          <Link href={'/demo'} prefetch>
            demo
          </Link>
        </div> */}

        </div>
        {/* {showStateVal === true ?
          <div
            className={cn(
              'text-xl font-medium text-gray-400 hover:text-white active:text-white cursor-pointer pointer-events-auto',
              active === 'builders' ? style.active : null,
              showStateVal === true ? style.connectBox1 : style.connectBox
            )}
          >

            <div className={cn('', style.imgIcon, offsetWidthNum <= 1200 ? style.imgIconNum : null)}> <Search text={searchText} showState={(x) => { setShowStateVal(x) }} onSearch={onSearchHandler}></Search></div>

            <div onClick={() => { setShowStateVal(false) }} className={cn('', style.closePop)}><img src='/images/close-pop.png'></img></div>
          </div>
          : <div onClick={() => { setShowStateVal(true) }} className={cn('', style.frame)}>  <img src='/images/Frame.png'></img></div>} */}
        {/* <div className={cn('', style.frame)}>  <img src='/images/Frame.png'></img></div> */}

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