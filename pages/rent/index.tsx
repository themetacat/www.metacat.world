import React from 'react';
import cn from 'classnames';

import PageHeader from '../../components/page-header';
import Tab from '../../components/tab';
import Page from '../../components/page';
import Footer from '../../components/footer';
import Pagination from '../../components/pagination';
import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import style from './index.module.css';

import { req_rent_islands } from '../../service/z_api';

import Status from '../../components/status';

const Area_sort = [
  {
    value: '< 100㎡',
    state: false,
  },
  {
    value: '100㎡-200㎡',
    state: false,
  },
  {
    value: '200㎡-500㎡',
    state: false,
  },
  {
    value: '> 500㎡',
    state: false,
  },
];
const Height_sort = [
  {
    value: '< 10m',
    state: false,
  },
  {
    value: '10 - 15m',
    state: false,
  },
  {
    value: '15 - 20m',
    state: false,
  },
  {
    value: '> 20m',
    state: false,
  },
];
const Price_week_sort = [
  {
    value: '< 0.1 ETH',
    state: false,
  },
  {
    value: '0.1 ETH - 0.2 ETH',
    state: false,
  },
  {
    value: '0.2 ETH - 0.5 ETH',
    state: false,
  },
  {
    value: '> 0.5 ETH',
    state: false,
  },
];
const Built_sort = [
  {
    value: 'Built',
    state: false,
  },
  {
    value: 'Not built',
    state: false,
  },
];

const Rank = [
  {
    value: 'Area',
    state: '',
  },
  {
    value: 'Height',
    state: '',
  },
  {
    value: 'Price',
    state: '',
  },
];
const TAB = [
  {
    label: 'Cryptovoxels',
    icon: '/images/Crypto Voxel.jpg',
    type: 'cryptovoxels',
  },
];

const meta = {
  title: `Rent - ${SITE_NAME}`,
  description: META_DESCRIPTION,
};

