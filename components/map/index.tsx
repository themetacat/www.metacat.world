import React from 'react';
import cn from 'classnames';
import L from 'leaflet';
import MiniMap from 'leaflet-minimap';

import Router from 'next/router';
import ReactTooltip from 'react-tooltip';

import style from './index.module.css';

import Selecter from '../select';
import Legend from '../legend';
import ParcelDeatil from '../parcel-detail';
import TopParcel from '../top_parcel';

import { convert } from '../../common/utils';

import {
  getCvTrafficMapLevelThree,
  getCvTrafficMapLevelTwo,
  getCvTrafficMapLevelOne,
  getCvPriceMapLevelOne,
  getCvPriceMapLevelThree,
  getCvPriceMapLevelTwo,
  getCvParcelDetail,
  getCvIsland,
  getCvSuburbs,
} from '../../service';
import { req_cv_top20_parcel } from '../../service/z_api';

const mapT = [
  { value: 'PRICE', label: 'PRICE' },
  { value: 'TRAFFIC', label: 'TRAFFIC' },
];

const options = {
  PRICE: [
    { label: 'MONTH', value: 'MONTH' },
    { label: 'QUARTER', value: 'QUARTER' },
    { label: 'YEAR', value: 'YEAR' },
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

function Map({
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
  const [stc, setStc] = React.useState('MONTHLY');
  const [staticList, setStaticList] = React.useState(options[mapType.current]);
  const legends = React.useRef(colors[1]);
  const trafficRef = React.useRef(null);
  const priceRef = React.useRef(null);
  const markers = React.useRef(null);
  const layerManager = React.useRef(null);
  const mapRef = React.useRef(null);
  const heighFeature = React.useRef(null);
  const [activeColor, setActiveColor] = React.useState(null);
  // const clickToJumpRef = React.useRef(clickToJump);
  const [arrowsState, setArrowsState] = React.useState(true);

  const priceTop = React.useRef(null);
  const trafficTop = React.useRef(null);
  const topData = React.useRef(null);

  const setLoading = React.useCallback(() => {
    if (loadFinish) {
      loadFinish();
    }
  }, [loadFinish]);

  const requestLand = React.useCallback(
    async (pageMap, layer) => {
      //
      const res = await getCvIsland();
      const { islands } = res;
      if (islands) {
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

        for (let i = 0; i < islands.length; i += 1) {
          if (islands[i]) {
            const all = islands[i];
            if (all.geometry) {
              const al = {
                type: 'Feature',
                geometry: all.geometry,
                properties: {
                  id: all.id,
                  name: all.name,
                },
              };
              layer.addData(al);
              minIsLandLayer.addData(all.geometry);
            }
          }
        }
        setLoading();
        const params = {
          position: 'topright',
          width: 250,
          heigth: 100,
          zoomLevelFixed: 1,

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
    },
    [null],
  );

  const requestSub = React.useCallback(
    async (pageMap, layer) => {
      //
      const res = await getCvSuburbs();
      const { suburbs } = res;
      if (suburbs) {
        for (let i = 0; i < suburbs.length; i += 1) {
          if (suburbs[i]) {
            const all = suburbs[i];
            if (all.geometry) {
              const al = {
                type: 'Feature',
                geometry: all.position,
                properties: {
                  id: all.id,
                  name: all.name,
                },
              };
              layer.addData(al);
            }
          }
        }
        setLoading();
      }
    },
    [null],
  );

  const drawGeoJsonToLayer = (data, traffic, streetL, parcelL) => {
    if (data) {
      streetL?.clearLayers();
      parcelL?.clearLayers();
      for (let i = 0; i < data.length; i += 1) {
        const all = data[i];
        if (all) {
          if (all.geometry) {
            const polygon = {
              type: 'Feature',
              ...all,
            };

            if (traffic.levelOne) {
              colors[0].forEach(function (x, index) {
                Object.assign(x.TOTAL, traffic.levelOne[index].all);
                Object.assign(x.WEEKLY, traffic.levelOne[index].week);
                Object.assign(x.MONTHLY, traffic.levelOne[index].month);
              });
            }

            if (traffic.levelTwo) {
              colors[1].forEach(function (x, index) {
                Object.assign(x.TOTAL, traffic.levelTwo[index].all);
                Object.assign(x.WEEKLY, traffic.levelTwo[index].week);
                Object.assign(x.MONTHLY, traffic.levelTwo[index].month);
              });
            }

            if (traffic.levelThree) {
              colors[2].forEach(function (x, index) {
                Object.assign(x.TOTAL, traffic.levelThree[index].all);
                Object.assign(x.WEEKLY, traffic.levelThree[index].week);
                Object.assign(x.MONTHLY, traffic.levelThree[index].month);
              });
            }

            polygon.properties.TOTAL = all.traffic.all;
            polygon.properties.MONTHLY = all.traffic.month;
            polygon.properties.WEEKLY = all.traffic.week;

            parcelL.addData(polygon);
          }
          if (all.streets && streetL) {
            all.streets.forEach((x) => {
              if (x && x.geometry) {
                const stre = {
                  type: 'Feature',
                  ...x,
                };
                streetL.addData(stre);
              }
            });
          }
        }
      }
    }
  };

  const drawPriceGeoJsonToLayer = (data, price, parcelL) => {
    if (data) {
      parcelL?.clearLayers();
      for (let i = 0; i < data.length; i += 1) {
        const all = data[i];
        if (all) {
          if (all.geometry) {
            const polygon = {
              type: 'Feature',
              ...all,
            };

            if (price.levelOne) {
              colors[0].forEach(function (x, index) {
                Object.assign(x.ALL, price.levelOne[index].all);
                Object.assign(x.MONTH, price.levelOne[index].month);
                Object.assign(x.QUARTER, price.levelOne[index].quarter);
                Object.assign(x.YEAR, price.levelOne[index].year);
              });
            }

            if (price.levelTwo) {
              colors[1].forEach(function (x, index) {
                Object.assign(x.ALL, price.levelTwo[index].all);
                Object.assign(x.MONTH, price.levelTwo[index].month);
                Object.assign(x.QUARTER, price.levelTwo[index].quarter);
                Object.assign(x.YEAR, price.levelTwo[index].year);
              });
            }

            if (price.levelThree) {
              colors[2].forEach(function (x, index) {
                Object.assign(x.ALL, price.levelThree[index].all);
                Object.assign(x.MONTH, price.levelThree[index].month);
                Object.assign(x.QUARTER, price.levelThree[index].quarter);
                Object.assign(x.YEAR, price.levelThree[index].year);
              });
            }

            polygon.properties.ALL = all.price.all;
            polygon.properties.MONTH = all.price.month;
            polygon.properties.QUARTER = all.price.quarter;
            polygon.properties.YEAR = all.price.year;

            parcelL.addData(polygon);
          }
        }
      }
    }
  };

  const requestMapThreeData = React.useCallback(
    async (streetL, parcelL) => {
      const res = await getCvTrafficMapLevelThree();
      const { parcels, stats } = res.data;

      // parcels.current = data;
      trafficRef.current = stats?.traffic;

      drawGeoJsonToLayer(parcels, convert(stats?.traffic), streetL, parcelL);
      setLoading();
    },
    [null],
  );

  const clearHeightLight = React.useCallback(() => {
    if (heighFeature.current) {
      layerManager.current[9].layer.clearLayers();
      heighFeature.current = null;
    }
  }, []);

  const requestMapTwoData = React.useCallback(
    async (streetL, parcelL) => {
      const res = await getCvTrafficMapLevelTwo();
      const { parcels, stats } = res.data;

      // parcels.current = data;
      trafficRef.current = stats?.traffic;

      drawGeoJsonToLayer(parcels, convert(stats?.traffic), streetL, parcelL);
      setLoading();
    },
    [null],
  );

  const requestMapOneData = React.useCallback(
    async (streetL, parcelL) => {
      const res = await getCvTrafficMapLevelOne();
      const { parcels, stats } = res.data;

      // parcels.current = data;
      trafficRef.current = stats?.traffic;

      drawGeoJsonToLayer(parcels, convert(stats?.traffic), streetL, parcelL);
      setLoading();
    },
    [null],
  );

  const requestPriceMapTwoData = React.useCallback(
    async (parcelL) => {
      const res = await getCvPriceMapLevelTwo();
      const { parcels, stats } = res.data;

      // parcels.current = data;
      priceRef.current = stats?.price;

      drawPriceGeoJsonToLayer(parcels, convert(stats?.price), parcelL);
      setLoading();
    },
    [null],
  );

  const requestPriceMapThreeData = React.useCallback(
    async (parcelL) => {
      const res = await getCvPriceMapLevelThree();
      const { parcels, stats } = res.data;

      // parcels.current = data;
      priceRef.current = stats?.price;

      drawPriceGeoJsonToLayer(parcels, convert(stats?.price), parcelL);
      setLoading();
    },
    [null],
  );

  const requestPriceMapOneData = React.useCallback(
    async (parcelL) => {
      const res = await getCvPriceMapLevelOne();
      // console.log(res)
      const { parcels, stats } = res.data;

      // parcels.current = data;
      priceRef.current = stats?.price;

      drawPriceGeoJsonToLayer(parcels, convert(stats?.price), parcelL);
      setLoading();
    },
    [null],
  );
  const reqTop20 = React.useCallback(async () => {
    const result = await req_cv_top20_parcel();
    const { price_top, traffic_top } = result.data;
    priceTop.current = price_top;
    trafficTop.current = traffic_top;
    topData.current = price_top.price_all;
  }, [null]);

  const closePop = React.useCallback(() => {
    if (popDetail.current) {
      (popDetail.current as any).style.display = 'none';
    }
    clearHeightLight();
    setActiveColor(null);
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

  const switchLayer = React.useCallback(
    (targetZoom) => {
      markers.current.removeFrom(mapRef.current);
      if (!zoomControl) {
        mapRef.current.removeLayer(layerManager.current[1].layer); // street
        layerManager.current[0].layer.addTo(mapRef.current); // add suburbs

        mapRef.current.removeLayer(layerManager.current[2].layer);
        mapRef.current.removeLayer(layerManager.current[4].layer);

        mapRef.current.removeLayer(layerManager.current[6].layer);
        mapRef.current.removeLayer(layerManager.current[8].layer);

        if (mapType.current === 'PRICE') {
          mapRef.current.removeLayer(layerManager.current[3].layer);
          layerManager.current[7].layer.addTo(mapRef.current); // add price2
          layerManager.current[7].layer.setStyle(parcelStyle);
          return;
        }
        // mapRef.current.removeLayer(layerManager.current[5].layer);
        mapRef.current.removeLayer(layerManager.current[7].layer);
        layerManager.current[3].layer.addTo(mapRef.current); // add parcel2
        layerManager.current[3].layer.setStyle(parcelStyle);
        return;
      }
      // layerManager.current[2].layer.setStyle(parcelStyle);
      if (targetZoom < 2) {
        markers.current.addTo(mapRef.current);
        mapRef.current.removeLayer(layerManager.current[0].layer);
        mapRef.current.removeLayer(layerManager.current[1].layer);

        mapRef.current.removeLayer(layerManager.current[2].layer);
        mapRef.current.removeLayer(layerManager.current[3].layer);

        mapRef.current.removeLayer(layerManager.current[6].layer);
        mapRef.current.removeLayer(layerManager.current[7].layer);

        if (mapType.current === 'PRICE') {
          mapRef.current.removeLayer(layerManager.current[4].layer);
          layerManager.current[8].layer.addTo(mapRef.current); // add price2
          layerManager.current[8].layer.setStyle(parcelStyle);
          return;
        }
        mapRef.current.removeLayer(layerManager.current[8].layer);
        layerManager.current[4].layer.addTo(mapRef.current); // add parcel1
        layerManager.current[4].layer.setStyle(parcelStyle);
        return;
      }
      if (targetZoom < 3) {
        layerManager.current[0].layer.addTo(mapRef.current); // add suburbs

        mapRef.current.removeLayer(layerManager.current[1].layer);
        mapRef.current.removeLayer(layerManager.current[2].layer);
        mapRef.current.removeLayer(layerManager.current[4].layer);

        mapRef.current.removeLayer(layerManager.current[6].layer);
        mapRef.current.removeLayer(layerManager.current[8].layer);

        if (mapType.current === 'PRICE') {
          mapRef.current.removeLayer(layerManager.current[3].layer);
          layerManager.current[7].layer.addTo(mapRef.current); // add price2
          layerManager.current[7].layer.setStyle(parcelStyle);
          return;
        }
        // mapRef.current.removeLayer(layerManager.current[5].layer);
        mapRef.current.removeLayer(layerManager.current[7].layer);
        layerManager.current[3].layer.addTo(mapRef.current); // add parcel2
        layerManager.current[3].layer.setStyle(parcelStyle);
        return;
      }

      mapRef.current.removeLayer(layerManager.current[3].layer);
      mapRef.current.removeLayer(layerManager.current[4].layer);

      mapRef.current.removeLayer(layerManager.current[7].layer);
      mapRef.current.removeLayer(layerManager.current[8].layer);

      layerManager.current[0].layer.addTo(mapRef.current); // add suburbs
      layerManager.current[1].layer.addTo(mapRef.current); // add street

      if (mapType.current === 'PRICE') {
        mapRef.current.removeLayer(layerManager.current[2].layer);
        layerManager.current[6].layer.addTo(mapRef.current); // add price2
        layerManager.current[6].layer.setStyle(parcelStyle);
        return;
      }
      mapRef.current.removeLayer(layerManager.current[6].layer);
      layerManager.current[2].layer.addTo(mapRef.current); // add parcel2
      layerManager.current[2].layer.setStyle(parcelStyle);
    },
    [null],
  );

  const changeStaticType = React.useCallback(
    (newType) => {
      staticType.current = newType;
      if (mapType.current === 'PRICE') {
        if (newType === 'MONTH') {
          topData.current = priceTop.current.price_monthly;
        }
        if (newType === 'QUARTER') {
          topData.current = priceTop.current.price_quarterly;
        }
        if (newType === 'YEAR') {
          topData.current = priceTop.current.price_yearly;
        }
        if (newType === 'ALL') {
          topData.current = priceTop.current.price_all;
        }
      }
      if (mapType.current === 'TRAFFIC') {
        if (newType === 'WEEKLY') {
          topData.current = trafficTop.current.traffic_weekly;
        }
        if (newType === 'MONTHLY') {
          topData.current = trafficTop.current.traffic_monthly;
        }
        if (newType === 'TOTAL') {
          topData.current = trafficTop.current.traffic_all;
        }
      }
      setStc(newType);
      // layerManager.current[2].layer.setStyle(parcelStyle);
      switchLayer(mapRef.current.getZoom() - minZoomLevel + 1);
      closePop();
    },
    [minZoomLevel],
  );
  const changeMapType = React.useCallback(
    (newType) => {
      mapType.current = newType;
      setStaticList(options[newType]);
      setStc('MONTHLY');
      if (newType === 'PRICE') {
        topData.current = priceTop.current.price_quarterly;
      }
      if (newType === 'TRAFFIC') {
        topData.current = trafficTop.current.traffic_monthly;
      }
      staticType.current = options[newType][1].value;
      // layerManager.current[2].layer.setStyle(parcelStyle);
      switchLayer(mapRef.current.getZoom() - minZoomLevel + 1);
      closePop();
    },
    [minZoomLevel],
  );

  const getZoomChangeNumber = React.useCallback(
    (zoom) => {
      let result = zoom - minZoomLevel < 0 ? 0 : zoom - minZoomLevel;
      result = result > 2 ? 2 : result;
      return result;
    },
    [minZoomLevel],
  );

  const zoomChange = (e) => {
    const targetLayer = e.target._zoom - minZoomLevel + 1;

    legends.current = colors[getZoomChangeNumber(e.target._zoom)];

    /* eslint no-underscore-dangle: 0 */
    setZoomLevel(e.target._zoom);
    /* eslint no-underscore-dangle: 0 */
    switchLayer(targetLayer);

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
      let res = null;
      if (mapType.current === 'TRAFFIC') {
        res = await getCvParcelDetail(id);
      } else {
        res = await getCvParcelDetail(id, 'price', staticType.current);
      }
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
    if (zoomControl) {
      legends.current = colors[getZoomChangeNumber(zoomLevel)];
    } else {
      legends.current = colors['1'];
    }

    mapRef.current = map;
    markers.current = L.layerGroup([]);
    // map.addLayer(markers.current);

    const isLandLayer = L.geoJSON(null, {
      style: () => {
        return {
          weight: 3,
          color: '#39636C',
        };
      },
      onEachFeature: (feature, layer) => {
        const label = feature.properties.name;
        if (!label) {
          return;
        }

        /* eslint no-underscore-dangle: 0 */
        const c = (layer as any).getBounds().getCenter();
        const markerposition = c;
        const canvas = getCanvas(label);
        const markerlayer = L.marker(markerposition, {
          icon: L.icon({
            iconUrl: canvas.toDataURL('image/png'),
            iconSize: [canvas.width, canvas.height],
          }),
        });
        markers.current.addLayer(markerlayer);
      },
    }).addTo(map);

    const suburbsLayer = L.geoJSON(null, {
      style: (fe) => {
        return {
          color: '#39636C',
        };
      },
      pointToLayer: (feature) => {
        if (!feature.properties.name) {
          return;
        }

        const canvas = getCanvas(feature.properties.name);
        /* eslint no-underscore-dangle: 0 */
        const coord = feature.geometry.coordinates.reverse();
        const markerlayer = L.marker(
          { lat: coord[0], lng: coord[1] },
          {
            icon: L.icon({
              iconUrl: canvas.toDataURL('image/png'),
              iconSize: [canvas.width, canvas.height],
            }),
          },
        );
        return markerlayer;
      },
    }).addTo(map);

    const streetLayer = L.geoJSON(null, {
      style: (fe) => {
        return {
          fill: true,
          fillColor: `#39636C`,
          color: '#39636C',
          weight: 1,
          fillOpacity: 1,
        };
      },
    }).addTo(map);

    const parcelsLayerThree = L.geoJSON(null, {
      style: parcelStyle,
      onEachFeature: (feature, layer) => {
        if (feature.properties.name && zoomControl) {
          layer.bindTooltip(feature.properties.name, {
            direction: 'top',
            className: style.leafletLabel,
          });
        }
      },
    }).addTo(map);

    const parcelsLayerTwo = L.geoJSON(null, {
      style: parcelStyle,
      onEachFeature: (feature, layer) => {
        if (feature.properties.name && zoomControl) {
          layer.bindTooltip(feature.properties.name, {
            direction: 'top',
            className: style.leafletLabel,
          });
        }
      },
    }).addTo(map);

    const parcelsLayerOne = L.geoJSON(null, {
      style: parcelStyle,
      onEachFeature: (feature, layer) => {
        if (feature.properties.name && zoomControl) {
          layer.bindTooltip(feature.properties.name, {
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

    const parcelsPriceLayerThree = L.geoJSON(null, {
      style: parcelStyle,
      onEachFeature: (feature, layer) => {
        if (feature.properties.name && zoomControl) {
          layer.bindTooltip(feature.properties.name, {
            direction: 'top',
            className: style.leafletLabel,
          });
        }
      },
    });

    const parcelsPriceLayerTwo = L.geoJSON(null, {
      style: parcelStyle,
      onEachFeature: (feature, layer) => {
        if (feature.properties.name && zoomControl) {
          layer.bindTooltip(feature.properties.name, {
            direction: 'top',
            className: style.leafletLabel,
          });
        }
      },
    });

    const parcelsPriceLayerOne = L.geoJSON(null, {
      style: parcelStyle,
      onEachFeature: (feature, layer) => {
        if (feature.properties.name && zoomControl) {
          layer.bindTooltip(feature.properties.name, {
            direction: 'top',
            className: style.leafletLabel,
          });
        }
      },
    });

    if (zoomControl) {
      parcelsLayerThree.on('click', function (e) {
        if (e.sourceTarget && e.sourceTarget.feature) {
          const id = e.sourceTarget.feature.properties.parcel_id;
          const { colorIndex } = e.sourceTarget.feature.properties;

          clearHeightLight();

          const polygon = JSON.parse(JSON.stringify(e.sourceTarget.feature));
          polygon.properties.active = true;
          heighFeature.current = polygon;
          layerManager.current[9].layer.addData(heighFeature.current);

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

      parcelsPriceLayerThree.on('click', function (e) {
        if (e.sourceTarget && e.sourceTarget.feature) {
          const id = e.sourceTarget.feature.properties.parcel_id;
          const { colorIndex } = e.sourceTarget.feature.properties;

          clearHeightLight();

          const polygon = JSON.parse(JSON.stringify(e.sourceTarget.feature));
          polygon.properties.active = true;
          heighFeature.current = polygon;
          layerManager.current[9].layer.addData(heighFeature.current);

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
        Router.push('/heatmap?type=cryptovoxels');
        // window.location.href = '/map?type=voxel';
      });
    }

    // commit test

    const dataLayer = [
      {
        layer: suburbsLayer,
        name: 'subur',
      },
      {
        layer: streetLayer,
        name: 'street',
      },
      {
        layer: parcelsLayerThree,
        name: 'parcels3',
      },
      {
        layer: parcelsLayerTwo,
        name: 'parcels2',
      },
      {
        layer: parcelsLayerOne,
        name: 'parcels1',
      },
      {
        layer: isLandLayer,
        name: 'island',
      },
      {
        layer: parcelsPriceLayerThree,
        name: 'price3',
      },
      {
        layer: parcelsPriceLayerTwo,
        name: 'price2',
      },
      {
        layer: parcelsPriceLayerOne,
        name: 'price1',
      },
      {
        layer: heighLayer,
        name: 'heighLayer',
      },
    ];

    layerManager.current = dataLayer;

    switchLayer(2);
    requestLand(map, isLandLayer);
    requestSub(map, suburbsLayer);
    requestMapTwoData(null, parcelsLayerTwo);
    requestPriceMapTwoData(parcelsPriceLayerTwo);
    reqTop20();
    if (zoomControl) {
      requestMapOneData(null, parcelsLayerOne);
      requestMapThreeData(streetLayer, parcelsLayerThree);
      requestPriceMapThreeData(parcelsPriceLayerThree);
      requestPriceMapOneData(parcelsPriceLayerOne);
    }

    return () => {
      map.off('zoom');
      map.remove();
    };
    // requestSube(map);
  }, []);

  const rander = React.useMemo(() => {
    return (
      <>
        {topData.current
          ? topData.current.map((item, idx) => {
              return (
                <TopParcel
                  idx={idx}
                  key={idx}
                  {...item}
                  mapType={mapType.current}
                  staticType={stc}
                ></TopParcel>
              );
            })
          : null}
      </>
    );
  }, [stc, changeStaticType, changeMapType, staticList, arrowsState]);

  const selecterRander = React.useMemo(() => {
    
    return (
      <div className={cn('flex justify-between items-center', style.picker)} 
      >
        {/* <div className={cn('flex justify-center items-center', style.type)}>TRAFFIC</div> */}
        <Selecter
          mini={style.change}
          options={mapT}
          onClick={changeMapType}
          showArrow={changeTypeControl}
          defaultLabel={mapType.current}
        ></Selecter>
        <div className={style.dividing}></div>
        <Selecter
          mini={style.change}
          options={staticList}
          onClick={changeStaticType}
          showArrow={changeTypeControl}
          defaultLabel={staticType.current}
        ></Selecter>
      </div>
    );
  }, [changeMapType, changeStaticType, staticList, changeTypeControl]);

  return (
    <div className={style.mapContainer} onClick={onClick}>
      <div className={style.container}>
        <div className={style.bg}></div>
        {selecterRander}
        {mapType.current === 'PRICE' ? (
          <div className={cn('flex justify-center items-center', style.helper)}>
            <div
              data-tip
              data-for="info"
              data-place="bottom"
              className={cn('relative flex justify-center items-center', style.helperInfo)}
            >
              <img src="/images/helper.png"></img>
            </div>
            <ReactTooltip
              id="info"
              effect="solid"
              textColor="#AAAAAA"
              // className={style.pop}
              backgroundColor="#0F191B"
              border={false}
            >
              <div className={style.info}>
                The brighter the area, the higher the average price in the selected time frame.The
                first/second level show the average parcel sale USD in island/suburb, the third
                level (and above) show the cumulative sale USD of the parcel.
              </div>
            </ReactTooltip>
          </div>
        ) : (
          <></>
        )}
        <div
          className={style.arrows}
          onClick={() => {
            setArrowsState(!arrowsState);
          }}
        >
          <img src={`/images/${arrowsState ? 'Frame-down.png' : 'Frame-up.png'}`} />
        </div>
      </div>
      <div className={cn(style.topList, arrowsState ? style.dn : null)}>
        <div className={style.title}>TOP 20 Parcels</div>
        {rander}
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

export default Map;
