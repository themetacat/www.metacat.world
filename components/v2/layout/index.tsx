import React from 'react';
import { useTranslations } from 'next-intl';
import cn from 'classnames';
import Router, { useRouter } from 'next/router';
import { SkipNavContent } from '@reach/skip-nav';
import HeatMapCard from '../heatmap-card';

import { convert } from '../../../common/utils';

// import Logo from './icons/icon-logo';
import PageHeader from '../../top-navigation';
import Footer from '../../footer';
import Carousel from '../carousel';

import style from './index.module.css';

import { getHeatMapInfo } from '../../../service/v2';

const mediaData = [
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

const PriceMap = [
  'otherside',
  'decentraland',
  'sandbox',
  'somniumspace',
  'cryptovoxels',
  'substrata',
  'tz1and',
];

const Traffic = ['decentraland', 'cryptovoxels'];

type Props = {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
  layoutStyles?: any;
  fixed?: boolean;
  headerBgCls?: string;
  extra?: React.ReactNode;
};

export default function Layout({
  children,
  className,
  hideNav,
  layoutStyles,
  fixed = false,
  headerBgCls,
  extra,
}: Props) {
  const router = useRouter();
  const [carouselList, setCarouselList] = React.useState([]);
  const [trafficTags, setTrafficTags] = React.useState([]);
  const [fixedStateAll, setFixedStateAll] = React.useState(false);
  const [priceTags, setPriceTags] = React.useState([]);
  const { pathname } = router;
  const t = useTranslations('navigation');

  const jumpToMap = React.useCallback((item, mapType) => {
    window.open(`https://www.metacat.world${item.link}&static=${mapType}`); // https://www.metacat.world${item.link}&static=${mapType}
  }, []);

  const requsetHeatMapData = React.useCallback(async () => {
    const res = await getHeatMapInfo();
    const { heatmap_img } = res.data;
    setCarouselList(convert(heatmap_img));
  }, []);

  React.useEffect(() => {
    requsetHeatMapData();
    const arr1 = [];
    PriceMap.forEach((x) => {
      const m = mediaData.find((item) => item.type === x);
      if (m) {
        arr1.push(m);
      }
    });
    setPriceTags(arr1);

    const arr2 = [];
    Traffic.forEach((x) => {
      const m = mediaData.find((item) => item.type === x);
      if (m) {
        arr2.push(m);
      }
    });
    setTrafficTags(arr2);
  }, [null]);

  React.useEffect(() => {
    const listener = () => {
      if (
        document.getElementById('switch') &&
        // document.getElementById('switch').getBoundingClientRect().top <= 10 &&
        window.scrollY > 0
      ) {
        setFixedStateAll(true);
      } else {
        setFixedStateAll(false);
      }

    };
    document.addEventListener('scroll', listener);
    return () => document.removeEventListener('scroll', listener);
  }, [fixedStateAll]);

  return (
    <>
      {!hideNav &&  <div id="switch" className={cn('', fixedStateAll === true ? style.a : null)}> <PageHeader className=" relative fixed z-10" active={pathname} /></div>}
      <div className={cn('min-h-screen z-0', 'w-full')}>
        <div
          className={cn(
            headerBgCls,
            'relative z-10 h-22',
            {
              'fixed-center': fixed,
            },
            style.cover,
          )}
          style={{ zIndex: 1 }}
        >
          <div className={cn(' pt-20')}>
            <div className={cn(' text-white text-2xl font-bold flex main-content justify-start')}>
              Heatmap
            </div>
            <div className="flex main-content justify-between h-88 py-10 relative z-10">
              <div className="flex items-center" style={{ minHeight: '220px' }}>
                <div className="">
                  <HeatMapCard
                    tags={priceTags}
                    label={'Price Heatmap'}
                    className={'base-border mb-5'}
                    onActive={(ty) => {
                      jumpToMap(ty, 'price');
                    }}
                  ></HeatMapCard>
                  <HeatMapCard
                    tags={trafficTags}
                    label={'Traffic Heatmap'}
                    className={'base-border'}
                    onActive={(ty) => {
                      jumpToMap(ty, 'traffic');
                    }}
                  ></HeatMapCard>
                </div>
              </div>
              <div className={cn('image-round pointer-events-auto', style.roundImage)}>
                <Carousel imgs={carouselList}></Carousel>
              </div>
            </div>
          </div>
        </div>

        <div>
          <main style={layoutStyles}>
            <SkipNavContent />
            <div className={className}>{children}</div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
