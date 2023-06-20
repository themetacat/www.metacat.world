import React from 'react';
import cn from 'classnames';

import Router from 'next/router';
import {
  Scene,
  PerspectiveCamera,
  MeshStandardMaterial,
  ExtrudeGeometry,
  DoubleSide,
  WebGLRenderer,
  MOUSE,
  Mesh,
  MeshBasicMaterial,
  Shape,
  Color,
  Raycaster,
  Vector2,
  Vector3,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import style from './index.module.css';

import Selecter from '../select';
import Legend from '../legend';
import ParcelDeatil from '../tzland-parcel-detail';
import Popup from '../tzland-popup';
import Status from '../status';

import { convert } from '../../common/utils';

import { getTzLandPriceMap, getTzLandParcelDetail } from '../../service';

const mapT = [{ value: 'PRICE', label: 'PRICE' }];

const options = {
  PRICE: [
    { label: 'MONTH', value: 'MONTH' },
    { label: 'QUARTER', value: 'QUARTER' },
    { label: 'YEAR', value: 'YEAR' },
    { label: 'All-Time', value: 'ALL' },
  ],
  TRAFFIC: [
    { label: 'WEEKLY', value: 'WEEKLY' },
    { label: 'MONTHLY', value: 'MONTHLY' },
    { label: 'All-Time', value: 'TOTAL' },
  ],
};

interface Props {
  zoomLimit?: Array<number>;
  initZoom?: number;
  zoomControl?: boolean;
  onClick?: () => void;
  dragging?: boolean;
  backColor?: string;
  changeTypeControl?: boolean;
  clickToJump?: boolean;
  fullScreenOnClick?: (show) => void;
  loadFinish?: () => void;
  defaultStatic?: string;
}

const defalutColor = 'rgba(101, 128, 134, 1)';

const colors = {
  0: [
    {
      label: 'Top 20%',
      color: '#00F0FF',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '21%-50%',
      color: '#119CAE',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '51%-80%',
      color: '#03464F',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '81%-100%',
      color: '#0A2227',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
  ],
  1: [
    {
      label: 'Top 15%',
      color: '#4FFFF4',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '16%-30%',
      color: '#00D0DD',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '31%-45%',
      color: '#007B8C',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '46%-60%',
      color: '#00404E',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '61%-75%',
      color: '#00232B',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '76%-100%',
      color: '#00191E',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
  ],
  2: [
    {
      label: 'Top 10%',
      color: '#FFFFFF',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '11%-20%',
      color: '#BEFBFF',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '21%-30%',
      color: '#54F5FF',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '31%-40%',
      color: '#0BCEDB',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '41%-50%',
      color: '#0F8B9C',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '51%-65%',
      color: '#05616D',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '66%-80%',
      color: '#004049', // 'rgb(31,84,133)', //
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '81%-100%',
      color: '#002F32', // 'rgb(3,46,118)', //
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
  ],
};

function OtherSideMap({
  zoomLimit,
  zoomControl,
  initZoom = zoomLimit[0],
  onClick,
  dragging = true,
  backColor = 'black',
  changeTypeControl = true,
  clickToJump = false,
  fullScreenOnClick,
  loadFinish,
  defaultStatic = 'price',
}: Props) {
  const [minZoomAble, setMinZoomAble] = React.useState(true);
  const [maxZoomAble, setMaxZoomAble] = React.useState(true);
  const [fullScreen, setFullScreen] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState(initZoom);
  const [detail, setDeatil] = React.useState();
  const updatePop = React.useRef({
    need: false,
    source: {
      lat: 0,
      lng: 0,
    },
  });
  const popDetail = React.useRef();
  const mapType = React.useRef(defaultStatic.toUpperCase() || 'PRICE');
  const staticType = React.useRef('ALL');
  const [staticList, setStaticList] = React.useState(options[mapType.current]);
  const legends = React.useRef(colors[2]);
  const trafficRef = React.useRef(null);
  const priceRef = React.useRef(null);
  const markers = React.useRef(null);
  const layerManager = React.useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [activeColor, setActiveColor] = React.useState(null);

  const sceneRef = React.useRef(null);
  const renderer = React.useRef(null);
  const animationRef = React.useRef(null);
  const mapMesh = React.useRef(null);
  const pointerHandler = React.useRef({ x: null, y: null });
  const domRef = React.useRef(null);
  const raycasterRef = React.useRef(null);
  const activeParcel = React.useRef({
    parcel: null,
    id: null,
    point: null,
  });
  const allMesh = React.useRef(null);
  const [popupPosition, setPopupPosition] = React.useState({ x: null, y: null });
  const [showDetail, setShowDetail] = React.useState(false);
  const detailPosition = React.useRef({
    parcel: null,
    x: null,
    y: null,
    z: null,
  });

  const getSingleColor = React.useCallback(
    (fe) => {
      let color = defalutColor;
      let count = fe.attr[staticType.current.toLocaleLowerCase()];
      let index = -1;
      if (!Number.isNaN(count) && legends.current) {
        count = count < 0 ? 0 : count;
        index = legends.current.findIndex((x) => {
          return count <= x[staticType.current].start && count >= x[staticType.current].end;
        });
        if (index > -1) {
          const allColor = legends.current[index];
          /* eslint no-underscore-dangle: 0 */
          fe.attr.colorIndex = index; // eslint-disable-line
          color = allColor.color;
        }
      }
      return {
        color,
        index,
      };
    },
    [null],
  );

  const setColor = React.useCallback(
    (insMesh, acColor?) => {
      if (!insMesh) {
        return;
      }
      let result;
      if (!acColor) {
        const { color } = getSingleColor(insMesh.userData);
        result = color;
      } else {
        result = acColor;
      }
      insMesh.material.color.set(result); // eslint-disable-line
      insMesh.material.needsUpdate = true; // eslint-disable-line
    },
    [getSingleColor],
  );

  const clearHeightLight = () => {
    if (detailPosition.current.parcel) {
      setColor(detailPosition.current.parcel);
      detailPosition.current.parcel = null;
    }
  };

  const closePop = React.useCallback(() => {
    if (popDetail.current) {
      (popDetail.current as any).style.display = 'none';
    }
    setActiveColor(null);
    clearHeightLight();
  }, [popDetail.current, clearHeightLight]);

  const changeStaticType = React.useCallback(
    (newType) => {
      staticType.current = newType;
      allMesh.current.forEach((element) => {
        setColor(element);
      });
      closePop();
    },
    [setColor],
  );

  const changeMapType = React.useCallback(
    (newType) => {
      mapType.current = newType;
      setStaticList(options[newType]);
      staticType.current = options[newType][1].value;
      closePop();
    },
    [null],
  );

  const jumpToMap = () => {
    Router.push('/heatmap?type=otherside');
  };

  const zoomButtonClick = React.useCallback(
    (type) => {
      if (sceneRef.current) {
        const { camera } = sceneRef.current.userData;
        const oldZ = camera.position.z;
        if (type === 'zoomIn') {
          const nextOne = oldZ * 0.8;
          camera.position.setZ(nextOne > -570 ? -570 : nextOne);
        } else {
          const nextOne = oldZ / 0.8;
          camera.position.setZ(nextOne < -1400 ? -1400 : nextOne);
        }
      }
    },
    [null],
  );

  const onWindowResize = () => {
    const { camera } = sceneRef.current.userData;

    camera.aspect = domRef.current.clientWidth / domRef.current.clientHeight;
    camera.updateProjectionMatrix();

    renderer.current.setSize(domRef.current.clientWidth, domRef.current.clientHeight);
  };

  const full = React.useCallback(async () => {
    const isFull = !fullScreen;
    const s = await fullScreenOnClick(isFull);
    setFullScreen(isFull);
    onWindowResize();
  }, [fullScreen, fullScreenOnClick, onWindowResize]);

  const requestData = React.useCallback(
    async (sc) => {
      setLoading(true);
      const res = await getTzLandPriceMap();

      // const { parcels, stats } = JSON.parse(res).data;
      const { parcels, stats } = res.data;
      const price = convert(stats?.price);
 
      if (price.levelOne) {
        colors[2].forEach(function (item, index) {
          Object.assign(item.ALL, price.levelOne[index].all);
          Object.assign(item.MONTH, price.levelOne[index].month);
          Object.assign(item.QUARTER, price.levelOne[index].quarter);
          Object.assign(item.YEAR, price.levelOne[index].year);
        });
      }

      if (parcels) {
        const all = [];
        for (let i = 0; i < parcels.length; i += 1) {
          const { geometry, properties, price: pr } = parcels[i];
          const { coordinates } = geometry;
          const shape = new Shape();
          coordinates.forEach((ele, idx) => {
            if (idx === 0) {
              shape.moveTo(ele[0], ele[2]);
            } else {
              shape.lineTo(ele[0], ele[2]);
            }
          });
          const extrudeSettings = {
            steps: 2,
            depth: 1,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1,
          };

          const geo = new ExtrudeGeometry(shape, extrudeSettings);
          const material = new MeshBasicMaterial({ color: 0x00ff00 });
          const mesh = new Mesh(geo, material);
          mesh.rotateX(Math.PI);
          mesh.userData = {
            id: properties.token_id,
            attr: pr,
          };
          setColor(mesh);
          sc.add(mesh);
          all.push(mesh);
        }
        allMesh.current = all;
        setLoading(false);
      }

      if (loadFinish) {
        loadFinish();
      }
    },
    [setColor, onWindowResize, loadFinish],
  );

  const onActive = React.useCallback(
    async (event) => {
      if (!clickToJump && activeParcel.current.id) {
        clearHeightLight();
        const res = await getTzLandParcelDetail(activeParcel.current.id);
        const { data } = res;
        setShowDetail(true);
        setDeatil(convert(data));
        if (!activeParcel.current.point) {
          return;
        }
        (popDetail.current as any).style.display = 'block';
        const vector = activeParcel.current.point;
        detailPosition.current.x = vector.x;
        detailPosition.current.y = vector.y;
        detailPosition.current.z = vector.z;
        detailPosition.current.parcel = activeParcel.current.parcel;
        setColor(activeParcel.current.parcel, new Color(0xff0000));
        const { index } = getSingleColor(activeParcel.current.parcel.userData);
        if (index > -1) {
          setActiveColor(index);
        }
      }
    },
    [clearHeightLight, setColor],
  );

  const onPointerMove = React.useCallback(
    (event) => {
      // calculate pointer position in normalized device coordinates
      // (-1 to +1) for both components
      setPopupPosition({
        x: event.offsetX,
        y: event.offsetY,
      });
      pointerHandler.current.x = (event.offsetX / domRef.current.clientWidth) * 2 - 1;
      pointerHandler.current.y = -(event.offsetY / domRef.current.clientHeight) * 2 + 1;
    },
    [null],
  );

  const render = React.useCallback(() => {
    if (!renderer.current || !sceneRef.current) {
      return;
    }
    const { camera } = sceneRef.current.userData;
    renderer.current.render(sceneRef.current, camera);
    // if (mapMesh.current) {
    //   mapMesh.current.rotateZ(0.0005);
    // }
    if (pointerHandler.current.x) {
      // update the picking ray with the camera and pointer position
      raycasterRef.current.setFromCamera(pointerHandler.current, camera);

      // calculate objects intersecting the picking ray
      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);
      if (intersects.length > 0) {
        for (let i = 0; i < intersects.length; i += 1) {
          const intersect = intersects[i];
          const { object, point } = intersect;
          activeParcel.current.id = object.userData.id;
          activeParcel.current.point = point;
          activeParcel.current.parcel = object;
        }
      } else if (activeParcel.current.id) {
        activeParcel.current.id = null;
        activeParcel.current.point = null;
        activeParcel.current.parcel = null;
      }

      if (showDetail && popDetail.current) {
        const projector = new Vector3(
          detailPosition.current.x,
          detailPosition.current.y,
          detailPosition.current.z,
        );
        const vector = projector.project(camera);
        const centerX = domRef.current.clientWidth / 2;
        const centerY = domRef.current.clientHeight / 2;
        const dX = Math.round(vector.x * centerX + centerX);
        const dY = Math.round(-vector.y * centerY + centerY);
        (popDetail.current as any).style.top = `${dY}px`;
        (popDetail.current as any).style.left = `${dX}px`;
      }
    }

    if (camera) {
      const old = camera.position.z;
      // 10 600

      if (old === -570 && minZoomAble) {
        setMinZoomAble(false);
      }
      if (old !== -570 && !minZoomAble) {
        setMinZoomAble(true);
      }
      if (old === -1400 && maxZoomAble) {
        setMaxZoomAble(false);
      }
      if (old !== -1400 && !maxZoomAble) {
        setMaxZoomAble(true);
      }
    }
  }, [clearHeightLight, showDetail, minZoomAble, maxZoomAble]);

  const animation = React.useCallback(() => {
    render();
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animation);
  }, [render]);

  React.useEffect(() => {
    if (!renderer.current) {
      const sceneElement = document.getElementById(`map`);
      const re = new WebGLRenderer({ antialias: true });
      re.setClearColor(0xffffff, 0);
      re.setPixelRatio(window.devicePixelRatio);
      renderer.current = re;
      const scene = new Scene();

      domRef.current = sceneElement;
      const camera = new PerspectiveCamera(
        60,
        sceneElement.clientWidth / sceneElement.clientHeight,
        0.1,
        20000,
      );
      camera.position.z = -900;
      scene.userData.camera = camera;

      const controls = new OrbitControls(scene.userData.camera, re.domElement);

      controls.minDistance = 570;
      controls.maxDistance = 1400;
      controls.enablePan = true;
      controls.enableRotate = false;
      controls.enableZoom = true;
      controls.mouseButtons = {
        LEFT: MOUSE.PAN,
        MIDDLE: MOUSE.DOLLY,
        RIGHT: MOUSE.ROTATE,
      };

      scene.userData.controls = controls;

      raycasterRef.current = new Raycaster();
      pointerHandler.current = new Vector2();

      sceneRef.current = scene;

      re.setSize(sceneElement.clientWidth, sceneElement.clientHeight, true);
      sceneElement.appendChild(re.domElement);

      sceneElement.addEventListener('pointermove', onPointerMove);
      sceneElement.addEventListener('click', onActive);

      window.addEventListener('resize', onWindowResize);
      requestData(scene);

      return () => {
        window.removeEventListener('resize', onWindowResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
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
  }, [animation, requestData, onPointerMove, onActive]);

  return (
    <div className={style.mapContainer} onClick={clickToJump ? jumpToMap : null}>
      {loading ? (
        <div
          className={cn(
            ' absolute h-full w-full z-50 flex items-center justify-center',
            style.state,
          )}
        >
          <Status status="loading" />
        </div>
      ) : null}
      <div className={cn('flex justify-between items-center', style.picker)}>
        {/* <div className={cn('flex justify-center items-center', style.type)}>TRAFFIC</div> */}
        <Selecter
          options={mapT}
          onClick={changeMapType}
          showArrow={false}
          defaultLabel={mapType.current}
        ></Selecter>
        <div className={style.dividing}></div>
        <Selecter
          options={staticList}
          onClick={changeStaticType}
          showArrow={changeTypeControl}
          defaultLabel={staticType.current}
        ></Selecter>
      </div>
      {zoomControl ? (
        <>
          <div className={cn('flex flex-col', style.zoom)}>
            <div
              className={cn('flex justify-center items-center', style.zoomButton)}
              onClick={() => {
                zoomButtonClick('zoomIn');
              }}
            >
              <img className={minZoomAble ? null : style.disable} src="./images/Union.png"></img>
            </div>
            <div
              className={cn('flex justify-center items-center', style.zoomButton)}
              onClick={() => {
                zoomButtonClick('zoomOut');
              }}
            >
              <img
                className={maxZoomAble ? null : style.disable}
                src="./images/Rectangle.png"
              ></img>
            </div>
          </div>
          <div
            className={cn('text-white absolute flex justify-center items-center', style.fullBtn)}
            onClick={full}
          >
            <img src={`./images/${fullScreen ? 'unfull.png' : 'full.png'}`}></img>
          </div>
        </>
      ) : null}
      <div id="map" className={style.map} style={{ backgroundColor: backColor }}>
        <Popup position={popupPosition} id={activeParcel.current.id}></Popup>
      </div>
      <div className={cn('absolute', style.pop)} ref={popDetail}>
        <ParcelDeatil
          options={detail}
          trafficType={staticType.current}
          mapType={mapType.current}
          close={closePop}
          isSomnium={false}
          isOtherSide={true}
        ></ParcelDeatil>
      </div>
      <Legend
        className={style.legend}
        title={mapType.current === 'TRAFFIC' ? 'Traffic ranking' : 'Price ranking'}
        options={legends.current}
        active={activeColor}
      ></Legend>
    </div>
  );
}

export default OtherSideMap;
