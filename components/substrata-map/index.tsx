import React from 'react';
import cn from 'classnames';
import L from 'leaflet';
import MiniMap from 'leaflet-minimap';
import style from './index.module.css';
import { req_substrata_level_three } from '../../service/z_api';

type Props = {
  zoomLimit?: Array<number>;
  initZoom?: number;
  dragging?: boolean;
};

const mapT = [{ value: 'price', label: 'PRICE' }];

const options = {
  price: [
    { label: 'MONTHLY', value: 'month' },
    { label: 'QUARTERLY', value: 'quarter' },
    { label: 'YEARLY', value: 'year' },
    { label: 'All-Time', value: 'all' },
  ],
};

export default function subStrataMap({
  zoomLimit,
  initZoom = zoomLimit[0],
  dragging = true,
}: Props) {
  const [minZoomLevel, setMinZoomLevel] = React.useState(zoomLimit[0]);
  const [maxZoomLevel, setMaxZoomLevel] = React.useState(zoomLimit[1]);
  const [fullScreen, setFullScreen] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState(initZoom);

  const [data, setData] = React.useState([]);
  const [state, setState] = React.useState([]);

  const mapRef = React.useRef(null);
  const markers = React.useRef(null);
  const reqData = React.useCallback(async () => {
    const result = await req_substrata_level_three();
    console.log(result.data);
    if (result.code === 100000) {
      setData(result.data.parcels);
      setState(result.data.stats.price.level_one);
    }
  }, []);

  const zoomChange = (e) => {
    const targetLayer = e.target._zoom - minZoomLevel + 1;

    // legends.current = colors[getZoomChangeNumber(e.target._zoom)];

    /* eslint no-underscore-dangle: 0 */
    setZoomLevel(e.target._zoom);
    /* eslint no-underscore-dangle: 0 */
    // switchLayer(targetLayer);

    // closePop();
  };

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

  React.useEffect(() => {
    reqData();

    const map = L.map('map', {
      preferCanvas: true,
      minZoom: minZoomLevel,
      maxZoom: maxZoomLevel,
      zoomControl: false,
      dragging,
    }).setView([0, 0], zoomLevel);
    map.on('zoom', zoomChange);

    mapRef.current = map;
    markers.current = L.layerGroup([]);

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
        console.log(c);
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

    return () => {
      map.off('zoom');
      map.remove();
    };
  }, [reqData]);
  return (
    <div className={style.container}>
      <div className={style.map} id="map"></div>
    </div>
  );
}
