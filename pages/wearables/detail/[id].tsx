import React from 'react';

import cn from 'classnames';
import Router from 'next/router';

import {
  Scene,
  PerspectiveCamera,
  HemisphereLight,
  DirectionalLight,
  BoxHelper,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader.js';

import Page from '../../../components/page';
import PageHeader from '../../../components/page-header';
import Footer from '../../../components/footer';

import api from '../../../lib/api';
import { SITE_NAME, META_DESCRIPTION } from '../../../common/const';

import { convert } from '../../../common/utils';

import style from './index.module.css';

export default function WearablesDetail({ artwork, artist, id }) {
  const meta = {
    title: `WearablesDetail- ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const artworkData = convert(artwork);
  const artistData = convert(artist);
  console.log(artistData);

  const sceneRef = React.useRef(null);
  const renderer = React.useRef(null);
  const animationRef = React.useRef(null);
  const [intro, setIntro] = React.useState(true);

  const removeIntro = React.useCallback(() => {
    setIntro(false);
  }, [null]);

  const render = React.useCallback(() => {
    if (!renderer.current || !sceneRef.current) {
      return;
    }
    const { targetMesh } = sceneRef.current.userData;
    if (targetMesh) {
      targetMesh.rotation.y = Date.now() * 0.001;
    }
    const { camera } = sceneRef.current.userData;
    renderer.current.render(sceneRef.current, camera);
  }, [null]);

  const animation = React.useCallback(() => {
    render();
    animationRef.current = requestAnimationFrame(animation);
  }, [render]);

  React.useEffect(() => {
    if (!artworkData.voxUrl) {
      return;
    }
    if (!renderer.current) {
      const re = new WebGLRenderer({ antialias: true });
      re.setClearColor(0xffffff, 0);
      re.setPixelRatio(window.devicePixelRatio);
      renderer.current = re;
      const scene = new Scene();
      const sceneElement = document.getElementById(`webgl${id}`);

      const camera = new PerspectiveCamera(50, 1, 1, 10);
      camera.position.z = 2;
      scene.userData.camera = camera;

      const controls = new OrbitControls(scene.userData.camera, re.domElement);
      controls.minDistance = 1.5;
      controls.maxDistance = 4;
      controls.enablePan = false;
      controls.enableZoom = true;
      scene.userData.controls = controls;

      scene.add(new HemisphereLight(0xaaaaaa, 0x444444));

      const light = new DirectionalLight(0xffffff, 0.5);
      light.position.set(1, 1, 1);
      scene.add(light);
      sceneRef.current = scene;

      // add one random mesh to each scene
      const loader = new VOXLoader();
      loader.load(artworkData.voxUrl, function (chunks) {
        for (let i = 0; i < chunks.length; i += 1) {
          const chunk = chunks[i];
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
          mesh.scale.setScalar((1 / maxDiameter) * 1.1); // 0.015
          scene.userData.targetMesh = mesh;
          //
          scene.add(mesh);
        }
      });
      re.setSize(sceneElement.clientWidth, sceneElement.clientHeight, true);
      sceneElement.appendChild(re.domElement);
    }
    animation();

    return () => {
      if (renderer.current) {
        // renderer.current.dispose();
        // renderer.current.forceContextLoss();
        // renderer.current.context = null;
        // renderer.current.domElement = null;
        // renderer.current = null;
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animation, artworkData]);

  return (
    <Page className={cn('min-h-screen flex flex-col', style.anPage)} meta={meta}>
      <div className="bg-black relative">
        <PageHeader className="relative z-10" active={'wearables'} />
      </div>
      <div
        className={cn('main-content flex flex-col justify-start items-start mt-5', style.content)}
      >
        <div className={cn('text-sm flex items-center', style.guide)}>
          <span
            className={cn('cursor-pointer', style.guideHome)}
            onClick={() => {
              Router.push('/wearables?type=wearables');
            }}
          >
            Wearables
          </span>
          <img className="ml-1 mr-2" src="/images/v5/arrow-simple.png"></img>
          <span className=" text-white">{artworkData.name}</span>
        </div>
        <div className="mt-5 flex justify-between items-start w-full">
          <div className={cn('relative', style.modelCard)}>
            {intro ? (
              <div
                className={cn('absolute w-full h-full z-30 pointer-events-none', style.animation)}
              >
                <div className={cn('animate-bounce', style.animationIcon)}></div>
              </div>
            ) : null}
            <div
              id={`webgl${id}`}
              onMouseDown={removeIntro}
              className={cn('w-full h-full z-10')}
            ></div>
            <img
              src="/images/Nomal.png"
              className={cn('absolute z-20', style.opese)}
              onClick={() => {
                window.open(artworkData.openseaUrl);
              }}
            ></img>
          </div>
          <div className={cn('ml-5 mt-5 flex-1', style.info)}>
            <div className=" flex items-center text-white text-xl font-medium">
              {artworkData.name}
            </div>
            <div className={cn(' mt-2', style.desc)}>{artworkData.desc}</div>

            <div className={cn('mt-7 w-full p-5 flex items-start justify-start', style.infoRow)}>
              <div>Voxel Artist：</div>
              <div className=" ml-2">
                <div className=" text-white">{artistData.name}</div>
                <div
                  className={cn('mt-2 flex items-center', style.other)}
                  onClick={() => {
                    window.open(artistData.website);
                  }}
                >
                  To check other works by the artist
                  <img className="ml-1 mr-2 cursor-pointer" src="/images/v5/arrow-simple.png"></img>
                </div>
              </div>
            </div>

            <div className={cn('mt-7 w-full p-5 flex items-center justify-start', style.infoRow)}>
              <div>Contact：</div>
              {artistData.contact.homepage ? (
                <img
                  className={cn(' ml-9 cursor-pointer', style.icon)}
                  src="/images/icon/home.png"
                  onClick={() => {
                    window.open(artistData.contact.homepage);
                  }}
                ></img>
              ) : null}
              {artistData.contact.twitter ? (
                <img
                  className={cn(' ml-9 cursor-pointer', style.icon)}
                  src="/images/twitter.png"
                  onClick={() => {
                    window.open(artistData.contact.twitter);
                  }}
                ></img>
              ) : null}
              {artistData.contact.weibo ? (
                <img
                  className={cn(' ml-10 cursor-pointer', style.icon)}
                  src="/images/weibo.png"
                  onClick={() => {
                    window.open(artistData.contact.weibo);
                  }}
                ></img>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Page>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const res = await api.getDaoWearableDetail(id);
  const { artwork, artist } = res.data[0];
  return {
    props: {
      artwork,
      artist,
      id,
    }, // will be passed to the page component as props
  };
}