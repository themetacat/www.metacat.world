import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Tab from '../../components/tab';
import InfoCard from '../../components/info_card';
import Footer from '../../components/footer';
import TopJumper from '../../components/jump-to-top';
import Status from '../../components/status';

import { req_wearable_creators } from '../../service/z_api';

import style from './index.module.css';

const TAB = [
  {
    label: 'Creators',
    type: 'creators',
  },
  {
    label: 'WearableDao',
    type: 'wearabledao',
  },
];
const meta = {
  title: `Wearables - ${SITE_NAME}`,
  description: META_DESCRIPTION,
};

export default function Wearables() {
  const router = useRouter();
  const [tabState, setTabState] = React.useState('creators');
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [fixedState, setFixedState] = React.useState(false);
  const requestData = React.useCallback(async () => {
    setLoading(true);
    const result = await req_wearable_creators();
    if (result.code === 100000) {
      setData(result.data);
    }
    setLoading(false);
  }, []);

  const onTabChange = React.useCallback((t) => {
    setTabState(t);
    if (t === 'wearabledao') {
      router.replace(`/wearables/${t}?type=chinesered`);
    } else {
      router.replace(`/wearables`);
    }
  }, []);

  React.useEffect(() => {
    requestData();
  }, [requestData]);

  const toTopic = React.useCallback((id, c, b) => {
    window.open(`/topic/${c}?type=${'wearables'}`);
  }, []);

  const reander = React.useMemo(() => {
    if (loading) {
      return <Status status="loading" />;
    }
    return (
      <>
        {data.map((item, idx) => {
          return <InfoCard cls={style.cls} {...item} key={idx} onClick={toTopic}></InfoCard>;
        })}
      </>
    );
  }, [data, toTopic, loading]);

  React.useEffect(() => {
    const listener = () => {
      if (document.getElementById('switch') && window.scrollY > 90) {
        setFixedState(true);
      } else {
        setFixedState(false);
      }
    };
    document.addEventListener('scroll', listener);
    return () => document.removeEventListener('scroll', listener);
  }, [fixedState]);

  const cls = cn('flex-1', style.bottomLine);
  return (
    <Page className="min-h-screen" meta={meta}>
      <div className={cn('bg-black relative', style.backImage)}>
        <div className={cn(' relative', fixedState ? style.fix1 : null)}>
          <PageHeader className="relative z-10" active={'wearables'} />
        </div>
        <div className={cn(' relative mt-5', fixedState ? style.fix2 : null)} id="switch">
          <div className={cn('tab-list flex', style.allHeight)}>
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
        <div className={style.imgContanier}>
          <div className={style.title}>Wearable Creators</div>
          <div className={style.text}>
            <div className={style.hengxian}></div>
            <div className={style.t}>
              I N &nbsp;&nbsp;&nbsp; M E T A V E R S E &nbsp;&nbsp;&nbsp; W E &nbsp;&nbsp;&nbsp; C R
              E A T O R &nbsp;&nbsp;&nbsp;
            </div>
            {/* <div className={style.t}>In Metaverse we Creator</div> */}
            <div className={style.hengxian}></div>
          </div>
        </div>
      </div>
      <div className={style.cardList}>{reander}</div>
      <TopJumper classname={style.jumper}></TopJumper>
      <Footer></Footer>
    </Page>
  );
}
