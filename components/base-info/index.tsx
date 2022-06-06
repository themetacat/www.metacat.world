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
  const [wangzhi, setWangZhi] = React.useState('');
  const [text, setText] = React.useState('');
  const jumpToUrl = React.useCallback(
    (uri) => {
      window.open(uri);
    },
    [null],
  );
  React.useEffect(() => {
    if (description.indexOf('http') !== -1) {
      setWangZhi(description.slice(description.indexOf('http', -1)));
      setText(description.slice(0, description.indexOf('http', -1)));
    }
  }, [description]);

  const toDetail = React.useCallback(() => {
    window.open(wangzhi);
  }, [wangzhi]);
  const rander = React.useMemo(() => {
    if (text) {
      return (
        <div>
          {text}
          <a onClick={toDetail} className={style.cup}>
            {wangzhi}
          </a>
        </div>
      );
    }
    return <div>{description}</div>;
  }, [text, toDetail, description]);
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
            Home
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
            Twitter
          </div>
        ) : null}
        {discord && website && !twitter ? <div className="mx-5">|</div> : null}
        {twitter && discord ? <div className="mx-5">|</div> : null}
        {discord ? (
          <div
            className={cn('flex justify-center items-center', style.infoItem)}
            onClick={() => {
              jumpToUrl(discord);
            }}
          >
            <img src="/images/icon/discord.png"></img>
            Discord
          </div>
        ) : null}
      </div>
      <div className={cn('text-sm font-normal mt-4 text-center', style.description)}>{rander}</div>
    </div>
  );
}
