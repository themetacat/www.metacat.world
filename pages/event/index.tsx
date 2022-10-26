import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import style from './index.module.less';
import Page from '../../components/page';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import PageHeader from '../../components/top-navigation';
import Footer from '../../components/footer';
import SwiperTagParcels from '../../components/swiper-tagParcels';
import Tab from '../../components/hometabParcels';
import Layout from '../../components/layoutParcels';
import EventDetail from '../../components/eventDetail';

import { getEventList, getDclEventList } from '../../service';

type Props = {
    name?: string;
    description?: string;
    coverImg?: string;
    activityTime?: string;
    eventDetailUrl?: string;
    eventParcelUrl?: string;
    className?: string;
};

dayjs.extend(utc);

const TAB = [
    {
        label: 'Voxels',
        icon: '/images/cvLogo.png',
        type: 'cryptovoxels',
        link: '/parcels?tab=cryptovoxels',
    },
    {
        label: 'Decentraland',
        icon: '/images/Decentraland.jpg',
        type: 'decentraland',
        link: '/parcels?tab=decentraland',
    },
    // {
    //   label: 'The Sandbox',
    //   icon: '/images/home-icon.svg',
    //   type: 'sandbox',
    // },
    // {
    //   label: 'Somnium Space',
    //   icon: '/images/somniumspace.png',
    //   type: 'somniumspace',
    // },
    // {
    //   label: 'NFT Worlds',
    //   icon: '/images/worlds.svg',
    //   type: 'nftworlds',
    // },
    // {
    //   label: 'Worldwide Webb',
    //   icon: '/images/unnamed.svg',
    //   type: 'worldwidewebb',
    // },
    // {
    //   label: 'Otherside',
    //   icon: '/images/osd.png',
    //   type: 'otherside',
    // },
    // {
    //   label: 'Netvrk',
    //   icon: '/images/netvrk_logomark.svg',
    //   type: 'netvrk',
    // },
];

const SUBTAB = [
    {
        label: 'Parcel',
        type: 'parcel',
    },
    {
        label: 'Space',
        type: 'space',
    },
    // {
    //   label: 'Heatmap',
    //   type: 'map',
    // },
    // {
    //   label: 'Analytics',
    //   type: 'analytics',
    // },
    // {
    //   label: 'Events',
    //   type: 'event',
    // },
];

const SUBTABDECE = [
    {
        label: 'Parcel',
        type: 'parcel',
    },
    {
        label: 'Scene',
        type: 'scene',
    },
    // {
    //   label: 'Heatmap',
    //   type: 'map',
    // },
    // {
    //   label: 'Analytics',
    //   type: 'analytics',
    // },
    // {
    //   label: 'Events',
    //   type: 'event',
    // },
];

