import React from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import cn from 'classnames';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, BoxHelper } from 'three';

import { SITE_NAME, META_DESCRIPTION } from '../../../common/const';
import Page from '../../../components/page';
import PageHeader from '../../../components/top-navigation';

import { req_detailWearableDcl_list } from '../../../service/z_api';

import style from './index.module.css';

interface Props {
  idx;
  model;
  cover_img?;
  creator_name?;
  wearable_name?;
  contract_address?;
  item_id?;
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
  item_id,
}: Props) {
  const canvasRef = React.useRef(null);
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

  const reqWearableList = React.useCallback(
    (l, t) => {
      const res = req_detailWearableDcl_list(router.query.contract_address, router.query.item_id);
      // console.log(res,1222);
      res.then((resWear) => {
        setCoverImg(resWear.data.cover_img);
        setCreatorName(resWear.data.creator_name);
        setWearableName(resWear.data.wearable_name);
        setCreatorAddress(resWear.data.creator_address);
        setDescription(resWear.data.description);
        setIsExists(resWear.data.is_exists);
        setContact(resWear.data.contact);
      });
    },
    [router.query.contract_address, router.query.item_id],
  );

  const init = React.useCallback(() => {
    // reqWearableList(contract_address, item_id);
    const res = req_detailWearableDcl_list(router.query.contract_address, router.query.item_id);
    res.then((resWear) => {
      setCoverImg(resWear.data.cover_img);
      setCreatorName(resWear.data.creator_name);
      setWearableName(resWear.data.wearable_name);
      setCreatorAddress(resWear.data.creator_address);
      setDescription(resWear.data.description);
      setIsExists(resWear.data.is_exists);
      setContact(resWear.data.contact);
      const scene = new THREE.Scene();
      const aspectRatio = 500 / 500;
      const camera = new THREE.PerspectiveCamera(30, 1, 2, 1000);
      // (45,0.5,1,1000)
      camera.position.z = 10;
      camera.position.set(0, 1, 5);
      scene.userData.camera = camera;
      // const sceneElement = document.getElementById('canvas');
      scene.userData.element = canvasRef.current;
      const controls = new OrbitControls(camera, scene.userData.element);
      controls.target.set(0, 2, 0);
      camera.lookAt(0, 2, 0); // 设置相机的目标位置
//       camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientWidth;
// camera.updateProjectionMatrix();
      controls.minDistance = 3;
      controls.maxDistance = 7;
      controls.enablePan = true;
      controls.enableZoom = false;
      scene.userData.controls = controls;
      scene.add(new HemisphereLight(0xaaaaaa, 0x444444));
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
      renderer.setSize(500,500);

      const loader = new GLTFLoader();
      const url = coverImg;
      sceneRef.current = scene;
      scene.background = new THREE.Color(0x00102525);
      let modelGlft;

      loader?.load(
        resWear?.data?.cover_img,
        function (gltf) {
          modelGlft = gltf.scene;
          // modelGlft.scale.set(1.3, 1.3, 1.3);
          modelGlft.position.set(0, 1, 0);
          scene.add(modelGlft);

         
        },
        undefined,
        (error) => {
          console.log(error);
        },
      );
      function animate() {
        requestAnimationFrame(animate);
        if (modelGlft) {
          // 判断模型是否已加载完成
          modelGlft.rotation.y += 0.01; // 控制模型自动旋转
        }
        renderer.render(scene, camera);
      }
      animate();
    });
  }, [router.query.contract_address, router.query.item_id]);

  React.useEffect(() => {
    init();
  }, [router.query.contract_address, router.query.item_id]);

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
    if (isExists === 2) {
      router.replace(`/topic/${creatorAddress}?type=wearables`);
    }
  };

  return (
    <Page className="min-h-screen" meta={meta}>
      <div className={cn('', fixedState ? style.fix1 : null)}>
        <PageHeader className="relative z-10" active={'wearables'} />
      </div>
      <div
        className={cn('main-content flex flex-col justify-start items-start mt-5', style.content)}
      >
        <div className={style.headerBox}>
          <span className={style.authorName} onClick={isExists === 1 ? InforPage : null}>
            {creatorName}
          </span>
          <img className="ml-1 mr-2" src="/images/v5/arrow-simple.png"></img>
          <span className={style.productionName}>{wearableName}</span>
        </div>
        <div className={cn('relative w-full h-full', style.container)}>
          {
            coverImg === 'https://peer.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xcc45ca8992dad5003769f59ade46ba132908dc6b:0/thumbnail'?<img src={coverImg} alt=""className={cn(
              'absolute w-full h-full top-0 left-0 flex-auto  bg-transparent',
              style.graphicAll,
            )} />: <canvas
            className={cn(
              'absolute w-full h-full top-0 left-0 flex-auto  bg-transparent',
              style.graphicAll,
            )}
            ref={canvasRef}
            // id="canvas
          ></canvas>
          }
          {/* <img src={coverImg} alt="" className={style.imgBox} /> */}
          <canvas
            className={cn(
              'absolute w-full h-full top-0 left-0 flex-auto  bg-transparent',
              style.graphicAll,
            )}
            ref={canvasRef}
            // id="canvas"
          ></canvas>
          <div className={style.instructionBox}>
            <span className={style.productionName1}>{wearableName}</span>
            <div className={style.inst}>{description}</div>
            <div className={cn('mt-7 w-full p-5 flex items-start justify-start', style.infoRow)}>
              <span className={cn('text-white', style.createrName)}>Voxel Artist：</span>
              <span className={cn('text-white')}>{creatorName}</span>
            </div>
            <div className={cn('mt-7 w-full p-5 flex items-start justify-start', style.infoRow)}>
              <span className={cn('text-white', style.createrName)}>Contact：</span>
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
