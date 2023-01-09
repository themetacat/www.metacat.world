import React from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, BoxHelper } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader.js';

import { req_set_wearable_show_status } from '../../service/z_api';

import styles from './index.module.css';

interface Props {
  graphicId?: string;
  initFinish?: (se) => void;
  model?;
  tabState?;
  id?;
  name?;
  token?;
  wearablesShowOrHideState?;
  wearablesShowOrHide?;
  onClick?;
  wearablesSleceteIdList?;
  batchShowOrHide?;
  type?;
  address?;
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

export default function DaoWebglCard({
  graphicId,
  initFinish,
  model,
  tabState,
  id,
  name,
  token,
  wearablesShowOrHideState,
  wearablesShowOrHide,
  onClick,
  wearablesSleceteIdList,
  batchShowOrHide,
  type,
  address,
}: Props) {
  const router = useRouter();
  const sceneRef = React.useRef(null);
  const [selecete, setSelecete] = React.useState(false);
  const goToDetail = React.useCallback(() => {
    console.log(type,address);
    
    if (type === 'topicNewBuilding') {
      // router.replace(`/wearables/detail/${model.id}?type=${'topicNewBuilding'}&address=${address}`);
      window.open(`/wearables/detail/${model.id}?type=${'topicNewBuilding'}&address=${model.address}`);
      // window.open(`/wearables/detail/${model.id}?type=${'topic'}&address=${address}`)
    } else {
      // router.replace(`/wearables/detail/${model.id}?type=${'mywearables'}`);
      window.open(`/wearables/detail/${model.id}?type=${'topic'}&address=${model.address ||address}`);
    }
  }, [tabState, id, address]);

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

    if (!model.coverImg) {
      if (initFinish) {
        initFinish(scene);
      }
      return;
    }

    // add one random mesh to each scene
    const loader = new VOXLoader();
    loader.load(model.coverImg, function (chunks) {
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
    
    if (!model) {
      return;
    }
    init();
  }, [model, init]);

  const triggerModelRotation = React.useCallback((roatation) => {
    if (sceneRef.current) {
      sceneRef.current.userData.targetRotation = roatation;
    }
  }, []);

  const changeShowOrHide = React.useCallback(async (event) => {
    event.stopPropagation();
    //   const result = await req_set_wearable_show_status(await token, model.id, model.show_status === 1 ? 2 : 1)
    //   if (result.code === 100000) {
    //     if (model.show_status === 1) {
    //       toast.success("Successfully hidden! ")
    //     } else {
    //       toast.success("Successfully shown! ")
    //     }
    //   } else {
    //     toast.error("Failed!")
    //   }
    batchShowOrHide(model.id, model.show_status === 1 ? 2 : 1);
  }, []);
  React.useEffect(() => {
    if (wearablesSleceteIdList && wearablesSleceteIdList.findIndex((i) => model.id === i) !== -1) {
      setSelecete(true);
    } else {
      setSelecete(false);
    }
  }, [wearablesSleceteIdList]);



  return (
    <>
      <div
        className={cn('z-10  relative', styles.card)}
        onMouseEnter={() => {
          triggerModelRotation(true);
        }}
        onMouseLeave={() => {
          triggerModelRotation(false);
        }}
      >
        {wearablesShowOrHideState && model && wearablesShowOrHide === model.show_status ? (
          <div className={styles.shade}></div>
        ) : null}
        {wearablesShowOrHideState && model && wearablesShowOrHide !== model.show_status ? (
          <>
            <div
              className={styles.selectShade}
              onClick={() => {
                onClick(model.id);
              }}
            ></div>
            <img
              src={model ? '/images/Group1.png' : '/images/Group2.png'}
              className={styles.changeImg}
            />
          </>
        
          
        ) : null}
        <div className="relative">
          <div id={`webgl${graphicId}`} className={styles.graphic}></div>
          {model && model.openseaUrl ? (
           
            <img
              src="/images/Nomal.png"
              className={cn('absolute z-20', styles.opese)}
              onClick={() => {
                window.open(model.openseaUrl);
              }}
            ></img>
          ) : null}
        </div>
        <div
          className={cn('flex justify-start items-center  text-white', styles.footer)}
          onClick={goToDetail}
        >
          <div className={cn("flex flex-col justify-start items-start w-full text-lg font-medium", styles.bigbox)}>
            <div className={styles.model}>  <span className={cn('truncate', styles.title)}>{model ? model.name : null}</span></div>
            <div className={cn('flex items-end justify-center text-xs', styles.goDetail)}>
              <div className={styles.artist}>Voxel Artist：</div>
              <div className={styles.text}> {model ? model.creator_name||model.creatorName : null}</div>
            </div>
          </div>
          <div className={styles.container}>
            <span className={cn('flex  items-center cursor-pointer ml-4', styles.goDetail2)}>
              {`Detail`}
              <img className=" ml-1" src="/images/v5/arrow-simple.png"></img>
            </span>
          </div>
        </div>
        {!type && model && model.show_status ? (
          <div className={styles.showOrHide} onClick={changeShowOrHide}>
            {model && model.show_status === 2 ? `Show` : `Hide`}
          </div>
        ) : null}

      </div>
    </>
  );
}
