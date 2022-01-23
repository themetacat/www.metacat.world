import React from 'react';
import cn from 'classnames';
import L, { marker } from 'leaflet';
import MiniMap from 'leaflet-minimap';

import style from './index.module.css';

import AddLabelToGeoJSON from './label';

import Selecter from '../select';
import Legend from '../legend';
import ParcelDeatil from '../parcel-detail';

import { convert } from '../../common/utils';

import { getCvMapLevelThree, getCvParcelDetail } from '../../service';

const options = [
  { label: 'WEEKLY', value: 'WEEKLY' },
  { label: 'MONTHLY', value: 'MONTHLY' },
  { label: 'TOTAL', value: 'TOTAL' },
];

interface Props {
  zoomLimit?: Array<number>;
  zoomControl?: boolean;
  onClick?: () => void;
  dragging?: boolean;
  backColor?: string;
}

const colors = {
  0: [
    {
      label: 'Top 20%',
      color: '#00F0FF',
      limit: [0.8, 1.1],
    },
    {
      label: '21%-50%',
      color: '#119CAE',
      limit: [0.5, 0.8],
    },
    {
      label: '51%-80%',
      color: '#03464F',
      limit: [0.2, 0.5],
    },
    {
      label: '81%-100%',
      color: '#0A2227',
      limit: [0, 0.2],
    },
  ],
  1: [
    {
      label: 'Top 14%',
      color: '#4FFFF4',
      limit: [0.86, 1.1],
    },
    {
      label: '15%-30%',
      color: '#00D0DD',
      limit: [0.7, 0.86],
    },
    {
      label: '31%-45%',
      color: '#007B8C',
      limit: [0.55, 0.7],
    },
    {
      label: '45%-60%',
      color: '#00404E',
      limit: [0.4, 0.55],
    },
    {
      label: '61%-75%',
      color: '#00232B',
      limit: [0.25, 0.4],
    },
    {
      label: '76%-100%',
      color: '#00191E',
      limit: [0, 0.25],
    },
  ],
  2: [
    {
      label: 'Top 10%',
      color: '#72FFE6',
      limit: [0.9, 1.1],
    },
    {
      label: '11%-20%',
      color: '#00E1EF',
      limit: [0.8, 0.9],
    },
    {
      label: '21%-30%',
      color: '#009DA7',
      limit: [0.7, 0.8],
    },
    {
      label: '31%-40%',
      color: '#006A78',
      limit: [0.6, 0.7],
    },
    {
      label: '41%-50%',
      color: '#004149',
      limit: [0.5, 0.6],
    },
    {
      label: '51%-65%',
      color: '#082C31',
      limit: [0.35, 0.5],
    },
    {
      label: '66%-80%',
      color: '#001F23',
      limit: [0.2, 0.35],
    },
    {
      label: '81%-100%',
      color: '#001B21',
      limit: [0, 0.2],
    },
  ],
};

