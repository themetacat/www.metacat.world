import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, BoxHelper } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader.js';

import { req_detailWearableMona_list } from '../../service/z_api';

import styles from './index.module.css';

interface Props {
  idx;
  model;
  cover_img?;
  creator_name?;
  wearable_name?;
  name?;
  contract_address?;
  item_id?;
  wearable_id;
  creator_address;
  openseaUrl?;
  opensea_url?;
}

export default function CreationViverWearableList({
  idx,
  cover_img,
  model,
  creator_name,
  wearable_name,
  name,
  wearable_id,
  contract_address,
  creator_address,
  item_id,
  openseaUrl,
  opensea_url,
}: Props) {
    const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();
  const sceneRef = React.useRef(null);
  const [selecete, setSelecete] = React.useState(false);
  // const [saveIconVal, setSaveIconVal] = React.useState(false);
  
  const goToDetail = React.useCallback(
    (l, t) => {
      // const res = req_detailWearableMona_list( creator_address,wearable_id)

      router.replace(
        `/wearables/detailViverWear/?wearable_id=${wearable_id}`,
      );
    },
    [wearable_id],
  );
  React.useEffect(() => {
 
    // reqWearableList
  }, [cover_img]);
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying ===true) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  React.useEffect(() => {
    // cover_img 属性发生变化时更换 src 属性
    if (videoRef && videoRef.current) {
      videoRef.current.src = cover_img;
      videoRef.current.load();
    }
  }, [cover_img]);
  const handleEnded = () => {
    videoRef.current.currentTime = 0;
    videoRef.current.play();
  };

  return (
    <>
      <div
        className={styles.container}
      
      >
        <div className={styles.imgBoxCon}>
      
          <video id="my-video"  className={styles.boxCon} ref={videoRef}  onEnded={handleEnded}>
          <source src={cover_img} type="video/mp4" />
        </video>
          
          <div id="my-controls"  >
            <button id="play-pause-btn" onClick={togglePlay} className={styles.transmit}>   {isPlaying ? <img src='/images/icon/zanting.png' ></img> : <img src='/images/icon/bofang.png'></img>}</button>
          </div>
        </div>

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
        <div className={styles.footerBox} >
          <div className={styles.title}>{name}</div>
          <div className={styles.totalCon}>
            <span className={styles.artist}>Wearable Artist：</span>
            <span className={styles.text}>{creator_name}</span>
          </div>
        </div>
        <div className={styles.detailBox}   onClick={() => {
          goToDetail(wearable_id, creator_address);
        }}>
          Detail
          <img className=" ml-1" src="/images/v5/arrow-simple.png"></img>
        </div>
      </div>
    </>
  );
}
