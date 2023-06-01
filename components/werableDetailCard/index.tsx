import React from 'react';
import cn from 'classnames';

import CoverImg from '../cover-img';

import style from './index.module.css';

type Props = {
    topicId?: string;
    name?: string;
    imgUrlList?: Array<string>;
    cover_img?: string;
    detailUrl?: string;
    creatorName?: string;
};

export default function WerableDetailCard({ topicId, creatorName, name, imgUrlList, cover_img, detailUrl }: Props) {
    const canvaRef = React.useRef(null);
    return (
        <a
            onClick={() => {
                if (topicId) {
                    window.open(`/topic/${topicId}`);
                } else {
                    window.open(detailUrl);
                }
            }}
             target="_blank" 
             rel="noreferrer,noopener"
        >
            <div className={cn('relative', style.topicCard)}>
                {/* <div
          className={cn(
            'absolute top-2 right-2 flex justify-center items-center font-medium text-xs p-1',
            style.type,
          )}
        >
          {type}
        </div> */}
                <div className={cn('w-full flex flex-wrap')}>
                    {imgUrlList && imgUrlList.length !== 0 ? (
                        imgUrlList.map((img, idx) => {
                            return (
                                <img
                                    className={cn('w-1/2 h-1/2', style.cover)}
                                    src={img}
                                    onError={() => {
                                        this.src = '/images/logo.png';
                                    }}
                                    key={idx}
                                ></img>
                            );
                        })
                    ) : (
                        <img className={style.oneImg} src={cover_img} />
                    )}
                </div>
                <canvas
                    className={cn(
                        'absolute w-full h-full top-0 left-0 flex-auto bg-transparent',
                        style.graphicAll,
                    )}
                    ref={canvaRef}
                ></canvas>
                <div
                    className={cn(
                        '',
                        style.footer,
                    )}
                >
                    <div className={cn('text-base font-semibold', style.name)}>{name}</div>
                    <div className={cn('text-base font-semibold', style.description)}>Voxel Artist：
                        <span>{creatorName}</span>

                    </div>
                    <span className={cn('flex items-center cursor-pointer', style.goDetail2)}>
                        Detail <img className={cn(" ml-1", style.rightTab)} src="/images/rightTab.png"></img>

                    </span>
                </div>
            </div>
        </a>
    );
}
