import React, { MouseEventHandler } from 'react';

import { useRouter } from 'next/router';

import cn from 'classnames';

import style from './index.module.less';



type Props = {
  onActive?: (x) => void;
  active?: boolean;
  icon?: string;
  options?;
  label?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  isMini?: boolean;
};

export default function Tab({onActive, icon, label, active, options,onClick, isMini = false }: Props) {
  const router = useRouter();
  // const [activeData, setActiveData] = React.useState(  options[0].value);
  const ac = isMini ? style.miniActive : style.active;
  const no = isMini ? style.miniNormal : style.normal;
  const st = active ? ac : no;
  // React.useEffect(()=>{
  //   console.log(router,'switch');
  //   if(router){
  //     setActiveData(router.query.type)
  //       onActive(router?.query?.type);
  //   }
  // },[router.query.type])
  return isMini ? (
    <div
      className={cn('flex justify-center items-center text-white', st, style.miniBase)}
      onClick={onClick}
    >
      <div className={cn('flex justify-center items-center', style.miniCanHover)}>
        {icon ? (
          <div
            className={cn('bg-contain mr-2', style.miniTabIcon)}
            style={{ backgroundImage: `url('${icon}')` }}
          ></div>
        ) : null}
        <div>{label}</div>
      </div>
    </div>
  ) : (
    <div
      className={cn('flex justify-center items-center text-white', st, style.base)}
      onClick={onClick}
    >
      <div className={cn('flex justify-center items-center', style.canHover)}>
        <div
          className={cn('bg-contain mr-2', style.tabIcon)}
          style={{ backgroundImage: `url('${icon}')` }}
        ></div>
        <div>{label}</div>
      </div>
    </div>
  );
}
