import React from 'react';
import { useTranslations } from 'next-intl';
import cn from 'classnames';
import Router, { useRouter } from 'next/router';
import { SkipNavContent } from '@reach/skip-nav';
import HeatMapCard from '../heatmap-card';

import { convert } from '../../../common/utils';

// import Logo from './icons/icon-logo';
import PageHeader from '../page-header';
import Footer from '../../footer';
import Carousel from '../carousel';

import style from './index.module.css';

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
];

const PriceMap = [
  'otherside',
  'decentraland',
  'sandbox',
  'somniumspace',
  'cryptovoxels',
  'substrata',
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
  const [priceTags, setPriceTags] = React.useState([]);
  const { pathname } = router;
  const t = useTranslations('navigation');

  const jumpToMap = React.useCallback((item) => {
    Router.push(item.link);
  }, []);

  React.useEffect(() => {
    fetch('/api/carousel').then(async (res) => {
      const data = await res.json();

      const { list } = data.data || [];
      setCarouselList(convert(list));
    });

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

  return (
    <>
      <div className={cn('min-h-screen', 'w-full')}>
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
          {!hideNav && <PageHeader className="relative z-10" active={pathname} />}
          <div className={cn('pt-12')}>
            <div className={cn(' text-white text-2xl font-bold flex main-content justify-start')}>
              Heatmap
            </div>
            <div className="flex main-content justify-between h-88 py-10 relative z-10">
              <div className="flex items-center" style={{ minHeight: '220px' }}>
                <div className="">
                  <HeatMapCard
                    tags={priceTags}
                    label={'Price HeatMap'}
                    className={'base-border mb-5'}
                    onActive={jumpToMap}
                  ></HeatMapCard>
                  <HeatMapCard
                    tags={trafficTags}
                    label={'Traffic HeatMap'}
                    className={'base-border'}
                    onActive={jumpToMap}
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
