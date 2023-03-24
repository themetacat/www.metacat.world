import React from 'react';
import Router from 'next/router';

export default function () {
  React.useEffect(() => {
    Router.push('/creater/builders');
  }, [null]);
  return <div></div>;
}
