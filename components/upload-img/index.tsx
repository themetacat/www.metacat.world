import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

interface Props {
  imgUrl?: string;
  actionPath?: string;
}

export default function UploadImg({ imgUrl, actionPath }: Props) {
  const [showCover, setShowCover] = React.useState(false);
  const p = {
    action: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('/upload.do');
        }, 2000);
      });
    },
    multiple: true,
    onStart(file) {
      console.log('onStart', file, file.name);
    },
    onSuccess(ret) {
      console.log('onSuccess', ret);
    },
    onError(err) {
      console.log('onError', err);
    },
  };

  return (
    <div className={cn('cursor-pointer', style.uploadContainer)}>
      {showCover ? (
        <div
          onMouseOut={() => {
            setShowCover(false);
          }}
          className={cn(
            'flex w-full h-full justify-center items-center z-10 absolute top-0 left-0',
            style.cover,
          )}
        >
          <img src="/images/v5/edit.png"></img>
        </div>
      ) : null}
      <img
        onMouseOver={() => {
          setShowCover(true);
        }}
        className={cn(' w-full h-full', style.backImg)}
        src={imgUrl}
      />
    </div>
  );
}
