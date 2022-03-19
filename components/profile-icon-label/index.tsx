import React from 'react';
import cn from 'classnames';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import style from './index.module.css';

type Porps = {
  icon?: string;
  prefix?: boolean;
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
}: Porps) {
  const iconClick = React.useCallback(
    (evt) => {
      if (onClick) {
        onClick(label);
      }
    },
    [label, onClick],
  );

  const renderSuffix = React.useMemo(() => {
    if (!prefix && hasIcon) {
      if (suffixCopy) {
        return (
          <CopyToClipboard text={label} onCopy={iconClick}>
            <img className="ml-2 cursor-pointer" src={icon}></img>
          </CopyToClipboard>
        );
      }
      return <img className="ml-2 cursor-pointer" src={icon} onClick={iconClick}></img>;
    }
    return null;
  }, [prefix, hasIcon, suffixCopy, label, iconClick, icon]);

  return (
    <div className={cn('flex items-center', style.iconLabel, classname)}>
      {prefix && hasIcon ? (
        <img className="mr-2 cursor-pointer" src={icon} onClick={iconClick}></img>
      ) : null}
      {isLink ? (
        <a href={link} target="_blank" title={link}>
          {label}
        </a>
      ) : (
        <span title={label}>{label}</span>
      )}
      {renderSuffix}
    </div>
  );
}
