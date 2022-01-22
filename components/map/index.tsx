import React from 'react';
import cn from 'classnames';
import L from 'leaflet';
import MiniMap from 'leaflet-minimap';

import style from './index.module.css';
import 'leaflet/dist/leaflet.css';

import AddLabelToGeoJSON from './label';

import Selecter from '../select';
import Legend from '../legend';

import { getCvMapLevelThree } from '../../service';

const options = [
  { label: 'WEEKLY', value: 'WEEKLY' },
  { label: 'MONTHLY', value: 'MONTHLY' },
  { label: 'TOTAL', value: 'TOTAL' },
];

interface legendObj {
  color?: string;
  label?: string;
}

interface Props {
  zoomLimit?: Array<number>;
  zoomControl?: boolean;
  legends?: Array<legendObj>;
  onClick?: () => void;
  dragging?: boolean;
  backColor?: string;
}

export default function Map({
  zoomLimit,
  zoomControl,
  legends,
  onClick,
  dragging = true,
  backColor = 'black',
}: Props) {
  const [minZoomLevel, setMinZoomLevel] = React.useState(zoomLimit[0]);
  const [maxZoomLevel, setMaxZoomLevel] = React.useState(zoomLimit[1]);
  const [zoomLevel, setZoomLevel] = React.useState(minZoomLevel);
  const [staticType, setStaticType] = React.useState('MONTHLY');
  const parcels = React.useRef(null);
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

  const drawGeoJsonToLayer = (data, layer1, layer2, layer3) => {
    if (data) {
      layer2?.clearLayers();
      layer3?.clearLayers();
      for (let i = 0; i < data.length; i += 1) {
        const all = data[i];
        if (all) {
          if (all.geometry) {
            all.type = 'Feature';
            layer3.addData(all);
          }
          if (all.streets) {
            all.streets.forEach((x) => {
              if (x && x.geometry) {
                const stre = {
                  type: 'Feature',
                  ...x,
                };
                layer2.addData(stre);
                layer3.addData(stre);
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
      const { data } = res;

      // parcels.current = data;

      drawGeoJsonToLayer(data, layers[0].layer, layers[1].layer, layers[2].layer);
    },
    [null],
  );

  const switchLayer = React.useCallback(
    (targetLayer) => {
      for (let i = 0; i < layerManager.current.length; i += 1) {
        if (layerManager.current[i].name !== `parcels${targetLayer}`) {
          mapRef.current.removeLayer(layerManager.current[i].layer);
        } else {
          layerManager.current[i].layer.addTo(mapRef.current);
        }
      }
    },
    [null],
  );

  const changeStaticType = React.useCallback(
    (newType) => {
      setStaticType(newType);
    },
    [staticType],
  );

  const checkBound = (feature, bound) => {
    const box = [feature.x1, feature.x2, feature.y1, feature.y2, feature.z1, feature.z2];
    // bound[Math.min(bound[0], feature.x1), ]
  };

  const zoomChange = (e) => {
    const targetLayer = e.target._zoom - minZoomLevel + 1;
    /* eslint no-underscore-dangle: 0 */
    setZoomLevel(e.target._zoom);
    /* eslint no-underscore-dangle: 0 */
    // switchLayer(targetLayer);
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

  React.useEffect(() => {
    const map = L.map('map', {
      preferCanvas: true,
      minZoom: minZoomLevel,
      maxZoom: maxZoomLevel,
      zoomControl: false,
      dragging,
    }).setView([0, 0], zoomLevel);
    map.on('zoom', zoomChange);
    mapRef.current = map;
    const IsLandLayer = L.geoJSON(null, {
      style: () => {
        return {
          weight: 1,
        };
      },
      onEachFeature: (feature) => {
        AddLabelToGeoJSON(feature, map, { LabelFeatureProperty: 'name' });
      },
    }).addTo(map);

    const Parcels1Layer = L.geoJSON(null, {
      style: (fe) => {
        return {
          fill: true,
          fillColor: `rgb(255, 255, ${fe.properties.color})`,
          weight: 1,
          fillOpacity: 1,
        };
      },
    }); // .addTo(map);

    const Parcels2Layer = L.geoJSON(null, {
      style: (fe) => {
        return {
          fill: true,
          fillColor: `rgb(255, 255, ${fe.properties.color})`,
          weight: 1,
          fillOpacity: 1,
        };
      },
    }); //  .addTo(map);

    const Parcels3Layer = L.geoJSON(null, {
      style: (fe) => {
        return {
          fill: true,
          fillColor: `rgb(255, 255, ${fe.properties.color})`,
          weight: 1,
          fillOpacity: 1,
        };
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.name);
        // AddLabelToGeoJSON(feature, map, { LabelFeatureProperty: 'name' });
      },
    }).addTo(map);

    const dataLayer = [
      {
        layer: Parcels1Layer,
        name: 'parcels1',
      },
      {
        layer: Parcels2Layer,
        name: 'parcels2',
      },
      {
        layer: Parcels3Layer,
        name: 'parcels3',
      },
    ];

    layerManager.current = dataLayer;

    const allLayer = [
      {
        layer: IsLandLayer,
        name: 'island',
      },
      ...dataLayer,
    ];
    requestLand(map, IsLandLayer);
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
          defaultLabel={staticType}
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
      <div id="map" className={style.map} style={{ backgroundColor: backColor }}></div>
      <Legend className={style.legend} title="Level of thermal" options={legends}></Legend>
    </div>
  );
}
