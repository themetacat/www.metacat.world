import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

type Props = {
  id?: string;
  className?: string;
  pointNum?: number;
};

export default function AnimationBack({ className, pointNum = 1000 }: Props) {
  const render = React.useMemo(() => {
    const all = [];
    for (let i = 1; i <= pointNum; i += 1) {
      const box = <span key={i}></span>;
      all.push(box);
    }
    return <>{all}</>;
  }, [pointNum]);

  return <div className={cn('w-full h-full bg-black', className, style.container)}>{render}</div>;
}
