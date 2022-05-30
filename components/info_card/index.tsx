import React from 'react';
import cn from 'classnames';
import style from './index.module.css';

type Props = {
  cls?: string;
};

export default function InfoCard({ cls }: Props) {
  return (
    <div className={cn(style.container, cls)}>
      <div className={style.topDetail}>
        <div className="flex justify-center w-full">
          <img src="/images/test.png" />
        </div>
        <div className={style.name}>Fabioema</div>
        <div className={style.area}>Area:Brazil</div>
      </div>
      <div className={style.bottom}>
        <div className={style.item}>
          <img src="/images/icon/home.png" />
          Home
        </div>
        <div className={style.shuxian}></div>
        <div className={style.item}>
          <img src="/images/icon/twitter.png" />
          Twitter
        </div>
        <div className={style.shuxian}></div>
        <div className={style.item}>
          <img src="/images/icon/discord.png" />
          Discord
        </div>
      </div>
    </div>
  );
}
