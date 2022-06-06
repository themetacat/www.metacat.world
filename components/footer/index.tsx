import React from 'react';
import dynamic from 'next/dynamic';
import cn from 'classnames';
import style from './index.module.css';

const ReactTooltip = dynamic(() => import('react-tooltip'), {
  ssr: false,
});

export default function Footer() {
  return (
    <footer className="py-10 bg-black flex text-white items-center relative">
      <div className="flex sm:flex-row flex-col sm:items-center main-content">
        <div className="flex flex-col items-start">
          <div className="sm:w-16 sm:h-16 w-12 h-12 mr-4">
            <img className="mr-4" src="/images/icon.png" alt="logo" />
          </div>
          <section className="flex flex-col	h-full">
            <span className="sm:text-xl text-base font-semibold">Powered by MetaCat</span>
          </section>
        </div>

        <section className="flex flex-1 sm:justify-end justify-center mt-4 sm:mt-0">
          <a
            href="https://twitter.com/Metacat007"
            target="_blank"
            data-tip="Twitter"
            className="w-10 h-10 mr-14"
          >
            <img src="/images/twitter.png" />
          </a>

          <a
            href="https://discord.gg/yRt6be237P"
            target="_blank"
            data-tip="Discord"
            className="w-10 h-10 mr-14"
          >
            <img src="/images/discord.png" />
          </a>

          <a
            href="https://medium.com/@themetacat"
            target="_blank"
            data-tip="Medium"
            className="w-10 h-10  rounded-full mr-14 justify-center items-center flex bg-transparent"
          >
            <img src="/images/medium.png" />
          </a>
          <div
            data-tip
            data-for="code"
            className="w-10 h-10  rounded-full  mr-14 justify-center items-center flex bg-transparent"
          >
            <img src="/images/wx.png" />
          </div>
          <a
            href=" https://mirror.xyz/0xE069160b21d23fB8Edad4F8B42f6b91f7b77F22A"
            data-tip="Mirror"
            className="w-10 h-10  rounded-full mr-14 justify-center items-center flex bg-transparent"
          >
            <img src="/images/mirror.png" />
          </a>
          <a
            href="https://www.youtube.com/channel/UCeZkqQ-CsIxjKeQJx3zOSGA"
            data-tip="YouTube"
            className={cn(
              'w-15 h-15  rounded-full mr-14 justify-center items-center flex bg-transparent',
              style.mt,
            )}
          >
            <img src="/images/YouTube.png" />
          </a>
          <a
            href="mailto:metacat@tutanota.com"
            data-tip="metacat@tutanota.com"
            className="w-10 h-10  rounded-full mr-14 justify-center items-center flex bg-transparent"
          >
            <img src="/images/emailW.png" />
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
