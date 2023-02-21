import React from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import * as Three from "three";
import cn from 'classnames';
import { Scene, WebGLRenderer, PerspectiveCamera, HemisphereLight, DirectionalLight, BoxHelper } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader.js';


import { req_detailWearableDcl_list } from '../../service/z_api';

import styles from './index.module.css';


interface Props {
    idx,
    model,
    graphicId?: string;
    cover_img?;
    creator_name?;
    wearable_name?;
    initFinish?: (se) => void;
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
    graphicId,
    initFinish,
    contract_address,
    item_id,
    openseaUrl,
    opensea_url,
}: Props) {

    const router = useRouter();
    const canvaRef = React.useRef(null);
    const sceneRef = React.useRef(null);
    const [selecete, setSelecete] = React.useState(false);
    // const [saveIconVal, setSaveIconVal] = React.useState(false);
    const goToDetail = React.useCallback((l, t) => {
        const res = req_detailWearableDcl_list(contract_address, item_id)

        router.replace(`/wearables/detailDcl/?contract_address=${contract_address}&item_id=${item_id}`);
    }, [item_id, contract_address]);
    const animation = React.useCallback(() => {
        // render(offsetY.current);
        // animationRef.current = requestAnimationFrame(animation);
    }, []);
    const initCan = React.useCallback(() => {
        const re = new WebGLRenderer({ canvas: canvaRef.current, antialias: true });
        re.setClearColor(0xffffff, 0);
        re.setPixelRatio(window.devicePixelRatio);
        // renderer.current = re;
        // if (canvaRef.current) {
        //   const domParams = canvaRef.current.getBoundingClientRect();
        //   offsetY.current = domParams.top;
        //   if (window.screenY > 0) {
        //     offsetY.current = offsetY.current + window.screenY;
        //   }
        //   animation();
        //   return;
        // }
        animation();
    }, [animation]);
    // const init = React.useCallback(() => {
    //     new Three.TextureLoader().load(
    //         "/static/C666青铜狮子C4D模型/thumbnail",
    //         texture => {
    //             const SIZE = 1;
    //             const img = texture.image;
    //             console.log(texture.image, 555555);

    //             let height = (img && img.height / 10) || SIZE;
    //             let width = (img && img.width / 10) || SIZE;
    //             const mat = new Three.MeshBasicMaterial({
    //                 map: texture,
    //                 side: Three.DoubleSide,
    //                 transparent: true
    //             });
    //             const geom = new Three.PlaneGeometry(width, height); //使用平面缓冲几何体
    //             const mesh = new Three.Mesh(geom, mat);
    //             mesh.position.set(0, 0, 0);
    //             mesh.scale.set(1, 1, 1);

    //             scene.add(mesh);
    //         }
    //     );

    // }, [initFinish]);

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
        new Three.TextureLoader().load(
            cover_img,
            texture => {
                const SIZE = 1;
                const img = texture.image;
                const height = (img && img.height / 10) || SIZE;
                const width = (img && img.width / 10) || SIZE;
                const mat = new Three.MeshBasicMaterial({
                    map: texture,
                    side: Three.DoubleSide,
                    transparent: true
                });
                const geom = new Three.PlaneGeometry(width, height); 
                const mesh = new Three.Mesh(geom, mat);
                mesh.position.set(0, 0, 0);
                mesh.scale.set(10, 10, 10);
                scene.add(mesh);
            }
        );
        if (!model.cover_img) {


            if (initFinish) {
                initFinish(scene);
            }
            return;
        }

        // add one random mesh to each scene
        // console.log(model.cover_img);

        if (initFinish) {


            initFinish(scene);
        }
        const re = new WebGLRenderer({ canvas: canvaRef.current, antialias: true });
        re.setClearColor(0xffffff, 1);
        re.setPixelRatio(window.devicePixelRatio);
        function render1() {
            re.render(scene, camera);
            // mesh.rotateY(0.01);
            window.requestAnimationFrame(render1);
        }
        render1()
    }, [initFinish]);
    React.useEffect(() => {
        // console.log(model,"model");
        // initCan()
        if (!model) {
            return;
        }
        init();
    }, [model, init]);





    return (
        <>
            <div className={styles.container}>
                {/* <div className={styles.imgBoxCon}><img src={cover_img} alt="" className={styles.boxCon} /></div> */}
                <div id={`webgl${graphicId}`} className={styles.graphic}>
                    <canvas
                        className={cn(
                            'absolute w-full top-0 left-0 flex-auto bg-transparent',
                            styles.graphicAll,
                        )}
                        ref={canvaRef}
                    ></canvas>
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
