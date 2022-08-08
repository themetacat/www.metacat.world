import React from 'react';
import cn from 'classnames';
import L from 'leaflet';
import MiniMap from 'leaflet-minimap';

import Router from 'next/router';

import style from './index.module.css';

import Selecter from '../select';
import Legend from '../legend';
import ParcelDeatil from '../parcel-detail';

import { convert } from '../../common/utils';

import { req_substrata_level_three, req_substrata_detail } from '../../service/z_api';

const mapT = [{ value: 'PRICE', label: 'PRICE' }];

const options = {
  PRICE: [
    { label: 'MONTH', value: 'MONTH' },
    { label: 'QUARTER', value: 'QUARTER' },
    { label: 'YEARLY', value: 'YEAR' },
    { label: 'All-Time', value: 'ALL' },
  ],
  TRAFFIC: [
    { label: 'WEEK', value: 'WEEKLY' },
    { label: 'MONTH', value: 'MONTHLY' },
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

function SubstrataMap({
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
  const mapType = React.useRef(defaultStatic.toUpperCase() || 'PRICE');
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

  const setLoading = React.useCallback(() => {
    if (loadFinish) {
      loadFinish();
    }
  }, [loadFinish]);

  const drawPriceGeoJsonToLayer = (pageMap, data, price, parcelL) => {
    if (data) {
      parcelL?.clearLayers();
      const margin = 0.01;
      const minIsLandLayer = L.geoJSON(null, {
        style: (fe) => {
          return {
            fill: true,
            fillColor: `rgba(101, 128, 134, 1)`,
            weight: 1,
            fillOpacity: 1,
            color: '#444444',
          };
        },
      });

      if (price.levelOne) {
        colors[2].forEach(function (x, index) {
          Object.assign(x.ALL, price.levelOne[index].all);
          Object.assign(x.MONTH, price.levelOne[index].month);
          Object.assign(x.QUARTER, price.levelOne[index].quarter);
          Object.assign(x.YEAR, price.levelOne[index].year);
        });
      }

      for (let i = 0; i < data.length; i += 1) {
        const all = data[i];
        if (all) {
          if (all.geometry) {
            let polygon;
            if (all.properties.type === 'polygon') {
              polygon = {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [all.geometry.coordinates],
                },
                properties: all.properties,
              };
            } else {
              const { coordinates } = all.geometry;
              polygon = {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [coordinates[0] + margin, coordinates[1] + margin],
                      [coordinates[2] - margin, coordinates[1] + margin],
                      [coordinates[2] - margin, coordinates[3] - margin],
                      [coordinates[0] + margin, coordinates[3] - margin],
                    ],
                  ],
                },
                properties: all.properties,
              };
            }

            polygon.properties.ALL = all.price.all;
            polygon.properties.MONTH = all.price.month;
            polygon.properties.QUARTER = all.price.quarter;
            polygon.properties.YEAR = all.price.year;
            parcelL.addData(polygon);
            minIsLandLayer.addData(polygon);
          }
        }
      }

      const params = {
        position: 'topright',
        width: 250,
        heigth: 100,
        zoomLevelFixed: 0,
        mapOptions: {
          preferCanvas: true,
        },
      };
      if (clickToJump) {
        (params as any).centerFixed = { lat: 0, lng: 0 };
      }
      const min = new MiniMap(minIsLandLayer, params);
      if (min) {
        min.addTo(pageMap);
      }
    }
  };

  const requestPriceMapThreeData = React.useCallback(
    async (pageMap, parcelL) => {
      const res = await req_substrata_level_three();
      const { parcels, stats } = res.data;

      // parcels.current = data;
      priceRef.current = stats?.price;

      drawPriceGeoJsonToLayer(pageMap, parcels, convert(stats?.price), parcelL);
      setLoading();
    },
    [null],
  );

  const clearHeightLight = React.useCallback(() => {
    if (heighFeature.current) {
      layerManager.current[1].layer.clearLayers();
      heighFeature.current = null;
    }
  }, []);

  const closePop = React.useCallback(() => {
    if (popDetail.current) {
      (popDetail.current as any).style.display = 'none';
    }
    setActiveColor(null);
    clearHeightLight();
  }, [popDetail.current, clearHeightLight]);

  // parcel style function
  const parcelStyle = React.useCallback(
    (fe) => {
      let color = 'rgba(101, 128, 134, 1)';
      let count = fe.properties[staticType.current];
      if (!Number.isNaN(count) && legends.current) {
        count = count < 0 ? 0 : count;
        const index = legends.current.findIndex((x) => {
          return count <= x[staticType.current].start && count >= x[staticType.current].end;
        });
        if (index > -1) {
          const allColor = legends.current[index];
          /* eslint no-underscore-dangle: 0 */
          fe.properties.colorIndex = index; // eslint-disable-line
          color = allColor.color;
        }
      }
      // if(color == 'rgba(101, 128, 134, 1)'){
      //   console.log(fe.properties)
      // }
      return {
        fill: true,
        fillColor: color,
        weight: 1,
        color: 'rgb(0,0,0)',
        fillOpacity: 1,
      };
    },
    [staticType],
  );

  const changeStaticType = React.useCallback(
    (newType) => {
      staticType.current = newType;
      layerManager.current[0].layer.setStyle(parcelStyle);
      closePop();
    },
    [minZoomLevel],
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

  const zoomChange = (e) => {
    /* eslint no-underscore-dangle: 0 */
    setZoomLevel(e.target._zoom);
    closePop();
  };

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

  const getCanvas = React.useCallback(
    (text) => {
      const canvas = document.createElement('canvas');

      const ctx = canvas.getContext('2d');

      ctx.font = `12px Arial`;

      const fontSize = 13;
      const cdiv = ctx.measureText(text).width;

      const width = cdiv * 1.3;
      const height = 28;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ctx.fillStyle = 'rgba(100,200,0, 0.7)';
      // ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px bold`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#000';
      ctx.strokeText(text, width / 2, height / 2);
      ctx.lineWidth = 3;
      ctx.fillStyle = '#fff';
      ctx.fillText(text, width / 2, height / 2);
      return canvas;
    },
    [null],
  );

  const requestDeatil = React.useCallback(
    async (id) => {
      const res = await req_substrata_detail(id);
      const parcel = convert(res.data);
      setDeatil(parcel);
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

  React.useEffect(() => {
    const map = L.map('map', {
      preferCanvas: true,
      minZoom: minZoomLevel,
      maxZoom: maxZoomLevel,
      zoomControl: false,
      dragging,
    }).setView([0, 0], zoomLevel);
    map.on('zoom', zoomChange);
    legends.current = colors['2'];

    mapRef.current = map;
    markers.current = L.layerGroup([]);

    const parcelsPriceLayerThree = L.geoJSON(null, {
      style: parcelStyle,
      onEachFeature: (feature, layer) => {
        if (feature.properties.token_id && zoomControl) {
          layer.bindTooltip(feature.properties.token_id.toString(), {
            direction: 'top',
            className: style.leafletLabel,
          });
        }
      },
    }).addTo(map);

    const heighLayer = L.geoJSON(null, {
      style: {
        fill: true,
        fillColor: 'rgb(255,0,0)',
        weight: 1,
        color: 'rgb(255,0,0)',
        fillOpacity: 0.6,
      },
    }).addTo(map);

    if (zoomControl) {
      parcelsPriceLayerThree.on('click', function (e) {
        if (e.sourceTarget && e.sourceTarget.feature) {
          const id = e.sourceTarget.feature.properties.token_id;
          const { colorIndex } = e.sourceTarget.feature.properties;

          clearHeightLight();

          const polygon = JSON.parse(JSON.stringify(e.sourceTarget.feature));
          polygon.properties.active = true;
          heighFeature.current = polygon;
          layerManager.current[1].layer.addData(heighFeature.current);

          if (colorIndex !== null || colorIndex !== undefined) {
            setActiveColor(colorIndex);
          }
          if (popDetail.current) {
            (popDetail.current as any).style.display = 'block';
            (popDetail.current as any).style.top = `${(e as any).containerPoint.y}px`;
            (popDetail.current as any).style.left = `${(e as any).containerPoint.x}px`;
            (popDetail.current as any).source = (e as any).latlng;
          }
          requestDeatil(id);
        }
      });

      map.on('movestart', (e) => {
        if (popDetail && popDetail.current) {
          updatePop.current.need = true;
        }
      });

      map.on('move', (e) => {
        if (updatePop.current.need && popDetail.current && (popDetail.current as any).source) {
          const containerPoint = map.latLngToContainerPoint((popDetail.current as any).source);
          (popDetail.current as any).style.top = `${containerPoint.y}px`;
          (popDetail.current as any).style.left = `${containerPoint.x}px`;
        }
      });

      map.on('moveend', () => {
        if (updatePop.current.need) {
          updatePop.current.need = false;
        }
      });
    }

    if (clickToJump) {
      map.on('click', function (e) {
        Router.push('/heatmap?type=substrata');
      });
    }

    const dataLayer = [
      {
        layer: parcelsPriceLayerThree,
        name: 'price3',
      },
      {
        layer: heighLayer,
        name: 'heighLayer',
      },
    ];

    layerManager.current = dataLayer;
    requestPriceMapThreeData(map, parcelsPriceLayerThree);

    return () => {
      map.off('zoom');
      map.remove();
    };
    // requestSube(map);
  }, [clearHeightLight]);

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
            isSomnium={false}
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
XMLSerializer
export default SubstrataMap;
