import React from 'react';
import cn from 'classnames';
import L from 'leaflet';
import MiniMap from 'leaflet-minimap';

import { req_substrata_level_three } from '../../service/z_api';

export default function subStrataMap() {
  const reqData = React.useCallback(async () => {
    const result = await req_substrata_level_three();
    console.log(result);
  }, []);

  React.useEffect(() => {
    reqData();
  }, [reqData]);
  return <div></div>;
}
