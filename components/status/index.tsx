import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

interface Props {
  status: 'loading' | 'error' | 'success' | 'coming' | 'empty' | 'search';
  mini?: boolean;
  retry?: () => void;
}
export default function Status({ status, retry, mini = false }: Props) {
  const commonCls = cn(
    'flex w-full flex-col justify-center items-center py-10',
    mini ? style.mini : style.baseText,
  );
  if (status === 'loading') {
    return (
      <div className={cn(commonCls, 'animate-spin')}>
        <img src="/images/loading.png" className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={cn(commonCls)}>
        <img src="/images/default-image.png" className={style.baseImg} />
        <span className="mt-4 text-xl font-semibold">DATA LOADING FAILURE</span>
        <span
          className={cn(
            'px-4 py-2 text-lg font-medium mt-5 flex justify-center items-center cursor-pointer',
            style.retry,
          )}
          onClick={retry}
        >
          Retry
        </span>
      </div>
    );
  }

  if (status === 'coming') {
    return (
      <div className={cn(commonCls)}>
        <img src="/images/default-image.png" className={style.baseImg} />
        <span className="mt-4 text-xl font-semibold">COMING SOON!</span>
      </div>
    );
  }

  if (status === 'success') {
    return <div>Success</div>;
  }

  if (status === 'empty') {
    return (
      <div className={cn(commonCls)}>
        <img src="/images/default-image.png" className={style.baseImg} />
        <span className="mt-4 text-xl font-semibold">NO DATA</span>
      </div>
    );
  }

  if (status === 'search') {
    return (
      <div className={cn(commonCls)}>
        <img src="/images/default-image.png" className={style.baseImg} />
        <span className="mt-4 text-xl font-semibold">NO SEARCH RESULTS</span>
      </div>
    );
  }
}
