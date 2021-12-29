import React from 'react';
import { useTranslations } from 'next-intl';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { SkipNavContent } from '@reach/skip-nav';

import { convert } from '../../common/utils';
import Smoke from '../../lib/somke';

// import Logo from './icons/icon-logo';
import PageHeader from '../page-header';
import Footer from '../footer';
import Carousel from '../carousel';

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

const test = [
  {
    imgUrl:
      'https://media-crvox.sfo2.digitaloceanspaces.com/0x195acaf2ccb5d388f4f5a03030ad765d74d94f3f/womps/1639464964429-5727956d-03dd-4363-936f-5a4763206df9.jpg',
    title: 'New eyes for the Sphinx...',
    detailUrl: 'https://www.cryptovoxels.com/play?coords=N@9W,296N,6F',
  },
  {
    imgUrl:
      'https://media-crvox.sfo2.digitaloceanspaces.com/0xa214384fd96d0883a4e4c75036c2863f0f5995f5/womps/1639464976791-9cf16de0-3ac3-4088-a5c9-2292fad8d0e0.jpg',
    title: 'happy holidays!',
    detailUrl: 'https://www.cryptovoxels.com/play?coords=@719E,660S',
  },
  {
    imgUrl: 'https://www.k1ic.com/imgs/cv_month_sold_sum.png',
    title: 'CV parcel monthly trade sum(ETH)',
    detailUrl: 'https://www.k1ic.com/cvb-zh.html',
  },
];

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
    Smoke('smoke');
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
                <div className={style.delive}></div>
                <div
                  className={cn('text-2xl mt-7 font-light', style.littleText)}
                >{`Metaverse Data Analytics & Content Navigation.`}</div>
              </div>
            </div>
            <div className={cn('image-round pointer-events-auto', style.roundImage)}>
              <Carousel imgs={carouselList}></Carousel>
            </div>
          </div>
          <canvas id="smoke" className="absolute w-full h-full top-0 left-0"></canvas>
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
