import React from 'react';
import Router from 'next/router';

export default function () {
  React.useEffect(() => {
    Router.push('/heatmap?type=cryptovoxels');
  }, [null]);
  return <div></div>;
}
