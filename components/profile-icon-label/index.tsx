import React from 'react';
import cn from 'classnames';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import Router from 'next/router';

import style from './index.module.css';


type Porps = {
  icon?: string;
  prefix?: boolean;
  address?: string;
  label?: string;
  classname?: string;
  suffixCopy?: boolean;
  hasIcon?: boolean;
  link?: string;
  onClick?: (evt) => void;
  isLink?: boolean;
};

export default function ProfileIconLabel({
  icon,
  prefix = false,
  label,
  classname,
  onClick,
  suffixCopy = false,
  hasIcon = true,
  isLink = false,
  link,
  address,
}: Porps) {
  const iconClick = React.useCallback(
    (evt) => {
      if (onClick) {
        onClick(label);
      }
    },
    [label, onClick],
  );

  const clipName = React.useCallback(
    (addres) => {
      if (addres?.length > 8) {
        const end = addres.length - 4;
        const all = addres.slice(4, end);
        return addres.replace(all, '***');
      }
      return addres;
    },
    [null],
  );
  const bianji =()=>{
    Router.replace('/profile/setting')
  }
  const renderSuffix = React.useMemo(() => {
    if (!prefix && hasIcon) {
      return suffixCopy ? (
        <CopyToClipboard text={label || address} onCopy={iconClick}>
          <img className="ml-2 cursor-pointer" src={icon}></img>
        </CopyToClipboard>
      ) : (
        <img className="ml-2 cursor-pointer" src={icon} onClick={iconClick}></img>
      );
    }
    return null;
  }, [prefix, hasIcon, suffixCopy, label, iconClick, icon, address]);

  return (
    <div className={cn('flex items-center', style.iconLabel, classname)}>
      {prefix && hasIcon ? (
        <img className={cn(" cursor-pointer", style.imgInsturation)} src={icon} onClick={iconClick}></img>
      ) : null}
      {isLink ? (
        <a href={link}  
        target="_blank" 
        rel="noreferrer,noopener" title={link} className={style.a}>
          {label || clipName(address)}
        </a>
      ) : (
        <>
          <div className={style.cns} title={label || clipName(address)}>
            <span>{label || clipName(address)}</span>
            <span className={style.content} onClick={bianji}>
              <img src={`/images/icon/bianji.png`} className={style.imgSet}></img>
            </span>
          </div>
        </>
      )}
      {renderSuffix}
    </div>
  );
}
