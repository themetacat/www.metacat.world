import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

import { Toaster } from 'react-hot-toast';

import WalletBtn from '../wallet-btn';

import style from './index.module.css';

type Props = {
  active?: string;
  className?: string;
};

export default function PageHeader({ active, className }: Props) {
  const jumpToData = React.useCallback(() => {
    window.open('https://www.k1ic.com/cvb-zh.html');
  }, []);

  return (
    <header
      className={cn(
        'main-content h-full flex justify-center items-center p-5 pointer-events-none',
        style.base,
        className,
      )}
    >
      <div className="flex flex-grow items-center text-white font-bold text-3xl pointer-events-auto">
        <img className={cn('mr-4 bg-white', style.logo)} src="/images/logo.png"></img>
        <Link href="/">METACAT</Link>
      </div>
      <div className="flex flex-grow justify-end">
        <div
          className={cn(
            'text-2xl font-medium text-gray-400 mx-14 cursor-pointer hover:text-white pointer-events-auto',
            active === '/' ? style.active : null,
          )}
        >
          <Link href="/">Home</Link>
        </div>
        <div
          className={cn(
            'text-2xl font-medium text-gray-400 hover:text-white  mr-14  active:text-white cursor-pointer pointer-events-auto',
            active === 'analytics' ? style.active : null,
          )}
          // onClick={jumpToData}
        >
          <Link href={'/analytics?typoe=cryptovoxels'}>Analytics</Link>
        </div>
        <div
          className={cn(
            'text-2xl font-medium text-gray-400 hover:text-white  mr-14  active:text-white cursor-pointer pointer-events-auto',
            active === 'map' ? style.active : null,
          )}
        >
          <Link href={'/map?typoe=cryptovoxels'}>Map</Link>
        </div>

        <div
          className={cn(
            'text-2xl font-medium text-gray-400 hover:text-white  mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'builders' ? style.active : null,
          )}
        >
          <Link href={'/builders'}>Builders</Link>
        </div>
        <div
          className={cn(
            'text-2xl font-medium text-gray-400 hover:text-white active:text-white cursor-pointer pointer-events-auto',
            active === 'builders' ? style.active : null,
          )}
        >
          <WalletBtn></WalletBtn>
        </div>
        <Toaster
          toastOptions={{
            duration: 2000,
            style: {
              background: 'rgba(0, 208, 236, 1)',
              color: 'black',
              borderRadius: 0,
            },
          }}
        />
      </div>
    </header>
  );
}
