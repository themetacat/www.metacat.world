import React from 'react';
// import { Scene, PointLayer, } from '@antv/l7';
// import { Mapbox } from '@antv/l7-maps';
// import { Hexbin } from '@antv/l7plot'

type Props = {
  id: string;
};
export default function Demo2({ id }: Props) {
  return (
    <>
      <div
        id={id}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgb(8 17 19)',
        }}
      ></div>
    </>
  );
}
