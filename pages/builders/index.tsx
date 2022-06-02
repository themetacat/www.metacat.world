import React from 'react';
import Router from 'next/router';

export default function Builders() {
  React.useEffect(() => {
    Router.push('/build/builders');
  }, []);
  return <div></div>;
}
