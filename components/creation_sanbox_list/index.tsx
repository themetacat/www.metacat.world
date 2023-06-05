import React from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, BoxHelper } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader.js';


import styles from './index.module.css';


interface Props {
    idx,
    model,
    cover_img?;
    creator_name?;
    name?;
    contract_address?;
    item_id?;
    wearable_id,
    creator_address,
    openseaUrl?;
    created_by_url?;
    opensea_url?;
}



export default function CreationMonaWearableList({
    idx,
    cover_img,
    model,
    creator_name,
    name,
    wearable_id,
    contract_address,
    creator_address,
    item_id,
    openseaUrl,
    created_by_url,
    opensea_url,
}: Props) {

    const router = useRouter();
    const sceneRef = React.useRef(null);
    const [selecete, setSelecete] = React.useState(false);
    // const [saveIconVal, setSaveIconVal] = React.useState(false);
    const goToDetail = React.useCallback((l, t) => {

        router.replace(`/wearables/detailSandBox/?avatar_id=${wearable_id}`);
    }, [wearable_id]);



    return (
        <>
            <div className={styles.container} >
                <div className={styles.imgBoxCon}><img src={cover_img} alt="" className={styles.boxCon} /></div>
                <div>
                    {openseaUrl || opensea_url ||created_by_url? (
                        <img
                            src="/images/Nomal.png"
                            className={cn('absolute z-20', styles.opese)}
                            onClick={() => {
                                window.open(openseaUrl || opensea_url||created_by_url);
                            }}
                        ></img>
                    ) : null}
                </div>
                <div className={styles.footerBox}>
                    <div className={styles.title}>{name}</div>
                    <div className={styles.totalCon}><span className={styles.artist}>Wearable Artist：</span><span className={styles.text}>{creator_name}</span></div>
                </div>
                <div className={styles.detailBox} onClick={() => { goToDetail(wearable_id, creator_address) }}>Detail
                    <img className=" ml-1" src="/images/v5/arrow-simple.png"></img>
                </div>
            </div>
        </>
    );
}
