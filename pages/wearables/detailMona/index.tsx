import React from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { SITE_NAME, META_DESCRIPTION } from '../../../common/const';

import Page from '../../../components/page';
import PageHeader from '../../../components/top-navigation';

import { req_detailWearableMona_list } from '../../../service/z_api';


import style from './index.module.css';

interface Props {
    idx,
    model,
    cover_img?;
    creator_name?;
    wearable_name?;
    contract_address?;
    wearable_id?;
    is_exists?;
    creator_address?;
}

const meta = {
    title: `Wearables - ${SITE_NAME}`,
    description: META_DESCRIPTION,
};



export default function CreationWearableList({
    idx,
    cover_img,
    model,
    creator_name,
    wearable_name,
    contract_address,
    is_exists,
    wearable_id,
    creator_address,
}: Props) {

    const router = useRouter();
    const sceneRef = React.useRef(null);
    const [fixedState, setFixedState] = React.useState(false);
    const [coverImg, setCoverImg] = React.useState(null);
    const [creatorName, setCreatorName] = React.useState(null);
    const [wearableName, setWearableName] = React.useState(null);
    const [creatorAddress, setCreatorAddress] = React.useState(null);
    const [description, setDescription] = React.useState(null);
    const [isExists, setIsExists] = React.useState(null);
    const [contact, setContact] = React.useState(null);
    // const [saveIconVal, setSaveIconVal] = React.useState(false);

    const reqWearableList = (l, t) => {
        const res = req_detailWearableMona_list(router.query.creator_address, router.query.wearable_id)
        res.then((resWear) => {
            setCoverImg(resWear.data.cover_img)
            setCreatorName(resWear.data.creator_name)
            setWearableName(resWear.data.wearable_name)
            setCreatorAddress(resWear.data.creator_address)
            setDescription(resWear.data.description)
            setIsExists(resWear.data.is_exists)
            setContact(resWear.data.contact)

        })
    }

    React.useEffect(() => {

        reqWearableList(creator_address, wearable_id)
    }, [router.query.creator_address, router.query.wearable_id]);

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

    const InforPage = () => {
        // console.log("查看信息页面？");
        if (isExists === 2) {
            router.replace(`/topic/${creatorAddress}?type=wearables`);
        }

    }



    return (
        <Page className="min-h-screen" meta={meta}>
            <div className={cn('', fixedState ? style.fix1 : null)}>
                <PageHeader className="relative z-10" active={'wearables'} />
            </div>
            <div
                className={cn('main-content flex flex-col justify-start items-start mt-5', style.content)}
            >
                <div className={style.headerBox}>
                    <span className={style.authorName} onClick={isExists === 1 ? InforPage : null}>{creatorName}</span>
                    <img className="ml-1 mr-2" src="/images/v5/arrow-simple.png"></img>
                    <span className={style.productionName}>{wearableName}</span>
                </div>
                <div className={style.container}>
                    <img src={coverImg} alt="" className={style.imgBox} />
                    <div className={style.instructionBox}>
                        <span className={style.productionName1}>{wearableName}</span>
                        <div className={style.inst}>{description}</div>
                        <div className={cn('mt-7 w-full p-5 flex items-start justify-start', style.infoRow)}>
                            <span className={cn('text-white', style.createrName)} >Voxel Artist：</span>
                            <span className={cn('text-white')}>{creatorName}</span>
                        </div>
                        <div className={cn('mt-7 w-full p-5 flex items-start justify-start', style.infoRow)}>
                            <span className={cn('text-white', style.createrName)} >Contact：</span>
                            <span className=" text-white">
                                {contact?.homepage !== '' ? (
                                    <img
                                        className={cn(' ml-9 cursor-pointer', style.icon)}
                                        src="/images/icon/home.png"
                                        onClick={() => {
                                            window.open(contact.homepage);
                                        }}
                                    ></img>
                                ) : null}
                                {contact?.twitter !== '' ? (
                                    <img
                                        className={cn(' ml-9 cursor-pointer', style.icon)}
                                        src="/images/twitter.png"
                                        onClick={() => {
                                            window.open(contact.twitter);
                                        }}
                                    ></img>
                                ) : null}
                                {contact?.weibo !== '' ? (
                                    <img
                                        className={cn(' ml-10 cursor-pointer', style.icon)}
                                        src="/images/weibo.png"
                                        onClick={() => {
                                            window.open(contact.weibo);
                                        }}
                                    ></img>
                                ) : null}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </Page>
    );
}








