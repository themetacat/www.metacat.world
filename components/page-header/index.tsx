import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

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
    <header className={cn('main-content h-full flex justify-center items-center p-5', className)}>
      <div className="flex flex-grow items-center text-white font-bold text-3xl">
        <img className={cn('mr-4 bg-white', style.logo)} src="/images/logo.png"></img>
        <Link href="/">METACAT</Link>
      </div>
      <div className="flex flex-grow justify-end">
        <div
          className={cn(
            'text-2xl font-medium text-gray-400 mx-28 cursor-pointer',
            active === '/' ? style.active : null,
          )}
        >
          <Link href="/">Home</Link>
        </div>
        <div
          className="text-2xl font-medium text-gray-400 hover:text-white active:text-white cursor-pointer"
          onClick={jumpToData}
        >
          Data
        </div>
      </div>
    </header>
  );
}
