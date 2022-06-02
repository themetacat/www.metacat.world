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
    label: 'Buliders',
    type: 'buliders',
  },
  {
    label: 'Bulidings',
    type: 'bulidings',
  },
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
  const [tabState, setTabState] = React.useState('buliders');
  const [navState, setNavState] = React.useState('Institutions');
  const [institutions, setInstitutions] = React.useState([]);
  const [individuals, setIndividuals] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
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
  React.useEffect(() => {
    requestData();
  }, [requestData]);

  const onTabChange = React.useCallback((t) => {
    setTabState(t);
    router.replace(`/build/${t}`);
  }, []);

  const toTopic = React.useCallback((id, c) => {
    window.open(`/topic/${id}`);
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

  const cls = cn('flex-1', style.bottomLine);
  return (
    <>
      <Page className="min-h-screen" meta={meta}>
        <div className={'bg-black relative'}>
          <PageHeader className="relative z-10" active={'builders'} />
        </div>
        <div className={'bg-black'}>
          <div className={cn('tab-list flex ', style.allHeight)}>
            <div className={cls}></div>
            <div className="main-content flex px-0">
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
        <div className={style.nav}>
          <div className={style.navcontainer}>
            {anchorNav.map((i, idx) => {
              return (
                <a href={i.type === 'Institutions' ? '#Institutions' : '#Individuals'}>
                  <div
                    className={cn(style.navItem, navState === i.type ? style.action : null)}
                    key={idx}
                    onClick={() => {
                      setNavState(i.type);
                    }}
                  >
                    {i.type}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
        <div className={style.title} id="Institutions">
          <div className={style.cn}>
            <div></div>
            Institutions
          </div>
        </div>
        <div className={style.cardList}>{reander1}</div>

        <div className={style.title} id="Individuals">
          <div className={style.cn}>
            <div></div>
            Individuals
          </div>
        </div>

        <div className={style.cardList}>{reander2}</div>
        <Footer></Footer>
      </Page>
    </>
  );
}
