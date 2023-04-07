import React from 'react';


import cn from 'classnames';
import style from './index.module.css';


type Props = {
  iconImgLight?;
};

export default function Footer(iconImgLight: Props) {
  const JumpTp =()=>{
    window.open('https://beian.miit.gov.cn/#/Integrated/index');
  }
  return (
    <footer
      className={cn(
        'py-10 flex text-white items-center relative',
        iconImgLight.iconImgLight === true ? style.footContent1 : style.footContent,
      )}
    >
      <div className={cn('flex sm:flex-row flex-col sm:items-center main-content')}>
        <div className={cn('', style.foot)}>
          <span className={cn('')}>ICP备案号：</span>
        
          <span className={cn('')} onClick={JumpTp}>京ICP备2023007895号-1</span>
        </div>
      
      </div>
    </footer>
  );
}