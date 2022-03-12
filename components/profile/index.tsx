import React from 'react';
import cn from 'classnames';

import { toast } from 'react-toastify';

import ProfileIconLabel from '../profile-icon-label';

import style from './index.module.css';

type Props = {
  name?: string;
  address?: string;
  twitter?: string;
  home?: string;
  avater?: string;
  classname?: string;
};

export default function Profile({
  name = '',
  address = '0xjdasfkhajsafsdjkafhk',
  twitter = 'http://localhost:8081/twitter',
  home = 'http://localhost:8081/twitter',
  avater = '',
  classname,
}: Props) {
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

  const copyName = React.useCallback(
    (evt) => {
      console.log(1);
      toast.success('copied!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'dark',
      });
    },
    [null],
  );

  return (
    <div className={cn('flex justify-between items-center ', classname, style.profile)}>
      <div className="flex justify-between items-center">
        <img className={style.avater} src={avater || '/images/logo.png'}></img>
        <div className={cn('ml-8', style.info)}>
          <ProfileIconLabel
            label={name || clipName(address)}
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
          <div className={cn('flex justify-between items-center', style.links)}>
            <ProfileIconLabel
              label={twitter}
              icon="/images/v5/Twitter.png"
              prefix={true}
              classname={'text-sm'}
            ></ProfileIconLabel>
            <div className={cn('mx-5', style.divide)}></div>
            <ProfileIconLabel
              label={home}
              icon="/images/v5/yoursite.io.png"
              prefix={true}
              classname={'text-sm'}
            ></ProfileIconLabel>
          </div>
        </div>
      </div>
      {/* <img className="h-full w-1/2" src="/images/1.png"></img> */}
    </div>
  );
}