export default function Event(props) {

    const router = useRouter();
    const headerRef = React.useRef(null)
    const meta = {
        title: `Event - ${SITE_NAME}`,
        description: META_DESCRIPTION,
    };
    const [tabState, setTabState] = React.useState(props.query.tab || 'cryptovoxels');
    const [subTabState, setSubTabState] = React.useState(props.query.subTab || 'parcel');
    const [fixedState, setFixedState] = React.useState(false);
    const [tabPercent, setTabPercent] = React.useState(0);
    const [showModal, setShowModal] = React.useState(false);
    const [eventDclList, setEventDclList] = React.useState([]);
    const [eventCvList, setEventCvList] = React.useState([]);
    const [pageNum, setPage] = useState(1);
    const [pageNumDec, setPageDec] = useState(1);
    const [count, setCount] = React.useState(20);
    useEffect(() => {
        // console.log(pageNum, 333);
    }, [pageNum])
    const cls = cn('flex-1', style.bottomLine);

    const requestData = async (page, count) => {



        if (tabState === 'cryptovoxels') {
            let mynum = pageNum
            setPage((num) => {
                mynum = num
                return num + 1
            })
            // console.log(mynum,999);
            const res = await getEventList(mynum * count + 1, count)
            // console.log(pageNum, 777);
            setShowModal(true)
            // let num = pageNum 
            // props.isSetPage(num)
            if (res.code === 100000) {
                setEventCvList(res.data.event_list);
                // console.log(res, "res");
                const dataList = eventCvList;
                if (res.data.event_list.length > 0) {
                    dataList?.push(...res?.data?.event_list)
                    setEventCvList(dataList)
                }

            }
            setShowModal(false)
            // console.log(newPage);

        } else {
            let mynumDel = pageNumDec
            setPageDec((num) => {
                mynumDel = num
                return num + 1
            })
            const resDel = await getDclEventList(mynumDel * count + 1, count)
            setShowModal(true)
            if (resDel.code === 100000) {
                setEventDclList(resDel.data.event_list);
                // console.log(resDel.data.event_list, "resDelList.data.event_list");
                // console.log(eventDclList);
                const dataList1 = eventDclList;
                if (resDel.data.event_list.length > 0) {
                    dataList1?.push(...resDel?.data?.event_list)
                    setEventDclList(dataList1)
                }
            }
            setShowModal(false)

        }

    }


    const onTabChange = async (tab) => {

        let subIndex;
        if (tabState === 'cryptovoxels') {
            subIndex = SUBTAB.findIndex((item) => item.type === subTabState);
        } else if (tabState === 'decentraland') {
            subIndex = SUBTABDECE.findIndex((item) => item.type === subTabState);
        }
        // console.log(subIndex, tabState);
        subIndex = subIndex === -1 ? 0 : subIndex;
        setTabState(tab);
        let sub = '';
        if (tab === 'cryptovoxels') {
            sub = SUBTAB[subIndex].type;
            setSubTabState(SUBTAB[subIndex].type);
            router.replace(`/event?tab=cryptovoxels`);
        } else if (tab === 'decentraland') {
            sub = SUBTAB[subIndex].type;
            setSubTabState(SUBTABDECE[subIndex].type);
            router.replace(`/event?tab=decentraland`);
        }
        // if (subTabState === 'map') {
        //   sub = 'parcel';
        //   setSubTabState(sub);
        // }
        // setSearchText('');
        // setTypeState('All');
        // nextCursor.current = 1;
        // const data = await requestData({
        //   tab,
        //   subTab: sub,
        //   page: 1,
        //   query: '',
        //   type: '',
        //   needUpdateTypeList: true,
        // });
        // setDataSource(data);
    };

    // console.log(tabState, 9999999999);
    const onClinkDclDetail = (card) => {
        window.open(card.event_parcel_url);
    }
    const onClinkCvDetail = (card) => {
        window.open(card.event_parcel_url);
    }

    const renderContent = React.useMemo(() => {


        if (tabState === 'cryptovoxels') {
            return (
                <>
                    <div className={cn("grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 ", style.voEvent)}>
                        {eventCvList.map((card, idx) => {
                            return < EventDetail key={idx} {...card} onClinkDetail={() => {
                                onClinkCvDetail(card)
                            }} />;
                        })}
                        {/* {
                            showModal ? <div style={{ marginLeft: "100%", width: "20px", height: "20px" }}>  <img src='/images/saveIcon.gif'></img> </div> :
                                null
                        } */}

                    </div>
                </>
            )
        }
        if (tabState === 'decentraland') {
            return (
                <>
                    <div className={cn("grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 ", style.voEvent)}>
                        {eventDclList.map((card, item) => {
                            return < EventDetail {...card} onClinkDetail={() => { onClinkDclDetail(card) }} />;
                        })}
                    </div>
                </>
            )
        }
    }, [tabState, eventDclList, eventCvList])

    useEffect(() => {

        const tab = router.query.tab || 'cryptovoxels';
        const subTab = router.query.subTab || 'parcel';
        setTabState(tab);
        setSubTabState(subTab);
        onTabChange(tab);
        requestData(1, 20)




        const scrollChange = () => {

            const scrollHeight = document.querySelector('.detailName')?.scrollHeight
            const clientHeight = document.querySelector('.detailName')?.clientHeight
            const scrollTop = document.querySelector('.detailName')?.scrollTop

            if (scrollTop + clientHeight >= scrollHeight - 1) {



                requestData(pageNum, count)
            }

            document.addEventListener('scroll', scrollChange);
            return () => document.removeEventListener('scroll', scrollChange);
        }


        window.addEventListener('scroll', scrollChange, true)
        // scrollChange()
        return () => {
            window.removeEventListener('scroll', scrollChange, false)
        }
    }, [router.query.tab]);
    console.log(tabState, "tabState");

    React.useEffect(() => {
        const listener = () => {
            if (
                document.querySelector('.myClassName') &&
                document.querySelector('.myClassName').getBoundingClientRect().top <= 10 &&
                window.scrollY > 0
            ) {
                setFixedState(true);
            } else {
                setFixedState(false);
            }
        };
        document.addEventListener('scroll', listener);
        return () => document.removeEventListener('scroll', listener);
    }, [fixedState]);

    return (
        <Page meta={meta} className={cn('detailName', style.detailName)}>
            {/* <Layout> */}
            <div className={style.containerBox} ref={headerRef}>
                <div className={cn('  myClassName', fixedState ? style.fix1 : null)} style={{ zIndex: "99999" }}>
                    <PageHeader className="relative" active={'/event'} />
                </div>
                <div
                    className={cn(
                        'tab-list flex  main-content relative',
                        style.allHeight,
                        // fixedState ? style.aboslute : style.allHeight,
                    )}
                >

                    {/* {fixedState === true ? <div className={offsetWidthNum <= 1200 ? style.headNumx : style.headNum}></div> : null} */}
                    <div className={cn("flex px-0 relative", style.headNum)}>
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={1}
                            slidesPerView="auto"
                            className={cn('w-full,flex', style.n)}
                            navigation={{
                                prevEl: '.p',
                                nextEl: '.n',
                            }}
                            onProgress={(swiper, progress) => {
                                setTabPercent(progress);
                            }}
                        >
                            {TAB.map((item, index) => {
                                return (
                                    <div
                                        className={cn(
                                            'box-border w-12 font-semibold text-white flex',
                                            style.baseCON,
                                            tabState === item.type ? style.active : null,
                                        )}
                                        key={index}
                                        onClick={() => {
                                            onTabChange(item.type);
                                        }}
                                    >
                                        <Tab
                                            active={tabState === item.type}
                                            key={item.label}
                                            label={item.label}
                                            icon={item.icon}
                                            isMini={true}
                                        //          id="switch"
                                        // className={style.aboslute}
                                        // fixedS={fixedState}
                                        />
                                    </div>
                                );
                            })}
                        </Swiper>

                        <div className={cls} />
                    </div>

                </div>
                <div className="main-content">

                    {renderContent}
                </div>
            </div>

            {/* </Layout> */}
            <Footer />
        </Page>
    );
}
export async function getServerSideProps({ locale = 'en-US', query }) {
    return {
        props: {
            messages: {
                ...require(`../../messages/common/${locale}.json`),
                ...require(`../../messages/index/${locale}.json`),
            },
            now: new Date().getTime(),
            locale,
            query,
        },
    };
}