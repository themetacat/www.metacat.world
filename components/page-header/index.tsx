import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

import { Toaster } from 'react-hot-toast';

import WalletBtn from '../wallet-btn';
import TwoNavigation from '../two_navigation';
import style from './index.module.css';

type Props = {
  active?: string;
  className?: string;
};

const build = [
  {
    label: 'Buliders',
    type: 'buliders',
    link: '/build/buliders',
  },
  {
    label: 'Bulidings',
    type: 'bulidings',
    link: '/build/bulidings',
  },
];
const wearable = [
  {
    label: 'Creators',
    type: 'creators',
    link: '/wearables',
  },
  {
    label: 'WearableDao',
    type: 'wearabledao',
    link: '/wearables/wearabledao',
  },
];

export default function PageHeader({ active, className }: Props) {
  const [buildState, setBuildState] = React.useState(false);
  const [wearableState, setWearableState] = React.useState(false);
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
        <Link href="/" prefetch>
          METACAT
        </Link>
      </div>
      <div className="flex flex-grow justify-end">
        <div
          className={cn(
            'text-xl font-medium text-gray-400 mx-14 cursor-pointer hover:text-white pointer-events-auto',
            active === '/' ? style.active : null,
          )}
        >
          <Link href="/" prefetch>
            Home
          </Link>
        </div>
        {/* <div
          className={cn(
            'text-xl font-medium text-gray-400 mr-14 cursor-pointer hover:text-white pointer-events-auto',
            active === 'rent' ? style.active : null,
          )}
        >
          <Link href="/rent">Rent</Link>
        </div> */}
        <div
          className={cn(
            'text-xl font-medium text-gray-400 hover:text-white  mr-14  active:text-white cursor-pointer pointer-events-auto',
            active === 'analytics' ? style.active : null,
          )}
          // onClick={jumpToData}
        >
          <Link href={'/analytics'} prefetch>
            Analytics
          </Link>
        </div>
        <div
          className={cn(
            'text-xl font-medium text-gray-400 hover:text-white  mr-14  active:text-white cursor-pointer pointer-events-auto',
            active === 'heatmap' ? style.active : null,
          )}
        >
          <Link href={'/heatmap?type=cryptovoxels'} prefetch>
            Heatmap
          </Link>
        </div>

        <div
          className={cn(
            'text-xl font-medium text-gray-400 hover:text-white relative  mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'builders' ? style.active : null,
          )}
          // onClick={() => {
          //   setBuildState(!buildState);
          // }}
          onMouseEnter={() => {
            setBuildState(true);
          }}
          onMouseLeave={() => {
            setBuildState(false);
          }}
        >
          Build
          {buildState ? <TwoNavigation options={build} className={style.cn}></TwoNavigation> : null}
        </div>

        <div
          className={cn(
            'text-xl font-medium text-gray-400 hover:text-white relative  mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'wearables' ? style.active : null,
          )}
          onMouseEnter={() => {
            setWearableState(true);
          }}
          onMouseLeave={() => {
            setWearableState(false);
          }}
        >
          Wearables
          {wearableState ? (
            <TwoNavigation options={wearable} className={style.cn2}></TwoNavigation>
          ) : null}
        </div>
        <div
          className={cn(
            'text-xl font-medium text-gray-400 hover:text-white  mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'learn' ? style.active : null,
          )}
        >
          <Link href={'/learn?type=articles'} prefetch>
            Learn
          </Link>
        </div>
        {/* <div
          className={cn(
            'text-xl font-medium text-gray-400 hover:text-white  mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'learn' ? style.active : null,
          )}
        >
          <Link href={'/demo'} prefetch>
            demo
          </Link>
        </div> */}
        {/* <div
          className={cn(
            'text-xl font-medium text-gray-400 hover:text-white  mr-14 active:text-white cursor-pointer pointer-events-auto',
            active === 'learn' ? style.active : null,
          )}
        >
          <Link href={'/demo'} prefetch>
            demo
          </Link>
        </div> */}
        <div
          className={cn(
            'text-xl font-medium text-gray-400 hover:text-white mr-14 active:text-white cursor-pointer pointer-events-auto',
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
