import React, { useEffect } from 'react';

import cn from 'classnames';

import dynamic from 'next/dynamic';

import { useRouter } from 'next/router';

import Page from '../../components/page';
// import PageHeader from '../../components/top-navigation';
import PageHeader from '../../components/top-nav';
import Footer from '../../components/footer';
import Tab from '../../components/tab';
import Status from '../../components/status';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import style from './index.module.css';

const Map = dynamic(() => import('../../components/map'), {
  ssr: false,
});
const OthersideMap = dynamic(() => import('../../components/otherside-map'), {
  ssr: false,
});

const TzLandMap = dynamic(() => import('../../components/tzland-map'), {
  ssr: false,
});

const DecentralandMap = dynamic(() => import('../../components/decentraland-map'), {
  ssr: false,
});

const SandboxMap = dynamic(() => import('../../components/sandbox-map'), {
  ssr: false,
});
const NetVrkLandMap = dynamic(() => import('../../components/netvrk_land_map'), {
  ssr: false,
});

const SomniumMap = dynamic(() => import('../../components/somnium-map'), {
  ssr: false,
});

const SubStrataMap = dynamic(() => import('../../components/substrata-map'), {
  ssr: false,
});

const meta = {
  title: `Heatmap - ${SITE_NAME}`,
  description: META_DESCRIPTION,
};

const TAB = [
  {
    label: 'Voxels',
    icon: '/images/cvLogo.png',
    type: 'cryptovoxels',
  },
  {
    label: 'Decentraland',
    icon: '/images/Decentraland.jpg',
    type: 'decentraland',
  },
  {
    label: 'The Sandbox',
    icon: '/images/home-icon.svg',
    type: 'sandbox',
  },
  {
    label: 'Somnium Space',
    icon: '/images/somniumspace.png',
    type: 'somniumspace',
  },

  {
    label: 'Otherside',
    icon: '/images/osd.png',
    type: 'otherside',
  },
  {
    label: 'SubStrata',
    icon: '/images/substrata.png',
    type: 'substrata',
  },
  {
    label: 'Tz1and',
    icon: '/images/tz1and.png',
    type: 'tz1and',
  },
  // {
  //   label: 'Netvrk',
  //   icon: '/images/tz1and.png',
  //   type: 'netvrk',
  // },
];

