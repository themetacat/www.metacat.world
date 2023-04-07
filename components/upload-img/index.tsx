import React from 'react';
import cn from 'classnames';

import toast from 'react-hot-toast';

import Upload from 'rc-upload';
import { client } from '../../common/utils';

import style from './index.module.css';

interface Props {
  imgUrl?: string;
  beginUpload?: () => void;
  afterUpload?: (event) => void;
}

export default function UploadBuilding({ imgUrl, afterUpload, beginUpload }: Props) {
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
    async ({ file }) => {
      const size = file.size / 1024 / 1024;
      if (size >= 1) {
        toast.error('Max size: 1M');
        return;
      }
      if (beginUpload) {
        await beginUpload();
      }
      multipartUpload(file);

      return {};
    },
    [multipartUpload, beginUpload],
  );

  return (
    <div className={cn('cursor-pointer', style.uploadContainer)}>
      <Upload customRequest={customRequest}>
        <div
          className={cn(
            'flex w-full h-full justify-center items-center z-10 absolute top-0 left-0',
            style.cover,
          )}
        ></div>
      </Upload>

      <img className={cn(' w-full h-full', style.backImg)} src={imgUrl} />
    </div>
  );
}
