import React from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import Page from '../../../components/page';
import PageHeader from '../../../components/page-header';
import InfoCard from '../../../components/info_card';
import Tab from '../../../components/tab';

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
  const meta = {
    title: `Build - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const onTabChange = React.useCallback((t) => {
    setTabState(t);
    router.replace(`/build/${t}`);
  }, []);

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
                <div
                  className={cn(style.navItem, navState === i.type ? style.action : null)}
                  key={idx}
                  onClick={() => {
                    setNavState(i.type);
                  }}
                >
                  {i.type}
                </div>
              );
            })}
          </div>
        </div>
        <div className={style.title}>
          <div className={style.cn}>
            <div></div>
            Institutions
          </div>
        </div>
        <div className={style.cardList}>
          <InfoCard cls={style.cls}></InfoCard>
        </div>
      </Page>
    </>
  );
}
