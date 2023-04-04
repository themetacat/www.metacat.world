import React, { useEffect } from 'react';
import cn from 'classnames';

import style from './index.module.css';

type Props = {
  id?: string;
  className?: string;
  pointNum?: number;
  iconImgLight?;
};

export default function AnimationBack({ className,iconImgLight, pointNum = 1000 }: Props) {
  // console.log(iconImgLight,555);

  const render = React.useMemo(() => {
    const all = [];
    for (let i = 1; i <= pointNum; i += 1) {
      const box = <span key={i}></span>;
      all.push(box);
    }
    return <>{all}</>;
  }, [pointNum]);

  return <div className={cn('w-full h-full bg-black', className, iconImgLight===true?style.container1:style.container)}>{render}</div>;
}
