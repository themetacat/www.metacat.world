import React from 'react';
import L from 'leaflet';
import MiniMap from 'leaflet-minimap';

import style from './index.module.css';
import 'leaflet/dist/leaflet.css';

export default function Map() {
  const [zoomLevel, setZoomLevel] = React.useState(5);
  const parcels = React.useRef(null);
  const layerManager = React.useRef(null);

  const requestData = (number, map) => {
    fetch(`https://www.cryptovoxels.com/api/parcels/${number}.json`)
      .then((res) => {
        const data = res.json();
        return data;
      })
      .catch((err) => {
        console.log(err);
      })
      .then((rr) => {
        if (rr && rr.parcel) {
          const all = rr.parcel;
          if (all.geometry) {
            L.geoJSON(all.geometry, {}).addTo(map);
          }
          if (all.streets) {
            all.streets.forEach((x) => {
              if (x && x.geometry) {
                L.geoJSON(x.geometry).addTo(map);
              }
            });
          }
          console.log({
            geometry: all.geometry,
            streets: all.streets,
          });
        }

        // parcel.geometry
      });
  };

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
                layer.addData(all.geometry);
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

  const getLayer = (name) => {
    const layer = layerManager.current?.find((x) => {
      return x.name === name;
    });
    if (layer) {
      return layer.layer;
    }
    return null;
  };

  const drawGeoJsonToLayer = (data, zlevel) => {
    const layer = getLayer('parcels');
    if (layer && data) {
      layer.clearLayers();
      const color = 255 / data.length;
      for (let i = 0; i < data.length; i += 1) {
        const all = data[i];
        if (data[i]) {
          if (zlevel > 6) {
            if (all.geometry) {
              const al = {
                type: 'Feature',
                geometry: all.geometry,
                properties: {
                  id: all.id,
                  name: all.name,
                  color: color * i,
                },
              };
              layer.addData(al);
            }
            if (all.streets) {
              all.streets.foreach((x) => {
                if (x && x.geometry) {
                  layer.addData(x.geometry);
                }
              });
            }
          } else if (zlevel === 6) {
            if (all.island === 'Origin City') {
              const al = {
                type: 'Feature',
                geometry: all.geometry,
                properties: {
                  id: all.id,
                  name: all.name,
                  color: color * i,
                },
              };
              layer.addData(al);
            }
          }
        }
      }
    }
  };

  // sort pacels data
  const sortParcels = (p) => {
    p.sort(function (a, b) {
      return a.suburb.localeCompare(b.suburb);
    });
    return p;
  };

  // request parcels data
  const requestParcels = (map, layer) => {
    fetch('https://www.cryptovoxels.com/api/parcels.json')
      .then((res) => {
        const data = res.json();
        return data;
      })
      .then((a) => {
        if (a && a.parcels) {
          const allP = sortParcels(a.parcels);
          parcels.current = allP;
          drawGeoJsonToLayer(allP, zoomLevel);
        }
      });
  };

  const checkBound = (feature, bound) => {
    const box = [feature.x1, feature.x2, feature.y1, feature.y2, feature.z1, feature.z2];
    // bound[Math.min(bound[0], feature.x1), ]
  };

  const zoomChange = (e) => {
    /* eslint no-underscore-dangle: 0 */
    setZoomLevel(e.target._zoom);
    /* eslint no-underscore-dangle: 0 */
    drawGeoJsonToLayer(parcels.current, e.target._zoom);
  };

  const initMainMap = React.useCallback(() => {
    const map = L.map('map', {
      preferCanvas: true,
      minZoom: 5,
      maxZoom: 7,
    }).setView([0, 0], zoomLevel);
    return map;
  }, [null]);

  React.useEffect(() => {
    const map = initMainMap();

    map.on('zoom', zoomChange);
    const IsLandLayer = L.geoJSON(null, {
      style: () => {
        return {
          weight: 1,
        };
      },
    }).addTo(map);

    const ParcelsLayer = L.geoJSON(null, {
      style: (fe) => {
        return {
          fill: true,
          fillColor: `rgb(255, 255, ${fe.properties.color})`,
          weight: 1,
          fillOpacity: 1,
        };
      },
    }).addTo(map);

    layerManager.current = [
      {
        layer: IsLandLayer,
        name: 'island',
      },
      {
        layer: ParcelsLayer,
        name: 'parcels',
      },
    ];

    requestLand(map, IsLandLayer);

    requestParcels(map, ParcelsLayer);

    return () => {
      map.off('zoom');
      map.remove();
    };
    // requestSube(map);
  }, [null]);
  return (
    <div className={style.mapContainer}>
      <div id="map" className={style.map}></div>
    </div>
  );
}
