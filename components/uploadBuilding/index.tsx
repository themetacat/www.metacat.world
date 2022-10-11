import React from 'react';
import cn from 'classnames';

import toast from 'react-hot-toast';

import Upload from 'rc-upload';
import { client } from '../../common/utils';

import style from './index.module.css';

interface Props {
  imgUrl?: any;
  cover?: any;
  coverImg?: any;
  showClear?: any;
  closeBuild?: any;
  beginUpload?: () => void;
  afterUpload?: (event) => void;
}

export default function uploadBuilding({ imgUrl, cover,coverImg, closeBuild, showClear, afterUpload, beginUpload }: Props) {
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
      // console.log(fileName, file, 558);

    },
    [afterUpload],
  );

  const imgClick = () => {
    // console.log(imgUrl);
    cover(imgUrl)
  }

  const customRequest = React.useCallback(
    async ({
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
      const fileInd = file.type.indexOf('image')
      if(fileInd === -1){
        toast.error('Please upload the correct file type');
        return;
      }
      const size = file.size / 1024 / 1024;
      if (size >= 10) {
        toast.error('Max size: 10M');
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

    <div className={style.backImgCo}>
      <div style={{ position: "absolute", right: "0px", top: "-20px", backgroundColor: "#fff", borderRadius: "50%", width: "14px", height: "14px" }} onClick={closeBuild}>
        <img src="/images/guanbi.png" alt="" /></div>
      <div className={cn('cursor-pointer', style.uploadContainer)}>
        <Upload customRequest={customRequest}>
          <div
            className={cn(
              'flex w-full h-full justify-center items-center z-10 absolute top-0 left-0',
              style.cover,
            )}
          ></div>
        </Upload>

        <img className={cn('w-full h-full', style.backImg)} src={imgUrl} />

      </div>

      <div className={style.coverBakInfo} onClick={cover}>{imgUrl === coverImg  ? 'Cover Image' : 'Set Cover Image'}
      </div>
    </div>
  );
}
