import React from 'react';

import style from './index.module.css';

export default function Map() {
  return (
    <div className={style.mapContainer}>
      <div id="map" className={style.map}></div>
    </div>
  );
}
