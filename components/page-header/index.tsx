import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

import { Toaster } from 'react-hot-toast';

import WalletBtn from '../wallet-btn';
import TwoNavigation from '../two_navigation';
import TwoNav from '../two_nav';
import { useRouter } from 'next/router';
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
    link: '/build/builders',
  },
  {
    label: 'Buildings',
    type: 'buildings',
    link: '/build/buildings',
  },
  {
    label: 'Space Buildings',
    type: 'spacebuildings',
    link: '/build/spacebuildings',
  },
];
const wearable = [
  {
    label: 'Creators',
    type: 'creators',
    link: '/wearables',
  },
  {
    label: 'WearableDao',
    type: 'wearabledao',
    link: '/wearables/wearabledao?type=chinesered',
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
]
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
];
const analyticsData = [
  {
    label: 'Overview',
    icon: '/images/logo.png',
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
  const [buildState, setBuildState] = React.useState(false);
  const [heatmapState, setHeatmapState] = React.useState(false);
  const [analyticState, setAnalyticState] = React.useState(false);
  const [ParcelsState, setParcelsState] = React.useState(false);
  const [wearableState, setWearableState] = React.useState(false);
  const [tabState, setTabState] = React.useState('cryptovoxels');
  const jumpToData = React.useCallback(() => {
    window.open('https://www.k1ic.com/cvb-zh.html');
  }, []);
  const router = useRouter();


  function myfun() {
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000);
    // router.replace(`/parcels?tab=cryptovoxels&subTab=${SUBTAB[subIndex].type}`)

  }
  
    const activeChange = async (type) => {
    setTimeout(() => {
      // window.location.reload();
    },1000 )
    console.log(analyticsData.findIndex(item => item.type === type));
    
    // let subIndex
    // setTabState(type);
    // if (type === 'cryptovoxels') {
    // console.log(type === 'cryptovoxels');
      
    // subIndex = analyticsData.findIndex(item => item.type === type)
    // } else if (tabState === "decentraland") {
    //   subIndex = analyticsData.findIndex(item => item.type === type)
    // }
    // console.log(tabState,subIndex);
    
  }
  
  function myfunData() {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  return (
    <header
      className={cn(
        'main-content h-full flex justify-center items-center p-5 pointer-events-none',
        style.base,
        className,
      )}
    >
      <div className="flex flex-grow items-center text-white font-bold text-3xl pointer-events-auto">
        <img className={cn('mr-4 bg-white', style.logo)} src="/images/logo.png"></img>
        <Link href="/" prefetch>
          METACAT
        </Link>
      </div>
      <div className="flex flex-grow justify-end">
        <div
          className={cn(
            'text-xl  text-gray-400 mx-14 cursor-pointer hover:text-white pointer-events-auto',
            active === '/' ? style.active : null,
          )}
        >
          <Link href="/" prefetch>
            Home
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
            'text-xl  text-gray-400 hover:text-white  mr-14  active:text-white cursor-pointer pointer-events-auto',
            active === 'analytics' ? style.active : null,
            style.z,
          )}
          // onClick={analyticsData}
          onMouseEnter={() => {
            setAnalyticState(true);
          }}
          onMouseLeave={() => {
            setAnalyticState(false);
          }}
        >
        <Link href="/analytics">Analytics</Link>
          {analyticState ? (
            <div onClick={activeChange}>
              <TwoNavigation
                options={analyticsData}
                className={style.cn1}
                location={style.location4}
              ></TwoNavigation>
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            'text-xl  text-gray-400 hover:text-white  mr-14  active:text-white cursor-pointer pointer-events-auto',
            active === 'heatmap' ? style.active : null,
          )}
          onMouseEnter={() => {
            setHeatmapState(true);
          }}
          onMouseLeave={() => {
            setHeatmapState(false);
          }}
        >
          <Link href={'/heatmap?type=cryptovoxels'} prefetch>
            Heatmap
          </Link>
          {heatmapState ? (
            <div >
               <TwoNavigation
               options={heatmapData}
               className={style.cn}
               location={style.location3}
              ></TwoNavigation>
            </div>
          ) : null}
        </div>

        {/* <div
          className={cn(
            'text-xl  text-gray-400 mr-14 cursor-pointer hover:text-white pointer-events-auto',
            active === '/parcels' ? style.active : null,
            style.z,
          )}
          onMouseEnter={() => {
            setParcelsState(true);
          }}
          onMouseLeave={() => {
            setParcelsState(false);
          }}
        >
          <Link href="/parcels" prefetch>Parcels</Link>
          {ParcelsState ? (
            <div onClick={myfunParcels}>
              <TwoNav
                options={parcels}
                className={style.cn}
                location={style.parcels}
              ></TwoNav>
            </div>
          ) : null}

        {/* </div> */}

        <div
          className={cn(
            'text-xl  text-gray-400 hover:text-white relative  mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'Build' ? style.active : null,
            style.z,
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
          Build
          {buildState ? (
            <TwoNavigation
              options={build}
              className={style.cn}
              location={style.location}
            ></TwoNavigation>
          ) : null}
        </div>

        <div
          className={cn(
            'text-xl  text-gray-400 hover:text-white relative  mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'wearables' ? style.active : null,
            style.z,
          )}
          onMouseEnter={() => {
            setWearableState(true);
          }}
          onMouseLeave={() => {
            setWearableState(false);
          }}
        >
          Wearables
          {wearableState ? (
            <TwoNavigation
              options={wearable}
              className={style.cn2}
              location={style.location2}
            ></TwoNavigation>
          ) : null}
        </div>
        <div
          className={cn(
            'text-xl  text-gray-400 hover:text-white  mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'learn' ? style.active : null,
          )}
        >
          <Link href={'/learn?type=articles'} prefetch>
            Learn
          </Link>
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
        <div
          className={cn(
            'text-xl font-medium text-gray-400 hover:text-white mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'builders' ? style.active : null,
          )}
        >
          <WalletBtn></WalletBtn>
        </div>

        <Toaster
          toastOptions={{
            duration: 2000,
            style: {
              background: 'rgba(0, 208, 236, 1)',
              color: 'black',
              borderRadius: 0,
            },
          }}
        />
      </div>
    </header>
  );
}
