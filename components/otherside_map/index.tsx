import React from 'react';
import { Scene, HeatmapLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

import styles from './index.module.css';

type Props = {
  id?: string;
};
export default function OthersideMap({ id }: Props) {
  const init = React.useCallback(() => {
    const map = new Mapbox({
      style: 'blank',
      pitch: 43,
      center: [120.13383079335335, 29.651873105004427],
      zoom: 8,
      minZoom: 3,
      maxZoom: 12,
    });

    const scene = new Scene({
      id,
      logoVisible: false,
      map,
    });
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/a1a8158d-6fe3-424b-8e50-694ccf61c4d7.csv',
      )
        .then((res) => res.text())
        .then((data) => {
          const layer = new HeatmapLayer({})
            .source(data, {
              parser: {
                type: 'csv',
                x: 'lng',
                y: 'lat',
              },
              transforms: [
                {
                  type: 'hexagon',
                  size: 2500,
                  field: 'v',
                  method: 'sum',
                },
              ],
            })
            .size('sum', (sum) => {
              return sum * 200;
            })
            .shape('circle')
            .style({
              coverage: 0.8,
              angle: 0,
              opacity: 1.0,
            })
            .color('sum', [
              '#094D4A',
              '#146968',
              '#1D7F7E',
              '#289899',
              '#34B6B7',
              '#4AC5AF',
              '#5FD3A6',
              '#7BE39E',
              '#A1EDB8',
              '#C3F9CC',
              '#DEFAC0',
              '#ECFFB1',
            ])
            .active({
              color: 'red',
            });
          // layer.on('click', (ev) => {
          //     // console.log(ev,1)
          // });
          scene.addLayer(layer);
        });
    });
  }, []);
  React.useEffect(() => {
    init();
  }, [init]);
  return (
    <>
      <div id={id} className={styles.map}></div>
    </>
  );
}