export default function Rent() {
  const [areaSort, setAreaSort] = React.useState(Area_sort);
  const [heightSort, setHeightSort] = React.useState(Height_sort);
  const [priceWeekSort, setPriceWeekSort] = React.useState(Price_week_sort);
  const [builtSort, setBuiltSort] = React.useState(Built_sort);
  const [rank, setRank] = React.useState(Rank);

  const [areaAll, setAreaAll] = React.useState('');
  const [heightAll, setHeightAll] = React.useState('');
  const [priceWeekAll, setPriceWeekAll] = React.useState('');
  const [builtAll, setBuiltAll] = React.useState('');
  const [locationAll, setLocationAll] = React.useState('');

  const [tabState, setTabState] = React.useState('cryptovoxels');
  const [islands_data, set_islands_data] = React.useState([]);
  const [islands_id, set_islands_id] = React.useState(null);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const cls = cn('flex-1', style.bottomLine);

  const onTabChange = React.useCallback(async (tab) => {
    setTabState(tab);
  }, []);
  // 获取岛屿列表
  const get_islands_list = React.useCallback(async () => {
    const result = await req_rent_islands();
    set_islands_data(result.data);
  }, []);
  // 获取列表id 更改高亮效果
  const get_islands_id = React.useCallback(
    (id) => {
      if (id === islands_id) {
        set_islands_id(null);
        return;
      }
      setLocationAll('');
      set_islands_id(id);
    },
    [islands_id],
  );
  // 改变状态是否选中
  const select = React.useCallback(
    (type, value) => {
      if (type === 'Area') {
        setAreaAll('');
        const result = areaSort.map((item) => {
          if (item.value === value) {
            return { value: item.value, state: !item.state };
          }
          return { ...item };
        });

        setAreaSort([...result]);
      }
      if (type === 'Height') {
        setHeightAll('');
        const result = heightSort.map((item) => {
          if (item.value === value) {
            return { value: item.value, state: !item.state };
          }
          return { ...item };
        });
        setHeightSort([...result]);
      }
      if (type === 'price') {
        setPriceWeekAll('');
        const result = priceWeekSort.map((item) => {
          if (item.value === value) {
            return { value: item.value, state: !item.state };
          }
          return { ...item };
        });
        setPriceWeekSort([...result]);
      }
      if (type === 'built') {
        setBuiltAll('');
        const result = builtSort.map((item) => {
          if (item.value === value) {
            return { value: item.value, state: !item.state };
          }
          return { ...item };
        });
        setBuiltSort([...result]);
      }
    },
    [areaSort, heightSort, priceWeekSort, builtSort],
  );
  // 改变排序状态
  const sort = React.useCallback(
    (index) => {
      const result = rank.map((item, i) => {
        if (index !== i && item.state !== '') {
          return { value: item.value, state: '' };
        }
        return { ...item };
      });
      if (result[index].state === '') {
        result[index].state = 'desc';
      }
      if (result[index].state === 'desc') {
        result[index].state = 'asc';
        setRank([...result]);
        return;
      }
      if (result[index].state === 'asc') {
        result[index].state = 'desc';
        setRank([...result]);
      }
    },
    [rank],
  );

  const renderContent = React.useMemo(() => {
    if (loading) {
      return <Status status="loading" />;
    }
    if (error) {
      return <Status status="error" />;
    }
    // if (cartData.length === 0) {
    //   return <Status status="empty" />;
    // }
    // return (
    //   <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-7">
    //     {cartData.map((card, idx) => {
    //       return (
    //         <Card></Card>
    //       );
    //     })}
    //   </div>
    // );
  }, [error, loading]);

  const AreaAll = React.useCallback(() => {
    if (areaAll === 'All') return;
    setAreaAll('All');
    const result = areaSort.map((item) => {
      return { value: item.value, state: false };
    });
    setAreaSort([...result]);
  }, [areaSort, areaAll]);
  const HeightAll = React.useCallback(() => {
    if (heightAll === 'All') return;
    setHeightAll('All');
    const result = heightSort.map((item) => {
      return { value: item.value, state: false };
    });
    setHeightSort([...result]);
  }, [heightSort, heightAll]);
  const PriceAll = React.useCallback(() => {
    if (priceWeekAll === 'All') return;
    setPriceWeekAll('All');
    const result = priceWeekSort.map((item) => {
      return { value: item.value, state: false };
    });
    setPriceWeekSort([...result]);
  }, [priceWeekAll, priceWeekSort]);
  const BuiltAll = React.useCallback(() => {
    if (builtAll === 'All') return;
    setBuiltAll('All');
    const result = builtSort.map((item) => {
      return { value: item.value, state: false };
    });
    setBuiltSort([...result]);
  }, [builtAll, builtSort]);
  const clearSort = React.useCallback(() => {
    const result = rank.map((item) => {
      return { value: item.value, state: '' };
    });
    setRank([...result]);
  }, [rank]);
  const LocationAll = React.useCallback(() => {
    if (locationAll === 'All') return;
    setLocationAll('All');
    set_islands_id(null);
  }, [locationAll]);

  React.useEffect(() => {
    get_islands_list();
  }, [get_islands_list]);
  return (
    <Page className={cn('min-h-screen', style.anPage)} meta={meta}>
      <div className="bg-black relative">
        {/* 顶部导航 */}
        <PageHeader className="relative z-10" active={'rent'} />
        {/* banner图 */}
        <div className={style.containerBanner}>
          <img src="/images/rent_banner.png" className={style.banner} />
        </div>
      </div>
      {/* Cryptovoxel导航 */}
      <div className={cn('tab-list flex mt-8', style.allHeight)}>
        <div className={cls}></div>
        <div className={cn('main-content flex px-0', style.tab)}>
          {TAB.map((item) => {
            return (
              <Tab
                active={tabState === item.type}
                isMini={true}
                key={item.label}
                label={item.label}
                icon={item.icon}
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
      {/* 条件筛选导航区域 */}
      <div className={style.filterNav}>
        <div className={cn('flex', style.navItem)}>
          <div className={cn(style.title)}>Location:</div>
          <div className={cn('flex', style.list)}>
            <div className={cn('flex mr-8', style.c)} onClick={LocationAll}>
              <div className={cn(locationAll === 'All' ? style.active : null)}>All</div>
            </div>
            {islands_data.map((item) => {
              return (
                <div
                  key={item.id}
                  className={cn(
                    'flex mr-8 mb-2',
                    style.c,
                    item.id === islands_id ? style.active : null,
                  )}
                  onClick={() => {
                    get_islands_id(item.id);
                  }}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>
        <div className={cn('flex mt-2', style.navItem)}>
          <div className={style.title}>Area:</div>
          <div className={cn('flex', style.list)}>
            <div className={cn('flex', style.i)} onClick={AreaAll}>
              {areaAll === 'All' ? (
                <img src="/images/option_yes.png" className={cn('w-4 h-4 mt-1 mr-1')} />
              ) : (
                <img src="/images/option_no.png" className={cn('w-4 h-4 mt-1 mr-1')} />
              )}
              <div className={cn('mr-5', areaAll === 'All' ? style.active : null)}>All</div>
            </div>
            {areaSort.map((item) => {
              return (
                <div key={item.value}>
                  <div
                    onClick={() => {
                      select('Area', item.value);
                    }}
                    className={cn('flex', style.i)}
                  >
                    {!item.state ? (
                      <img src="/images/option_no.png" className={cn('w-4 h-4 mt-1 mr-1')} />
                    ) : (
                      <img src="/images/option_yes.png" className={cn('w-4 h-4 mt-1 mr-1')} />
                    )}
                    <div className={cn('mr-5', item.state ? style.active : null)}>{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={cn('flex mt-6', style.navItem)}>
          <div className={style.title}>Height:</div>
          <div className={cn('flex', style.list)}>
            <div className={cn('flex', style.i)} onClick={HeightAll}>
              {heightAll === 'All' ? (
                <img src="/images/option_yes.png" className={cn('w-4 h-4 mt-1 mr-1')} />
              ) : (
                <img src="/images/option_no.png" className={cn('w-4 h-4 mt-1 mr-1')} />
              )}
              <div className={cn('mr-5', heightAll === 'All' ? style.active : null)}>All</div>
            </div>
            {heightSort.map((item) => {
              return (
                <div key={item.value}>
                  <div
                    onClick={() => {
                      select('Height', item.value);
                    }}
                    className={cn('flex', style.i)}
                  >
                    {!item.state ? (
                      <img src="/images/option_no.png" className={cn('w-4 h-4 mt-1 mr-1')} />
                    ) : (
                      <img src="/images/option_yes.png" className={cn('w-4 h-4 mt-1 mr-1')} />
                    )}
                    <div className={cn('mr-5', item.state ? style.active : null)}>{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={cn('flex mt-6', style.navItem)}>
          <div className={style.title}>Price/week:</div>
          <div className={cn('flex ml-10', style.list)}>
            <div className={cn('flex', style.i)} onClick={PriceAll}>
              {priceWeekAll === 'All' ? (
                <img src="/images/option_yes.png" className={cn('w-4 h-4 mt-1 mr-1')} />
              ) : (
                <img src="/images/option_no.png" className={cn('w-4 h-4 mt-1 mr-1')} />
              )}
              <div className={cn('mr-5', priceWeekAll === 'All' ? style.active : null)}>All</div>
            </div>
            {priceWeekSort.map((item) => {
              return (
                <div key={item.value}>
                  <div
                    onClick={() => {
                      select('price', item.value);
                    }}
                    className={cn('flex', style.i)}
                  >
                    {!item.state ? (
                      <img src="/images/option_no.png" className={cn('w-4 h-4 mt-1 mr-1')} />
                    ) : (
                      <img src="/images/option_yes.png" className={cn('w-4 h-4 mt-1 mr-1')} />
                    )}
                    <div className={cn('mr-5', item.state ? style.active : null)}>{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={cn('flex mt-6', style.navItem)}>
          <div className={style.title}>Built:</div>
          <div className={cn('flex ml-10', style.list)}>
            <div className={cn('flex', style.i)} onClick={BuiltAll}>
              {builtAll === 'All' ? (
                <img src="/images/option_yes.png" className={cn('w-4 h-4 mt-1 mr-1')} />
              ) : (
                <img src="/images/option_no.png" className={cn('w-4 h-4 mt-1 mr-1')} />
              )}
              <div className={cn('mr-5', builtAll === 'All' ? style.active : null)}>All</div>
            </div>
            {builtSort.map((item) => {
              return (
                <div key={item.value}>
                  <div
                    onClick={() => {
                      select('built', item.value);
                    }}
                    className={cn('flex', style.i)}
                  >
                    {!item.state ? (
                      <img src="/images/option_no.png" className={cn('w-4 h-4 mt-1 mr-1')} />
                    ) : (
                      <img src="/images/option_yes.png" className={cn('w-4 h-4 mt-1 mr-1')} />
                    )}
                    <div className={cn('mr-5', item.state ? style.active : null)}>{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={style.sort}>
        <div className={cn('flex', style.sortMode)}>
          <div className={cn('flex mr-8', style.clearSort)}>
            <div onClick={clearSort}>Default sort</div>
          </div>
          {rank.map((item, index) => {
            return (
              <div
                key={item.value}
                className={cn('mr-8', style.sortModeItem)}
                onClick={() => {
                  sort(index);
                }}
              >
                <div className={cn('flex')}>
                  <div className={cn(style.title, item.state !== '' ? style.active : null)}>
                    {item.value}
                  </div>
                  {item.state === '' ? <img src="/images/stateless.png" /> : null}
                  {item.state === 'desc' ? <img src="/images/desc.png" /> : null}
                  {item.state === 'asc' ? <img src="/images/asc.png" /> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={cn('main-content mt-8', style.content)}>{renderContent}</div>
      <Pagination />
      <Footer />
    </Page>
  );
}
