import React from 'react';
import cn from 'classnames';
import style from './index.module.css';

type Props = {
  cls?: string;
  country?: string;
  discord?: string;
  logo_url: string;
  name?: string;
  topic_id?: number;
  twitter?: string;
  website?: string;
  onClick?;
};

export default function InfoCard({
  cls,
  country,
  discord,
  logo_url,
  name,
  topic_id,
  twitter,
  website,
  onClick,
}: Props) {
  return (
    <div
      className={cn(style.container, cls)}
      onClick={() => {
        onClick(topic_id, name);
      }}
    >
      <div className={style.topDetail}>
        <div className="flex justify-center w-full">
          <img src={logo_url} />
        </div>
        <div className={style.name}>{name}</div>
        {country ? <div className={style.area}>Country:{country}</div> : null}
      </div>
      <div className={style.bottom}>
        {website ? (
          <div
            className={style.item}
            onClick={() => {
              window.open(website);
            }}
          >
            <img src="/images/icon/home.png" />
            Home
          </div>
        ) : null}
        {/* <div className={style.shuxian}></div> */}
        {twitter ? (
          <div
            className={style.item}
            onClick={() => {
              window.open(twitter);
            }}
          >
            <img src="/images/icon/twitter.png" />
            Twitter
          </div>
        ) : null}
        {/* <div className={style.shuxian}></div> */}
        {discord ? (
          <div
            className={style.item}
            onClick={() => {
              window.open(discord);
            }}
          >
            <img src="/images/icon/discord.png" />
            Discord
          </div>
        ) : null}
      </div>
    </div>
  );
}
