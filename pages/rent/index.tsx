import React from 'react';
import cn from 'classnames';
import { v4 as uuid } from 'uuid';
import PageHeader from '../../components/page-header';
import Tab from '../../components/tab';
import Page from '../../components/page';
import Footer from '../../components/footer';
import PagiNation from '../../components/pagination';
import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import RentCard from '../../components/rent-card';
import CoverImg from '../../components/cover-img';

import style from './index.module.css';

import { req_rent_islands, req_rent_cardList } from '../../service/z_api';

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
  const [islands_ids, set_islands_ids] = React.useState([]);

  const [loading, setLoading] = React.useState(false);

  const [cardInfoList, setCardInfoList] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(20);
  const [idsQuery, setIdsQuery] = React.useState('all');
  const [areaQuery, setAreaQuery] = React.useState('');
  const [heightQuery, setHeightQuery] = React.useState('');
  const [priceQuery, setPriceQuery] = React.useState('');
  const [builtQuery, setBuiltQuery] = React.useState('all');
  const [fieldQuery, setFieldQuery] = React.useState('default');
  const [typeQuery, setTypeQuery] = React.useState('desc');

  const [Defaultsort, setDefaultsort] = React.useState(true);

  const [detailState, setDetailState] = React.useState(false);

  const [imgState, setImgState] = React.useState(false);

  const [hoverState, setHoverState] = React.useState(false);
  const [hoverText, setHoverText] = React.useState('');

  const [cardInfo, setCardInfo] = React.useState({
    parcel_id: null,
    name: null,
    island: null,
    suburb: null,
    height: null,
    area: null,
    built_status: null,
    end_date: null,
    owner: null,
    parcel_page_url: null,
    traffic: null,
    price: null,
    cover_img_url: null,
  });

  const cls = cn('flex-1', style.bottomLine);

  const onTabChange = React.useCallback(async (tab) => {
    setTabState(tab);
  }, []);
  // 获取岛屿列表
  const get_islands_list = React.useCallback(async () => {
    const result = await req_rent_islands();
    set_islands_data(result.data);
  }, []);
  // 获取card列表数据
  const get_rent_cardList = React.useCallback(async () => {
    setLoading(true);
    const result = await req_rent_cardList(
      page,
      pageCount,
      islands_ids.length === 0 ? idsQuery : islands_ids.join(','),
      areaQuery,
      heightQuery,
      priceQuery,
      builtQuery,
      fieldQuery,
      typeQuery,
    );
    if (result.code === 100000) {
      setLoading(false);
      setCardInfoList(result.data.parcel_list);
      setTotalPage(result.data.total_page);
    } else {
      setLoading(false);
    }
  }, [
    page,
    pageCount,
    idsQuery,
    areaQuery,
    heightQuery,
    priceQuery,
    builtQuery,
    fieldQuery,
    typeQuery,
    islands_ids,
  ]);
  // 获取列表id 更改高亮效果
  const get_islands_id = React.useCallback(
    (id) => {
      setLocationAll('');
      if (islands_ids.findIndex((item) => item === id) === -1) {
        islands_ids.push(id);
        set_islands_ids([...islands_ids]);
        return;
      }
      islands_ids.splice(
        islands_ids.findIndex((item) => item === id),
        1,
      );

      set_islands_ids([...islands_ids]);
    },
    [islands_ids],
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
        result.forEach((item) => {
          if (item.state) {
            if (item.value === '< 100㎡') {
              setAreaQuery(`${areaQuery}0_100,`);
            }
            if (item.value === '100㎡-200㎡') {
              setAreaQuery(`${areaQuery}100_200,`);
            }
            if (item.value === '200㎡-500㎡') {
              setAreaQuery(`${areaQuery}200_500,`);
            }
            if (item.value === '> 500㎡') {
              setAreaQuery(`${areaQuery}500_,`);
            }
          }
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
        result.forEach((item) => {
          if (item.state) {
            if (item.value === '< 10m') {
              setHeightQuery(`${heightQuery}0_10,`);
            }
            if (item.value === '10 - 15m') {
              setHeightQuery(`${heightQuery}10_15,`);
            }
            if (item.value === '15 - 20m') {
              setHeightQuery(`${heightQuery}15_20,`);
            }
            if (item.value === '> 20m') {
              setHeightQuery(`${heightQuery}20_,`);
            }
          }
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

        result.forEach((item) => {
          if (item.state) {
            if (item.value === '< 0.1 ETH') {
              setPriceQuery(`${priceQuery}0_0.1,`);
            }
            if (item.value === '0.1 ETH - 0.2 ETH') {
              setPriceQuery(`${priceQuery}0.1_0.2,`);
            }
            if (item.value === '0.2 ETH - 0.5 ETH') {
              setPriceQuery(`${priceQuery}0.2_0.5,`);
            }
            if (item.value === '> 0.5 ETH') {
              setPriceQuery(`${priceQuery}0.5_,`);
            }
          }
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
        result.forEach((item) => {
          if (item.state) {
            if (item.value === 'Built') {
              setBuiltQuery(`${builtQuery === 'all' ? '' : builtQuery}yes,`);
            }
            if (item.value === 'Not built') {
              setBuiltQuery(`${builtQuery === 'all' ? '' : builtQuery}no,`);
            }
          }
        });

        setBuiltSort([...result]);
      }
    },
    [
      areaSort,
      heightSort,
      priceWeekSort,
      builtSort,
      areaQuery,
      heightQuery,
      priceQuery,
      builtQuery,
    ],
  );
  // 改变排序状态
  const sort = React.useCallback(
    (index, val) => {
      setDefaultsort(false);
      const result = rank.map((item, i) => {
        if (index !== i && item.state !== '') {
          return { value: item.value, state: '' };
        }
        return { ...item };
      });

      setFieldQuery(val);
      if (result[index].state === '' && val !== 'Price') {
        result[index].state = 'desc';
      }
      if (result[index].state === 'desc' && val !== 'Price') {
        result[index].state = 'asc';
        setTypeQuery('asc');
        setRank([...result]);
        return;
      }
      if (result[index].state === 'asc' && val !== 'Price') {
        result[index].state = 'desc';
        setTypeQuery('desc');
        setRank([...result]);
      }

      if (result[index].state === '' && val === 'Price') {
        result[index].state = 'asc';
      }

      if (result[index].state === 'asc' && val === 'Price') {
        result[index].state = 'desc';
        setTypeQuery('desc');
        setRank([...result]);
        return;
      }
      if (result[index].state === 'desc' && val === 'Price') {
        result[index].state = 'asc';
        setTypeQuery('asc');
        setRank([...result]);
      }
    },
    [rank],
  );
  // 弹出框的状态
  const toDetail = React.useCallback((Info) => {
    setCardInfo(Info);
    setDetailState(true);
  }, []);

  const AreaAll = React.useCallback(() => {
    if (areaAll === 'All') return;
    setAreaAll('All');
    setAreaQuery('');
    const result = areaSort.map((item) => {
      return { value: item.value, state: false };
    });
    setAreaSort([...result]);
  }, [areaSort, areaAll]);
  const HeightAll = React.useCallback(() => {
    if (heightAll === 'All') return;
    setHeightAll('All');
    setHeightQuery('');
    const result = heightSort.map((item) => {
      return { value: item.value, state: false };
    });
    setHeightSort([...result]);
  }, [heightSort, heightAll]);
  const PriceAll = React.useCallback(() => {
    if (priceWeekAll === 'All') return;
    setPriceWeekAll('All');
    setPriceQuery('');
    const result = priceWeekSort.map((item) => {
      return { value: item.value, state: false };
    });
    setPriceWeekSort([...result]);
  }, [priceWeekAll, priceWeekSort]);
  const BuiltAll = React.useCallback(() => {
    if (builtAll === 'All') return;
    setBuiltAll('All');
    setBuiltQuery('all');
    const result = builtSort.map((item) => {
      return { value: item.value, state: false };
    });
    setBuiltSort([...result]);
  }, [builtAll, builtSort]);
  const clearSort = React.useCallback(() => {
    setDefaultsort(true);
    setFieldQuery('default');
    setTypeQuery('desc');
    const result = rank.map((item) => {
      return { value: item.value, state: '' };
    });
    setRank([...result]);
  }, [rank]);
  const LocationAll = React.useCallback(() => {
    if (locationAll === 'All') return;
    setLocationAll('All');
    set_islands_ids([]);
  }, [locationAll]);
  const renderContent = React.useMemo(() => {
    if (loading) {
      return <Status status="loading" />;
    }
    if (cardInfoList.length === 0) {
      return <Status status="empty" />;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-7">
        {cardInfoList.map((item) => {
          return (
            <RentCard
              key={uuid()}
              {...item}
              onClick={(Info) => {
                toDetail(Info);
              }}
            ></RentCard>
          );
        })}
      </div>
    );
  }, [loading, cardInfoList]);

  const onPageChangeHandler = React.useCallback(
    async (number: number) => {
      const requestNumber = number + 1;
      setLoading(true);
      const result = await req_rent_cardList(
        requestNumber,
        pageCount,
        islands_ids.length === 0 ? idsQuery : islands_ids.join(','),
        areaQuery,
        heightQuery,
        priceQuery,
        builtQuery,
        fieldQuery,
        typeQuery,
      );
      if (result.code === 100000) {
        setLoading(false);
        setCardInfoList(result.data.parcel_list);
        setPage(requestNumber);
        setTotalPage(result.data.total_page);
      } else {
        setLoading(false);
      }
    },
    [
      pageCount,
      idsQuery,
      areaQuery,
      heightQuery,
      priceQuery,
      builtQuery,
      fieldQuery,
      typeQuery,
      page,
    ],
  );

  const hint = React.useCallback(
    (val, sta) => {
      setHoverState(true);
      if (val === 'Area' && (sta === '' || sta === 'desc')) {
        setHoverText('Click to sort by area from large to small');
      }
      if (val === 'Area' && sta === 'asc') {
        setHoverText('Click to sort by area from samll to large');
      }
      if (val === 'Height' && (sta === '' || sta === 'desc')) {
        setHoverText('Click to sort by height from high to low');
      }
      if (val === 'Height' && sta === 'asc') {
        setHoverText('Click to sort by area from low to high');
      }
      if (val === 'Price' && (sta === '' || sta === 'asc')) {
        setHoverText('Click to sort by height from low to high');
      }
      if (val === 'Price' && sta === 'desc') {
        setHoverText('Click to sort by height from high to low');
      }
    },
    [hoverText],
  );
  const closeDetail = React.useCallback(() => {
    setDetailState(false);
  }, []);
  React.useEffect(() => {
    get_islands_list();
    get_rent_cardList();
  }, [get_islands_list, get_rent_cardList, hint]);
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
                    islands_ids.findIndex((i) => i === item.id) !== -1 ? style.active : null,
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
          <div className={cn('flex', style.clearSort)}>
            <div onClick={clearSort} className={cn(Defaultsort ? style.active : null)}>
              Default sort
            </div>
          </div>
          {hoverState ? <div className={style.hover_text}>{hoverText}</div> : null}
          {rank.map((item, index) => {
            return (
              <div
                key={item.value}
                className={cn('ml-8', style.sortModeItem)}
                onClick={() => {
                  sort(index, item.value);
                }}
                onMouseOver={() => {
                  hint(item.value, item.state);
                }}
                onMouseOut={() => {
                  setHoverState(false);
                }}
              >
                <div className={cn('flex')}>
                  <div className={cn(style.title, item.state !== '' ? style.active : null)}>
                    {item.value}
                  </div>
                  {item.state === '' && item.value !== 'Price' ? (
                    <img src="/images/stateless.png" />
                  ) : null}
                  {item.state === 'desc' && item.value !== 'Price' ? (
                    <img src="/images/desc.png" />
                  ) : null}
                  {item.state === 'asc' && item.value !== 'Price' ? (
                    <img src="/images/asc.png" />
                  ) : null}
                  {item.state === '' && item.value === 'Price' ? (
                    <img src="/images/stateless.png" />
                  ) : null}
                  {item.state === 'desc' && item.value === 'Price' ? (
                    <img src="/images/desc.png" />
                  ) : null}
                  {item.state === 'asc' && item.value === 'Price' ? (
                    <img src="/images/asc.png" />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={cn('main-content mt-8', style.content)}>{renderContent}</div>
      <PagiNation
        total={totalPage}
        pageNumber={page - 1}
        pageSize={20}
        pageChange={onPageChangeHandler}
      />

      {detailState ? (
        <div>
          <div className={style.container}></div>
          <div className={cn('flex', style.detailCard)}>
            <div className={style.left}>
              <div className={style.imgContanier}>
                <CoverImg
                  className={style.img}
                  img={cardInfo.cover_img_url}
                  error="/images/default-cover.png"
                ></CoverImg>
                <a href={cardInfo.parcel_page_url} target="_blank">
                  <div
                    className={imgState ? style.shade : style.sd}
                    onMouseOver={() => {
                      setImgState(true);
                    }}
                    onMouseOut={(e) => {
                      setImgState(false);
                    }}
                  ></div>
                  {imgState ? (
                    <div
                      className={style.toTitle}
                      onMouseEnter={() => {
                        setImgState(true);
                      }}
                    >
                      {`Click to the building`}
                      <img src="/images/xiangyou.png" />
                    </div>
                  ) : null}
                </a>
              </div>
              <div className={style.contactTitle}>Contact the Owner:</div>
            </div>
            <div className={style.right}>
              <h2>
                {`${cardInfo.island} `}
                <span>.</span>
                {` ${cardInfo.suburb}`}
              </h2>
              <div className={style.price}>{`${cardInfo.price} ETH/WEEK`}</div>
              <div className={style.endTime}>Can be rented until: {cardInfo.end_date}</div>
              <div className={style.detail}>
                <div className={cn('flex', style.coord)}>
                  <img src="/images/icon/traffic.png" />
                  <div>{`Month Traffic :  ${cardInfo.traffic}`}</div>
                </div>
                <div className={cn('flex', style.plot)}>
                  <img src="/images/icon/dizhi.png" />
                  <div>{`#${cardInfo.parcel_id} ${cardInfo.name}`}</div>
                </div>
                <div className={cn('flex', style.info)}>
                  <img src="/images/icon/dikuai.png" />
                  <div className={style.info_item}>{`${cardInfo.area}㎡`}</div>
                  <div className={style.info_item}>{`${cardInfo.height}m High`}</div>
                  <div className={style.info_item}>
                    {cardInfo.built_status === 0 ? 'Not Built' : 'Built'}
                  </div>
                </div>
              </div>
              <div className={style.contact}>
                <a href="https://twitter.com/Metacat007" target="_blank" data-tip="twitter">
                  <div>
                    <img src="/images/rent-twitter.png" />
                    <div>Twitter</div>
                  </div>
                </a>
                <a href="mailto:metacat@tutanota.com" data-tip="metacat@tutanota.com">
                  <div>
                    <img src="/images/rent-email.png" />
                    <div>Email</div>
                  </div>
                </a>
              </div>
            </div>
            <div className={cn(style.guanbi, style.close)} onClick={closeDetail}>
              <img src="/images/guanbi.png" />
            </div>
          </div>
        </div>
      ) : null}
      <Footer />
    </Page>
  );
}
