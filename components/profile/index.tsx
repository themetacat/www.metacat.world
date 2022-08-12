import React from 'react';
import cn from 'classnames';

import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
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
  creatorsState?: number;
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
  creatorsState,
}: Props) {
  const router = useRouter();
  const copyName = React.useCallback(
    (evt) => {
      toast.success('copied!');
    },
    [null],
  );

  const toTopic = React.useCallback(() => {
    if (address) {
      router.replace(`/topic/${address}?type=wearables&from=profile`);
    }
  }, [address]);
  return (
    <div className={cn('flex justify-between items-center ', classname, style.profile)}>
      <div style={{marginLeft:"1px"}}>
        <div style={{ textAlign: 'center' }}>
          <img className={style.avater} src={avater || '/images/logo.png'}></img>
        </div>

        <div className={cn('ml-8', style.info)}>
          <div className="flex">
            {address && address !== '' && name ? (
              <ProfileIconLabel
                label={name}
                address={address}
                icon="/images/v5/copy.png"
                suffixCopy={true}
                hasIcon={!(name && name !== '')}
                onClick={copyName}
                classname={'text-2xl font-semibold mb-4'}
              ></ProfileIconLabel>
            ) : null}

            {!name && name === '' ? (
              <ProfileIconLabel
                label={address}
                icon="/images/v5/copy.png"
                suffixCopy={true}
                onClick={copyName}
                classname={cn('mb-4 text-sm', style.address)}
              ></ProfileIconLabel>
            ) : null}
            {creatorsState === 1 ? (
              <div className={style.cd} onClick={onClick}>
                {`Join Creators >`}
              </div>
            ) : null}
            {creatorsState === 2 ? (
              <div className={style.waiting}>Waiting for confirmation to show as a creator……</div>
            ) : null}
            {creatorsState === 4 ? (
              <div className={style.cd} onClick={toTopic}>{` My creator page >`}</div>
            ) : null}
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
        <div style={{ color: '#fff', display: 'flex', marginTop: '12px' }}>
          <div className={style.content}>
            <img src={`/images/icon/twitter.png`} className={style.imgSet}></img>
            Twitter{' '}
          </div>
          <div className={style.content2}>
            <img src={`/images/icon/discord.png`} className={style.imgSet}></img>
            Discord{' '}
          </div>
          <div className={style.content3}>
            <img src={`/images/icon/emailIcon.png`} className={style.imgSet}></img>
            Email{' '}
          </div>
        </div>
      </div>
      {/* <img className={cn('h-1/2 w-1/2', style.back)} src="/images/v5/textOnly.png"></img> */}
    </div>
  );
}
