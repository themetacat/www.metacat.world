import React, { useRef } from 'react';

import cn from 'classnames';

import dynamic from 'next/dynamic';
import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Footer from '../../components/footer';
import Tab from '../../components/tab';
import Status from '../../components/status';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import style from './index.module.css';

const Map = dynamic(() => import('../../components/map'), {
  ssr: false,
});

const meta = {
  title: `Map - ${SITE_NAME}`,
  description: META_DESCRIPTION,
};

const TAB = [
  {
    label: 'Cryptovoxel',
    icon: '/images/Crypto Voxel.jpg',
    type: 'voxel',
  },
];

export default function MapPage() {
  const cls = cn('flex-1', style.bottomLine);

  const [fullScreen, setFullScreen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const showFull = React.useCallback(
    (x) => {
      setFullScreen(x);
    },
    [null],
  );

  return (
    <Page className="min-h-screen" meta={meta}>
      {fullScreen ? null : (
        <>
          <div className="bg-black relative">
            <PageHeader className="relative z-10" active={'map'} />
          </div>

          <div className={cn('tab-list flex mt-5', style.allHeight)}>
            <div className={cls}></div>
            <div className="main-content flex px-0">
              {TAB.map((item, index) => {
                return (
                  <Tab
                    active={true}
                    isMini={true}
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                  />
                );
              })}
              <div className={cls} />
            </div>
            <div className={cls} />
          </div>
        </>
      )}

      <div
        className={cn(
          'relative w-full flex justify-center items-center',
          fullScreen ? style.full : style.mapContanier,
        )}
      >
        {loading ? (
          <div className="w-max">
            <Status status="loading" />
          </div>
        ) : (
          <Map
            fullScreenOnClick={showFull}
            zoomControl={true}
            zoomLimit={[5, 9]}
            dragging={true}
            initZoom={6}
            loadFinish={() => {
              setLoading(false);
            }}
            backColor="rgb(8 17 19)"
          ></Map>
        )}
      </div>
      {fullScreen ? null : <Footer />}
    </Page>
  );
}