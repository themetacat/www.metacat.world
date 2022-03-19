import React from 'react';
import cn from 'classnames';

import toast from 'react-hot-toast';

import Upload from 'rc-upload';
import { client } from '../../common/utils';

import style from './index.module.css';

interface eventResult {
  success?: boolean;
  data?: string;
}

interface Props {
  imgUrl?: string;
  actionPath?: string;
  afterUpload?: (event) => void;
}

export default function UploadImg({ imgUrl, actionPath, afterUpload }: Props) {
  const [showCover, setShowCover] = React.useState(false);

  const multipartUpload = React.useCallback(
    async (file) => {
      const names = file.name.split('.');
      const suffix = names[names.length - 1];
      const fileName = `file${file.uid}.${suffix}`;
      client()
        .multipartUpload(fileName, file)
        .then((res) => {
          toast.success('Update success');
          if (afterUpload) {
            afterUpload({ success: true, data: res });
          }
        })
        .catch((err) => {
          toast.error('Update failed');
          if (afterUpload) {
            afterUpload({ success: false });
          }
        });
    },
    [afterUpload],
  );

  const customRequest = React.useCallback(
    ({
      action,
      data,
      file,
      filename,
      headers,
      onError,
      onProgress,
      onSuccess,
      withCredentials,
    }) => {
      const size = file.size / 1024 / 1024;
      if (size >= 1) {
        toast.error('Max size: 1M');
        return;
      }
      multipartUpload(file);

      return {};
    },
    [multipartUpload],
  );

  return (
    <div className={cn('cursor-pointer', style.uploadContainer)}>
      <Upload customRequest={customRequest}>
        {/* {showCover ? (
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
        ) : null} */}
        <div
          className={cn(
            'flex w-full h-full justify-center items-center z-10 absolute top-0 left-0',
            style.cover,
          )}
        ></div>
      </Upload>

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