export default function Map({
  zoomLimit,
  zoomControl,
  onClick,
  dragging = true,
  backColor = 'black',
}: Props) {
  const [minZoomLevel, setMinZoomLevel] = React.useState(zoomLimit[0]);
  const [maxZoomLevel, setMaxZoomLevel] = React.useState(zoomLimit[1]);
  const [zoomLevel, setZoomLevel] = React.useState(minZoomLevel);
  const [detail, setDeatil] = React.useState();
  const updatePop = React.useRef({
    need: false,
    source: {
      lat: 0,
      lng: 0,
    },
  });
  const popDetail = React.useRef();
  const staticType = React.useRef('MONTHLY');
  const legends = React.useRef(colors[0]);
  const trafficRef = React.useRef(null);
  const markers = React.useRef(null);
  const layerManager = React.useRef(null);
  const mapRef = React.useRef(null);

  const requestLand = (map, layer) => {
    //
    fetch('https://www.cryptovoxels.com/api/islands.json')
      .then((res) => {
        const data = res.json();
        return data;
      })
      .then((a) => {
        if (a && a.islands) {
          const allP = a.islands;

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

          for (let i = 0; i < allP.length; i += 1) {
            if (allP[i]) {
              const all = allP[i];
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

          const min = new MiniMap(minIsLandLayer, {
            position: 'topright',
            width: 300,
            heigth: 150,
            zoomLevelFixed: 2,
            mapOptions: {
              preferCanvas: true,
            },
          }).addTo(map);
        }
      });
  };

  const requestSub = (map, layer) => {
    //
    fetch('https://www.cryptovoxels.com/api/suburbs.json')
      .then((res) => {
        const data = res.json();
        return data;
      })
      .then((a) => {
        if (a && a.suburbs) {
          const allP = a.suburbs;

          for (let i = 0; i < allP.length; i += 1) {
            if (allP[i]) {
              const all = allP[i];
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
        }
      });
  };

  const drawGeoJsonToLayer = (data, traffic, layer2, layer3) => {
    if (data) {
      layer2?.clearLayers();
      layer3?.clearLayers();
      for (let i = 0; i < data.length; i += 1) {
        const all = data[i];
        if (all) {
          if (all.geometry) {
            const polygon = {
              type: 'Feature',
              ...all,
            };
            const allPercent =
              (all.traffic.all - traffic.all.min) / (traffic.all.max - traffic.all.min);
            const monthPercent =
              (all.traffic.month - traffic.month.min) / (traffic.month.max - traffic.month.min);
            const weekPercent =
              (all.traffic.week - traffic.week.min) / (traffic.week.max - traffic.week.min);

            polygon.properties.TOTAL = allPercent;
            polygon.properties.MONTHLY = monthPercent;
            polygon.properties.WEEKLY = weekPercent;

            layer3.addData(polygon);
          }
          if (all.streets) {
            all.streets.forEach((x) => {
              if (x && x.geometry) {
                const stre = {
                  type: 'Feature',
                  ...x,
                };
                layer2.addData(stre);
              }
            });
          }
        }
      }
    }
  };

  const requestMapData = React.useCallback(
    async (layers) => {
      const res = await getCvMapLevelThree();
      const { parcels, stats } = res.data;

      // parcels.current = data;
      trafficRef.current = stats?.traffic;

      drawGeoJsonToLayer(parcels, stats?.traffic, layers[1].layer, layers[2].layer);
    },
    [null],
  );

  // parcel style function
  const parcelStyle = React.useCallback(
    (fe) => {
      let color = 'rgba(101, 128, 134, 1)';
      let count = fe.properties[staticType.current];
      if (!Number.isNaN(count) && legends.current) {
        count = count < 0 ? 0 : count;
        const allColor = legends.current.find((x) => {
          return count < x.limit[1] && count >= x.limit[0];
        });
        if (allColor) {
          color = allColor.color;
        }
      }
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
    (targetLayer) => {
      markers.current.removeFrom(mapRef.current);
      if (targetLayer < 2) {
        mapRef.current.removeLayer(layerManager.current[1].layer);
        mapRef.current.removeLayer(layerManager.current[0].layer);
        layerManager.current[3].layer.addTo(mapRef.current); // add island
        markers.current.addTo(mapRef.current);
        return;
      }
      if (targetLayer < 3) {
        mapRef.current.removeLayer(layerManager.current[1].layer);
        mapRef.current.removeLayer(layerManager.current[3].layer);
        layerManager.current[0].layer.addTo(mapRef.current);
        return;
      }
      mapRef.current.removeLayer(layerManager.current[3].layer);
      layerManager.current[1].layer.addTo(mapRef.current);
      layerManager.current[0].layer.addTo(mapRef.current);
    },
    [null],
  );

  const changeStaticType = React.useCallback(
    (newType) => {
      staticType.current = newType;
      layerManager.current[2].layer.setStyle(parcelStyle);
      switchLayer(mapRef.current.getZoom() - minZoomLevel + 1);
    },
    [minZoomLevel],
  );

  const zoomChange = (e) => {
    const targetLayer = e.target._zoom - minZoomLevel + 1;

    legends.current = colors[e.target._zoom - minZoomLevel < 0 ? 0 : e.target._zoom - minZoomLevel];

    /* eslint no-underscore-dangle: 0 */
    setZoomLevel(e.target._zoom);
    /* eslint no-underscore-dangle: 0 */
    switchLayer(targetLayer);
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

      const fontSize = 12;
      const cdiv = ctx.measureText(text).width;

      const width = cdiv * 1.3;
      const height = 28;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ctx.fillStyle = 'rgba(100,200,0, 0.7)';
      // ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px bold`;
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, height / 2);
      return canvas;
    },
    [null],
  );

  const requestDeatil = React.useCallback(
    async (id) => {
      const res = await getCvParcelDetail(id);
      const parcel = convert(res.data);
      setDeatil(parcel);
    },
    [null],
  );

  React.useEffect(() => {
    const map = L.map('map', {
      preferCanvas: true,
      minZoom: minZoomLevel,
      maxZoom: maxZoomLevel,
      zoomControl: false,
      dragging,
    }).setView([0, 0], zoomLevel);
    map.on('zoom', zoomChange);
    legends.current = colors[zoomLevel - minZoomLevel < 0 ? 0 : zoomLevel - minZoomLevel];
    mapRef.current = map;
    markers.current = L.layerGroup([]);
    // map.addLayer(markers.current);
    const isLandLayer = L.geoJSON(null, {
      style: () => {
        return {
          weight: 1,
          color: '#39636C',
        };
      },
      onEachFeature: (feature, layer) => {
        const label = feature.properties.name;
        if (!label) {
          return;
        }
        const c = layer.getBounds().getCenter();
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
        const markerlayer = L.marker(feature.geometry.coordinates.reverse(), {
          icon: L.icon({
            iconUrl: canvas.toDataURL('image/png'),
            iconSize: [canvas.width, canvas.height],
          }),
        });
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

    const parcelsLayer = L.geoJSON(null, {
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

    if (zoomControl) {
      parcelsLayer.on('click', function (e) {
        if (e.sourceTarget && e.sourceTarget.feature) {
          const id = e.sourceTarget.feature.properties.parcel_id;
          if (popDetail.current) {
            popDetail.current.style.desplay = 'block';
            popDetail.current.style.top = `${e.containerPoint.y}px`;
            popDetail.current.style.left = `${e.containerPoint.x}px`;
            updatePop.current.source = e.latlng;
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
        if (updatePop.current.need && popDetail.current) {
          const containerPoint = map.latLngToContainerPoint(updatePop.current.source);
          popDetail.current.style.top = `${containerPoint.y}px`;
          popDetail.current.style.left = `${containerPoint.x}px`;
        }
      });

      map.on('moveend', () => {
        if (updatePop.current.need) {
          updatePop.current.need = false;
        }
      });
    }

    const dataLayer = [
      {
        layer: suburbsLayer,
        name: 'subur',
      },
      {
        layer: streetLayer,
        name: 'parcels2',
      },
      {
        layer: parcelsLayer,
        name: 'parcels3',
      },
      {
        layer: isLandLayer,
        name: 'island',
      },
    ];

    layerManager.current = dataLayer;

    switchLayer(1);
    requestLand(map, isLandLayer);
    requestSub(map, suburbsLayer);
    requestMapData(dataLayer);
    return () => {
      map.off('zoom');
      map.remove();
    };
    // requestSube(map);
  }, [null]);

  return (
    <div className={style.mapContainer} onClick={onClick}>
      <div className={cn('flex justify-between items-center', style.picker)}>
        <div className={cn('flex justify-center items-center', style.type)}>PRICE</div>
        <div className={style.dividing}></div>
        <Selecter
          options={options}
          onClick={changeStaticType}
          showArrow={zoomControl}
          defaultLabel={staticType.current}
        ></Selecter>
      </div>
      {zoomControl ? (
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
      ) : null}
      <div id="map" className={style.map} style={{ backgroundColor: backColor }}>
        <div className={cn('absolute', style.pop)} ref={popDetail}>
          <ParcelDeatil options={detail}></ParcelDeatil>
        </div>
      </div>
      <Legend className={style.legend} title="Level of thermal" options={legends.current}></Legend>
    </div>
  );
}
