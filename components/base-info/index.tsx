import React from 'react';
import cn from 'classnames';
import CoverImg from '../cover-img';

import style from './index.module.css';

type Props = {
  logoUrl?: string;
  name?: string;
  description?: string;
  discord?: string;
  twitter?: string;
  website?: string;
};

export default function BaseInfo({ logoUrl, name, description, discord, twitter, website }: Props) {
  const jumpToUrl = React.useCallback(
    (uri) => {
      window.open(uri);
    },
    [null],
  );

  return (
    <div className={cn('flex flex-col justify-center items-center', style.info)}>
      <CoverImg
        className={cn('flex justify-center items-center z-10', style.avater)}
        img={logoUrl}
      ></CoverImg>
      <div className={cn('text-white text-2xl font-medium', style.name)}>{name}</div>
      <div className={cn('text-sm font-normal flex justify-center mt-4', style.connactInfo)}>
        {website ? (
          <div
            className={cn('flex justify-center items-center', style.infoItem)}
            onClick={() => {
              jumpToUrl(website);
            }}
          >
            <img src="/images/icon/home.png"></img>
            {website}
          </div>
        ) : null}
        {website && twitter ? <div className="mx-5">|</div> : null}
        {twitter ? (
          <div
            className={cn('flex justify-center items-center', style.infoItem)}
            onClick={() => {
              jumpToUrl(twitter);
            }}
          >
            <img src="/images/icon/twitter.png"></img>
            {twitter}
          </div>
        ) : null}
        {twitter && discord ? <div className="mx-5">|</div> : null}
        {discord ? (
          <div
            className={cn('flex justify-center items-center', style.infoItem)}
            onClick={() => {
              jumpToUrl(discord);
            }}
          >
            <img src="/images/icon/discord.png"></img>
            {discord}
          </div>
        ) : null}
      </div>
      <div className={cn('text-sm font-normal mt-4 text-center', style.description)}>
        {description}
      </div>
    </div>
  );
}
