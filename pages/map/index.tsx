import React from 'react';

import cn from 'classnames';

import dynamic from 'next/dynamic';
import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Footer from '../../components/footer';
import Tab from '../../components/tab';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import style from './index.module.css';

const Map = dynamic(() => import('../../components/map'), {
  ssr: false,
});

const meta = {
  title: `map - ${SITE_NAME}`,
  description: META_DESCRIPTION,
};

const TAB = [
  {
    label: 'Cryptovoxel',
    icon: '/images/Crypto Voxel.jpg',
    type: 'voxel',
  },
];

const legends = [
  {
    color: 'rgba(0, 240, 255, 1)',
    label: 'Top 20%',
  },
  {
    color: 'rgba(17, 156, 174, 1)',
    label: '21%-50%',
  },
  {
    color: 'rgba(3, 70, 79, 1)',
    label: '51%-80%',
  },
  {
    color: 'rgba(10, 34, 39, 1)',
    label: '81%-100%',
  },
];

export default function MapPage() {
  const cls = cn('flex-1', style.bottomLine);

  return (
    <Page className="min-h-screen" meta={meta}>
      <div className="bg-black relative">
        <PageHeader className="relative z-10" active={'map'} />
      </div>

      <div className={cn('tab-list flex mt-5', style.allHeight)}>
        <div className={cls}></div>
        <div className="main-content flex px-0">
          {TAB.map((item, index) => {
            return <Tab active={true} key={item.label} label={item.label} icon={item.icon} />;
          })}
          <div className={cls} />
        </div>
        <div className={cls} />
      </div>

      <div className={cn('w-full', style.mapContanier)}>
        <Map
          zoomControl={true}
          zoomLimit={[5, 7]}
          legends={legends}
          dragging={true}
          backColor="rgb(8 17 19)"
        ></Map>
      </div>
      <Footer />
    </Page>
  );
}
