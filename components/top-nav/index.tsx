


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
    link: '/creation/wearable?tab=cryptovoxels',
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



export default function topNav({ active, className, iconImgLight }: Props) {
  const router = useRouter();
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


  useEffect(() => {


    setOffsetWidthNum(headerRef?.current?.clientWidth)
    setOffsetHeightNum(window.screen.availHeight)
    // console.log(offsetWidthNum, 8898,);
    // console.log(offsetWidthNum <= 1200);
  }, [offsetHeighthNum])
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
        <div className={cn(" flex-flow", style.one,)}>
          {/* <img className={cn('mr-4 bg-white', style.logo)} src="/images/1.png"></img> */}
          <Link href="/" prefetch>
            <img className={cn('flex-flow', style.metaImg)} src={"/images/imgConent/meta1.png"}></img>
          </Link>
        </div>
      
      </div>

    </header>
  );
}