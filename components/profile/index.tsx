import React from 'react';
import cn from 'classnames';

import { toast } from 'react-hot-toast';

import ProfileIconLabel from '../profile-icon-label';

import style from './index.module.css';

type Props = {
  name?: string;
  address?: string;
  twitter?: string;
  home?: string;
  avater?: string;
  classname?: string;
  email?: string;
  onClick?;
};

export default function Profile({
  name,
  address,
  twitter,
  home,
  avater = '',
  classname,
  email,
  onClick,
}: Props) {
  const copyName = React.useCallback(
    (evt) => {
      toast.success('copied!');
    },
    [null],
  );

  return (
    <div className={cn('flex justify-between items-center ', classname, style.profile)}>
      <div className="flex justify-between items-center">
        <img className={style.avater} src={avater || '/images/logo.png'}></img>
        <div className={cn('ml-8', style.info)}>
          <div className="flex">
            <ProfileIconLabel
              label={name}
              address={address}
              icon="/images/v5/copy.png"
              suffixCopy={true}
              hasIcon={!(name && name !== '')}
              onClick={copyName}
              classname={'text-2xl font-semibold mb-4'}
            ></ProfileIconLabel>
            {name && name !== '' ? (
              <ProfileIconLabel
                label={address}
                icon="/images/v5/copy.png"
                suffixCopy={true}
                onClick={copyName}
                classname={cn('mb-4 text-sm', style.address)}
              ></ProfileIconLabel>
            ) : null}
            {/* <div className={style.cd} onClick={onClick}>
              {`Creator Display >`}
            </div> */}
          </div>
          <div className={cn('flex justify-start items-center', style.links)}>
            {twitter ? (
              <ProfileIconLabel
                label="Twitter"
                icon="/images/v5/Twitter.png"
                prefix={true}
                link={`https://twitter.com/${twitter}`}
                isLink={true}
                classname={'text-sm'}
              ></ProfileIconLabel>
            ) : null}
            {twitter && home ? <div className={cn('mx-5', style.divide)}></div> : null}
            {home ? (
              <ProfileIconLabel
                label={`Homepage`}
                link={home}
                icon="/images/v5/home.png"
                prefix={true}
                isLink={true}
                classname={'text-sm'}
              ></ProfileIconLabel>
            ) : null}
          </div>
        </div>
      </div>
      <img className={cn('h-1/2 w-1/2', style.back)} src="/images/v5/textOnly.png"></img>
    </div>
  );
}