export default function MapPage(props) {
  const router = useRouter();

  const cls = cn('flex-1', style.bottomLine);

  const [fullScreen, setFullScreen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [mapType, setMapType] = React.useState(router.query.type || 'cryptovoxels');
  const [staticType, setStaticType] = React.useState(props.query.static || 'price');

  const showFull = React.useCallback(
    (x) => {
      setFullScreen(x);
    },
    [null],
  );

  useEffect(() => {
    
    if (router.query.type) {
      setMapType(router.query.type);
    } else {
      setMapType('cryptovoxels');
    }
  }, [router.query.type]);

  const renderMap = React.useMemo(() => {
    if (loading) {
      return (
        <div className="w-max">
          <Status status="loading" />
        </div>
      );
    }

    if (mapType === 'cryptovoxels') {
      return (
        <Map
          fullScreenOnClick={showFull}
          zoomControl={true}
          zoomLimit={[5, 9]}
          dragging={true}
          initZoom={6}
          defaultStatic={staticType}
          loadFinish={() => {
            setLoading(false);
          }}
          backColor="rgb(8 17 19)"
        ></Map>
      );
    }

    if (mapType === 'decentraland') {
      return (
        <DecentralandMap
          fullScreenOnClick={showFull}
          zoomControl={true}
          zoomLimit={[1, 9]}
          dragging={true}
          defaultStatic={staticType}
          initZoom={5}
          backColor="rgb(8 17 19)"
        ></DecentralandMap>
      );
    }

    if (mapType === 'sandbox') {
      return (
        <SandboxMap
          fullScreenOnClick={showFull}
          zoomControl={true}
          zoomLimit={[1, 9]}
          dragging={true}
          initZoom={6}
          defaultStatic={staticType}
          changeTypeControl={false}
          backColor="rgb(8 17 19)"
        ></SandboxMap>
      );
    }

    if (mapType === 'somniumspace') {
      return (
        <SomniumMap
          fullScreenOnClick={showFull}
          zoomControl={true}
          zoomLimit={[3, 9]}
          dragging={true}
          initZoom={4}
          defaultStatic={staticType}
          loadFinish={() => {
            setLoading(false);
          }}
          backColor="#15282C"
        ></SomniumMap>
      );
    }

    if (mapType === 'otherside') {
      return (
        <OthersideMap
          fullScreenOnClick={showFull}
          zoomControl={true}
          zoomLimit={[3, 9]}
          dragging={true}
          initZoom={4}
          defaultStatic={staticType}
          loadFinish={() => {
            setLoading(false);
          }}
          backColor="#000"
        ></OthersideMap>
      );
    }
    if (mapType === 'substrata') {
      return (
        <SubStrataMap
          fullScreenOnClick={showFull}
          zoomControl={true}
          zoomLimit={[3, 9]}
          dragging={true}
          initZoom={4}
          defaultStatic={staticType}
          loadFinish={() => {
            setLoading(false);
          }}
          backColor="#15282C"
        ></SubStrataMap>
      );
    }
    if (mapType === 'tz1and') {
      return (
        <TzLandMap
          fullScreenOnClick={showFull}
          zoomControl={true}
          zoomLimit={[3, 9]}
          dragging={true}
          initZoom={4}
          defaultStatic={staticType}
          loadFinish={() => {
            setLoading(false);
          }}
          backColor="#000"
        ></TzLandMap>
      );
    }
    if (mapType === 'netvrk') {
      return (
        <NetVrkLandMap
          // fullScreenOnClick={showFull}
          // zoomControl={true}
          // zoomLimit={[3, 9]}
          // dragging={true}
          // initZoom={4}
          // defaultStatic={staticType}
          // loadFinish={() => {
          //   setLoading(false);
          // }}
          // backColor="#000"
        ></NetVrkLandMap>
      );
    }

    return (
      <Map
        fullScreenOnClick={showFull}
        zoomControl={true}
        zoomLimit={[5, 9]}
        dragging={true}
        initZoom={6}
        defaultStatic={staticType}
        loadFinish={() => {
          setLoading(false);
        }}
        backColor="rgb(8 17 19)"
      ></Map>
    );
  }, [mapType, loading]);

  return (
    <Page className="min-h-screen" meta={meta}>
      
      {fullScreen ? null : (
        <>
          <div style={{ zIndex: "9999999" }}>
            <PageHeader className={cn("relative ",style.aaa)} active={'heatmap'} />
          </div>
          <div className={style.container}>
            {/* <div className="relative"> */}

            {/* </div> */}

            <div className={cn('tab-list flex', style.allHeight)}>
              <div className={cls}></div>
              <div className="main-content flex px-0">
                {TAB.map((item, index) => {
                  return (
                    <Tab
                      active={mapType === item.type}
                      isMini={true}
                      key={item.label}
                      label={item.label}
                      icon={item.icon}
                      onClick={(val) => {
                        setMapType(item.type);
                        router.replace(`/heatmap?type=${item.type}`);
                      }}
                    />
                  );
                })}
                <div className={cls} />
              </div>
              <div className={cls} />
            </div>
          </div>
        </>
      )}

      <div
        className={cn(
          'relative w-full flex justify-center items-center',
          fullScreen ? style.full : style.mapContanier,
        )}
      >
        {renderMap}
      </div>
      {/* {fullScreen ? null : <Footer />} */}
    </Page>
  );
}

export async function getServerSideProps({ query }) {
  return {
    props: {
      query,
    }, // will be passed to the page component as props
  };
}
