import React, { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

import cn from 'classnames';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, BoxHelper } from 'three';

import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader.js';

import { req_detailWearableDcl_list } from '../../service/z_api';

import styles from './index.module.css';

interface Props {
  idx;
  model;
  cover_img?;
  creator_name?;
  wearable_name?;
  contract_address?;
  initDe: () => void;
  item_id?;
  openseaUrl?;
  key?;
  graphicId?;
  opensea_url?;
}

export default function CreationWearableList({
  idx,
  key,
  cover_img,
  model,
  creator_name,
  wearable_name,
  initDe,
  graphicId,
  contract_address,
  item_id,
  openseaUrl,
  opensea_url,
}: Props) {
  const canvasRef = useRef(null);
  const animationRef = React.useRef(null);
  const offsetY = React.useRef(null);
  const router = useRouter();
  const sceneRef = React.useRef(null);

  const [selecete, setSelecete] = React.useState([]);
  // const [saveIconVal, setSaveIconVal] = React.useState(false);
  const goToDetail = React.useCallback(
    (l, t) => {
      const res = req_detailWearableDcl_list(contract_address, item_id);

      router.replace(
        `/wearables/detailDcl/?contract_address=${contract_address}&item_id=${item_id}`,
      );
    },
    [item_id, contract_address],
  );
  // console.log(model,'model');

  const init = () => {
    const loader = new GLTFLoader();
    const hemisphereLight = new HemisphereLight(0xaaaaaa, 0x444444);
    const rendererList = [];

    const scene = new THREE.Scene();
    // console.log(scene, 5656);

    const camera = new THREE.PerspectiveCamera(45, 0.5, 1, 1000);
    camera.position.z = 3;
    camera.position.set(0, 5, 5);
    // camera.fov = 75;
    scene.userData.camera = camera;

    const sceneElement = document.getElementById(graphicId);

    scene.userData.element = canvasRef.current;
    const controls = new OrbitControls(camera, sceneElement);
    controls.target.set(0, 2, 0);

    controls.minDistance = 5;
    controls.maxDistance = 5;
    controls.enablePan = true;
    controls.enableZoom = false;
    scene.userData.controls = controls;
    scene.add(hemisphereLight);
    const renderer = new THREE.WebGLRenderer({
      canvas: sceneElement,
      antialias: true,
    });
    rendererList.push(renderer);
    // console.log(renderer.domElement, 'renderer.domElement');
    // console.log(rendererList, 'rendererList');

    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientWidth);
    // renderer.clear();
    // document.body.appendChild(renderer.domElement);
    // const loader = new GLTFLoader();
    // console.log(cover_img, model);
    const coverImages = [];
    model.forEach((item) => {
      coverImages.push(item.cover_img);
    });
    // console.log(coverImages, 'coverImages');

    // const url= coverImages.splice(0, 16);
    const url= cover_img;
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x00202829);



    loader.load(
      url,

      function (gltf) {
        const modelGlft = gltf.scene;

        scene.add(modelGlft);
      },
      undefined,
      (error) => {
        console.log(error);
      },
    );
    function animate() {
      requestAnimationFrame(animate);

      renderer.render(scene, camera);
    }
    console.log(renderer);
    animate();

    // // 销毁旧的renderer
    // function destroyRenderer() {
    //   console.log(222);

    //   const rendererDis = rendererList.shift();
    //   console.log(rendererDis, 'rendererDisrendererDisrendererDisrendererDis');

    //   rendererDis.dispose();
    // }

    // // 检查渲染器数量并销毁其中一个
    // function checkRendererCount() {
    //   console.log(11111);

    //   const maxRendererCount = 15;
    //   while (rendererList.length >= maxRendererCount) {
    //     destroyRenderer();
    //   }
    // }
    // checkRendererCount();
    // // 监听window.resize事件，更新渲染器大小
    // function handleWindowResize(rendererDis) {
    //   window.addEventListener('resize', () => {
    //     const w = window.innerWidth;
    //     const h = window.innerHeight;
    //     renderer.setSize(w, h);
    //   });
    // }
    // 创建并显示一个新的canvas和渲染器
    // function addCanvas() {
    //   const canvas = document.createElement('canvas');
    //   document.body.appendChild(canvas);

    //   const renderer = createRenderer(canvas);
    //   handleWindowResize(renderer);

    //   checkRendererCount();
    // }
  };

  const triggerModelRotation = React.useCallback((roatation) => {
    if (sceneRef.current) {
      sceneRef.current.userData.targetRotation = roatation;
    }
  }, []);

  // React.useEffect(() => {
  //     init();
  //   function animate() {
  //     requestAnimationFrame(animate);
  //   }
  //   animate();
  // }, []);

  return (
    <>
      <div className={styles.container}>
        <div
          className={cn('relative w-full h-full', styles.imgBoxCon)}
          onMouseEnter={() => {
            triggerModelRotation(true);
          }}
          onMouseLeave={() => {
            triggerModelRotation(false);
          }}
        >
          <img src={cover_img} alt="" className={styles.boxCon} />
          {/* <canvas
            className={cn(
              'absolute w-full h-full top-0 left-0 flex-auto  bg-transparent',
              styles.graphicAll,
            )}
            ref={canvasRef}
            id={graphicId}
          ></canvas> */}
        </div>
        <div className={cn('')}>
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
            <div className={styles.totalCon}>
              <span className={styles.artist}>Wearable Artist：</span>
              <span className={styles.text}>{creator_name}</span>
            </div>
          </div>
          <div
            className={styles.detailBox}
            onClick={() => {
              goToDetail(item_id, contract_address);
            }}
          >
            Detail
            <img className=" ml-1" src="/images/v5/arrow-simple.png"></img>
          </div>
        </div>
      </div>
    </>
  );
}
