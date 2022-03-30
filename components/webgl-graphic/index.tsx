import React from 'react';

import Router from 'next/router';
import cn from 'classnames';
import { Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, BoxHelper } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader.js';

import styles from './index.module.css';

type ModelCard = {
  kol?: Kol;
  artist?: Artist;
  id?: string;
};

type Contact = {
  twitter?: string;
  weibo?: string;
};

type Kol = {
  name?: string;
  title?: string;
  desc?: string;
  d2Url?: string;
  d3Url?: string;
  contact?: Contact;
};

type Artist = {
  name?: string;
  website?: string;
};

interface Props {
  graphicId?: string;
  initFinish?: (se) => void;
  model?: ModelCard;
}

// {
//   "kol": {
//     "name": "比特币子琪",
//     "title": "",
//     "desc": "",
//     "2d_url": "https://poster-phi.vercel.app/wearable/okx/BTC521.png",
//     "3d_url": "https://poster-phi.vercel.app/wearable/okx/BTC521.vox",
//     "contact": {
//       "twitter": "https://twitter.com/BTC521",
//       "weibo": ""
//     }
//   },
//   "artist": {
//     "name": "MERMAID",
//     "website": ""
//   },
//   "id": 100
// },

export default function WebglCard({ graphicId, initFinish, model }: Props) {
  const sceneRef = React.useRef(null);

  const goToDetail = React.useCallback(() => {
    Router.push(`/wearables/detail/${model.id}`);
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

    if (!model.kol.d3Url) {
      if (initFinish) {
        initFinish(scene);
      }
      return;
    }
    // add one random mesh to each scene
    const loader = new VOXLoader();
    loader.load(model.kol.d3Url, function (chunks) {
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
        mesh.scale.setScalar((1 / maxDiameter) * 0.9); // 0.015
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
    init();
  }, [init]);

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
        <img
          src={model.kol.d2Url}
          className={cn('absolute top-0 left-0 z-20', styles.avatar)}
        ></img>
        <div id={`webgl${graphicId}`} className={styles.graphic}></div>
      </div>
      <div
        className={cn('flex flex-col justify-start items-center p-4 text-white', styles.footer)}
        onClick={goToDetail}
      >
        <div className="flex justify-between items-center w-full text-lg font-medium">
          {model.kol.name}
          <span className={cn('flex justify-between items-center cursor-pointer', styles.goDetail)}>
            {`Detail`}
            <img className=" ml-1" src="/images/v5/arrow-simple.png"></img>
          </span>
        </div>
        <div className="flex justify-between items-center w-full  mt-3">
          <div className={cn('flex justify-between items-center', styles.contact)}>
            {model.kol.contact.twitter ? (
              <img
                className={cn(' cursor-pointer', styles.icon)}
                src="/images/twitter.png"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(model.kol.contact.twitter);
                }}
              ></img>
            ) : null}
            {model.kol.contact.weibo ? (
              <img
                className={cn(
                  model.kol.contact.weibo ? 'ml-5' : null,
                  'cursor-pointer',
                  styles.icon,
                )}
                src="/images/weibo.png"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(model.kol.contact.weibo);
                }}
              ></img>
            ) : null}
          </div>
          <div className="flex items-end flex-col justify-center text-xs text-right">
            <div className={styles.goDetail}>Voxel Artist</div>
            <div>{model.artist.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
