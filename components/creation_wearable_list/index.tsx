import React from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, BoxHelper } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader.js';

import { req_detailWearableDcl_list } from '../../service/z_api';

import styles from './index.module.css';


interface Props {
    idx,
    model,
    cover_img?;
    creator_name?;
    wearable_name?;
    contract_address?;
    item_id?;
    openseaUrl?;
    opensea_url?;
}



export default function CreationWearableList({
    idx,
    cover_img,
    model,
    creator_name,
    wearable_name,
    contract_address,
    item_id,
    openseaUrl,
    opensea_url,
}: Props) {

    const router = useRouter();
    const sceneRef = React.useRef(null);
    const [selecete, setSelecete] = React.useState(false);
    // const [saveIconVal, setSaveIconVal] = React.useState(false);
    const goToDetail = React.useCallback((l, t) => {
        const res = req_detailWearableDcl_list(contract_address, item_id)

        router.replace(`/wearables/detailDcl/?contract_address=${contract_address}&item_id=${item_id}`);
    }, [item_id, contract_address]);




    return (
        <>
            <div className={styles.container}>
                <div className={styles.imgBoxCon}><img src={cover_img} alt="" className={styles.boxCon} /></div>
                <div>
                    {openseaUrl || opensea_url ? (
                        <img
                            src="/images/Nomal.png"
                            className={cn('absolute z-20', styles.opese)}
                            onClick={() => {
                                window.open(openseaUrl || opensea_url);
                            }}
                        ></img>
                    ) : null}
                </div>
                <div className={styles.footerBox}>
                    <div className={styles.title}>{wearable_name}</div>
                    <div className={styles.totalCon}><span className={styles.artist}>Wearable Artist：</span><span className={styles.text}>{creator_name}</span></div>
                </div>
                <div className={styles.detailBox} onClick={() => { goToDetail(item_id, contract_address) }}>Detail
                    <img className=" ml-1" src="/images/v5/arrow-simple.png"></img>
                </div>
            </div>
        </>
    );
}