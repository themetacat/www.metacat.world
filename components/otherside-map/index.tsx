import React from 'react';
import cn from 'classnames';

import {
  Scene,
  PerspectiveCamera,
  InstancedMesh,
  CircleGeometry,
  DoubleSide,
  WebGLRenderer,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Color,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import style from './index.module.css';

import Selecter from '../select';
import Legend from '../legend';
import ParcelDeatil from '../parcel-detail';

import { convert } from '../../common/utils';

import { getOtherSidePriceMap } from '../../service';

const mapT = [{ value: 'PRICE', label: 'PRICE' }];

const options = {
  PRICE: [
    { label: 'MONTHLY', value: 'MONTH' },
    { label: 'QUARTERLY', value: 'QUARTER' },
    { label: 'YEARLY', value: 'YEAR' },
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
  id: string;
}

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
      color: '#72FFE6',
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
      color: '#00E1EF',
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
      color: '#009DA7',
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
      color: '#006A78',
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
      color: '#004149',
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
      color: '#082C31',
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
      color: '#001F23',
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
      color: '#001B21',
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
  id,
}: Props) {
  const [minZoomLevel, setMinZoomLevel] = React.useState(zoomLimit[0]);
  const [maxZoomLevel, setMaxZoomLevel] = React.useState(zoomLimit[1]);
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
  const mapType = React.useRef('PRICE');
  const staticType = React.useRef('ALL');
  const [staticList, setStaticList] = React.useState(options[mapType.current]);
  const legends = React.useRef(colors[2]);
  const trafficRef = React.useRef(null);
  const priceRef = React.useRef(null);
  const markers = React.useRef(null);
  const layerManager = React.useRef(null);
  const mapRef = React.useRef(null);
  const heighFeature = React.useRef(null);
  const [activeColor, setActiveColor] = React.useState(null);
  // const clickToJumpRef = React.useRef(clickToJump);

  const sceneRef = React.useRef(null);
  const renderer = React.useRef(null);
  const animationRef = React.useRef(null);
  const mapMesh = React.useRef(null);

  const setLoading = React.useCallback(() => {
    if (loadFinish) {
      loadFinish();
    }
  }, [loadFinish]);

  const closePop = React.useCallback(() => {
    if (popDetail.current) {
      (popDetail.current as any).style.display = 'none';
    }
    setActiveColor(null);
  }, [popDetail.current]);

  const setColor = React.useCallback(
    (insMesh) => {
      if (!insMesh) {
        return;
      }
      const { attrs } = insMesh.userData;
      let color = 'rgba(101, 128, 134, 1)';
      for (let i = 0; i < attrs.length; i += 1) {
        const fe = attrs[i];
        let count = fe.attr[staticType.current.toLocaleLowerCase()];
        if (!Number.isNaN(count) && legends.current) {
          count = count < 0 ? 0 : count;
          const index = legends.current.findIndex((x) => {
            return count <= x[staticType.current].start && count >= x[staticType.current].end;
          });
          if (index > -1) {
            const allColor = legends.current[index];
            /* eslint no-underscore-dangle: 0 */
            fe.attr.colorIndex = index; // eslint-disable-line
            color = allColor.color;
          }
        }

        insMesh.setColorAt(i, new Color(color));
      }
      insMesh.instanceColor.needsUpdate = true; // eslint-disable-line
    },
    [colors],
  );

  const changeStaticType = React.useCallback(
    (newType) => {
      staticType.current = newType;
      setColor(mapMesh.current);
      closePop();
    },
    [minZoomLevel, setColor],
  );

  const changeMapType = React.useCallback(
    (newType) => {
      mapType.current = newType;
      setStaticList(options[newType]);
      staticType.current = options[newType][1].value;
      closePop();
    },
    [minZoomLevel],
  );

  const zoomButtonClick = React.useCallback(
    (type) => {
      if (mapRef.current) {
        if (type === 'zoomIn') {
          mapRef.current.zoomIn();
        } else {
          mapRef.current.zoomOut();
        }
      }
    },
    [null],
  );

  const full = React.useCallback(async () => {
    const isFull = !fullScreen;
    const s = await fullScreenOnClick(isFull);
    setFullScreen(isFull);
    if (mapRef.current) {
      mapRef.current.invalidateSize(true);
      // setTimeout(() => {

      // }, 1000);
    }
  }, [fullScreen, fullScreenOnClick]);

  const requestData = React.useCallback(
    async (sc) => {
      const res = await getOtherSidePriceMap();

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
        const org = parcels[0];
        const orgCenter = org.properties.coordinates;

        const insGeometry = new CircleGeometry(0.2, 32);

        const pointsMaterial = new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide });
        insGeometry.center();

        const insMesh = new InstancedMesh(insGeometry, pointsMaterial, parcels.length);
        const transform = new Object3D();
        const allAttr = [];
        for (let i = 0; i < parcels.length; i += 1) {
          const x = parcels[i].properties.coordinates[0] - orgCenter[0];
          const y = parcels[i].properties.coordinates[1] - orgCenter[1];
          const z = 0;
          transform.position.set(x, y, z);
          transform.updateMatrix();
          insMesh.setMatrixAt(i, transform.matrix);
          const d = Math.random();
          const d2 = Math.random();
          const d3 = Math.random();
          insMesh.setColorAt(i, new Color(d, d2, d3));
          allAttr.push({
            id: parcels[i].token_id,
            attr: parcels[i].price,
          });
        }
        insMesh.userData.attrs = allAttr;
        mapMesh.current = insMesh;
        setColor(insMesh);
        sc.add(insMesh);
      }
    },
    [setColor],
  );

  const render = React.useCallback(() => {
    if (!renderer.current || !sceneRef.current) {
      return;
    }
    // const { targetMesh } = sceneRef.current.userData;
    // if (targetMesh) {
    //   targetMesh.rotation.y = Date.now() * 0.001;
    // }
    const { camera } = sceneRef.current.userData;
    renderer.current.render(sceneRef.current, camera);
    if (mapMesh.current) {
      mapMesh.current.rotateZ(0.0005);
    }
  }, [null]);

  const animation = React.useCallback(() => {
    render();
    animationRef.current = requestAnimationFrame(animation);
  }, [render]);

  React.useEffect(() => {
    if (!renderer.current) {
      const re = new WebGLRenderer({ antialias: true });
      re.setClearColor(0xffffff, 0);
      re.setPixelRatio(window.devicePixelRatio);
      renderer.current = re;
      const scene = new Scene();
      const sceneElement = document.getElementById(`map`);

      const camera = new PerspectiveCamera(
        60,
        sceneElement.clientWidth / sceneElement.clientHeight,
        0.1,
        20000,
      );
      camera.position.z = 500;
      scene.userData.camera = camera;

      const controls = new OrbitControls(scene.userData.camera, re.domElement);
      scene.userData.controls = controls;

      sceneRef.current = scene;

      re.setSize(sceneElement.clientWidth, sceneElement.clientHeight, true);
      sceneElement.appendChild(re.domElement);
      requestData(scene);
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
  }, [animation, requestData]);

  return (
    <div className={style.mapContainer} onClick={onClick}>
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
              <img
                className={zoomLevel >= maxZoomLevel ? style.disable : null}
                src="./images/Union.png"
              ></img>
            </div>
            <div
              className={cn('flex justify-center items-center', style.zoomButton)}
              onClick={() => {
                zoomButtonClick('zoomOut');
              }}
            >
              <img
                className={zoomLevel <= minZoomLevel ? style.disable : null}
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
        <div className={cn('absolute', style.pop)} ref={popDetail}>
          <ParcelDeatil
            options={detail}
            trafficType={staticType.current}
            mapType={mapType.current}
            close={closePop}
            isSomnium={true}
          ></ParcelDeatil>
        </div>
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
