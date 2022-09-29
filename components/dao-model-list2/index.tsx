import React from 'react';
import cn from 'classnames';

import { v4 as uuid } from 'uuid';
import { WebGLRenderer } from 'three';
import DaoWebglCard2 from '../dao-webgl-graphic2';
import styles from './index.module.css';

type Props = {
  models?;
  tabState?;
  id?;
  saveIconVal?;
  name?;
  token?;
  wearablesShowOrHideState?;
  wearablesShowOrHide?;
  length?;
  onClick?;
  wearablesSleceteIdList?;
  batchShowOrHide?;
  type?;
  address?;
};

export default function DaoModelList({
  models,
  tabState,
  id,
  name,
  saveIconVal,
  token,
  wearablesShowOrHideState,
  wearablesShowOrHide,
  length,
  onClick,
  wearablesSleceteIdList,
  batchShowOrHide,
  type,
  address,
}: Props) {
  const [allScene, setAllScene] = React.useState([]);
  const renderer = React.useRef(null);
  const canvaRef = React.useRef(null);
  const animationRef = React.useRef(null);
  const offsetY = React.useRef(null);

  const updateSize = (offY?: number) => {
    if (!canvaRef.current) {
      return;
    }
    const offset = offY === null ? 800 : offY;
    // async canvas and container window
    if (window.scrollY > offset + 200) {
      canvaRef.current.style.transform = `translateY(${window.scrollY - offset}px)`;
    } else {
      canvaRef.current.style.transform = `translateY(0px)`;
    }
    const width = canvaRef.current.clientWidth;
    const height = canvaRef.current.clientHeight;

    if (canvaRef.current.width !== width || canvaRef.current.height !== height) {
      renderer.current.setSize(width, height, false);
    }
  };

  const render = React.useCallback(
    (offY?: number) => {
      if (!allScene || allScene.length <= 0 || !renderer.current || !canvaRef.current) {
        return;
      }
      updateSize(offY);
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
          rect.top - offY > renderer.current.domElement.clientHeight ||
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
    },
    [updateSize],
  );

  const animation = React.useCallback(() => {
    render(offsetY.current);
    animationRef.current = requestAnimationFrame(animation);
  }, [render]);

  const renderGraphic = React.useMemo(() => {
    const scenes = [];
    if (!models) {
      return;
    }
    const modelEle = models.map((model, idx) => {
      return (
        <DaoWebglCard2
          wearablesShowOrHideState={wearablesShowOrHideState}
          wearablesShowOrHide={wearablesShowOrHide}
          wearablesSleceteIdList={wearablesSleceteIdList}
          onClick={onClick}
          id={id}
          saveIconVal={saveIconVal}
          model={model}
          batchShowOrHide={batchShowOrHide}
          name={name}
          key={uuid()}
          token={token}
          graphicId={`dao-${idx}`}
          tabState={tabState}
          type={type}
          address={address}
          initFinish={(se) => {
            scenes.push(se);
          }}
        ></DaoWebglCard2>
      );
    });
    setAllScene(scenes);
    return modelEle;
  }, [models, wearablesShowOrHideState, wearablesShowOrHide, onClick, address]);

  const init = React.useCallback(() => {
    const re = new WebGLRenderer({ canvas: canvaRef.current, antialias: true });
    re.setClearColor(0xffffff, 0);
    re.setPixelRatio(window.devicePixelRatio);
    renderer.current = re;
    if (canvaRef.current) {
      const domParams = canvaRef.current.getBoundingClientRect();
      offsetY.current = domParams.top;
      if (window.screenY > 0) {
        offsetY.current = offsetY.current + window.screenY;
      }
      animation();
      return;
    }
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
  }, [models]);

  return (
    <div id="container" className="relative w-full h-full">
      <canvas
        className={cn(
          'absolute w-full h-full top-0 left-0 flex-auto bg-transparent',
          styles.graphicAll,
        )}
        ref={canvaRef}
      ></canvas>
      <div className="w-full h-full top-0 left-0 grid grid-cols-4 gap-4 z-10">{renderGraphic}</div>
    </div>
  );
}
