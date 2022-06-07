import React from 'react';
import cn from 'classnames';

import { CopyToClipboard } from 'react-copy-to-clipboard';

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
        <img className="mr-2 cursor-pointer" src={icon} onClick={iconClick}></img>
      ) : null}
      {isLink ? (
        <a href={link} target="_blank" title={link} className={style.a}>
          {label || clipName(address)}
        </a>
      ) : (
        <span title={label || clipName(address)}>{label || clipName(address)}</span>
      )}
      {renderSuffix}
    </div>
  );
}
