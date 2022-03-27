import React from 'react';
import { useTranslations } from 'next-intl';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { SkipNavContent } from '@reach/skip-nav';
import Link from 'next/link';

import { convert } from '../../common/utils';

// import Logo from './icons/icon-logo';
import PageHeader from '../page-header';
import Footer from '../footer';
import Carousel from '../carousel';
import AnimationBack from '../animation-back';

import style from './index.module.less';

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
  const activeRoute = router.asPath;
  const { pathname } = router;
  const t = useTranslations('navigation');

  React.useEffect(() => {
    fetch('/api/carousel').then(async (res) => {
      const data = await res.json();

      const { list } = data.data || [];
      setCarouselList(convert(list));
    });
    // Smoke('smoke');
  }, [null]);

  return (
    <>
      <div className={cn('min-h-screen', 'w-full')}>
        <div
          className={cn(headerBgCls, 'relative z-10 h-22 bg-black', {
            'fixed-center': fixed,
          })}
          style={{ zIndex: 1 }}
        >
          {!hideNav && <PageHeader className="relative z-10" active={pathname} />}
          <div className="flex main-content justify-between h-88 py-10 relative z-10 pointer-events-none">
            <div className="flex items-center" style={{ minHeight: '220px' }}>
              <div className={cn('sign-mark-word text-white font-bold', style.headText)}>
                <div>CATCH DATA CATCH VALUE</div>
                <div
                  className={cn('text-2xl mt-5 font-light', style.littleText)}
                >{`Metaverse Data Analytics & Content Navigation.`}</div>
                <div
                  className={cn(
                    'text-xl font-semibold mt-7 flex justify-center items-center pointer-events-auto cursor-pointer',
                    style.gomap,
                  )}
                >
                  <Link href="/map?type=voxel">GO MAP</Link>
                </div>
              </div>
            </div>
            <div className={cn('image-round pointer-events-auto', style.roundImage)}>
              <Carousel imgs={carouselList}></Carousel>
            </div>
          </div>
          <AnimationBack className="absolute w-full h-full top-0 left-0"></AnimationBack>
          {/* <canvas id="smoke" className="absolute w-full h-full top-0 left-0"></canvas> */}
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
