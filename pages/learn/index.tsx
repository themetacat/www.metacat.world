import React from 'react';

import cn from 'classnames';

import style from './index.module.css';

import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import Footer from '../../components/footer';
import Tab from '../../components/tab';
import Search from '../../components/search';
import SelectLearn from '../../components/chart-select-learn';
import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

const REPORTTAB = [
  {
    label: 'Articles',
    type: 'articles',
  },
  {
    label: 'MetaCat Report',
    type: 'metacat report',
  },
];

const meta = {
  title: `Learn - ${SITE_NAME}`,
  description: META_DESCRIPTION,
};

const ps = [
  {
    label: 'English',
    value: 'english',
  },
  {
    label: 'Chinese',
    value: 'chinese',
  },
];

export default function Learn() {
  const [tabState, setTabState] = React.useState('articles');
  const [tabStateTR, setTabStateTR] = React.useState('articles');
  const [searchText, setSearchText] = React.useState('');
  const [options, setOptions] = React.useState(ps);
  const onTabChange = React.useCallback((i) => {
    setTabState(i);
  }, []);

  const onSearchHandler = React.useCallback(
    async (text: string) => {
      console.log(text);
      setSearchText(text);
      // const data = await requestData({
      //     tab: tabState,
      //     subTab: subTabState,
      //     query: text,
      //     page: 1,
      //     type: typeState,
      //     needUpdateTypeList: true,
      // });

      // setDataSource(data);
    },
    [tabState],
  );

  const changeStatic = React.useCallback((val) => {
    // setShowType(val);
    // if (dataSource) {
    // update(val);
    // }
  }, []);

  const cls = cn('flex-1', style.bottomLine);
  return (
    <Page className={cn('min-h-screen', style.anPage)} meta={meta}>
      <div className="bg-black relative">
        <PageHeader className="relative z-10" active={'learn'} />
      </div>
      <div className={style.containerBanner}>
        <img src="/images/LearnBanner.png" className={style.banner} />
      </div>
      <div className={cn('tab-list flex mt-5', style.allHeight)}>
        <div className={cls}></div>
        <div className="main-content flex px-0">
          {REPORTTAB.map((item) => {
            return (
              <Tab
                active={tabState === item.type}
                isMini={true}
                key={item.label}
                label={item.label}
                onClick={() => {
                  onTabChange(item.type);
                }}
              />
            );
          })}

          <div className={cls} />
        </div>
        <Search text={searchText} onSearch={onSearchHandler} type={'z'}></Search>
        <div
          className={cn('flex items-center', style.border)}
          style={{ color: 'rgba(255,255,255, 0.3)' }}
        >
          <SelectLearn
            options={options}
            showArrow={true}
            onClick={changeStatic}
            className={style.selecterLong}
            defaultLabel={options[0].value}
            hasBorder={false}
          ></SelectLearn>
        </div>
        <div className={cls} />
      </div>
      <Footer />
    </Page>
  );
}
