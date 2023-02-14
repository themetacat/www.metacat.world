import React from 'react';
import dynamic from 'next/dynamic';
import cn from 'classnames';
import style from './index.module.css';

const ReactTooltip = dynamic(() => import('react-tooltip'), {
  ssr: false,
});
type Props = {
  iconImgLight?;
};

export default function Footer(iconImgLight:Props) {
  
  return (
    <footer className={cn("py-10 flex text-white items-center relative",iconImgLight.iconImgLight===true?style.footContent1:style.footContent)}>
      <div className="flex sm:flex-row flex-col sm:items-center main-content">
        <div className="flex flex-col items-start">
          <div className="sm:w-16 sm:h-16 w-12 h-12 mr-4">
            <img className="mr-4" src="/images/icon.png" alt="logo" />
          </div>
          <section className="flex flex-col	h-full">
            <span className={cn("sm:text-xl text-base font-semibold",iconImgLight.iconImgLight===true?style.p1:style.p2)}>Powered by MetaCat</span>
          </section>
        </div>

        <section className="flex flex-1 sm:justify-end justify-center mt-4 sm:mt-0">
          <a
            href="https://twitter.com/Metacat007"
            target="_blank"
            data-tip="Twitter"
            className="w-10 h-10 mr-14"
          >
            <img src={iconImgLight.iconImgLight ===true?'/images/twitter.png':'/images/image/twitter.png'} />
          </a>

          <a
            href="https://discord.gg/yRt6be237P"
            target="_blank"
            data-tip="Discord"
            className="w-10 h-10 mr-14"
          >
            <img src={iconImgLight.iconImgLight ===false?"/images/discord.png":'/images/image/discord.png'} />
          </a>

          <a
            href="https://medium.com/@themetacat"
            target="_blank"
            data-tip="Medium"
            className="w-10 h-10  rounded-full mr-14 justify-center items-center flex bg-transparent"
          >
            <img src={iconImgLight.iconImgLight ===false?"/images/medium.png":'/images/image/medium.png'} />
          </a>
          <div
            data-tip
            data-for="code"
            className="w-10 h-10  rounded-full  mr-14 justify-center items-center flex bg-transparent"
          >
            <img src={iconImgLight.iconImgLight ===false?"/images/wx.png" :'/images/image/wx.png'}/>
          </div>
          <a
            href=" https://mirror.xyz/0xE069160b21d23fB8Edad4F8B42f6b91f7b77F22A"
            data-tip="Mirror"
            className="w-10 h-10  rounded-full mr-14 justify-center items-center flex bg-transparent"
          >
            <img  src={iconImgLight.iconImgLight ===false?"/images/mirror.png":'/images/image/mirror.png'} />
          </a>
          <a
            href="https://www.youtube.com/channel/UCeZkqQ-CsIxjKeQJx3zOSGA"
            data-tip="YouTube"
            className={cn(
              'w-15 h-15  rounded-full mr-14 justify-center items-center flex bg-transparent',
              style.mt,
            )}
          >
            <img src={iconImgLight.iconImgLight ===false?"/images/YouTube.png":'/images/image/YouTube.png' }/>
          </a>
          <a
            href="mailto:metacat@tutanota.com"
            data-tip="metacat@tutanota.com"
            className="w-10 h-10  rounded-full mr-14 justify-center items-center flex bg-transparent"
          >
            <img src={iconImgLight.iconImgLight ===false?"/images/emailW.png" :'/images/image/emailW.png' }/>
          </a>
        
          <ReactTooltip
            id="code"
            effect="solid"
            textColor="#ccc"
            className={style.pop}
            backgroundColor="rgba(0, 208, 236, 0.2)"
            border={false}
          >
            <img src="/images/code.jpg" className="w-24 h-24" />
          </ReactTooltip>
      
        </section>
      </div>
      <ReactTooltip
        effect="solid"
        textColor="#ccc"
        className={style.pop}
        backgroundColor="rgba(0, 208, 236, 0.2)"
        border={false}
      ></ReactTooltip>
    </footer>
  );
}
