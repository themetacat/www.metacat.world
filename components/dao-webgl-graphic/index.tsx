import React from 'react';

import Router from 'next/router';
import cn from 'classnames';
import { Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, BoxHelper } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader.js';

import styles from './index.module.css';

type DaoArtist = {
  name?: string;
  contact?: Contact;
};

type Contact = {
  twitter?: string;
  weibo?: string;
  homepage?: string;
};

type Artwork = {
  name?: string;
  desc?: string;
  voxUrl?: string;
  openseaUrl?: string;
};

type DaoCard = {
  artwork?: Artwork;
  artist?: DaoArtist;
  id?: string;
};

interface Props {
  graphicId?: string;
  initFinish?: (se) => void;
  model?: DaoCard;
}

// {
//   "artwork": {
//     "name": "比特币子琪",
//     "desc": "微博@公众号：子棋-热搜点评员 专注行情分析，挖掘优质项目！ Weibo and WeChat public account: Bitcoin Ziqi, focusing on market analysis,discover high-quality projects. #BTC $ETH",
//     "vox_url": "https://poster-phi.vercel.app/wearable/okx/BTC521.vox",
//     "opensea_url": "https://opensea.io/assets/matic/0x469da19448b0fafcf781350efcd5a09267ca1f99/60"
//   },
//   "artist": {
//     "name": "Angelica",
//     "contact": {
//       "homepape": "https://www.xuechun.space/",
//       "twitter": "https://twitter.com/BTC521",
//       "weibo": "https://weibo.com/u/6201825184"
//     }
//   },
//   "id": 100
// },

export default function DaoWebglCard({ graphicId, initFinish, model }: Props) {
  const sceneRef = React.useRef(null);
  const goToDetail = React.useCallback(() => {
    console.log(process.env.NEXT_PUBLIC_HOST_ADDRESS);
    window.open(`${process.env.NEXT_PUBLIC_HOST_ADDRESS}wearables/detail/${model.id}`);
    // Router.push(`/wearables/detail/${model.id}`);
  }, [model]);

  const init = React.useCallback(() => {
    const scene = new Scene();

    const containerId = `webgl${graphicId}`;
    const sceneElement = document.getElementById(containerId);
    // the element that represents the area we want to render the scene
    scene.userData.element = sceneElement;

    const camera = new PerspectiveCamera(50, 1, 1, 10);
    camera.position.z = 2;
    scene.userData.camera = camera;

    const controls = new OrbitControls(scene.userData.camera, scene.userData.element);
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.enablePan = true;
    controls.enableZoom = false;
    scene.userData.controls = controls;

    scene.add(new HemisphereLight(0xaaaaaa, 0x444444));

    const light = new DirectionalLight(0xffffff, 0.5);
    light.position.set(1, 1, 1);
    scene.add(light);
    sceneRef.current = scene;

    if (!model.artwork.voxUrl) {
      if (initFinish) {
        initFinish(scene);
      }
      return;
    }

    // add one random mesh to each scene
    const loader = new VOXLoader();
    loader.load(model.artwork.voxUrl, function (chunks) {
      for (let i = 0; i < chunks.length; i += 1) {
        const chunk = chunks[i];
        // displayPalette( chunk.palette );
        const mesh = new VOXMesh(chunk);
        mesh.name = 'targetMesh';
        const boxHelper = new BoxHelper(mesh);
        boxHelper.geometry.computeBoundingBox();
        const box = boxHelper.geometry.boundingBox;
        const maxDiameter = Math.max(
          box.max.x - box.min.x,
          box.max.y - box.min.y,
          box.max.z - box.min.z,
        );
        mesh.scale.setScalar(1 / maxDiameter); // 0.015
        scene.userData.targetMesh = mesh;
        scene.userData.targetRotation = false;
        scene.add(mesh);
      }
    });

    if (initFinish) {
      initFinish(scene);
    }
  }, [initFinish]);

  React.useEffect(() => {
    if (!model.artwork) {
      return;
    }
    init();
  }, [model, init]);

  const triggerModelRotation = React.useCallback((roatation) => {
    if (sceneRef.current) {
      sceneRef.current.userData.targetRotation = roatation;
    }
  }, []);

  return (
    <div
      className={cn('z-10 p-4', styles.card)}
      onMouseEnter={() => {
        triggerModelRotation(true);
      }}
      onMouseLeave={() => {
        triggerModelRotation(false);
      }}
    >
      <div className="relative">
        <div id={`webgl${graphicId}`} className={styles.graphic}></div>
        {model.artwork?.openseaUrl ? (
          <img
            src="/images/Nomal.png"
            className={cn('absolute z-20', styles.opese)}
            onClick={() => {
              window.open(model.artwork.openseaUrl);
            }}
          ></img>
        ) : null}
      </div>
      <div
        className={cn('flex justify-start items-center p-4 text-white', styles.footer)}
        onClick={goToDetail}
      >
        <div className="flex flex-col justify-start items-start w-full text-lg font-medium">
          <span title={model.artwork?.name} className={cn('truncate', styles.title)}>
            {model.artwork?.name}
          </span>
          <div
            className={cn('flex items-end justify-center text-xs text-right mt-4', styles.goDetail)}
          >
            <div>Voxel Artist：</div>
            <div>{model.artist.name}</div>
          </div>
        </div>
        <span className={cn('flex justify-between items-center cursor-pointer', styles.goDetail2)}>
          {`Detail`}
          <img className=" ml-1" src="/images/v5/arrow-simple.png"></img>
        </span>
      </div>
    </div>
  );
}
