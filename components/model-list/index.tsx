import React from 'react';
import cn from 'classnames';

import { WebGLRenderer } from 'three';
import WebglCard from '../webgl-graphic';

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
  models: Array<ModelCard>;
}

export default function ModelList({ models }: Props) {
  const [allScene, setAllScene] = React.useState([]);
  const renderer = React.useRef(null);
  const canvaRef = React.useRef(null);
  const animationRef = React.useRef(null);

  const updateSize = () => {
    if (!canvaRef.current) {
      return;
    }
    // async canvas and container window
    if (window.scrollY > 800) {
      canvaRef.current.style.transform = `translateY(${window.scrollY}px)`;
    } else {
      canvaRef.current.style.transform = `translateY(0px)`;
    }
    const width = canvaRef.current.clientWidth;
    const height = canvaRef.current.clientHeight;

    if (canvaRef.current.width !== width || canvaRef.current.height !== height) {
      renderer.current.setSize(width, height, false);
    }
  };

  const render = React.useCallback(() => {
    if (!allScene || allScene.length <= 0 || !renderer.current || !canvaRef.current) {
      return;
    }
    updateSize();
    renderer.current.setClearColor(0xffffff, 0);
    renderer.current.setScissorTest(false);
    renderer.current.clear();
    const base = canvaRef.current.getBoundingClientRect();
    renderer.current.setClearColor(0xffffff, 0);
    renderer.current.setScissorTest(true);

    allScene.forEach((scene) => {
      // so something moves
      const { targetRotation, targetMesh } = scene.userData;
      if (targetRotation && targetMesh) {
        targetMesh.rotation.y = Date.now() * 0.001;
      }

      // get the element that is a place holder for where we want to
      // draw the scene
      const { element } = scene.userData;

      // get its position relative to the page's viewport
      const rect = element.getBoundingClientRect();
      // check if it's offscreen. If so skip it
      if (
        rect.bottom < 0 ||
        rect.top > renderer.current.domElement.clientHeight ||
        rect.right < 0 ||
        rect.left > renderer.current.domElement.clientWidth + renderer.current.domElement.left
      ) {
        return; // it's off screen
      }

      // set the viewport
      const width = rect.right - rect.left;
      const height = rect.bottom - rect.top;
      const left = rect.left - base.left;
      const bottom = renderer.current.domElement.clientHeight - rect.bottom + base.top;

      renderer.current.setViewport(left, bottom, width, height);
      renderer.current.setScissor(left, bottom, width, height);

      const { camera } = scene.userData;

      // camera.aspect = width / height; // not changing in this example
      // camera.updateProjectionMatrix();

      // scene.userData.controls.update();

      renderer.current.render(scene, camera);
    });
  }, [updateSize]);

  const animation = React.useCallback(() => {
    render();
    animationRef.current = requestAnimationFrame(animation);
  }, [render]);

  const renderGraphic = React.useMemo(() => {
    const scenes = [];
    if (!models) {
      return;
    }
    const modelEle = models.map((model, idx) => {
      return (
        <WebglCard
          model={model}
          key={idx}
          graphicId={idx.toString()}
          initFinish={(se) => {
            scenes.push(se);
          }}
        ></WebglCard>
      );
    });
    setAllScene(scenes);
    return modelEle;
  }, [models]);

  const init = React.useCallback(() => {
    const re = new WebGLRenderer({ canvas: canvaRef.current, antialias: true });
    re.setClearColor(0xffffff, 0);
    re.setPixelRatio(window.devicePixelRatio);
    renderer.current = re;
    animation();
  }, [animation]);

  React.useEffect(() => {
    init();
    // return ()=>{
    //   if(renderer.current){
    //     renderer.current.dispose();
    //     renderer.current.forceContextLoss();
    //     renderer.current.context = null;
    //     renderer.current.domElement = null;
    //     renderer.current = null;
    //   }
    // }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [models, allScene]);

  return (
    <div id="container" className="relative w-full h-full">
      <canvas
        className={cn(
          'absolute w-full h-full top-0 left-0 flex-auto bg-transparent',
          styles.graphicAll,
        )}
        ref={canvaRef}
      ></canvas>
      <div className="w-full h-full top-0 left-0 grid grid-cols-3 gap-4 z-10">{renderGraphic}</div>
    </div>
  );
}
