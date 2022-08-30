import React from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import Page from '../../../components/page';
import PageHeader from '../../../components/page-header';
import InfoCard from '../../../components/info_card';
import Tab from '../../../components/tab';
import Footer from '../../../components/footer';
import Status from '../../../components/status';

import { req_buid_builders_list } from '../../../service/z_api';

import style from './index.module.css';

import { SITE_NAME, META_DESCRIPTION } from '../../../common/const';

const TAB = [
  {
    label: 'Builders',
    type: 'builders',
  },
  {
    label: 'Buildings',
    type: 'buildings',
  },
  // {
  //   label: 'Space Buildings',
  //   type: 'spacebuildings',
  // },
];

const anchorNav = [
  {
    type: 'Institutions',
  },
  {
    type: 'Individuals',
  },
];

export default function Builders() {
  const router = useRouter();
  const [tabState, setTabState] = React.useState('builders');
  const [navState, setNavState] = React.useState('Institutions');
  const [institutions, setInstitutions] = React.useState([]);
  const [individuals, setIndividuals] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [fixedState, setFixedState] = React.useState(false);
  const [anchor, setAnchor] = React.useState(false);
  const meta = {
    title: `Build - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const requestData = React.useCallback(async () => {
    setLoading(true);
    const result = await req_buid_builders_list();
    if (result.code === 100000) {
      setInstitutions(result.data.institution);
      setIndividuals(result.data.individuals);
    }
    setLoading(false);
  }, []);
  const getTop = React.useCallback(() => {
    const Institutions = document.getElementById('Individuals');
    document.addEventListener('scroll', () => {
      if (window.scrollY >= Institutions.getBoundingClientRect().top) {
        setNavState('Individuals');
      } else {
        setNavState('Institutions');
      }
    });
  }, []);
  React.useEffect(() => {
    getTop();
    requestData();
  }, [requestData, getTop]);

  const onTabChange = React.useCallback((t) => {
    setTabState(t);
    router.replace(`/build/${t}`);
  }, []);

  const toTopic = React.useCallback((id, c) => {
    window.open(`/topic/${id}?type=buildings`);
  }, []);

  const reander1 = React.useMemo(() => {
    if (loading) {
      return <Status status="loading" />;
    }
    return (
      <>
        {institutions.map((item, idx) => {
          return <InfoCard cls={style.cls} {...item} key={idx} onClick={toTopic}></InfoCard>;
        })}
      </>
    );
  }, [loading, institutions, toTopic]);

  const reander2 = React.useMemo(() => {
    if (loading) {
      return <Status status="loading" />;
    }
    return (
      <>
        {individuals.map((item, idx) => {
          return <InfoCard cls={style.cls} {...item} key={idx} onClick={toTopic}></InfoCard>;
        })}
      </>
    );
  }, [loading, individuals, toTopic]);

  React.useEffect(() => {
    const listener = () => {
      if (document.getElementById('switch') && window.scrollY > 90) {
        if (!anchor) {
          setFixedState(true);
        } else {
          setAnchor(false);
        }
      } else {
        setFixedState(false);
      }
    };
    document.addEventListener('scroll', listener);
    return () => document.removeEventListener('scroll', listener);
  }, [fixedState, anchor]);

  const cls = cn('flex-1', style.bottomLine);
  return (
    <>
      <Page className="min-h-screen" meta={meta}>
        <div className={cn('bg-black z-10', fixedState ? style.fix1 : null)}>
          <PageHeader className="relative z-20" active={'Build'} />
        </div>
        <div className={cn('bg-black', fixedState ? style.fix2 : null)} id="switch">
          <div className={cn('tab-list flex ', style.allHeight)}>
            <div className={cls}></div>
            <div className={cn("main-content flex px-0")}>
              {TAB.map((item, index) => {
                return (
                  <Tab
                    active={tabState === item.type}
                    key={item.label}
                    icon={null}
                    label={item.label}
                    isMini={true}
                    onClick={() => {
                      onTabChange(item.type);
                    }}
                  />
                );
              })}
              <div className={cls} />
            </div>
            <div className={cls} />
          </div>
        </div>
        <div className={style.bannerContainer}>
          <img src="/images/buildersBanner.png" />
        </div>
        {/* <div className={cn(style.nav, fixedState ? style.fix3 : null)}>
          <div className={style.navcontainer}>
            {anchorNav.map((i, idx) => {
              return (
                <a href={i.type === 'Institutions' ? '#Institutions' : '#Individuals'}>
                  <div
                    className={cn(style.navItem, navState === i.type ? style.action : null)}
                    key={idx}
                    onClick={() => {
                      setNavState(i.type);
                      setFixedState(false);
                      setAnchor(true);
                    }}
                  >
                    {i.type}
                  </div>
                </a>
              );
            })}
          </div>
        </div> */}
        <div className={style.title} id="Institutions">
          <div className={style.cn}>
            <div></div>
            <span className={style.institutions}>Institutions</span>
          </div>
        </div>
        <div className={style.cardList}>{reander1}</div>

        <div className={style.title} id="Individuals">
          <div className={style.cn}>
            <div></div>
            <span className={style.institutions}>Individuals</span>
          </div>
        </div>

        <div className={style.cardList}>{reander2}</div>
        <Footer></Footer>
      </Page>
    </>
  );
}
