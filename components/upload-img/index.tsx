import React from 'react';
import cn from 'classnames';

import { toast } from 'react-toastify';

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
        toast.warn('Max size: 1M', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: 'dark',
        });
        return;
      }
      async function multipartUpload() {
        const names = file.name.split('.');
        const suffix = names[names.length - 1];
        const fileName = `file${file.uid}.${suffix}`;
        client()
          .multipartUpload(fileName, file)
          .then((res) => {
            toast.success('Update success', {
              position: 'top-center',
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: 'dark',
            });
            if (afterUpload) {
              afterUpload({ success: true, data: res });
            }
          })
          .catch((err) => {
            toast.error('Update failed', {
              position: 'top-center',
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: 'dark',
            });
            if (afterUpload) {
              afterUpload({ success: false });
            }
          });
      }
      multipartUpload();

      return {
        abort() {
          console.log('upload progress is aborted.');
        },
      };
    },
    [null],
  );

  return (
    <div className={cn('cursor-pointer', style.uploadContainer)}>
      {showCover ? (
        <Upload customRequest={customRequest}>
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
        </Upload>
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
