import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import style from './index.module.less';
import Page from '../../components/page';


import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
// import PageHeader from '../../components/top-navigation';
import PageHeader from '../../components/top-nav';
import Footer from '../../components/footer';
import SwiperTagParcels from '../../components/swiper-tagParcels';
import Tab from '../../components/hometabParcels';
import Layout from '../../components/layoutParcels';
import EventDetail from '../../components/eventDetail';

import { getEventList, getDclEventList, getSomEventList } from '../../service';

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
    {
        label: 'Somnium Space',
        icon: '/images/somniumspace.png',
        type: 'somniumspace',
    },
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
    // console.log(props.query.tab);

    const [tabState, setTabState] = React.useState(props.query.tab || 'cryptovoxels');
    const [subTabState, setSubTabState] = React.useState(props.query.subTab || 'parcel');
    const [fixedState, setFixedState] = React.useState(false);
    const [tabPercent, setTabPercent] = React.useState(0);
    const [showModal, setShowModal] = React.useState(false);
    const [anchor, setAnchor] = React.useState(false);
    const [eventDclList, setEventDclList] = React.useState([]);
    const [eventSomList, setEvenSomList] = React.useState([]);
    const [eventCvList, setEventCvList] = React.useState([]);
    const [pageNum, setPage] = useState(0);
    const [pageNumDec, setPageDec] = useState(0);
    const [pageNumSom, setPageSom] = useState(0);
    const [count, setCount] = React.useState(20);
    useEffect(() => {
        // console.log(pageNum, 333);
    }, [pageNum])
    const cls = cn('flex-1', style.bottomLine);

    const requestData = async (page, countNum) => {
        if (tabState === 'cryptovoxels') {
            let mynum = pageNum
            // console.log(mynum, 999);
            setPage((num) => {
                mynum = num
                return num + 1
            })
            // console.log(mynum,999);
            // console.log(mynum, mynum * count + 1, count);

            const res = await getEventList(mynum * count + 1, count)
            // console.log(pageNum, 777);
            setShowModal(true)
            // let num = pageNum 
            // props.isSetPage(num)
            if (res.code === 100000) {

                // setEventCvList(res.data.event_list);
                // console.log(res, "res");
                const dataList = eventCvList;
                // if (res.data.event_list.length > 0) {
                dataList?.push(...res?.data?.event_list)
                setEventCvList(dataList)
                // }

            }
            setShowModal(false)
            // console.log(newPage);

        } else if (tabState === 'decentraland') {
            let mynumDel = pageNumDec
            setPageDec((num) => {
                mynumDel = num
                return num + 1
            })
            const resDel = await getDclEventList(mynumDel * count + 1, count)
            setShowModal(true)
            if (resDel.code === 100000) {

                // setEventDclList(resDel.data.event_list);
                // console.log(resDel.data.event_list, "resDelList.data.event_list");
                // console.log(eventDclList);
                const dataList1 = eventDclList;
                // if (resDel.data.event_list.length > 0) {
                dataList1?.push(...resDel?.data?.event_list)
                setEventDclList(dataList1)
                // }
                // console.log(eventDclList);
            }
            setShowModal(false)

        } else if (tabState === 'somniumspace') {
            let mynumSom = pageNumSom
            setPageSom((num) => {
                mynumSom = num
                return num + 1
            })
            // console.log(mynumSom, 89989);
            // console.log(eventSomList.length);

            // const resSom = await getSomEventList(1,20)
            const resSom = await getSomEventList(mynumSom * count, count)
            // console.log(getSomEventList(1,20),8888);
            // console.log(resSom?.data?.event_list);
            setShowModal(true)
            if (resSom.code === 100000) {
                // setEvenSomList(resSom.data.event_list);
                // console.log(resDel.data.event_list, "resDelList.data.event_list");
                // console.log(eventSomList);


                const dataListSom = eventSomList;
                // if (resSom.data.event_list.length > 0) {
                // if(eventSomList?.length==0){
                //     console.log('执行');
                //     console.log(resSom.data.event_list);

                //     setEvenSomList(resSom.data.event_list);
                // }else{
                dataListSom?.push(...resSom?.data?.event_list)
                // console.log(dataListSom);

                setEvenSomList(dataListSom)
                // }
                // }else if(resSom.data.event_list.length == 0){
                // // setEvenSomList(resSom.data.event_list);
                // setEvenSomList(dataListSom)
                // }
            }
            setShowModal(false)
        }

    }


    const onTabChange = async (tab) => {
        setPageSom(0)
        setPageDec(0)
        setPage(0)
        let subIndex;
        if (tabState === 'cryptovoxels') {
            subIndex = SUBTAB.findIndex((item) => item.type === subTabState);
        } else if (tabState === 'decentraland') {
            subIndex = SUBTABDECE.findIndex((item) => item.type === subTabState);
        }
        // console.log(subIndex, tabState);
        subIndex = subIndex === -1 ? 0 : subIndex;
        setTabState(tab);
        const sub = '';
        if (tab === 'cryptovoxels') {
            // sub = SUBTAB[subIndex].type;
            // setSubTabState(SUBTAB[subIndex].type);
            router.replace(`/event?tab=cryptovoxels`);
        } else if (tab === 'decentraland') {
            // sub = SUBTAB[subIndex].type;
            // setSubTabState(SUBTABDECE[subIndex].type);
            router.replace(`/event?tab=decentraland`);
        } else if (tab === 'somniumspace') {
            // sub = SUBTAB[subIndex].type;
            // setSubTabState(SUBTABDECE[subIndex].type);
            router.replace(`/event?tab=somniumspace`);
        }

    };

    // console.log(tabState, 9999999999);
    const onClinkDclDetail = (card) => {
        // console.log(card.status);
        if (card.status === 'Entry') {
            window.open(card.event_parcel_url);
        }

    }
    const onClinkCvDetail = (card) => {
        if (card.status === 'Entry') {
            window.open(card.event_parcel_url);
        }
    }

    const renderContent = React.useMemo(() => {

        // console.log(eventSomList);

        if (tabState === 'cryptovoxels') {
            return (
                <>
                    <div className={cn("grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 ", style.voEvent)}>
                        {eventCvList.map((card, idx) => {


                            return < EventDetail {...card} onClinkDetail={() => { onClinkCvDetail(card) }} />;
                        })}
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
        // if (tabState === 'somniumspace') {
        //     return (
        //         <>
        //             <div className={cn("grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 ", style.voEvent)}>
        //                 {eventSomList&&eventSomList.map((card, item) => {
        //                     return < EventDetail {...card} onClinkDetail={() => { onClinkDclDetail(card) }} />;
        //                 })}
        //             </div>
        //         </>
        //     )
        // }
    }, [tabState, eventDclList, eventCvList, eventSomList])

    // React.useEffect(()=>{
    //     requestData(1, 20)
    // },[])

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


    React.useEffect(() => {
        const listener = () => {
            if (document.getElementById('switch') && window.scrollY > 0) {
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

    return (
        <Page meta={meta} className={cn('detailName', style.detailName)}>
            {/* <Layout> */}
            <div className={style.containerBox} ref={headerRef}>
                <div id="switch" className={cn(' z-10', fixedState ? style.fix1 : null)}>
                    <PageHeader className="" active={'/event'} iconImgLight={false}/>
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
                                            ' flex',
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

                    {/* {renderContent} */}
                    {


                        tabState === 'decentraland' ?
                            <>
                                <div className={cn("grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 ", style.voEvent)}>
                                    {eventDclList && eventDclList.map((card, item) => {
                                        return < EventDetail {...card} onClinkDetail={() => { onClinkDclDetail(card) }} />;
                                    })}
                                </div>
                            </>
                            : ''
                    }
                    {
                        tabState === 'cryptovoxels' ?
                            <>
                                <div className={cn("grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 ", style.voEvent)}>
                                    {eventCvList && eventCvList.map((card, idx) => {
                                        return < EventDetail {...card} onClinkDetail={() => { onClinkCvDetail(card) }} />;
                                    })}
                                </div>
                            </>
                            : ''
                    }
                    {
                        tabState === 'somniumspace' ?
                            <>
                                <div className={cn("grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 ", style.voEvent)}>
                                    {eventSomList && eventSomList.map((card, item) => {
                                        return < EventDetail {...card} onClinkDetail={() => { onClinkDclDetail(card) }} />;
                                    })}
                                </div>
                            </>
                            : ''
                    }

                </div>
            </div>

            {/* </Layout> */}
            <Footer iconImgLight={false}/>
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