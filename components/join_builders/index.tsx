import React from 'react';
import cn from 'classnames';
import style from './index.module.css';

interface Props {
  classname?: string;
}

export default function JoinBuilders({ classname }: Props) {
  const [show, switchShow] = React.useState(false);

  //   React.useEffect(() => {
  //     const listener = () => {
  //       switchShow(window.scrollY > 300);
  //     };
  //     document.addEventListener('scroll', listener);
  //     return () => document.removeEventListener('scroll', listener);
  //   }, [show]);

  return (
    <div>
      <div style={{ color: 'red' }}>TOP</div>
    </div>
  );
}
